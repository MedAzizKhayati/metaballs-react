import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const MAX_BALLS = 50;
const MetaballsMaterial = shaderMaterial(
  {
    time: 0,
    balls: [],
    ballsLength: 0,
    resolution: { x: 0, y: 0 },
  },
  glsl`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
  glsl`
      #define MAX_BALLS ${MAX_BALLS}
      struct Ball {
            vec2 center;
            float radius;
      };
      varying vec2 vUv;
      uniform float time;
      uniform int ballsLength;
      uniform Ball balls[MAX_BALLS];
      uniform vec2 resolution;
      float pToCircle (vec2 p, vec2 center) {
        vec2 ratio = resolution.xy / resolution.x;
        return distance(p*ratio, center*ratio);
      }
      bool inCircle (vec2 p, vec2 center, float radius) {
        return pToCircle(p, center) < radius;
      }
      
      bool inBall(vec2 p, Ball b) {
        return inCircle(p, b.center, b.radius);
      }

      void main() {
        vec2 p = vUv;
        float z = 0.5+0.5*smoothstep(-1.0, 1.0, cos(time * 0.005));
        gl_FragColor = vec4(0.0);
        
        for (int i=0; i<ballsLength; ++i) { 
            // if (inBall(p, balls[i])) {
            //     gl_FragColor = vec4(7.0, 0, 0, 1.0); //vec4(p.x, p.y, z, 1.0);
            // }
            float val = balls[i].radius / pToCircle(p, balls[i].center);
            val = clamp(val, 0.0, 1.0);
            if(i%4 == 0) {
                gl_FragColor.r += val;
            }
            else if (i%4 == 2) {
                gl_FragColor.rb += val;
            }else{
                gl_FragColor.rgb += val;
            }
            gl_FragColor.a = 1.0;
        }
      }`
);

extend({ MetaballsMaterial });

export { MetaballsMaterial };

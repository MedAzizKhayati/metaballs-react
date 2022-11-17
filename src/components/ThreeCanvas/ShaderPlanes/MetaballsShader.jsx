import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { MAX_BALLS, MetaballsMaterial } from "../Materials/MetaballsMaterial";
import { Ball, Vec2 } from "../Physics/Ball";

export default function MetaballsShader({ ballsLength = 7 }) {
  const ref = useRef();
  const { width, height } = useThree((state) => state.viewport);
  const canvas = useThree((state) => state.gl.domElement);
  const [mousePosition, setMousePosition] = useState(new Vec2(0, 0));
  const balls = useMemo(() => Ball.generateRandomBalls(MAX_BALLS), []);
  const movingBalls = useMemo(() => balls.slice(0, ballsLength), [ballsLength]);

  useFrame((_, delta) => {
    const ball = Ball.closestBall(movingBalls, mousePosition);
    ball.goSmoothlyTowords(mousePosition, 0.04);
    ref.current.balls = balls.map((ball, i) => {
      if (i < ballsLength) {
        ball.increaseSize(delta * 0.03);
      } else {
        ball.decreaseSize(delta * 0.03);
      }
      ball.update(delta);
      return ball;
    });
    ref.current.time += delta;
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      let x = (e.clientX - rect.left) / (rect.right - rect.left);
      let y = 1 - (e.clientY - rect.top) / (rect.bottom - rect.top);
      x = Math.max(0, Math.min(1, x));
      y = Math.max(0, Math.min(1, y));
      setMousePosition(new Vec2(x, y));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry />
      <metaballsMaterial
        ref={ref}
        balls={balls}
        ballsLength={MAX_BALLS}
        key={MetaballsMaterial.key}
        resolution={[width, height]}
      />
    </mesh>
  );
}

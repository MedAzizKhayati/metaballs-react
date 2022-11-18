import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import MetaballsShader from "../components/ThreeCanvas/ShaderPlanes/MetaballsShader";
export default function App() {
  const [ballsLength, setBallsLength] = useState(7);
  return (
    <div className="p-5 h-screen bg-[#121212] flex justify-center items-center">
      <div className="absolute w-screen h-screen overflow-hidden">
        <Canvas>
          <MetaballsShader ballsLength={ballsLength} />
        </Canvas>
      </div>
      <div
        style={{ maxWidth: "min(90%, 550px)" }}
        className="bg-black/10 absolute gap-5 shadow-2xl flex-col p-5 text-white rounded-2xl backdrop-blur-lg flex items-center"
      >
        <h1 className="text-3xl text-bold underline">INSTRUCTIONS</h1>
        <ul className="text-sm md:text-base">
          <li>
            ○ This is a metaballs shader made with react-three-fiber and
            three.js using GLSL.
          </li>
          <li>
            ○ The closest metaball is going to be attracted to your cursor so
            move it around and play with it.
          </li>
          <li>
            ○ You can also limit the number of metaballs by using the slider.
          </li>
        </ul>

        <label className="text-sm w-full">
          NUMBER OF METABALLS: {ballsLength}
        </label>
        <input
          type="range"
          value={ballsLength}
          onChange={(e) => setBallsLength(+e.target.value)}
          min="1"
          max="10"
          className="w-full h-3 ring-0 rounded-lg appearance-none cursor-pointer bg-transparent backdrop-blur-2xl"
        />
      </div>
    </div>
  );
}

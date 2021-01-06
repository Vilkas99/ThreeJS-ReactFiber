import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import Puntos from "./componentes/Three/puntos";
import Efectos from "./componentes/Three/efectos";

export default function App() {
  return (
    <Canvas colorManagement={false} orthographic camera={{ zoom: 20 }}>
      <color attach="background" args={["black"]} />
      <OrbitControls />
      <Efectos />
      <Puntos />
    </Canvas>
  );
}

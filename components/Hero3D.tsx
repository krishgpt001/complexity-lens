"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Line, Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Group } from "three";

function Network() {
  const group = useRef<Group>(null);
  const reducedMotion = useReducedMotion();
  useFrame((_, delta) => { if (!reducedMotion && group.current) group.current.rotation.y += delta * 0.12; });
  const object = <><Icosahedron args={[1.55, 1]}><meshBasicMaterial color="#89b4fa" wireframe transparent opacity={0.42} /></Icosahedron><Line points={[[0, -1.55, 0], [0, 1.55, 0]]} color="#a6e3a1" transparent opacity={0.45} lineWidth={1} /></>;
  return <group ref={group}>{reducedMotion ? object : <Float speed={0.7} rotationIntensity={0.15} floatIntensity={0.25}>{object}</Float>}</group>;
}
export default function Hero3D() {
  return <div className="pointer-events-none absolute -right-24 top-0 h-[580px] w-[580px] opacity-70 md:right-0" aria-hidden="true"><Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 4.8] }} gl={{ antialias: true, alpha: true }}><Network /></Canvas></div>;
}

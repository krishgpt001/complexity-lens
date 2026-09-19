"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Torus } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function Core() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.18;
      mesh.current.rotation.x += delta * 0.06;
    }
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 4]} />
      <MeshDistortMaterial color="#8b5cf6" emissive="#4c1d95" emissiveIntensity={0.6} roughness={0.15} metalness={0.4} distort={0.35} speed={1.6} />
    </mesh>
  );
}

function Rings() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => { if (group.current) group.current.rotation.z += delta * 0.05; });
  return (
    <group ref={group}>
      <Torus args={[2.15, 0.012, 16, 100]} rotation={[Math.PI / 2.3, 0, 0]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </Torus>
      <Torus args={[2.5, 0.008, 16, 100]} rotation={[Math.PI / 1.8, 0.4, 0]}>
        <meshBasicMaterial color="#ec4899" transparent opacity={0.4} />
      </Torus>
    </group>
  );
}

function Scene() {
  const reducedMotion = useReducedMotion();
  const object = (
    <>
      <Core />
      <Rings />
      <Sparkles count={60} scale={4.5} size={2.5} speed={0.35} color="#c4b5fd" />
    </>
  );
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 2, 4]} intensity={40} color="#8b5cf6" />
      <pointLight position={[-3, -2, 2]} intensity={25} color="#22d3ee" />
      {reducedMotion ? object : <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.6}>{object}</Float>}
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="pointer-events-none absolute -right-24 top-0 h-[620px] w-[620px] opacity-90 md:right-0" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2] }} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}

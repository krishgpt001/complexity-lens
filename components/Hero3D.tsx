"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 900;
const STAR_COLORS = ["#ffffff", "#ffffff", "#ffffff", "#c7d2fe", "#a5f3fc"];

/** A point on a small rocket ship: nose cone, cylindrical body, four base fins. */
function rocketPoint(t: number): [number, number, number] {
  if (t < 0.18) {
    const y = 0.75 + Math.random() * 0.85;
    const maxR = 0.4 * (1 - (y - 0.75) / 0.85);
    const theta = Math.random() * Math.PI * 2;
    const rad = maxR * Math.sqrt(Math.random());
    return [Math.cos(theta) * rad, y, Math.sin(theta) * rad];
  }
  if (t < 0.78) {
    const y = -0.9 + Math.random() * 1.65;
    const theta = Math.random() * Math.PI * 2;
    return [Math.cos(theta) * 0.4, y, Math.sin(theta) * 0.4];
  }
  const finIndex = Math.floor(Math.random() * 4);
  const angle = (finIndex / 4) * Math.PI * 2 + Math.PI / 4;
  const along = Math.random();
  const spread = Math.random() * (1 - along);
  const outward = 0.4 + spread * 0.6;
  const y = -0.9 - along * 0.55;
  return [Math.cos(angle) * outward, y, Math.sin(angle) * outward];
}

/** A point on a desktop computer: screen rectangle, edge outline, neck, base plate. */
function computerPoint(t: number): [number, number, number] {
  if (t < 0.5) {
    const x = (Math.random() - 0.5) * 1.7;
    const y = 0.15 + Math.random() * 1.05;
    return [x, y, (Math.random() - 0.5) * 0.06];
  }
  if (t < 0.6) {
    const edge = Math.floor(Math.random() * 4);
    const w = 1.7, h = 1.05, y0 = 0.15;
    if (edge === 0) return [(Math.random() - 0.5) * w, y0, (Math.random() - 0.5) * 0.04];
    if (edge === 1) return [(Math.random() - 0.5) * w, y0 + h, (Math.random() - 0.5) * 0.04];
    if (edge === 2) return [-w / 2, y0 + Math.random() * h, (Math.random() - 0.5) * 0.04];
    return [w / 2, y0 + Math.random() * h, (Math.random() - 0.5) * 0.04];
  }
  if (t < 0.8) {
    return [(Math.random() - 0.5) * 0.12, -0.35 + Math.random() * 0.5, (Math.random() - 0.5) * 0.12];
  }
  return [(Math.random() - 0.5) * 0.95, -0.4 + (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.35];
}

function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function StarObject({
  containerRef,
  hoverRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  hoverRef: React.MutableRefObject<boolean>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const burst = useRef(0);
  const reducedMotion = useReducedMotion();

  const { rocket, computer, seeds, dirs, colors, positions, texture } = useMemo(() => {
    const rocket = new Float32Array(COUNT * 3);
    const computer = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const dirs = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const [rx, ry, rz] = rocketPoint(t);
      const [cx, cy, cz] = computerPoint(t);
      rocket[i * 3] = rx;
      rocket[i * 3 + 1] = ry;
      rocket[i * 3 + 2] = rz;
      computer[i * 3] = cx;
      computer[i * 3 + 1] = cy;
      computer[i * 3 + 2] = cz;
      seeds[i] = Math.random();
      dirs[i * 3] = (Math.random() - 0.5) * 2;
      dirs[i * 3 + 1] = (Math.random() - 0.5) * 2;
      dirs[i * 3 + 2] = (Math.random() - 0.5) * 2;
      tmpColor.set(STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }
    const positions = new Float32Array(rocket);
    return { rocket, computer, seeds, dirs, colors, positions, texture: makeGlowTexture() };
  }, []);

  useFrame((state, delta) => {
    if (hoverRef.current) burst.current = Math.min(1.6, burst.current + delta * 6);
    else burst.current = Math.max(0, burst.current - delta * 1.4);

    let scrollT = 0;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      scrollT = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
    }

    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < COUNT; i++) {
      const seed = seeds[i];
      let localT = scrollT * 1.3 - seed * 0.3;
      localT = Math.min(1, Math.max(0, localT));
      const eased = localT * localT * (3 - 2 * localT);
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const bx = rocket[ix] + (computer[ix] - rocket[ix]) * eased;
      const by = rocket[iy] + (computer[iy] - rocket[iy]) * eased;
      const bz = rocket[iz] + (computer[iz] - rocket[iz]) * eased;
      const twinkle = reducedMotion ? 0 : Math.sin(time * 1.6 + seed * 20) * 0.012;
      const burstScale = burst.current * (0.4 + seed * 0.9);
      (posAttr.array as Float32Array)[ix] = bx + dirs[ix] * burstScale;
      (posAttr.array as Float32Array)[iy] = by + dirs[iy] * burstScale + twinkle;
      (posAttr.array as Float32Array)[iz] = bz + dirs[iz] * burstScale;
    }
    posAttr.needsUpdate = true;

    if (pointsRef.current && !reducedMotion) pointsRef.current.rotation.y += delta * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        map={texture}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        opacity={0.95}
      />
    </points>
  );
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => { hoverRef.current = true; }}
      onPointerLeave={() => { hoverRef.current = false; }}
      className="absolute -right-24 top-0 h-[620px] w-[620px] md:right-0"
      aria-hidden="true"
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.5] }} gl={{ antialias: true, alpha: true }}>
        <StarObject containerRef={containerRef} hoverRef={hoverRef} />
      </Canvas>
    </div>
  );
}

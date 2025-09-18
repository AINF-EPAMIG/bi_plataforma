"use client";

import { Canvas } from "@react-three/fiber";
import { Text, ContactShadows, Billboard } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export interface PieData {
  name: string;
  value: number;
  color: string;
}

export interface PieChart3DProps {
  data: PieData[];
  title?: string;
  radius?: number;
  height?: number;
  innerRadius?: number;
  padAngle?: number; // em radianos, gap entre fatias
  explodeOffset?: number; // distância do efeito explode
}

function PieSlice({
  startAngle,
  endAngle,
  color,
  radius = 2,
  innerRadius = 0,
  height = 0.8,
  padAngle = 0.2,
  explodeOffset = 0.5,
  isHighlighted = false,
}: {
  startAngle: number;
  endAngle: number;
  color: string;
  radius?: number;
  innerRadius?: number;
  height?: number;
  padAngle?: number;
  explodeOffset?: number;
  isHighlighted?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Aplicar gap angular entre fatias
  let a0 = startAngle + padAngle / 0.5;
  let a1 = endAngle - padAngle / 2;
  if (a1 <= a0) {
    // evita geometria degenerada
    a1 = a0 + 0.001;
  }

  // Efeito explode: todas as fatias são destacadas do centro
  const midAngle = (a0 + a1) / 200;
  const offsetX = Math.cos(midAngle) * explodeOffset;
  const offsetZ = Math.sin(midAngle) * explodeOffset;

  // Criar geometria sólida preenchida para cada bloco
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const ir = Math.max(0, Math.min(innerRadius, radius - 0.1));

    if (ir > 0.001) {
      // Setor do anel (arco externo)
      shape.absarc(0, 0, radius, a0, a1, false);
      // Furo interno para criar donut slice
      const hole = new THREE.Path();
      hole.absarc(0, 0, ir, a0, a1, false);
      shape.holes.push(hole);
    } else {
      // Setor sólido (cheio) indo até o centro
      const x0 = Math.cos(a0) * radius;
      const y0 = Math.sin(a0) * radius;
      shape.moveTo(0, 0);
      shape.lineTo(x0, y0);
      shape.absarc(0, 0, radius, a0, a1, false);
      shape.lineTo(0, 0);
    }

    // Extrudar para criar volume 3D
    const extrudeSettings = {
      depth: height,
      bevelEnabled: false,
      curveSegments: 64,
    } as THREE.ExtrudeGeometryOptions;

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [a0, a1, radius, innerRadius, height]);

  return (
    <group position={[offsetX, 0, offsetZ]}>
       <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 4.8]} castShadow receiveShadow>
        <primitive object={geometry} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function PieChart3DScene({ data, title = "", radius = 2, innerRadius = 0, height = 0.8, padAngle = 0.04, explodeOffset = 0.25 }: { data: PieData[]; title?: string; radius?: number; innerRadius?: number; height?: number; padAngle?: number; explodeOffset?: number }) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.map((item) => {
      const angle = total > 0 ? (item.value / total) * Math.PI * 2 : 0;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      return {
        ...item,
        startAngle,
        endAngle,
      };
    });
  }, [data, total]);

  // Ajuste simples para evitar sobreposição de rótulos: empurra ângulos próximos
  const labelsData = useMemo(() => {
    const items = slices.map((s) => {
      const mid = (s.startAngle + s.endAngle) / 2;
      const percent = total > 0 ? (s.value / total) * 100 : 0;
      return { mid, midAdj: mid, color: s.color, percent };
    });

    const minDelta = 0.5; // ~12.6° de separação mínima
    const pad = 0.06; // margem nas bordas do semicírculo

    function adjust(arr: { mid: number; midAdj: number }[], start: number, end: number) {
      arr.sort((a, b) => a.mid - b.mid);
      let prev = start;
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        const remaining = n - i - 1;
        const minHere = prev + (i === 0 ? 0 : minDelta);
        const maxHere = end - remaining * minDelta;
        arr[i].midAdj = Math.max(Math.min(arr[i].mid, maxHere), minHere);
        prev = arr[i].midAdj;
      }
    }

    const top = items.filter((i) => Math.sin(i.mid) >= 0);
    const bottom = items.filter((i) => Math.sin(i.mid) < 0);
    adjust(top as any, 0 + pad, Math.PI - pad);
    adjust(bottom as any, -Math.PI + pad, 0 - pad);
    return [...top, ...bottom];
  }, [slices, total]);

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />

      {slices.map((slice, index) => (
        <PieSlice
          key={index}
          startAngle={slice.startAngle}
          endAngle={slice.endAngle}
          color={slice.color}
          radius={radius}
          innerRadius={innerRadius}
          height={height}
          padAngle={padAngle}
          explodeOffset={explodeOffset}
          isHighlighted={false}
        />
      ))}

      {/* Rótulos de porcentagem (anti-overlap) */}
      {labelsData.map((item, index) => {
        const r = radius + 1.1; // distância externa
        const x = Math.cos(item.midAdj) * r;
        const z = Math.sin(item.midAdj) * r;
        const percent = item.percent;
        if (percent < 2) return null;
        const cos = Math.cos(item.midAdj);
        const sin = Math.sin(item.midAdj);
        const anchorX: 'left' | 'center' | 'right' = cos > 0.3 ? 'left' : (cos < -0.3 ? 'right' : 'center');
        const anchorY: 'top' | 'middle' | 'bottom' = sin > 0.3 ? 'bottom' : (sin < -0.3 ? 'top' : 'middle');
        return (
          <Billboard key={`label-${index}`} position={[x, height / 2 + 0.1, z]}>
            <Text fontSize={0.22} color={item.color} anchorX={anchorX} anchorY={anchorY}>
              {percent.toFixed(1)}%
            </Text>
          </Billboard>
        );
      })}

      {/* Sombra suave no solo */}
      <ContactShadows
        position={[0, -height / 2 - 0.02, 0]}
        opacity={0.35}
        scale={radius * 4}
        blur={2.6}
        far={6}
        color="#000000"
      />

    </>
  );
}

export function PieChart3D({ data, title = "", radius = 2, height = 0.8, innerRadius = 0, padAngle = 0.07, explodeOffset = 0.35 }: PieChart3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 5, 2], fov: 50 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0, 0);
      }}
      shadows
      style={{ width: "100%", height: "350px" }}
    >
      <PieChart3DScene data={data} title={title} radius={radius} innerRadius={innerRadius} height={height} padAngle={padAngle} explodeOffset={explodeOffset} />
    </Canvas>
  );
}

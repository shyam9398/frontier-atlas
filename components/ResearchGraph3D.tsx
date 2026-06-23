'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Card3D {
  name: string;
  position: [number, number, number];
  color: string;
  iconChar: string;
}

function GlassCard({ name, position, color, iconChar }: Card3D) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Slow orbital and float animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time + position[0] * 2) * 0.08;
    meshRef.current.position.y = position[1] + floatOffset;
    meshRef.current.rotation.y = Math.sin(time * 0.5 + position[2]) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Rectangular Glass Card shape */}
      <boxGeometry args={[1.0, 0.55, 0.06]} />
      
      {/* Frosted Physical Glass Material with light warm tint */}
      <meshPhysicalMaterial
        color={hovered ? '#FFFDFB' : '#FFF9F5'}
        transmission={0.8}
        roughness={0.12}
        thickness={0.5}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        metalness={0.05}
        emissive={hovered ? color : '#F3E5DC'}
        emissiveIntensity={hovered ? 0.35 : 0.05}
      />

      {/* Glow highlight node embedded inside the glass card */}
      <mesh position={[-0.38, 0, 0.04]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* HTML text label projected onto the physical card face */}
      <Html
        transform
        distanceFactor={3.5}
        position={[0.08, 0, 0.04]}
        className="pointer-events-none select-none"
      >
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-transparent text-[8px] font-extrabold tracking-wider uppercase whitespace-nowrap transition-colors duration-200 ${
          hovered ? 'text-primary' : 'text-text-primary/75'
        }`}>
          <span className="opacity-90">{iconChar}</span>
          <span>{name}</span>
        </div>
      </Html>
    </mesh>
  );
}

function GridConnections({ cards }: { cards: Card3D[] }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    // Draw connections in a ring sequence and to the center
    for (let i = 0; i < cards.length; i++) {
      const current = cards[i].position;
      const next = cards[(i + 1) % cards.length].position;
      
      // Connect to next card
      pts.push(new THREE.Vector3(...current));
      pts.push(new THREE.Vector3(...next));

      // Connect to central core
      pts.push(new THREE.Vector3(...current));
      pts.push(new THREE.Vector3(0, 0, 0));
    }
    return pts;
  }, [cards]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#FFD8C9" linewidth={1.5} opacity={0.5} transparent />
    </lineSegments>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow rotational scan
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
  });

  // Distribute cards in a 3D orbital path
  const cards: Card3D[] = [
    { name: 'Papers', position: [1.6, 0.3, 0.5], color: '#FF6B35', iconChar: '📄' },
    { name: 'Models', position: [-0.6, 1.2, 1.4], color: '#3B82F6', iconChar: '🤖' },
    { name: 'Datasets', position: [-1.5, -0.4, -0.6], color: '#10B981', iconChar: '📁' },
    { name: 'Benchmarks', position: [0.6, -1.1, -1.3], color: '#F59E0B', iconChar: '📊' },
    { name: 'Authors', position: [1.2, 0.9, -1.1], color: '#EC4899', iconChar: '👥' },
    { name: 'Organizations', position: [-1.0, -0.8, 1.2], color: '#8B5CF6', iconChar: '🏢' }
  ];

  return (
    <group ref={groupRef}>
      {/* Central Core Glowing Hub */}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color="#FF6B35" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshPhysicalMaterial
          color="#FF8A5B"
          transmission={0.9}
          roughness={0.1}
          emissive="#FF6B35"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* 3D Glass Cards */}
      {cards.map((card, idx) => (
        <GlassCard key={idx} {...card} />
      ))}

      {/* Grid line linkages */}
      <GridConnections cards={cards} />
    </group>
  );
}

export default function ResearchGraph3D() {
  return (
    <div className="w-full h-full min-h-[220px] max-h-[300px] aspect-video relative flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.0} />

        <Scene />

        <OrbitControls
          enableZoom={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 2.8}
        />
      </Canvas>
    </div>
  );
}

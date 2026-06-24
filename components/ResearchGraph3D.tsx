'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitingNodeProps {
  name: string;
  radius: number;
  speed: number;
  yOffset: number;
  phase: number;
}

function OrbitingNode({ name, radius, speed, yOffset, phase }: OrbitingNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    // Add dynamic vertical floating motion
    const y = yOffset + Math.sin(t * 1.8) * 0.08;
    
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
    }
    
    // Update dynamic line connection from center [0,0,0] to orbiting node [x,y,z]
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
      positions[0] = 0;
      positions[1] = 0;
      positions[2] = 0;
      positions[3] = x;
      positions[4] = y;
      positions[5] = z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Prepare line geometry once
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points * 3 coordinates
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  return (
    <group>
      {/* Thin connection wire from Center Node to Orbiting Node */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color={hovered ? '#FF4D3A' : '#6B7280'} 
          linewidth={1} 
          transparent 
          opacity={hovered ? 0.8 : 0.25} 
        />
      </lineSegments>

      {/* Orbiting glowing node sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1.0}
      >
        <sphereGeometry args={[0.045, 32, 32]} />
        <meshPhysicalMaterial
          color={hovered ? '#FFFFFF' : '#FF6B57'}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1.0}
          emissive={hovered ? '#FF4D3A' : '#FF6B57'}
          emissiveIntensity={hovered ? 2.5 : 0.6}
        />
        
        {/* HTML Hover Label */}
        <Html
          position={[0, 0.1, 0]}
          center
          distanceFactor={3}
          className="pointer-events-none select-none"
        >
          <div className={`px-2 py-0.5 rounded-full border text-[8px] font-extrabold tracking-wider bg-white select-none whitespace-nowrap transition-all duration-200 shadow-sm ${
            hovered ? 'text-[#FF4D3A] border-[#FF4D3A]/40 scale-105 font-black' : 'text-[#6B7280] border-[#EEEEEE]'
          }`}>
            {name}
          </div>
        </Html>
      </mesh>
    </group>
  );
}

function CenterNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Breathe animation
    const scale = (hovered ? 1.25 : 1.0) + Math.sin(t * 1.5) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.11, 32, 32]} />
      <meshPhysicalMaterial
        color={hovered ? '#FFFFFF' : '#FF4D3A'}
        roughness={0.05}
        metalness={0.3}
        clearcoat={1.0}
        emissive="#FF4D3A"
        emissiveIntensity={hovered ? 3.5 : 2.0}
      />
      <Html
        position={[0, 0.22, 0]}
        center
        distanceFactor={3}
        className="pointer-events-none select-none"
      >
        <div className="px-3 py-1 rounded-full border border-[#FF4D3A]/20 text-[9px] font-extrabold tracking-widest bg-white text-[#FF4D3A] select-none whitespace-nowrap shadow-sm uppercase">
          AI Research
        </div>
      </Html>
    </mesh>
  );
}

function GraphScene() {
  const sceneGroupRef = useRef<THREE.Group>(null);

  // Slow rotational drift of the entire scene coordinate space
  useFrame((state) => {
    if (!sceneGroupRef.current) return;
    sceneGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.035;
  });

  // Define 8 orbiting nodes symmetrically distributed in phases
  const orbitingNodes = [
    { name: 'Papers', radius: 0.9, speed: 0.22, yOffset: -0.15, phase: 0 },
    { name: 'Models', radius: 1.1, speed: 0.18, yOffset: 0.25, phase: Math.PI / 4 },
    { name: 'Datasets', radius: 1.0, speed: 0.25, yOffset: -0.25, phase: Math.PI / 2 },
    { name: 'Benchmarks', radius: 1.15, speed: 0.15, yOffset: 0.1, phase: 3 * Math.PI / 4 },
    { name: 'Authors', radius: 0.85, speed: 0.28, yOffset: -0.05, phase: Math.PI },
    { name: 'Organizations', radius: 1.05, speed: 0.2, yOffset: 0.35, phase: 5 * Math.PI / 4 },
    { name: 'Repositories', radius: 1.12, speed: 0.17, yOffset: -0.2, phase: 3 * Math.PI / 2 },
    { name: 'Tasks', radius: 0.95, speed: 0.24, yOffset: 0.15, phase: 7 * Math.PI / 4 }
  ];

  return (
    <group ref={sceneGroupRef}>
      {/* Center node */}
      <CenterNode />

      {/* Orbiting nodes with connection lines */}
      {orbitingNodes.map((node) => (
        <OrbitingNode
          key={node.name}
          name={node.name}
          radius={node.radius}
          speed={node.speed}
          yOffset={node.yOffset}
          phase={node.phase}
        />
      ))}
    </group>
  );
}

export default function ResearchGraph3D() {
  return (
    <div className="w-full h-full min-h-[140px] max-h-[180px] aspect-square relative flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.4, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#FF6B57" />
        <directionalLight position={[0, 4, 1]} intensity={0.8} />

        <GraphScene />

        <OrbitControls
          enableZoom={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}

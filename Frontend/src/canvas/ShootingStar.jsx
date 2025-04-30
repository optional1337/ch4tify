import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

function ShootingStar({ position }) {
  const starRef = useRef();
  const trailRef = useRef();
  const trail = useRef([]);

  useFrame(() => {
    if (starRef.current && trailRef.current) {
      starRef.current.rotation.z += 0.05;

      // Add new position to the trail
      const newPos = new THREE.Vector3(position.x, position.y, 0);
      trail.current.push(newPos);

      // Limit trail length
      if (trail.current.length > 15) trail.current.shift();

      // Update BufferGeometry with points
      const points = trail.current;
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      trailRef.current.geometry.dispose();
      trailRef.current.geometry = geometry;
    }
  });

  return (
    <>
      {/* Star */}
      <mesh ref={starRef} position={[position.x, position.y, 0]}>
        <circleGeometry args={[0.02, 32]} />
        <meshBasicMaterial color={'white'} />
      </mesh>

      {/* Glowing Trail */}
      <line ref={trailRef}>
        <bufferGeometry />
        <lineBasicMaterial color={'cyan'} transparent opacity={0.7} linewidth={3} />
      </line>
    </>
  );
}

export default function CursorShootingStar() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setCursorPos({ x, y });
      setActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActive(false), 100);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <Canvas className="fixed inset-0 z-50 pointer-events-none">
      <OrbitControls enabled={false} />
      <ambientLight intensity={0.5} />
      <AnimatePresence>
        {active && (
          <motion.group
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ShootingStar position={cursorPos} />
          </motion.group>
        )}
      </AnimatePresence>
    </Canvas>
  );
}

import { useGLTF, OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Mailbox(props) {
  const { scene } = useGLTF('/earth.glb');
  const groupRef = useRef();
  const { viewport } = useThree();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const isMobile = viewport.width < 6;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smaller target scales for desktop
      const targetY = isMobile ? 0 : 0;
      const targetScale = isMobile ? 0.1 : 0.0008; // Reduced scale further

      // Entrance animation
      if (animationProgress < 1) {
        const newProgress = Math.min(animationProgress + delta * 1.3, 1);
        setAnimationProgress(newProgress);

        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0, targetScale, newProgress));
        groupRef.current.position.z = THREE.MathUtils.lerp(-2, 0, newProgress);
        groupRef.current.position.y = THREE.MathUtils.lerp(0, targetY, newProgress);
        groupRef.current.position.x = 0;
      }

      // Auto-rotation
      if (animationProgress === 1 && !isUserInteracting) {
        groupRef.current.rotation.y += 0.003;
      }
    }
  });

  return (
    <>
      <group
        ref={groupRef}
        position={[0, 0, 0]}
        {...props}
      >
        <primitive object={scene} />
      </group>

      {/* OrbitControls */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        // autoRotate={false}
        onStart={() => setIsUserInteracting(true)}
        onEnd={() => setIsUserInteracting(false)}
      />
    </>
  );
}

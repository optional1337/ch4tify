import React, { Suspense } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { useThemeStore } from '../store/ThemeStore';
import { Button } from '@/components/ui/button';
import { MessageSquareText } from 'lucide-react';

import StarsCanvas from "../canvas/stars";
import Mailbox from '../canvas/mailbox';

const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-black text-white">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 opacity-90" />

      {/* Stars Effect */}
      <StarsCanvas />

      {/* 3D Mailbox */}
      {/* <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 7], fov: 45 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[-5, 5, 5]} intensity={1} />
          <Mailbox />
          <Preload all />
        </Suspense>
      </Canvas> */}

      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 py-4">
        {/* Logo */}
<motion.div
  className="flex items-center gap-2"
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ 
    duration: 0.8, 
    ease: [0.68, -0.55, 0.265, 1.55] // custom springy cubic-bezier for bounce
  }}
>
  <MessageSquareText className="w-6 h-6 text-primary" />
  <span className="font-bold text-lg text-white tracking-wider">ch4tify</span>
</motion.div>

{/* Login Button */}
<motion.div
  initial={{ x: 100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ 
    duration: 0.8, 
    ease: [0.68, -0.55, 0.265, 1.55] // same springy bounce
  }}
>
  <Button
    variant="secondary"
    onClick={() => navigate('/login')}
    className="text-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
  >
    Login
  </Button>
</motion.div>

      </header>

      {/* Hero Section */}
      <motion.div
        className="absolute bottom-24 md:bottom-32 text-center px-6 z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Title */}
        <motion.h1
          className="text-3xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Welcome to <span className="text-primary">ch4tify</span>
          <br />
          <span className="text-xl md:text-3xl font-semibold text-gray-300">
            The Dark Room Awaits
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Beyond the silence, connections are made.
          Step into the quiet where messages thrive.
        </motion.p>

        {/* Call To Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Enter Now
        </motion.button>

        {/* Footer Note */}
        <motion.p
          className="text-xs text-gray-500 mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          100% Free • Instant Access
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HomePage;

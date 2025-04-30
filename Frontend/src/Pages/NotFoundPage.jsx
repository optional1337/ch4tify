import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { MessageSquareText } from 'lucide-react'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 z-10">
      <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.68, -0.55, 0.265, 1.55] 
          }}
        >
          <MessageSquareText className="w-6 h-6 text-primary" />
          <span className="font-bold text-white text-lg tracking-wider">ch4tify</span>
        </motion.div>
      </header>

      <h1 className="text-4xl font-bold mt-10 mb-4">Page Not Found</h1>

      {/* Animated and bigger responsive Image */}
      <motion.img
        src="/404.gif"
        alt="Not Found"
        className="w-60 sm:w-80 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] h-auto object-contain mb-4 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <p className="text-gray-400 mb-2">
        Sorry, the page you are looking for does not exist.
      </p>

      <Button
        variant="secondary"
        className="bg-white mt-2 text-black transition-transform duration-200 transform hover:-translate-y-1 hover:bg-gray-100 cursor-pointer"
        onClick={handleGoBack}
      >
        Go back to Login
      </Button>
    </div>
  )
}

export default NotFoundPage

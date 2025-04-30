import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeClosed, MessageSquareText } from "lucide-react";
import { Link,  useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading, resetError } = useAuthStore();
  const navigate = useNavigate();


  useEffect(() => {
    resetError();
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [email, password, isTyping, resetError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success("Logged in successfully");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Network Error Try again";
      if (message === "Please verify your email before logging in") {
        toast.error(message);
        setTimeout(() => navigate("/verify-email"), 2000);
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <>
      {/* Floating animation */}
      {/* <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style> */}
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
</header>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-md border-t border-b border-white/10
  bg-opacity-80 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden relative
  mx-4 sm:mx-auto"
>
  <div className="relative z-10 p-6 sm:p-8">
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-white drop-shadow-lg">
      Welcome Back
    </h2>

    <form onSubmit={handleLogin}>
      {/* Email Input */}
      <div className="relative mb-4 sm:mb-5">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsTyping(true);
          }}
          className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-black/70 rounded-lg 
          text-white placeholder-white/70 focus:outline-none transition duration-300
          ${
            isTyping
              ? "border-transparent focus:ring-0"
              : "border border-white/30 focus:ring-2 focus:ring-white focus:border-white"
          }`}
        />
      </div>
      {/* Password Input */}
      <div className="relative mb-6 sm:mb-8">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsTyping(true);
          }}
          className={`w-full pl-10 pr-10 py-2.5 sm:py-3 bg-black/70 rounded-lg 
          text-white placeholder-white/70 focus:outline-none transition duration-300
          ${
            isTyping
              ? "border-transparent focus:ring-0"
              : "border border-white/30 focus:ring-2 focus:ring-white focus:border-white"
          }`}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
        >
          {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
        </span>
      </div>

      <div className="flex items-center mb-5 sm:mb-6 justify-between">
        <Link to="/forgot-password" className="text-xs sm:text-sm text-white hover:underline">
          Forgot password?
        </Link>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 sm:py-3 px-4 bg-white text-black cursor-pointer font-bold rounded-lg shadow-xl 
        hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
        focus:ring-offset-black transition duration-200 text-sm sm:text-base"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto text-black" /> : "Login"}
      </motion.button>
    </form>
  </div>

  <div className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 bg-black bg-opacity-60 flex justify-center border-t border-white/10">
    <p className="text-xs sm:text-sm text-white/70">
      Don't have an account?{" "}
      <Link to="/signup" className="text-white hover:underline font-semibold">
        Sign up
      </Link>
    </p>
  </div>
</motion.div>

    </>
  );
};

export default LoginPage;
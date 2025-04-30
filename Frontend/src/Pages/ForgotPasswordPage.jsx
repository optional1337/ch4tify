import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { ArrowLeft, Loader, Mail, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner"; // Import toast

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);  // Attempt to send reset email
      setIsSubmitted(true);
      toast.success("check your email"); // Success toast
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Specific handling for a 400 error (Bad Request)
        toast.error(error.response.data.message || "Email not found");
      } else {
        toast.error(error.message || "Error sending reset link"); // Generic error toast
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
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
        className='max-w-md w-full border-t border-b border-white/10 bg-opacity-70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden 
         relative mx-4 sm:mx-auto'
      >

        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
        
        <div className='relative z-10 p-8'>
          <h2 className='text-3xl sm:text-4xl font-extrabold mb-6 text-center sm:mb-8 text-white bg-clip-text drop-shadow-lg'>
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <p className='text-gray-300 mb-6 text-center'>
                Enter your email address and we'll send you a reset link.
              </p>
              <div className='relative mb-5'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5' />
                <input
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  onChange={(e) => {setEmail(e.target.value);setIsTyping(true);}}
                  required
                  className='w-full pl-10 pr-4 py-2.5 sm:py-3 bg-black/70 rounded-lg text-white placeholder-white/70 
                   transition duration-300 border border-white/30 focus:ring-white focus:border-white'
                   
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-2.5 sm:py-3 px-4 bg-white text-black cursor-pointer font-bold rounded-lg shadow-xl 
                hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
                focus:ring-offset-black transition duration-200 text-sm sm:text-base'
                type='submit'
              >
                {isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
              </motion.button>
            </form>
          ) : (
            <div className='text-center'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className='w-16 h-16 bg-emerald-500 rounded-full flex items-center 
                justify-center mx-auto mb-4'
              >
                <Mail className='h-8 w-8 text-white' />
              </motion.div>
              <p className='text-gray-300 mb-6'>
                If an account exists for {email}, you will receive a reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className='relative z-10 px-8 py-4 bg-black bg-opacity-60 flex justify-center border-t border-white/10'>
          <Link to={"/login"} className='text-sm text-white hover:underline flex items-center'>
            <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

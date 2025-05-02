import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { ArrowLeft, Loader, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const recaptchaRef = useRef();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }
    try {
      await forgotPassword(email, captchaToken);
      setIsSubmitted(true);
      toast.success("Check your email.");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Email not found");
      } else {
        toast.error(error.message || "Error sending reset link");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-black via-gray-900 to-black">
      <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-4 sm:px-6 py-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.68, -0.55, 0.265, 1.55],
          }}
        >
          <MessageSquare className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-white tracking-wider">
            ch4tify
          </span>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md border-t border-b border-white/10 bg-opacity-70 backdrop-blur-2xl 
          rounded-2xl shadow-2xl overflow-hidden mx-auto"
      >
        <div className="relative z-10 p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center sm:mb-8 text-white drop-shadow-lg">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <p className="text-gray-300 mb-6 text-center text-sm sm:text-base">
                Enter your email address and we'll send you a reset link.
              </p>

              <div className="relative mb-4 sm:mb-5">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-black/70 rounded-lg text-white placeholder-white/70 
                  transition duration-300 border border-white/30 focus:ring-white focus:border-white"
                />
              </div>

              <div className="my-4">
                <div className="scale-[0.9] sm:scale-100 origin-top-left max-w-full overflow-hidden">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={setCaptchaToken}
                    theme="dark"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-2.5 sm:py-3 px-4 bg-white text-black font-bold rounded-lg shadow-xl 
                  hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
                  focus:ring-offset-black transition duration-200 text-sm sm:text-base"
              >
                {isLoading ? (
                  <Loader className="size-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-emerald-500 rounded-full flex items-center 
                justify-center mx-auto mb-4"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                If an account exists for <span className="font-semibold">{email}</span>, you will receive a reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 bg-black bg-opacity-60 flex justify-center border-t border-white/10">
          <Link to="/login" className="text-sm text-white hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

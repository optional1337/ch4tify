import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils"; 
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"; // <--- imported

const EmailVerificationPage = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [focusedIndex, setFocusedIndex] = useState(null);
  const { error, isLoading, verifyEmail, resetError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return; // prevent wrong submit
    try {
      const response = await verifyEmail(code);

      if (response && response.success) {
        toast.success("Email verified successfully");
        setTimeout(() => {
          navigate("/");
        }, 1600);
      } else {
        toast.error("Invalid or expired verification code");
      }
    } catch (error) {
      toast.error(error.message || "Error verifying email");
    }
  };

  // Auto-submit when full code entered
  useEffect(() => {
    resetError();
    if (code.length === 6) {
      handleSubmit(new Event("submit"));
    }
  }, [code, resetError]);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 py-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.68, -0.55, 0.265, 1.55],
          }}
        >
          <MessageSquareText className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-white tracking-wider">ch4tify</span>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-opacity-80 border-t border-b border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden relative mx-4 sm:mx-auto"
      >
        <div className="relative z-10 p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-white drop-shadow-lg">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
  

		  <InputOTP
  maxLength={6}
  value={code}
  onChange={(value) => {
    setCode(value);

    // Detect currently focused slot
    const active = document.activeElement;
    if (active) {
      const slotIndex = active.getAttribute("data-slot");
      if (slotIndex !== null) {
        setFocusedIndex(Number(slotIndex));
      } else {
        setFocusedIndex(null);
      }
    }
  }}
  className="flex justify-center gap-1 sm:gap-3"
>
  <InputOTPGroup className="flex gap-1 sm:gap-3">
    {[0, 1, 2].map((index) => (
      <div key={index} className="relative">
        <InputOTPSlot
          index={index}
          data-slot={index} // help us detect which slot is focused
          className={cn(
            "relative lg:w-12 lg:h-12 w-9 h-9 text-center text-2xl font-bold bg-black/70 text-white border-2 border-gray-700 rounded-lg focus:border-white/70 focus:outline-none",
            focusedIndex === index ? "border-white" : ""
          )}
        />
        {/* Show blinking caret if focused and empty */}
        {focusedIndex === index && !code[index] && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-2xl animate-blink pointer-events-none">
            |
          </span>
        )}
      </div>
    ))}

    <InputOTPSeparator className="text-white text-2xl font-bold px-2">-</InputOTPSeparator>

    {[3, 4, 5].map((index) => (
      <div key={index} className="relative">
        <InputOTPSlot
          index={index}
          data-slot={index}
          className={cn(
            "relative lg:w-12 lg:h-12 w-9 h-9 text-center text-2xl font-bold bg-black/70 text-white border-2 border-gray-700 rounded-lg focus:border-white/70 focus:outline-none",
            focusedIndex === index ? "border-white" : ""
          )}
        />
        {focusedIndex === index && !code[index] && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-2xl animate-blink pointer-events-none">
            |
          </span>
        )}
      </div>
    ))}
  </InputOTPGroup>
</InputOTP>


  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type="submit"
    disabled={isLoading || code.length !== 6}
    className="w-full py-2.5 sm:py-3 px-4 bg-white text-black cursor-pointer font-bold rounded-lg shadow-xl 
      hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
      focus:ring-offset-black transition duration-200 text-sm sm:text-base"
  >
    {isLoading ? "Verifying..." : "Verify Email"}
  </motion.button>
</form>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;

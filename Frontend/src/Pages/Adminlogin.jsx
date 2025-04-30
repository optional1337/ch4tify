import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Loader } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [secretKey, setSecretKey] = useState("");
  const navigate = useNavigate();
  const { adminLogin, error, isLoading, resetError } = useAuthStore();

  const handleAccess = async (e) => {
    e.preventDefault();
    
    // Ensure resetError exists and is an async function before calling
    if (typeof resetError === "function") resetError();  

    try {
        const response = await adminLogin(secretKey);

        if (response?.success) {
            toast.success("Access granted");
            setTimeout(() => {
                navigate("/admin");
              }, 1500);
        } else {
            toast.error(response?.message || "Invalid secret key");
        }
    } catch (error) {
        console.error("Login Error:", error);  // Log error for debugging
        toast.error(error?.response?.data?.message || "Network error, try again");
    }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md border-t border-b border-white/10 bg-opacity-80 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden relative mx-4 sm:mx-auto"
    >
      <div className="relative z-10 p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-white drop-shadow-lg">
          Admin Access
        </h2>

        <form onSubmit={handleAccess}>
          <div className="relative mb-6 sm:mb-8">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="password"
              placeholder="Enter Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-black/70 rounded-lg text-white placeholder-white/70 focus:outline-none border border-white/30 focus:ring-2 focus:ring-white focus:border-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 sm:py-3 px-4 bg-white text-black cursor-pointer font-bold rounded-lg shadow-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition duration-200 text-sm sm:text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto text-black" /> : "Access"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLogin;

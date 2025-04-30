import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/input";
import { Lock, Eye, Loader, EyeClosed, MessageSquareText } from "lucide-react";
import { toast } from "sonner";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const { resetPassword, error, isLoading, message, resetError } = useAuthStore();
	const { token } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		resetError();
		if (isTyping) {
			const timer = setTimeout(() => setIsTyping(false), 1000);
			return () => clearTimeout(timer);
		}
	}, [password, confirmPassword, isTyping, resetError]);

	const handleSubmit = async (e) => {
		e.preventDefault();
	
		// Validate password strength with regex first
		const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
		if (!passwordRegex.test(password)) {
			toast.error(
				"Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
			);
			return;
		}
		
		// Check if passwords match
		if (password.trim() !== confirmPassword.trim()) {
			toast.error("Passwords do not match");
			return;
		}
	
		try {
			const response = await resetPassword(token, password);
			
			if (response && response.success) {
				toast.success("Password reset successfully");
				setTimeout(() => {
					navigate("/login");
				}, 2000);
			} else {
				toast.error(response?.message || "Error resetting password");
			}
		} catch (error) {
			console.log("Error:", error);
			toast.error(error?.response?.data?.message || "Error resetting password");
		}
	};

	return (
		<>
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
			// whileInView={{ opacity: 1 }}
			// whileHover={{ scale: 1.01 }}
			className="max-w-md w-full border-t border-b border-white/10 bg-opacity-80 backdrop-blur-2xl 
			rounded-2xl shadow-2xl overflow-hidden relative mx-4 sm:mx-auto"
		>
			{/* <style jsx>{`
				@keyframes float {
					0% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
					100% { transform: translateY(0px); }
				}
			`}</style> */}

			

			<div className="relative z-10 p-8">
				<h2 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
					Reset Password
				</h2>

				{/* {error && <p className="text-red-500 font-semibold mb-2">{error}</p>} */}
				{/* {message && <p className="text-green-500 font-semibold mb-2">{message}</p>} */}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Password Input */}
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
						<input
							type={showPassword ? "text" : "password"}
							placeholder="New Password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setIsTyping(true);
							}}
							required
							className={`w-full pl-10 pr-4 py-3 bg-black/70 rounded-lg text-white placeholder-white/70 focus:outline-none
								 transition duration-300 ${isTyping ? "border-transparent focus:ring-0" : "border border-white/30 focus:ring-2 focus:ring-white focus:border-white"}`}
						/>
						<span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white">
							{showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
						</span>
					</div>

					{/* Confirm Password Input */}
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
						<input
							type={showConfirmPassword ? "text" : "password"}
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
								setIsTyping(true);
							}}
							required
							className={`w-full pl-10 pr-4 py-3 bg-black/70 rounded-lg text-white placeholder-white/70 focus:outline-none transition duration-300 ${isTyping ? "border-transparent focus:ring-0" : "border border-white/30 focus:ring-2 focus:ring-white focus:border-white"}`}
						/>
						<span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white">
							{showConfirmPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
						</span>
					</div>

					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						type="submit"
						disabled={isLoading}
						className="w-full py-3 px-4 bg-white  text-black font-bold cursor-pointer rounded-lg shadow-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
           				   focus:ring-offset-black transition duration-200"
					>
						{isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto text-black" /> : "Set New Password"}
					</motion.button>
				</form>
			</div>
		</motion.div>
		</>
	);
};

export default ResetPasswordPage;
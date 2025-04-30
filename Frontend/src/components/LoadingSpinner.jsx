import { motion } from "framer-motion";
import StarsCanvas from "../canvas/stars"

const LoadingSpinner = () => {
	return (
		<div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden'>
			{/* Simple Loading Spinner */}
			< StarsCanvas />
			<motion.div
				className='w-10 h-10 border-4 border-t-5 border-t-black border-white rounded-full'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;
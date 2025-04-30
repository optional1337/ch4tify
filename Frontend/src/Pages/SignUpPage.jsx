import { motion } from 'framer-motion';
import { Loader, Lock, Mail, User, Ghost, Eye, EyeOff, MessageSquareText, EyeClosed } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from "sonner";
import PasswordStrengthMeter from '../components/PasswordStrength';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signup, error: signupError, isLoading, resetError } = useAuthStore();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    resetError();
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTyping, resetError]);

  const validateAlias = (value) => {
    if (/[^a-zA-Z0-9]/.test(value)) return 'Alias cannot contain spaces or special characters';
    if (/^[0-9]+$/.test(value)) return 'Alias cannot be numbers only';
    if (/^[0-9]/.test(value)) return 'Alias cannot start with a number';
    return '';
  };

  const handleAliasChange = (e) => {
    const value = e.target.value;
    setAlias(value);
    setIsTyping(true);
    const error = validateAlias(value);
    setAliasError(error);
    setErrors((prev) => ({ ...prev, alias: error || null }));
  };

  const handleInputChange = (setter, key) => (e) => {
    setter(e.target.value);
    setIsTyping(true);
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsTyping(true);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: e.target.value === password ? null : prev.confirmPassword,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!alias) newErrors.alias = 'Alias is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (aliasError) newErrors.alias = aliasError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await signup(email, password, name, alias);
  
      // Show success toast for email verification
      toast.success('verify your email');
  
      // Redirect to the verify-email page after a short delay
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);  // Delay navigation for 2 seconds to let the user see the toast
    } catch (error) {
      console.log(error);
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
  <span className="font-bold text-lg text-white tracking-wider" onClick={() => navigate('/')}>ch4tify</span>
</motion.div>
</header>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // whileHover={{ scale: 1.01 }}
      className='max-w-md w-full border-t border-b border-white/10 
      bg-opacity-70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden relative  
      animate-[float_6s_ease-in-out_infinite] mx-4 sm:mx-auto mt-15 mb-5'>
      {/* <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style> */}
      
      <div className='relative z-10 p-6 sm:p-8 '>
        <h2 className='text-3xl sm:text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg'>
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          {/* Name and Alias */}
          <div className='flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5'>
            {/* Name */}
            <div className='relative w-full sm:w-1/2'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5' />
              <input
                type='text'
                placeholder='Full Name'
                value={name}
                onChange={handleInputChange(setName, 'name')}
                className={`w-full pl-10 pr-4 py-3 bg-black/70 rounded-lg text-white placeholder-white/70
                  focus:outline-none transition duration-300 
                  ${errors.name ? 'border border-red-500 focus:ring-red-500' : isTyping ? 'border-transparent focus:ring-0' : 'border border-white/30 focus:ring-2 focus:ring-white focus:border-white'}`}
              />
            </div>
            {/* Alias */}
            <div className='relative w-full sm:w-1/2'>
              <Ghost className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5' />
              <input
                type='text'
                placeholder='Alias Name'
                value={alias}
                onChange={handleAliasChange}
                className={`w-full pl-10 pr-4 py-3 bg-black/70 rounded-lg text-white placeholder-white/70 focus:outline-none transition duration-300 
                  ${errors.alias ? 'border border-red-500 focus:ring-red-500' : isTyping ? 'border-transparent focus:ring-0' : 'border border-white/30 focus:ring-2 focus:ring-white focus:border-white'}`}
              />
            </div>
          </div>

          {/* Email */}
          <div className='relative mb-5'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5' />
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={handleInputChange(setEmail, 'email')}
              className={`w-full pl-10 pr-4 py-3 bg-black/70 rounded-lg text-white placeholderwhite/70 focus:outline-none transition duration-300 
                ${errors.email ? 'border border-red-500 focus:ring-red-500' : isTyping ? 'border-transparent focus:ring-0' : 'border border-white/30 focus:ring-2 focus:ring-white focus:border-white'}`}
            />
          </div>

          {/* Password + Confirm Password */}
          <div className='flex flex-col gap-3 mb-5'>
            {/* Password */}
            <div className='relative'>
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={handleInputChange(setPassword, 'password')}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className={`w-full pl-10 pr-10 py-3 bg-black/70 rounded-lg text-white placeholder-white/70 focus:outline-none transition duration-300 
                  ${errors.password ? 'border border-red-500 focus:ring-red-500' : isTyping ? 'border-transparent focus:ring-0' : 'border border-white/30 focus:ring-2 focus:ring-white focus:border-white'}`}
              />
              
            </div>
            {/* Confirm Password */}
            <div className='relative'>
            
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full pl-10 pr-4 py-3 bg-black/70 rounded-lg text-white placeholder-white/70 focus:outline-none transition duration-300 
                  ${errors.confirmPassword ? 'border border-red-500 focus:ring-red-500' : isTyping ? 'border-transparent focus:ring-0' : 'border border-white/30 focus:ring-2 focus:ring-white focus:border-white'}`}
              />
            </div>
          </div>

          {/* Error Messages Section */}
          <div className='text-red-500 text-sm space-y-1 mt-2'>
            {errors.name && <p>{errors.name}</p>}
            {errors.alias && <p>{errors.alias}</p>}
            {errors.email && <p>{errors.email}</p>}
            {errors.password && <p>{errors.password}</p>}
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            {signupError && <p>{signupError}</p>}
          </div>

          {isPasswordFocused && <PasswordStrengthMeter password={password} />}
          {/* <PasswordStrengthMeter password={password} /> */}

          <motion.button
            className='mt-5 w-full py-3 px-4 bg-white text-black cursor-pointer font-bold rounded-lg shadow-xl 
              hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
              focus:ring-offset-black transition duration-200'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? <Loader className='animate-spin mx-auto text-black' /> : 'Sign Up'}
          </motion.button>
          </form>
          </div>
          <div className="relative z-10 px-8 py-4 bg-black bg-opacity-60 flex justify-center border-t border-white/10">
          <p className="text-sm text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline font-semibold">Login</Link>
          </p>
          </div>
          </motion.div>
          </>
  );
};

export default SignUpPage;

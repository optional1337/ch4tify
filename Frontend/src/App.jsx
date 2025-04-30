import FloatingShapes from './components/FloatingShapes'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import EmailVerificationPage from './Pages/EmailVerificationPage'
// import { Toaster } from 'react-hot-toast'
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from './store/authStore' 
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import DashboardPage from './Pages/DashboardPage'
import LoadingSpinner from './components/LoadingSpinner'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import StarsCanvas from "./canvas/stars"
import HomePage from './Pages/HomePage'
import NotFoundPage from './Pages/NotFoundPage'
import ProfilePage from './Pages/ProfilePage'
import SettingPage from './Pages/SettingPage'
import Adminlogin from './Pages/Adminlogin'
import { useThemeStore } from './store/ThemeStore'


// public route blocks authenticated users to access

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// protected route to redirect to login page if user is not authenticated

const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />
  }
  return children;
}

const BlockVerifiedUsers = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// redirect to home page if user is authenticated

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user, isVerified } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/home' replace />;
	}
  
	return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, onlineUsers } = useAuthStore();
  const {theme} = useThemeStore();
  const [toastPosition, setToastPosition] = useState("bottom-right");

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setToastPosition("top-center"); // Mobile
      } else {
        setToastPosition("bottom-right"); // Desktop
      }
    };

    updatePosition(); // Set initial position
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  useEffect(() => {
    checkAuth();
  },[checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isCheckingAuth) return <LoadingSpinner/>;
  return (

    <div className="min-h-screen  flex 
    items-center justify-center relative overflow-hidden">
      {/* // <FloatingShapes color="bg-gray-700" size="w-64 h-64" top="-5%" left="10%" delay="1" />
      // <FloatingShapes color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay="5" />
      // <FloatingShapes color="bg-gray-600" size="w-32 h-32" top="40%" left="-10%" delay="2" />
      // <FloatingShapes color="bg-gray-500" size="w-42 h-42" top="-1%" left="12%" delay="10" /> */}

       {/* Base background */}
       <div className="absolute inset-0 bg-black"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 opacity-95"></div>

      <StarsCanvas />
    <Routes>
      <Route path='/' element={<PublicRoute><HomePage/></PublicRoute>} />
      <Route path='/home' element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
      <Route path='/admin/login' element={<Adminlogin/>} />
      <Route path='/profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><SettingPage/></ProtectedRoute>} />
      <Route path='/signup' element={<RedirectAuthenticatedUser><SignUpPage/></RedirectAuthenticatedUser>} />
      <Route path='/login' element={<RedirectAuthenticatedUser><LoginPage/></RedirectAuthenticatedUser>} />
      <Route path='/verify-email' element={<BlockVerifiedUsers><EmailVerificationPage/></BlockVerifiedUsers>} />
      <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPasswordPage/></RedirectAuthenticatedUser>} />
      <Route path='/reset-password/:token' element={<RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>} />
      

    {/* Wildcard route - redirect unknown routes */}
    <Route path="*" element={<NotFoundPage />} />

    </Routes>
    <Toaster position={toastPosition} richColors toastOptions={{
    className: "custom-toast",
  }} />

  </div>

  )
}

export default App

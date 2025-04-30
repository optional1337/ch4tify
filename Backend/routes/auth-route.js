import express from 'express';
import { login, signup, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, updateProfile, verifyPassword, updatePassword } from '../controllers/auth-controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update-profile", verifyToken, updateProfile)
router.post("/verify-password", verifyToken, verifyPassword);
router.post("/update-password", verifyToken, updatePassword);

export default router;
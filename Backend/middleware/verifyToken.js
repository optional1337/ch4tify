import jwt from 'jsonwebtoken';
import { User } from '../models/user-model.js';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token payload" });
        }

        // OPTIONAL: You could also fetch full user data here if needed
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user; // now you have req.user everywhere!
        next();
    } catch (error) {
        console.log("Error in verifyToken:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

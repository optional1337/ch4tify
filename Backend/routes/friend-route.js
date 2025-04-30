import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriendRequests,
    getFriends,
    removeFriend,
} from '../controllers/auth-controller.js';

import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// ✅ Protect all routes with verifyToken middleware
router.post("/send-request", verifyToken, sendFriendRequest);
router.post("/accept-request", verifyToken, acceptFriendRequest);
router.post("/remove", verifyToken, removeFriend);
router.post("/decline-request", verifyToken, declineFriendRequest);
router.get("/requests", verifyToken, getFriendRequests);
router.get("/list", verifyToken, getFriends);

export default router;

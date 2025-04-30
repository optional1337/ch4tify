import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getMessages, getUsersForSidebar, sendMessage, updateMessageReaction } from "../controllers/message-controller.js";

const router = express.Router();

router.get("/users", verifyToken, getUsersForSidebar);
router.get("/:id", verifyToken, getMessages);

router.post("/send/:id", verifyToken, sendMessage);

// ✅ New route for updating message reactions
router.patch("/reaction/:messageId", verifyToken, updateMessageReaction);

export default router;

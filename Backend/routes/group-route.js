import express from "express";
import { createGroup, getUserGroups, promoteToAdmin, removeMember, deleteGroup, demoteAdmin, leaveGroup, addGroupMembers } from "../controllers/auth-controller.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/create", verifyToken, createGroup);
router.get("/user-groups", verifyToken, getUserGroups);
router.put("/:groupId/promote/:memberId", verifyToken, promoteToAdmin);
router.put("/demote-admin", verifyToken, demoteAdmin);
router.put("/leave", verifyToken, leaveGroup);
router.put("/:groupId/add-members", verifyToken, addGroupMembers);
router.put("/:groupId/remove/:memberId", verifyToken, removeMember);
router.delete("/:groupId", verifyToken, deleteGroup);

export default router;

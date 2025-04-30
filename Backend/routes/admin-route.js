import express from "express";
import { adminLogin } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/login", adminLogin); // This should match the frontend API call

export default router;

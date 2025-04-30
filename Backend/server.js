import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth-route.js";
import messageRoutes from "./routes/message-route.js";
// import adminRoutes from "./routes/admin-route.js"
import friendRoutes from './routes/friend-route.js';
import groupRoutes from "./routes/group-route.js";
import { app, server } from './utils/socket.js'

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "https://ch4tify-frontend.onrender.com", credentials: true }));

app.use(express.json()); // allowes us to parse incoming requests:req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // allows us to parse cookies
app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
app.use('/api/friends', friendRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);



    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  
server.listen(PORT, () => {
    connectDB();
    console.log("server is running! : ", PORT);
});
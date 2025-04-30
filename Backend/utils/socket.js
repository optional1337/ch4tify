import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  
  if (userId ) {
    userSocketMap[userId] = socket.id;
    socket.userId = userId; // ✅ assign userId to socket
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

 // ✅ Typing
socket.on("typing", ({ chatId, isGroup, members = [], recipientId }) => {
  const senderId = socket.userId;
  const payload = {
    chatId,
    senderId,
  };

  if (isGroup) {
    members.forEach((memberId) => {
      if (memberId !== senderId) {
        const socketId = getReceiverSocketId(memberId);
        if (socketId) {
          io.to(socketId).emit("typing", payload);
        }
      }
    });
  } else {
    const receiverSocketId = getReceiverSocketId(recipientId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", payload);
    }
  }
});

// ✅ Stop Typing
socket.on("stopTyping", ({ chatId, isGroup, members = [], recipientId }) => {
  const senderId = socket.userId;
  const payload = {
    chatId,
    senderId,
  };

  if (isGroup) {
    members.forEach((memberId) => {
      if (memberId !== senderId) {
        const socketId = getReceiverSocketId(memberId);
        if (socketId) {
          io.to(socketId).emit("stopTyping", payload);
        }
      }
    });
  } else {
    const receiverSocketId = getReceiverSocketId(recipientId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", payload);
    }
  }
});



  // ✅ Friend Request: Send
  socket.on("send_friend_request", ({ sender, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_friend_request", sender);
    }
  });

  // ✅ Friend Request: Accept
  socket.on("friend_request_accepted", ({ senderId, receiver }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("friend_request_accepted_notify", receiver);
    }
  });

  // ✅ Friend Request: Decline
  socket.on("friend_request_declined", ({ senderId }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("friend_request_declined_notify");
    }
  });

  // ❌ Disconnect Cleanup
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[socket.userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };

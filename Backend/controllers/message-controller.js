import { User } from "../models/user-model.js";
import Message from "../models/message-model.js";
import Group from "../models/Group.js";

import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const myId = req.user._id;

    const group = await Group.findById(chatId);

    let messages;

    if (group) {
      // Group chat: receiverId is the group ID
      messages = await Message.find({ receiverId: chatId });
    } else {
      // 1-on-1 chat
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: chatId },
          { senderId: chatId, receiverId: myId },
        ],
      });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const group = await Group.findById(receiverId);

    // Attach chatId for real-time handling on client
    const emittedMessage = {
      ...newMessage.toObject(),
      chatId: receiverId,
    };

    if (group) {
      // ✅ Group Chat
      console.log("Group chat detected. Broadcasting to group members...");
      group.members.forEach((member) => {
        if (member.toString() !== senderId.toString()) {
          const socketId = getReceiverSocketId(member.toString());
          console.log(`Member: ${member}, SocketId: ${socketId}`);
          if (socketId) {
            io.to(socketId).emit("newMessage", emittedMessage);
          }
        }
      });
    } else {
      // ✅ 1-to-1 Chat
      console.log("1-1 chat detected. Emitting to receiver...");
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", emittedMessage);
      }
    }

    // Respond to sender
    res.status(201).json(emittedMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ error: "Emoji is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReactionIndex !== -1) {
      const existingReaction = message.reactions[existingReactionIndex];

      if (existingReaction.emoji === emoji) {
        // ❌ Toggle off reaction
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // 🔁 Change emoji
        message.reactions[existingReactionIndex].emoji = emoji;
      }
    } else {
      // ➕ New reaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    // Create emit payload with chatId for client-side matching
    const emitPayload = {
      messageId: message._id,
      reactions: message.reactions,
      chatId: message.receiverId,
    };

    // Check if it's a group chat or 1-1
    const group = await Group.findById(message.receiverId);

    if (group) {
      // ✅ Broadcast to group members
      group.members.forEach((memberId) => {
        if (memberId.toString() !== userId.toString()) {
          const socketId = getReceiverSocketId(memberId.toString());
          if (socketId) {
            io.to(socketId).emit("reactionUpdated", emitPayload);
          }
        }
      });
    } else {
      // ✅ Single chat: notify the other person
      const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("reactionUpdated", emitPayload);
      }
    }

    res.status(200).json({ reactions: message.reactions });
  } catch (error) {
    console.error("updateMessageReaction error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
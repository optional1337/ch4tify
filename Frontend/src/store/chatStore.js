import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
// import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";

const axiosInstance = axios.create({ baseURL: 'http://localhost:5000/api' });
axios.defaults.withCredentials = true;
export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  // lastMessages: [],
  unreadMessages: {},  // ✅ Initialize unreadMessages
  // sendReaction: [], // Stores unread counts for each user

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users" , { withCredentials: true });
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (chatObj) => {
    const chatId = chatObj._id;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${chatId}`, {
        withCredentials: true,
      });
  
      set({ messages: res.data });
  
      set((state) => {
        const updatedUnreadMessages = { ...state.unreadMessages };
        delete updatedUnreadMessages[chatId];
        return { unreadMessages: updatedUnreadMessages };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData , { withCredentials: true });
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.patch(`/messages/reaction/${messageId}`, { emoji }, { withCredentials: true });

      // ✅ Update the message list with the new reaction
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions: res.data.reactions } : msg
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding reaction");
    }
  },

  subscribeToMessages: () => {
  const socket = useAuthStore.getState().socket;

  socket.on("newMessage", (newMessage) => {
    const { selectedUser, messages } = get();

    const isGroupChat = selectedUser?.isGroupChat;
    const isCurrentChat =
      isGroupChat
        ? newMessage.chatId === selectedUser._id // group chat match
        : newMessage.senderId === selectedUser._id; // single chat match

    if (isCurrentChat) {
      set({ messages: [...messages, newMessage] });
    } else {
      get().receiveMessage(newMessage);
    }
  });

  // ✅ Real-time reaction updates
  socket.on("reactionUpdated", ({ messageId, reactions }) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, reactions } : msg
      ),
    }));
  });

  // ✅ Typing indicators
  socket.on("typing", ({ chatId, senderId }) => {
    const { selectedUser } = get();
    const isGroupChat = selectedUser?.isGroupChat;

    const isTypingInCurrentChat =
      isGroupChat
        ? chatId === selectedUser._id // group typing
        : senderId === selectedUser._id; // single chat typing

    if (isTypingInCurrentChat) {
      set({ isTyping: true });
    }
  });

  socket.on("stopTyping", ({ chatId, senderId }) => {
    const { selectedUser } = get();
    const isGroupChat = selectedUser?.isGroupChat;

    const isTypingInCurrentChat =
      isGroupChat
        ? chatId === selectedUser._id
        : senderId === selectedUser._id;

    if (isTypingInCurrentChat) {
      set({ isTyping: false });
    }
  });
},

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("reactionUpdated"); // ✅ Add this to prevent memory leaks
  },

  setSelectedUser: (user) => {
    set((state) => {
      const updatedUnreadMessages = { ...state.unreadMessages };
      if (user && updatedUnreadMessages[user._id]) {
        delete updatedUnreadMessages[user._id]; // Reset unread count when chat is opened
      }
      return { selectedUser: user, unreadMessages: updatedUnreadMessages };
    });
  },

  receiveMessage: (message) => {
    set((state) => {
      const updatedUnreadMessages = { ...state.unreadMessages };
  
      if (state.selectedUser?._id === message.senderId) {
        // ✅ If the chat is open, add message and reset unread count
        updatedUnreadMessages[message.senderId] = 0;
        return {
          messages: [...state.messages, message],
          unreadMessages: updatedUnreadMessages,
        };
      } else {
        // ✅ If no chat is selected, increment unread count
        updatedUnreadMessages[message.senderId] =
          (updatedUnreadMessages[message.senderId] || 0) + 1;
  
        return {
          messages: state.messages, // Keep existing messages
          unreadMessages: updatedUnreadMessages, // Update unread count
        };
      }
    });
  },

  setUnreadMessages: (chatId, count) =>
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [chatId]: count,  // ✅ Ensure it updates even if no chat is selected
      },
    })),
  
  
  
}));
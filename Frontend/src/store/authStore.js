import { create } from 'zustand';
import axios from 'axios';
import { isValidElement } from 'react';
// import toast from 'react-hot-toast';
import { toast } from 'sonner'
import { io } from "socket.io-client";
import { chatStore } from './chatStore';


const API_URL = 'http://localhost:5000/api/auth'
const BASE_URL = 'http://localhost:5000'
axios.defaults.withCredentials = true;
export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    onlineUsers: [],
    isUpdatingProfile:false,
    socket:null,
    friends: [],
    groups: [],
    friendRequests: [],

    signup: async (email, password, name, alias) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name, alias });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({ 
                isAuthenticated: true,
                user: response.data.user,
                isLoading: false,
                error: null
             });
             get().connectSocket()
             return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    verifyPassword: async (currentPassword) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/verify-password`, { currentPassword }, { withCredentials: true });
    
        set({ 
          isLoading: false,
          error: null,
        });
    
        return response.data; // { success: true, message: "Password verified successfully" }
      } catch (error) {
        set({ error: error.response?.data?.message || "Error verifying password", isLoading: false });
        throw error;
      }
    },
    
    updatePassword: async (newPassword, confirmPassword) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/update-password`, { newPassword, confirmPassword }, { withCredentials: true });
    
        set({
          isLoading: false,
          error: null,
        });
    
        return response.data; // { success: true, message: "Password updated successfully" }
      } catch (error) {
        set({ error: error.response?.data?.message || "Error updating password", isLoading: false });
        throw error;
      }
    },
    

    adminLogin: async (secretKey) => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/login",
                { secretKey },
                { withCredentials: true }  // ✅ Important for cookies
            );
    
            set({
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
    
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || "Error verifying secret key" });
            throw error;
        }
    }, 

    verifyEmail: async(code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            get().connectSocket()
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            
        }
    },

    checkAuth: async() => {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            console.log("checkAuth user response:", response.data.user);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            get().connectSocket()
        } catch (error) {
            set({ user: null, error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    forgotPassword: async(email) => {
        set ({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {email});
            set({isLoading: false, message: response.data.message});
        } catch (error) {
            set({isLoading: false, error: error.response.data.message || "Error sending reset password email"});
            throw error;
        }
    },

    resetPassword: async(token, password) => {
        set ({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, {password})
            set({message: response.data.message, isLoading: false})
            return response.data; // Return response data so frontend can access it
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password"
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            toast.success("Logged out successfully");
            setTimeout(() => {
                set({ user: null, isAuthenticated: false, error: null, isLoading: false });
            }, 1000);
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed" );
        }    
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true, isAuthenticated: true });
    try {
      const res = await axios.put(`${API_URL}/update-profile`, data);
      set({ user: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
    },

    connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: user._id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    // Reset the error state to null
    resetError: () => set({ error: null }),

    //Friend System
    // ===============================
    // 🚀 Friend System
    //Friend System
// ===============================
sendFriendRequest: async (receiverId) => {
  try {
      const res = await axios.post(`${BASE_URL}/api/friends/send-request`, { receiverId }, { withCredentials: true });
      toast.success(res.data.message);

      // 🔴 Emit to receiver via socket
      const { user, socket } = get();
      if (socket && user) {
          socket.emit("send_friend_request", {
              sender: user,
              receiverId,
          });
      }
  } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send friend request");
  }
},

acceptFriendRequest: async (senderId) => {
  try {
      const res = await axios.post(`${BASE_URL}/api/friends/accept-request`, { senderId }, { withCredentials: true });
      toast.success(res.data.message);

      await get().checkAuth();

      // 🔴 Emit to sender via socket
      const { user, socket } = get();
      if (socket && user) {
          socket.emit("friend_request_accepted", {
              senderId,
              receiver: user,
          });
      }
  } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
  }
},

declineFriendRequest: async (senderId) => {
  try {
      const res = await axios.post(`${BASE_URL}/api/friends/decline-request`, { senderId }, { withCredentials: true });
      toast.success(res.data.message);

      await get().checkAuth();

      // 🔴 Emit to sender via socket
      const { socket } = get();
      if (socket) {
          socket.emit("friend_request_declined", { senderId });
      }
  } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline request");
  }
},


    // 🔄 Fetch pending friend requests for current user
    getFriendRequests: async () => {
      try {
          const res = await axios.get(`${BASE_URL}/api/friends/requests`, { withCredentials: true });
          set({ friendRequests: res.data.friendRequests || [] });
          return res.data.friendRequests;
      } catch (error) {
          toast.error("Could not fetch friend requests");
          set({ friendRequests: [] });
          return [];
      }
  },
  

// 🔄 Fetch current friends list
getFriends: async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/friends/list`, { withCredentials: true });
        set({ friends: res.data.friends });
        return res.data.friends; // array of user profiles
    } catch (error) {
        toast.error("Could not fetch friends list");
        return [];
    }
},

removeFriend: async (friendId) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/friends/remove`, { friendId }, { withCredentials: true });
      toast.success(res.data.message);
      await get().getFriends(); // refresh friend list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  },
  
createGroup: async (groupData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/groups/create`, groupData, {
        withCredentials: true,
      });
      toast.success("Group created successfully");
      return res.data.group;
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
      throw error;
    }
  },

  addGroupMembers: async (groupId, newMemberIds) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/groups/${groupId}/add-members`,
        { newMemberIds },
        { withCredentials: true }
      );
      toast.success("Members added successfully");
      return res.data;
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error(error.response?.data?.message || "Failed to add members");
      throw error;
    }
  },
  
  getGroups: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/groups/user-groups`, {
        withCredentials: true,
      });
      set({ groups: res.data });
      console.log("✅ Groups fetched:", res.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  },

  promoteToAdmin: async (groupId, memberId) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/groups/${groupId}/promote/${memberId}`, {
        withCredentials: true,
      });
      toast.success("Promoted to admin");
      return res.data.group;
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to promote admin");
      throw err;
    }
  },

  demoteAdmin: async (groupId, userIdToDemote) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/groups/demote-admin`, {
        groupId,
        userIdToDemote,
      } , { withCredentials: true });
      // Optionally update local selectedUser state
        toast.success("Demoted to member");
        return res.data.group; // Return the updated group data if needed
    } catch (err) {
      console.error("Demote admin failed:", err);
    }
  },
  
  leaveGroup: async (groupId) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/groups/leave`, { groupId } , { withCredentials: true });
      // Clear selected chat and refresh group if needed
      toast.success("Left group successfully");
      return res.data.group; // Return the updated group data if needed
    } catch (err) {
      console.error("Leave group failed:", err);
    }
  },  

  removeGroupMember: async (groupId, memberId) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/groups/${groupId}/remove/${memberId}` , {
        withCredentials: true,
      });
      toast.success("Member removed");
      return res.data.group;
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to remove member");
      throw err;
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axios.delete(`${BASE_URL}/api/groups/${groupId}` , {
        withCredentials: true,
      });
      toast.success("Group deleted");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete group");
      throw err;
    }
  },

}));
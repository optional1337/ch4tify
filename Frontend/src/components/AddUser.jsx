import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { chatStore } from "../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

const AddUser = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const { getUsers, users } = chatStore();
  const {
    user,
    sendFriendRequest,
    socket,
    checkAuth, // 🔄 To refresh user state
  } = useAuthStore();

  // 🔄 Filter users based on search
  useEffect(() => {
    const filtered = users.filter((u) => u._id !== user._id);
    if (!searchTerm.trim()) {
      setResults(filtered);
    } else {
      const found = filtered.filter((u) =>
        u.alias.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(found);
    }
  }, [searchTerm, users, user]);

  // 🧠 Listen for real-time updates
  useEffect(() => {
    if (!socket) return;
  
    const handleIncomingRequest = async (sender) => {
      console.log("New friend request from", sender);
      await checkAuth(); // 🔄 Refresh user
    };
  
    const handleRequestAccepted = async (receiver) => {
      console.log("Friend request accepted by", receiver);
      await checkAuth();
    };
  
    const handleRequestDeclined = async (data) => {
      console.log("Friend request declined", data);
      await checkAuth();
    };
  
    // ✅ Correct event names:
    socket.on("new_friend_request", handleIncomingRequest);
    socket.on("friend_request_accepted_notify", handleRequestAccepted);
    socket.on("friend_request_declined_notify", handleRequestDeclined);
  
    return () => {
      socket.off("new_friend_request", handleIncomingRequest);
      socket.off("friend_request_accepted_notify", handleRequestAccepted);
      socket.off("friend_request_declined_notify", handleRequestDeclined);
    };
  }, [socket, user._id, checkAuth]);
  

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
  };

  const handleSendRequest = (userId) => {
    sendFriendRequest(userId);
    setRequestedIds((prev) => [...prev, userId]);
  };
  
  useEffect(() => {
    if (open && users.length === 0) {
      getUsers();
    }
  }, [open, getUsers, users.length]);
  
  const isFriend = (id) => user.friends.includes(id);
  const isRequested = (id) =>
    user.friendRequestsSent.includes(id) || requestedIds.includes(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:w-[500px] h-[500px] lg:max-w-full bg-base-100 overflow-hidden border-none">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Search users by alias and send a friend request.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none -scale-x-100" />
          <Input
            placeholder="Search by alias"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 border bg-background border-base-200 focus:outline-none focus:ring-0 focus:border-base-200 focus-visible:ring-0"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-primary transition"
            >
              <X className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="mt-1 flex-1 overflow-y-auto space-y-3 p-1 h-[330px] pb-8">
          {results.length > 0 ? (
            <AnimatePresence>
              {results.map((u) => {
                const friend = isFriend(u._id);
                const requested = isRequested(u._id);

                return (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex items-center justify-between gap-3 p-2 rounded-md border transition
                      ${friend || requested ? "hover:bg-transparent" : "hover:bg-accent"}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profilePic || "/avatar/default.png"}
                        alt={u.alias}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{u.alias}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.name}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSendRequest(u._id)}
                      size="sm"
                      disabled={friend || requested}
                      className={`cursor-pointer ${
                        friend || requested
                          ? "opacity-60 cursor-not-allowed bg-transparent border border-primary"
                          : ""
                      }`}
                    >
                      {friend ? "Friends" : requested ? "Requested" : "Request"}
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <p className="text-center text-sm text-muted-foreground mt-16">
              No user found
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;

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
import { Search, X, Users } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { chatStore } from "../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

const AddGroup = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { getUsers, users } = chatStore();
  const { user, getFriends, createGroup } = useAuthStore();
  const [friends, setFriends] = useState([]);


  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(friends);
    } else {
      const found = friends.filter((u) =>
        u.alias.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(found);
    }
  }, [searchTerm, friends]);
  

  useEffect(() => {
    const fetchFriends = async () => {
      const fetchedFriends = await getFriends();
      const filtered = fetchedFriends.filter((u) => u._id !== user._id);
      setFriends(filtered);
      setResults(filtered);
    };
  
    if (open) {
      fetchFriends();
    }
  }, [open, getFriends, user._id]);
  

  const handleToggleUser = (userObj) => {
    const exists = selectedUsers.find((u) => u._id === userObj._id);
    if (exists) {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== userObj._id));
    } else {
      setSelectedUsers((prev) => [...prev, userObj]);
    }
  };

  const handleRemoveSelected = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) return;
  
    const groupPayload = {
      name: groupName,
      members: [...selectedUsers.map((u) => u._id), user._id],
      adminIds: [user._id, ...selectedUsers.map((u) => u._id)], // Array of admin IDs
       // optional
    };
    
  
    try {
      const group = await createGroup(groupPayload);
      console.log("Group created:", group);
  
      // Optionally reset state or close dialog
      onOpenChange(false);
      setGroupName("");
      setSelectedUsers([]);
    } catch (err) {
      console.error("Group creation failed");
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="w-full max-w-[95%] sm:max-w-[500px] h-[90vh] sm:h-[600px] bg-base-100 overflow-hidden border-none flex flex-col">
  <DialogHeader>
    <DialogTitle>Create Group</DialogTitle>
    <DialogDescription>
      Enter group name and add users to create a group chat.
    </DialogDescription>
  </DialogHeader>

  <div className="flex-1 overflow-y-auto scrollbar-none pr-1 space-y-4">
  {/* Group Name + Search Inputs */}
  <div className="flex flex-col gap-0">
    <div className="flex items-center border bg-background border-base-200 rounded-md px-3 h-[40px]">
      <Users className="w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full bg-transparent outline-none px-2 py-[6px] text-sm"
      />
    </div>

    <div className="flex items-center border bg-background border-base-200 rounded-md px-3 mt-2 h-[40px]">
      <Search className="w-4 h-4 text-muted-foreground -scale-x-100" />
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-transparent outline-none px-2 py-[6px] text-sm"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="p-1 rounded hover:bg-primary transition cursor-pointer"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  </div>

 {/* Selected Users */}
{selectedUsers.length > 0 && (
  <div className="mt-3">
    <h4 className="text-sm font-semibold text-foreground mb-2">Selected Members</h4>

    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {selectedUsers.slice(0, 5).map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm whitespace-nowrap min-w-max"
          >
            <img
              src={u.profilePic || "/avatar/default.png"}
              alt={u.alias}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs">{u.alias}</span>
            <X
              className="w-3.5 h-3.5 ml-1 cursor-pointer hover:scale-110 transition"
              onClick={() => handleRemoveSelected(u._id)}
            />
          </div>
        ))}

        {selectedUsers.length > 5 && (
          <div className="text-xs text-muted-foreground ml-1">
            +{selectedUsers.length - 5} more
          </div>
        )}
      </div>
    </div>
  </div>
)}




  {/* Members Header */}
  <div className="text-sm font-bold text-muted-foreground px-1">
    Friends
  </div>

  {/* User List */}
  <motion.div className="flex-1 overflow-y-auto space-y-3 p-1 max-h-[30vh]  min-h-[120px]"
  layout>
    {results.length > 0 ? (
      <AnimatePresence>
        {results.map((u) => {
          const isSelected = selectedUsers.find((sel) => sel._id === u._id);
          return (
            <motion.div
              key={u._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center justify-between gap-3 p-2 rounded-md border hover:bg-accent transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.profilePic || "/avatar/default.png"}
                  alt={u.alias}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{u.alias}</div>
                  <div className="text-xs text-muted-foreground">{u.name}</div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleToggleUser(u)}
                variant={isSelected ? "outline" : "default"}
                className="cursor-pointer"
              >
                {isSelected ? "Remove" : "Add"}
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    ) : (
      <div className="h-[200px] space-y-3 p-1 overflow-hidden">
        <div className="h-full rounded-md flex items-center justify-center text-sm text-muted-foreground">
          No users found
        </div>
      </div>
    )}
  </motion.div>
  </div>

  {/* Create Button */}
<div className="pt-3 mt-3">
  <Button
    className="w-full cursor-pointer hover:scale-101 transition-all duration-200"
    onClick={handleCreateGroup}
    disabled={!groupName.trim() || selectedUsers.length < 2}
  >
    Create Group
  </Button>
</div>

</DialogContent>

</Dialog>

  );
};

export default AddGroup;

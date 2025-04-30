import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/authStore";
import { chatStore } from "../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

const AddMembers = ({ open, onOpenChange, updateGroupMembers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { user, getFriends, addGroupMembers } = useAuthStore();
  const { selectedUser } = chatStore(); // current group chat
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const fetchedFriends = await getFriends();
  
      // Convert group member IDs to string array for safe comparison
      const groupMemberIds = selectedUser?.members?.map((m) =>
        typeof m === "object" ? m._id?.toString() : m?.toString()
      ) || [];
  
      const filtered = fetchedFriends
        .filter((f) => f._id !== user._id)
        .filter((f) => !groupMemberIds.includes(f._id.toString()));
  
      setFriends(filtered);
    };
  
    if (open) {
      fetchFriends();
    }
  }, [open, selectedUser?._id, selectedUser?.members, user._id]);
  
  // keep this for syncing friends
  
  useEffect(() => {
    if (open) {
      setSelectedUsers([]);
      setSearchTerm("");
    }
  }, [open]); // separate effect to only reset selection on open
  
  

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
  

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
  
    try {
      // Call backend API to add members to the group
      await addGroupMembers(selectedUser._id, selectedUsers.map((u) => u._id));
  
      // Update group members in the parent component or store
      updateGroupMembers(selectedUsers);
  
      // Optionally, remove added users from the friends list
      const updatedFriends = friends.filter(
        (f) => !selectedUsers.some((sel) => sel._id === f._id)
      );
      setFriends(updatedFriends);
  
      // Clear selected users and close the dialog
      setSelectedUsers([]);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to add members:", err);
    }
  };
  

  const filteredResults = friends.filter(
    (u) =>
      u.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95%] sm:max-w-[500px] h-[90vh] sm:h-[600px] bg-base-100 border-none flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          {/* <DialogDescription>
  Add members to the group <span className="font-semibold">{selectedUser?.name}</span>.
</DialogDescription> */}


        </DialogHeader>

        {/* Search Input */}
        <div className="flex flex-col gap-0">
        <div className="flex items-center border bg-background border-base-200 rounded-md px-3 h-[40px]">
      <Users className="w-4 h-4 text-muted-foreground" />
      <input
        value={selectedUser?.name || ""}
        readOnly
        className="w-full bg-transparent outline-none px-2 py-[6px] text-sm"
      />
    </div>

        <div className="flex items-center border border-base-200 rounded-md px-3 h-[40px] mt-2 bg-background">
          <Search className="w-4 h-4 text-muted-foreground -scale-x-100" />
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none px-2 py-[6px] text-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="p-1 hover:bg-primary rounded">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-foreground mb-2">Selected</h4>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {selectedUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm min-w-max"
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
            </div>
          </div>
        )}

        {/* User List */}
        <motion.div
  className="flex-1 overflow-y-auto space-y-3 p-1 max-h-[40vh]  min-h-[120px]"
  layout
>
  {filteredResults.length > 0 ? (
    <AnimatePresence>
      {filteredResults.map((u) => {

                const isSelected = selectedUsers.find((sel) => sel._id === u._id);
                return (
                  <motion.div
                    key={u._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-between gap-3 p-2 rounded-md border transition
                    ${isSelected ? "hover:bg-transparent" : " hover:bg-accent"}`}
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
                      className="cursor-pointer"
                      variant={isSelected ? "outline" : "default"}
                    >
                      {isSelected ? "Remove" : "Add"}
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
              All friends are already added
            </div>
          )}
          
        </motion.div>
        
        <div className="mt-auto pt-3">
          <Button
            className="w-full hover:scale-103 transition-all cursor-pointer"
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0}
          >
            Add Members
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default AddMembers;

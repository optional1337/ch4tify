import { X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { chatStore } from "../store/chatStore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Trash2, LogOut, UserPlus  } from "lucide-react";
import { motion } from "framer-motion";
import AddMembers from "./AddMembers";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = chatStore();
  const { onlineUsers, user, promoteToAdmin, removeGroupMember, deleteGroup, demoteAdmin, leaveGroup } = useAuthStore();
  
  if (!selectedUser) return null;
  
  const isGroupChat = selectedUser.isGroupChat;
  const [open, setOpen] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [currentMembers, setCurrentMembers] = useState(selectedUser.members); // Initialize with current members from selectedUser
  
  const updateGroupMembers = (newMembers) => {
    setCurrentMembers((prevMembers) => [...prevMembers, ...newMembers]);
  };


  if (!selectedUser) return null;

  return (
    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          {/* Avatar and Info Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                {/* Avatar */}
                <div className="avatar">
                  <div className="size-10 rounded-full relative">
                    <img
                      src={isGroupChat ? selectedUser.groupPic || "/avatar/group-default.png" : selectedUser.profilePic || "/avatar/default.png"}
                      alt={isGroupChat ? selectedUser.name : selectedUser.fullName}
                    />
                  </div>
                </div>

                {/* User/Group Info */}
                <div>
                  <h3 className="font-medium">{isGroupChat ? selectedUser.name : selectedUser.alias}</h3>
                  <p className="text-sm text-base-content/70">
                  {isGroupChat
    ? (selectedUser?.members && Array.isArray(selectedUser.members) && selectedUser.members.length > 0
        ? selectedUser.members.map((member, index) => (
            <span key={member._id}>
              {member._id === user._id ? "You" : member.alias}
              {index < selectedUser.members.length - 1 && ", "}
            </span>
          ))
        : "No members")
                      : onlineUsers.includes(selectedUser._id)
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </SheetTrigger>

            {/* Sheet Content */}
            <SheetContent
  side="right"
  className="w-[300px] sm:w-[350px] bg-base-200 text-base-content"
>
{isGroupChat ? (
  <div className="mt-6 w-full flex flex-col items-center px-4 space-y-5">
  {/* Group Pic */}
  <img
    src={selectedUser.groupPic || "/avatar/group-default.png"}
    alt="Group"
    className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow"
  />

  {/* Group Name */}
  <h2 className="text-xl font-bold text-center">{selectedUser.name}</h2>

  {/* Members List */}
  <div className="w-full flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground font-semibold tracking-wide">
        Members ({selectedUser.members.length})
      </div>

      {(selectedUser.createdBy === user._id || selectedUser.adminIds.includes(user._id)) && (
        <button
          onClick={() => setShowAddMembers(true)}
          className="text-primary hover:text-primary/80 transition-transform hover:scale-110 mr-2 size-6 cursor-pointer bg-transparent"
          title="Add Member"
        >
          <UserPlus className="size-4" />
        </button>
      )}
      <AddMembers open={showAddMembers} 
                  onOpenChange={setShowAddMembers} 
                  updateGroupMembers={updateGroupMembers}
                  />

  </div>

    {/* Scrollable members list with animation */}
    <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
    {[...selectedUser.members]
  .sort((a, b) => {
    if (a._id === selectedUser.createdBy) return -1; // creator comes first
    if (b._id === selectedUser.createdBy) return 1;
    const aIsAdmin = selectedUser.adminIds.includes(a._id);
    const bIsAdmin = selectedUser.adminIds.includes(b._id);
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;
    return 0;
  })
  .map((member, i) => {
    const isAdmin = selectedUser.adminIds.includes(member._id);
    const isSelf = member._id === user._id;
    const isCurrentUserCreator = user._id === selectedUser.createdBy;
    const isCurrentUserAdmin = selectedUser.adminIds.includes(user._id);

    return (
      <motion.div
        key={member._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="flex items-center justify-between bg-base-100 px-3 py-2 rounded-xl shadow-sm"
      >
        <div className="flex items-center gap-3">
          <img
            src={member.profilePic || "/avatar/default.png"}
            alt={member.alias}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-medium">
            {isSelf ? "You" : member.alias}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {member._id === selectedUser.createdBy && (
            <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
              Creator
            </Badge>
          )}
          {isAdmin && member._id !== selectedUser.createdBy && (
            <Badge className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
              Admin
            </Badge>
          )}

          {/* Demote Admin - visible only to creator */}
{selectedUser.createdBy === user._id && isAdmin && member._id !== user._id && (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        size="icon"
        className="size-6 text-yellow-600 transition-transform hover:scale-110 hover:bg-transparent bg-transparent cursor-pointer"
      >
        <ShieldCheck className="size-4 rotate-180" /> {/* visually 'undo' admin */}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-base-200 text-base-content">
      <AlertDialogHeader>
        <AlertDialogTitle>Demote Admin?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove admin rights from {member.alias}?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => demoteAdmin(selectedUser._id, member._id)
          }
          className="bg-yellow-600 text-white hover:bg-yellow-700"
        >
          Demote
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)}


          {/* Action buttons */}
          {isCurrentUserAdmin && !isSelf && (
            <>
              {/* Promote to admin */}
              {!isAdmin && isCurrentUserCreator && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" className="size-6 text-green-600 transition-transform hover:scale-110 hover:bg-transparent bg-transparent cursor-pointer">
                      <ShieldCheck className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-base-200 text-base-content">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Promote to Admin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Granting admin rights to <strong>{member.alias}</strong> will allow them to manage group members and settings. Proceed with promotion?
                      </AlertDialogDescription>

                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => promoteToAdmin(selectedUser._id, member._id)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Promote
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Remove member or admin */}
              {(isCurrentUserCreator || (!isAdmin && isCurrentUserAdmin)) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" className="size-6 text-red-600 transition-transform hover:scale-110 hover:bg-transparent bg-transparentcursor-pointer">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-base-200 text-base-content">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Remove {member.alias} from the group?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeGroupMember(selectedUser._id, member._id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  })}


    </div>
  </div>


  {/* Delete group button (only for admin) */}
  {selectedUser.createdBy === user._id && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="text-xs px-4 py-2 h-auto mt-6 bg-red-600 cursor-pointer hover:scale-102 transition-all"
        >
          Delete Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-base-200 text-base-content">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Group?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the group <strong>{selectedUser.name}</strong> and remove all members. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteGroup(selectedUser._id);
              setSelectedUser(null); // Exit chat
              setOpen(false);        // Close sheet
            }}
            
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )}

{/* leave group button (only for admin/non-admin members) */}
{selectedUser.createdBy !== user._id && (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        size="sm"
        variant="secondary"
        className="text-xs px-4 py-2 h-auto mt-4 bg-yellow-600 text-white cursor-pointer hover:scale-102 transition-all flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Leave Group
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-base-200 text-base-content">
      <AlertDialogHeader>
        <AlertDialogTitle>Leave Group?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to leave <strong>{selectedUser.name}</strong>? You’ll no longer receive messages from this group.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="bg-yellow-600 text-white hover:bg-yellow-700"
          onClick={async () => {
            await leaveGroup(selectedUser._id);
            setSelectedUser(null); // Exit chat
            setOpen(false);        // Close sheet
          }}
          
        >
          Leave
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)}

</div>


) : (
  // 👇 The friend info block stays the same as your current implementation

  <div className="mt-4 flex flex-col items-center text-center">
    <img
      src={selectedUser.profilePic || "/avatar/default.png"}
      alt="Profile"
      className="w-20 h-20 rounded-full object-cover mb-4"
    />
    <h2 className="text-lg font-semibold">{selectedUser.alias}</h2>
    <p className="text-sm text-base-content/70 break-all">
      {selectedUser.email || "No email available"}
    </p>

    {/* 👇 Remove Friend Button */}
    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      size="sm"
      variant="destructive"
      className="text-xs px-4 py-2 h-auto mt-6 cursor-pointer bg-red-600 hover:scale-103 transition-transform duration-200 ease-in-out"
    >
      Remove Friend
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent className="bg-base-200 text-base-content">
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to remove this friend?</AlertDialogTitle>
      <AlertDialogDescription>
  Once removed, <strong>{selectedUser.name}</strong> will no longer appear in your friend list. To reconnect, you will need to send a new friend request.
</AlertDialogDescription>

    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
        onClick={async () => {
          await useAuthStore.getState().removeFriend(selectedUser._id);
          setSelectedUser(null); // Close chat
          setOpen(false); // Close sheet
        }}
      >
        Yes, Remove
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        </div>
        )}
      </SheetContent>
          </Sheet>

          {/* Chat close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;

import { useEffect, useState } from "react";
import { chatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import SidebarSkeleton from "./skelatons/sidebar-skeleton";
import { Users as GroupIcon, UserPlus, Search, X } from "lucide-react";
import AddUser from "./AddUser";
import AddGroup from "./AddGroup";
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadMessages,
    lastMessages,
  } = chatStore();

  const { onlineUsers, user, friends, getFriends, groups, getGroups } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [unreadUpdate, setUnreadUpdate] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  useEffect(() => {
    setUnreadUpdate((prev) => prev + 1);
  }, [unreadMessages]);

  useEffect(() => {
    if (selectedUser && selectedUser.isGroupChat) {
      console.log("Selected group:", selectedUser.isGroupChat);
  
      if (!selectedUser.members) {
        console.warn("Group selected but no members array!");
        // Optionally: you could fetch the group details again here
        // Or update `setSelectedUser` to ensure it includes `members`
      }
    }
  }, [selectedUser]);
  


useEffect(() => {
  getFriends();
  getGroups(); // 👈 fetch groups
}, [getFriends, getGroups]);

  const sortedUsers = [...(Array.isArray(friends) ? friends : [])].sort((a, b) => {
    const isAOnline = onlineUsers.includes(a._id);
    const isBOnline = onlineUsers.includes(b._id);
    return isBOnline - isAOnline;
  });

  const filteredUsers = sortedUsers.filter((userObj) => {
    const isOnline = onlineUsers.includes(userObj._id);
    const matchesSearch = userObj.alias.toLowerCase().includes(searchTerm.toLowerCase());
    return (showOnlineOnly ? isOnline : true) && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-75 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between gap-3">
          {/* 🔍 Search Bar */}
          <div className="flex items-center gap-2 border border-base-300 rounded-md px-2 py-1 w-full max-w-[200px] relative">
            <Search className="size-4 text-zinc-500 -scale-x-100" />
            <input
              type="text"
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-primary transition"
              >
                <X className="size-4 text-zinc-400" />
              </button>
            )}
          </div>

          {/* ➕ Icons */}
          <div className="flex items-center gap-3">
            <button title="Add User" className="hover:text-primary/80 hover:scale-105 transition-all cursor-pointer"
              onClick={() => setAddUserOpen(true)}>
              <UserPlus className="size-5" />
            </button>
            <button title="Add Group" className="hover:text-primary/80 hover:scale-105 transition-all cursor-pointer"
              onClick={() => setAddGroupOpen(true)}>
              <GroupIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* 🌐 Online Filter */}
        <div className="mt-4 px-1 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer
                ${showOnlineOnly ? "bg-primary" : "bg-zinc-400/40"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full shadow-sm transition-all duration-300
                  ${showOnlineOnly ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs">
              <Badge className="bg-base-200 rounded-full">
                {
                  friends && Array.isArray(friends)
                    ? friends.filter(f => onlineUsers.includes(f._id)).length
                    : 0
                } online
              </Badge>
            </span>
          </div>
        </div>
      </div>


      {/* 👥 Users List */}
      <div className="overflow-y-auto w-full py-3 scroll-m-2">
      <AnimatePresence>
        {filteredUsers.map((user) => {
          const unreadCount = unreadMessages?.[user._id] ?? 0;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}           
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer flex items-center gap-3 rounded-xl px-4 py-2 transition
                        hover:bg-base-300 bg-base-100
                        ${selectedUser?._id === user._id ? "bg-base-200" : ""}
                      `}
                      style={{
                        margin: "0.25rem auto",
                        maxWidth: "92%",
                      }}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar/default.png"}
                alt={user.name}
                className="size-10 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-primary rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="font-medium truncate">{user.alias}</div>
              <div className="text-xs text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-primary text-base-100 rounded-full px-2">
                {unreadCount}
              </span>
            )}
          </motion.div>

          );
        })}
        
        </AnimatePresence>

         {/* 👥 Group List */}
{groups && groups.length > 0 && (
  <>
    <div className="text-xs text-zinc-400 px-4 py-2">Groups</div>
    {groups.map((group) => (
      <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }} 
      key={group._id}
      onClick={() => {
        if (group.members && Array.isArray(group.members)) {
          setSelectedUser(group);
        } else {
          console.warn("Group missing members data:", group);
        }
      }}
      
      className={`cursor-pointer flex items-center gap-3 rounded-xl px-4 py-2 transition
        hover:bg-base-300 bg-base-100
        ${selectedUser?._id === group._id ? "bg-base-200" : ""}
      `}
      style={{
        margin: "0.25rem auto",
        maxWidth: "92%",
      }}
    >
      <div className="relative">
        <img
          src={group.groupPic || "/avatar/group-default.png"}
          alt={group.name}
          className="size-10 object-cover rounded-full"
        />
      </div>
    
      <div className="text-left min-w-0 flex-1">
        <div className="font-medium truncate">{group.name}</div>
        <div className="text-xs text-zinc-400">
          {group.members?.filter(
            m => onlineUsers.includes(m._id) && m._id !== user._id
          ).length} online
        </div>


      </div>
    </motion.div>
    
    ))}
  </>
)}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 pt-40">No friend found</div>
        )}
      </div>
      {/* Modal Component Mount */}
      <AddUser open={addUserOpen} onOpenChange={setAddUserOpen} />
      <AddGroup open={addGroupOpen} onOpenChange={setAddGroupOpen} />

    </aside>
  );
};

export default Sidebar;

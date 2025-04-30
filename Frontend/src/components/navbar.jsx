import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Bell,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Inbox
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // ShadCN Drawer
import { Button } from "@/components/ui/button"; // ShadCN Button
import { motion, AnimatePresence } from "framer-motion";


const Navbar = () => {
  const { logout, checkAuth, user, socket } = useAuthStore();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  const handleLogout = () => logout();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
        setShowNotifications(false);
      }
  
      // Keep the menu open if clicked inside either dropdown
      if (
        notifRef.current &&
        notifRef.current.contains(event.target)
      ) {
        return;
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await useAuthStore.getState().getFriendRequests();
        setFriendRequests(requests || []); // fallback to []
      } catch (err) {
        console.error("Failed to fetch friend requests:", err);
        setFriendRequests([]); // safe fallback on error
      }
    };
  
    if (checkAuth) {
      fetchRequests();
    }
  }, [checkAuth]);
  
  
  

  return (
    <header className="bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg sm:px-6 md:px-4 px-0">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-base-content">Ch4tify</h1>
            </Link>
          </div>

          {/* Right Icons */}
          {checkAuth && (
            <div className="flex items-center gap-4 relative">
              {/* Notification */}
              <div ref={notifRef} className="relative">
                {isMobile ? (
                  <Drawer open={showNotifications} onOpenChange={setShowNotifications}>
                    <DrawerTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-base-200 cursor-pointer">
                      <div className="relative">
                        <Bell className="size-6 text-base-content" />
                        <AnimatePresence>
                          {friendRequests.length > 0 && (
                            <motion.div
                              key="notif-badge"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary bg-destructive text-base-100 text-xs font-bold flex items-center justify-center shadow-md"
                            >
                              {friendRequests.length > 9 ? "9+" : friendRequests.length}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>


                      </button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-base-100 border-t border-base-300 p-4 pt-1 max-h-[80vh] scrollbar-none">
  <h3 className="font-bold text-lg mb-3 text-base-content">Inbox</h3>

  <div className="flex flex-col gap-3">
    {friendRequests.length === 0 ? (
      <div className="flex flex-col items-center justify-center pt-12 text-sm text-base-content/70 font-medium">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-base-200 mb-2">
          <Inbox className="w-6 h-6 text-base-content/40" />
        </div>
        No friend requests
      </div>
    ) : (
      friendRequests.map((request) => (
        <div
          key={request._id}
          className="flex items-center justify-between gap-3 bg-base-200 p-3 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <img
              src={request.profilePic || "/avatar/default.png"}
              alt={request.alias}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-medium text-base-content">{request.alias}</span>
              <span className="text-sm text-base-content/60">{request.name}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-primary/90 cursor-pointer"
              onClick={async () => {
                await useAuthStore.getState().acceptFriendRequest(request._id);
                setFriendRequests((prev) =>
                  prev.filter((r) => r._id !== request._id)
                );
              }}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              className="text-xs bg-destructive px-2 py-1 rounded-md hover:bg-destructive/90 cursor-pointer"
              onClick={async () => {
                await useAuthStore.getState().declineFriendRequest(request._id);
                setFriendRequests((prev) =>
                  prev.filter((r) => r._id !== request._id)
                );
              }}
            >
              Decline
            </Button>
          </div>
        </div>
      ))
    )}
  </div>
</DrawerContent>


                  </Drawer>
                ) : (
                  <>
                    <button
                      ref={notifRef}
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowProfileDropdown(false);
                      }}
                      className="p-2 rounded-full hover:bg-base-200 cursor-pointer"
                    >
                      <div className="relative">
                        <Bell className="size-6 text-base-content" />
                        <AnimatePresence>
                          {friendRequests.length > 0 && (
                            <motion.div
                              key="notif-badge"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive bg-primary text-base-100 text-xs font-bold flex items-center justify-center shadow-md"
                            >
                              {friendRequests.length > 9 ? "9+" : friendRequests.length}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>


                    </button>
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-100 h-80 bg-base-100 rounded-xl shadow-xl p-4 z-50"
                        >
                          <h3 className="font-bold text-lg mb-3 text-base-content">Inbox</h3>
                          <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100%-3rem)] pr-1">
  {friendRequests.length === 0 ? (
    <div className="flex flex-col items-center justify-center pt-15 text-sm text-base-content/70 font-medium">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-base-200 mb-2">
        <Inbox className="w-6 h-6 text-base-content/40" />
      </div>
      No friend requests
    </div>
  ) : (
    friendRequests.map((request) => (
      <div
        key={request._id}
        className="flex items-center justify-between gap-3 bg-base-200 p-3 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <img
            src={request.profilePic || "/avatar/default.png"}
            alt={request.alias}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium text-base-content">{request.alias}</span>
            <span className="text-sm text-base-content/60">{request.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            className="text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-primary/90 cursor-pointer"
            onClick={async () => {
              await useAuthStore.getState().acceptFriendRequest(request._id);
              setFriendRequests((prev) => {
                const updated = prev.filter((r) => r._id !== request._id);
                return updated;
              });
            }}
          >
            Accept
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-xs bg-destructive  px-2 py-1 rounded-md hover:bg-destructive/90 cursor-pointer"
            onClick={async () => {
              await useAuthStore.getState().declineFriendRequest(request._id);
              setFriendRequests((prev) => {
                const updated = prev.filter((r) => r._id !== request._id);
                return updated;
              });
            }}
          >
            Decline
          </Button>
        </div>
      </div>
    ))
  )}
</div>

                        </motion.div>
                      )}
                    </AnimatePresence>

                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotifications(false);
                  }}
                  className="hover:ring-2 ring-base-300 rounded-full transition cursor-pointer"
                >
                  <img
                    src={user?.profilePic || "/avatar/default.png"}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-max bg-base-100 rounded-xl shadow-xl z-50 min-w-[12rem]"
                    >
                      <div className="p-4 flex items-center gap-3 border-b border-base-300">
                        <img
                          src={user?.profilePic || "/avatar/default.png"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-base-content">{user?.name || "User"}</p>
                          <p className="text-sm text-base-content/70">{user?.email}</p>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col gap-2">
                        <Link
                          to="/profile"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition text-sm font-medium text-base-content"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition text-sm font-medium text-base-content"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <Button
                          onClick={handleLogout}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:scale-102 transition-all text-sm font-medium text-base-content"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

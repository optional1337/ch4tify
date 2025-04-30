import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Camera, Mail, User, DoorClosed, Lock, ShieldCheck, LockKeyhole } from "lucide-react";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, isUpdatingProfile, updateProfile, verifyPassword, updatePassword } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [tabValue, setTabValue] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyPassword = async () => {
    try {
      await verifyPassword(currentPassword);
      setIsVerified(true);
      toast.success("Password verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect current password");
    }
  };
  
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill both password fields.");
    }
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(newPassword)) {
      return toast.error("Password must be at least 6 characters with uppercase, lowercase, and a number.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
  
    try {
      await updatePassword(newPassword, confirmPassword);
      toast.success("Password updated successfully!");
      // Optional: Clear input fields after success
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setIsVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setShowOptions(false);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen min-w-screen pt-20 z-10 flex flex-col bg-base-100/50">
      <Navbar />
      <div className="flex-1 overflow-y-auto scrollbar-none">
      <div className="max-w-xl mx-auto px-4 py-6 ">
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          {/* 🔘 Custom styled TabsList */}
          <TabsList className="flex w-full bg-base-200 p-1 rounded-lg mb-6">
            {["profile", "security"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={`w-full text-sm font-medium rounded-md transition-colors px-3 py-2 cursor-pointer
                  ${
                    tabValue === tab
                      ? "bg-base-100 text-primary font-semibold shadow-sm"
                      : "bg-base-200 text-muted-foreground"
                  }`}
              >
                {tab === "profile" ? "Profile" : "Security"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 🧑 Profile Tab Content */}
          <TabsContent value="profile">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-base-300 rounded-xl p-6 space-y-6"
  >
    {/* Header */}
    <div className="text-center space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
      <p className="text-sm text-muted-foreground">Manage your account info</p>
    </div>

    <div className="flex justify-center relative">
      <div className="relative group">
        <img
          src={selectedImg || user.profilePic || "/avatar/default.png"}
          alt="Profile"
          className="size-28 rounded-full object-cover border-4 border-base-100 shadow-md"
        />
        <Popover open={showOptions} onOpenChange={setShowOptions}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`absolute bottom-1 right-1 z-20 bg-base-content hover:scale-105 p-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-4 h-4 text-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align={window.innerWidth < 640 ? "center" : "start"}
            side={window.innerWidth < 640 ? "bottom" : "right"}
            className="w-44"
          >
            <div className="flex flex-col gap-2 text-base-200">
              <Button
                className="w-full text-xs cursor-pointer"
                onClick={() => {
                  const def_url = "/avatar/default.png";
                  setSelectedImg(def_url);
                  updateProfile({ profilePic: def_url });
                  setShowOptions(false);
                }}
              >
                Remove Profile
              </Button>
              <Button
                className="w-full text-xs cursor-pointer"
                onClick={() => {
                  setShowStore(true);
                  setShowOptions(false);
                }}
              >
                Choose from Store
              </Button>
              <Button
                className="w-full text-xs cursor-pointer"
                onClick={() => {
                  document.getElementById("avatar-upload").click();
                  setShowOptions(false);
                }}
              >
                Choose from Device
              </Button>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <p className="text-sm text-muted-foreground text-center">
      {isUpdatingProfile
        ? "Uploading..."
        : "Tap the camera icon to update your picture"}
    </p>

    {/* Basic Info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
          <User className="w-4 h-4" />
          Full Name
        </label>
        <div className="bg-base-200 px-4 py-2 rounded-lg text-primary text-sm shadow-inner">
          {user?.name}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4" />
          Email
        </label>
        <div className="bg-base-200 px-4 py-2 rounded-lg text-primary text-sm shadow-inner">
          {user?.email}
        </div>
      </div>
    </div>

    {/* Account Info Section */}
    <div className="bg-base-100 rounded-xl p-4 shadow-md">
      <h2 className="text-base font-semibold mb-3 text-zinc-100">Account Details</h2>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span>Last Login</span>
          <span className="text-right text-zinc-300">
            {user.lastLogin &&
              new Date(user.lastLogin).toLocaleString("en-CA", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .replace(" a.m.", " AM")
              .replace(" p.m.", " PM")}
          </span>
        </div>
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span>Member Since</span>
          <span className="text-right text-zinc-300">
            {user.createdAt &&
              new Date(user.createdAt).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Account Status</span>
          <Badge className="rounded-full bg-green-600/10 border border-green-600 text-green-500">
            Active
          </Badge>
        </div>
      </div>
    </div>
        {/* Delete Account Button */}
        <div className="pt-4 border-t border-zinc-700 text-center">
      <Button
        variant="outline"
        className="w-full sm:w-auto hover:scale-105 transition-transform"
        onClick={() => {
          // Confirm dialog or deletion logic here
          if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            // deleteAccount(); // your deletion logic
            console.log("Account deleted");
          }
        }}
      >
        Delete Account
      </Button>
    </div>

  </motion.div>
</TabsContent>


          {/* 🔐 Security Tab Content */}
          {/* 🔐 Security Tab Content */}
<TabsContent value="security">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-base-300 rounded-xl p-6 space-y-6"
  >
    <div className="text-center space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Security Settings</h1>
      <p className="text-sm text-muted-foreground">Manage your login credentials</p>
    </div>

    {/* Step 1: Verify Current Password */}
    <div className="bg-base-100 rounded-xl p-4 shadow-inner space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <Lock className="w-4 h-4" />
        Current Password
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isVerified && currentPassword) handleVerifyPassword();
        }}
        className="flex flex-col sm:flex-row gap-2 sm:items-center"
      >
        <div className="relative flex-1">
          <Input
            type="password"
            id="currentPassword"
            placeholder="Enter current password"
            className="pl-10"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isVerified}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <Button
          type="submit"
          className="sm:w-auto hover:scale-105 transition-transform"
          disabled={isVerified || !currentPassword}
          variant={isVerified ? "secondary" : "default"}
        >
          {isVerified ? "Verified" : "Verify"}
        </Button>
      </form>
    </div>

    {/* Step 2: Set New Password */}
    <div className="bg-base-100 rounded-xl p-4 shadow-inner space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="password"
            id="newPassword"
            placeholder="New password"
            className="pl-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!isVerified}
          />
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>

        <div className="relative">
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            className="pl-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!isVerified}
          />
          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>

        <Button
          className="w-full mt-2 hover:scale-105 transition-transform"
          disabled={!isVerified}
          onClick={handleUpdatePassword}
        >
          Update Password
        </Button>
      </div>
    </div>
  </motion.div>
</TabsContent>



        </Tabs>
      </div>

      {/* 🖼 Avatar Store Drawer */}
      <Drawer open={showStore} onOpenChange={setShowStore}>
        <DrawerContent className="bg-base-300">
          <DrawerHeader className="text-center space-y-2">
            <DrawerTitle className="text-lg">Select an Avatar</DrawerTitle>
            <DrawerDescription className="text-zinc-400">
              Pick one avatar from the store below
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex justify-center max-h-[80vh] overflow-y-auto scrollbar-none">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-8 px-8 py-6">
              {[
                "/avatar/hacker.png",
                "/avatar/ai.png",
                "/avatar/monster.png",
                "/avatar/rabbit.png",
                "/avatar/pirate.png",
                "/avatar/astronaut.png",
                "/avatar/beaver.png",
                "/avatar/gorilla.png",
                "/avatar/ninja.png",
                "/avatar/dinosaur.png",
                "/avatar/dog.png",
                "/avatar/girl.png",
                "/avatar/real man.png",
                "/avatar/robot.png",
                "/avatar/tiger.png",
                "/avatar/unicorn.png",
                "/avatar/woman.png",
                "/avatar/penguin.png",
                "/avatar/panda.png",
                "/avatar/cool.png",
                "/avatar/eagle.png",
                "/avatar/man.png",
              ].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Avatar ${index + 1}`}
                  className="w-16 h-16 sm:w-28 sm:h-28 object-cover rounded-full cursor-pointer border-2 border-transparent hover:border-primary transition"
                  onClick={() => {
                    setSelectedImg(img);
                    updateProfile({ profilePic: img });
                    setShowStore(false);
                  }}
                />
              ))}
            </div>
          </div>

          <DrawerFooter className="absolute top-2 right-4 sm:top-1 sm:right-1">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer border border-primary hover:bg-zinc-200 dark:hover:bg-primary/50"
              >
                <span className="sr-only">Close</span>
                <DoorClosed className="h-15 w-15" />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
    </div>
  );
};

export default ProfilePage;

import { useRef, useState, useEffect } from "react";
import { chatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage, selectedUser } = chatStore();
  const { user, socket, currentUser  } = useAuthStore();
  const typingTimeout = useRef(null);
  const isMobile = useIsMobile();
  const inputRef = useRef(null);


  const handleTyping = () => {
    if (!selectedUser || !socket || !currentUser) return;
  
    const isGroup = selectedUser.isGroupChat;
    const payload = {
      chatId: selectedUser._id,           // group._id or receiver's _id
      senderId: currentUser._id,
      isGroup: isGroup,
      ...(isGroup && { members: selectedUser.members }),
    };
  
    socket.emit("typing", payload);
  
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", payload);
    }, 1000);
  };
  
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest("#emoji-toggle-btn") // don't close if emoji button was clicked
      ) {
        setShowEmojiPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    // setShowEmojiPicker(false); // Close picker when emoji is selected
   // Wait for emoji picker to unmount and focus the input
  setTimeout(() => {
    inputRef.current?.focus();
  }, 1000); // Slight delay avoids interruption from other side-effects
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false); // Close emoji picker when sending message
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full relative">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          {/* Emoji Picker Button */}
          <button 
            id="emoji-toggle-btn"
            type="button" 
            className="text-zinc-400 hover:text-zinc-600"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={22} className="cursor-pointer"/>
          </button>

          {/* Emoji Picker Dropdown */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                ref={emojiPickerRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-12 left-0 z-10"
              >
                <div className={`${isMobile ? "scale-[0.75]" : "scale-100"} origin-bottom-left`}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          <input
            ref={inputRef}
            type="text"
            className="w-full px-4 py-2 rounded-full border border-base-200 bg-base-200 
                      focus:ring-2 focus:ring-base-100 focus:outline-none shadow-md 
                      placeholder:text-zinc-400 transition-all duration-200"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {setText(e.target.value); handleTyping()}}
            onKeyDown={(e) => e.key === "Enter" && setShowEmojiPicker(false)} // Close on Enter
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send Message Button */}
        <button
          type="submit"
          className="btn btn-sm btn-square bg-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

import { chatStore } from "../store/chatStore";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skelatons/Message-Skeleton";
import { useAuthStore } from "../store/authStore";
import { formatMessageTime } from "../lib/util.js";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion animation variants
const dropIn = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, type: "spring", damping: 20, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const formatDateHeader = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) return "Today";
  if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday";
  return messageDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendReaction,
    isTyping,
  } = chatStore();

  const { user } = useAuthStore();
  const messageEndRef = useRef(null);
  const [selectedReactions, setSelectedReactions] = useState(null);
  

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser); // ✅ Pass full object for group or user
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#reaction-popup")) {
        setSelectedReactions(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isGroupChat = selectedUser?.isGroupChat;
  const groupMembers = selectedUser?.members || [];

  const getSenderInfo = (senderId) =>
    isGroupChat
      ? groupMembers.find((m) => m._id === senderId)
      : senderId === user._id
      ? user
      : selectedUser;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  let lastDate = null;

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const messageDateHeader = formatDateHeader(message.createdAt);
          const showDateHeader = messageDateHeader !== lastDate;
          lastDate = messageDateHeader;

          const senderInfo =
            message.senderId === user._id ? user : getSenderInfo(message.senderId);

          return (
            <div key={message._id}>
              {showDateHeader && (
                <div className="text-center my-2">
                  <div className="inline-block px-3 py-1 text-xs rounded-md bg-base-300">
                    {messageDateHeader}
                  </div>
                </div>
              )}

              <div className={`chat ${message.senderId === user._id ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={senderInfo?.profilePic || "/avatar/default.png"}
                      alt="profile pic"
                    />
                  </div>
                </div>

                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="chat-bubble break-words whitespace-pre-wrap min-w-[100px] max-w-[200px] sm:max-w-md lg:max-w-lg p-3 relative w-full sm:w-fit">
                      
                      {/* ✅ Group Chat Alias (inside bubble) */}
                      {/* {isGroupChat && message.senderId !== user._id && (
                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                          {senderInfo?.alias || senderInfo?.name || "Unknown"}
                        </div>
                      )} */}

                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                        />
                      )}

                      <div className="flex items-end space-x-2">
                        {message.text && (
                          <p className="text-xs sm:text-sm md:text-base">
                            {message.text}
                          </p>
                        )}
                        <span className="text-[10px] opacity-60 self-end whitespace-nowrap mt-1">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>

                      {message.reactions?.length > 0 && (
                        <div
                          className="absolute -bottom-5 left-2 flex space-x-1 bg-base-200 border border-base-100 px-2 py-1 rounded-2xl shadow-sm cursor-pointer"
                          onClick={() =>
                            setSelectedReactions(
                              message.reactions.map((r) => ({
                                ...r,
                                messageId: message._id,
                              }))
                            )
                          }
                        >
                          {message.reactions.map((reaction, idx) => (
                            <span key={idx} className="text-xs lg:text-sm">
                              {reaction.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </ContextMenuTrigger>

                  <ContextMenuContent className="bg-base-200 p-2 rounded-lg shadow-md flex space-x-1">
                    {REACTION_EMOJIS.map((emoji) => (
                      <ContextMenuItem
                        key={emoji}
                        className="text-base cursor-pointer hover:scale-105 transition p-1"
                        onClick={async () => {
                          const existingReaction = message.reactions?.find(
                            (r) => r.userId === user._id && r.emoji === emoji
                          );

                          if (existingReaction) {
                            message.reactions = message.reactions.filter(
                              (r) => !(r.userId === user._id && r.emoji === emoji)
                            );
                          } else {
                            message.reactions = [
                              ...(message.reactions || []),
                              { userId: user._id, emoji },
                            ];
                          }

                          await sendReaction(message._id, emoji);
                          setSelectedReactions(null);
                        }}
                      >
                        {emoji}
                      </ContextMenuItem>
                    ))}
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef} />
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            key="typing-indicator"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="text-sm italic text-muted-foreground ml-4 mb-2 z-10"
          >
            {isGroupChat
              ? `someone is typing...`
              : `${selectedUser?.alias || selectedUser?.name} is typing...`}

          </motion.div>
        )}
      </AnimatePresence>

      <MessageInput />

      {/* Reaction Popup Dialog */}
      <Dialog open={!!selectedReactions} onOpenChange={() => setSelectedReactions(null)}>
        <DialogContent
          id="reaction-popup"
          className="bg-base-200 border border-base-100 p-0 w-[340px] rounded-xl shadow-2xl"
        >
          <motion.div
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 space-y-4"
          >
            <h3 className="text-base font-semibold text-center">Message Reactions</h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {selectedReactions?.map((reaction, idx) => {
                const reactionUser =
                  reaction.userId === user._id
                    ? user
                    : groupMembers.find((m) => m._id === reaction.userId) || selectedUser;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-base-300 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={reactionUser?.profilePic || "/avatar/default.png"}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span className="text-sm font-medium">
                        {reactionUser?.name || "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{reaction.emoji}</span>
                      {reaction.userId === user._id && (
                        <button
                          onClick={async () => {
                            setSelectedReactions((prev) =>
                              prev.filter(
                                (r) =>
                                  !(
                                    r.userId === user._id &&
                                    r.emoji === reaction.emoji &&
                                    r.messageId === reaction.messageId
                                  )
                              )
                            );

                            const msgIndex = messages.findIndex(
                              (m) => m._id === reaction.messageId
                            );
                            if (msgIndex !== -1) {
                              messages[msgIndex].reactions = messages[
                                msgIndex
                              ].reactions.filter(
                                (r) =>
                                  !(r.userId === user._id && r.emoji === reaction.emoji)
                              );
                            }

                            await sendReaction(reaction.messageId, reaction.emoji);
                          }}
                          className="text-xs text-red-500 hover:text-red-400 transition cursor-pointer"
                          title="Remove your reaction"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatContainer;

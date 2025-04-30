import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // For group chats
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // or ChatRoom depending on your model name
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String },
      },
    ],
  },
  { timestamps: true }
);
// messageSchema.pre("save", function (next) {
//   if (!this.receiverId && !this.chatId) {
//     return next(new Error("Either receiverId or chatId must be provided."));
//   }
//   next();
// });
const Message = mongoose.model("Message", messageSchema);

export default Message;

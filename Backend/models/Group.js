import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  adminIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupPic: {
    type: String,
    default: "", // optional group avatar
  },
  isGroupChat: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);
export default Group;

import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    secretKey: {
      type: String,
      required: true,
      unique: true,
      default: process.env.ADMIN_SECRET_KEY,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;

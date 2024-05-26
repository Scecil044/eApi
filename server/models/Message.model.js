import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Types.ObjectId, ref: "Chat" },
    senderId: { type: mongoose.Types.ObjectId, ref: "User" },
    text: { type: String },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
export default Message;

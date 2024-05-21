import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Types.ObjectId, ref: "Chat" },
    text: { type: String },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: boolean, default: false },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
export default Message;

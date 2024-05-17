import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Types.ObjectId, ref: "Chat" },
    text: { type: String },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
export default Message;

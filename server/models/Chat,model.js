import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    messageId: { type: mongoose.Types.ObjectId, ref: "Message" },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;

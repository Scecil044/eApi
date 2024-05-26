import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    messageId: { type: mongoose.Types.ObjectId, ref: "Message" },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    isGroupChat: { type: Boolean, default: false },
    groupName: { type: String },
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ChatSchema.pre("save", function (next) {
  if (this.isModified("members")) {
    if (this.members.length > 1) {
      this.isGroupChat = true;
    } else {
      this.isGroupChat = false;
    }
  }
  next();
});

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;

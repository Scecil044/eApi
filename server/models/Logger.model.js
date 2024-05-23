import mongoose from "mongoose";
// import { paginate } from "./plugins/paginatePlugin.js";

const LoggerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    message: { type: String },
    isDeleted: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now() },
    dateDeleted: { type: Date },
    deletedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// LoggerSchema.plugin(paginate);
const Logger = mongoose.model("Logger", LoggerSchema);
export default Logger;

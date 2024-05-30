import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    isBlackListed: { type: Boolean, default: false },
    expiry: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", TokenSchema);
export default Token;

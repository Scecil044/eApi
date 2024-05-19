import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      enum: ["admin", "superAdmin", "trader", "user"],
    },
    roleId: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Role = mongoose.model("Role", RoleSchema);
export default Role;

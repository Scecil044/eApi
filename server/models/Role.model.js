import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      enum: ["admin", "user", "trader", "superAdmin"],
    },
    roleId: { type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Role = mongoose.model("Role", RoleSchema);
export default Role;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Types.ObjectId, ref: "Business" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBlackListed: { type: Boolean, default: false },
    metaData: { type: Object },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isDirectModified("password")) {
    next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password);
    this.password = hashedPassword;
  } catch (error) {
    throw new Error("could not hash password", error);
  }
});

UserSchema.methods.comparePasswords = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error(error, "could not compare passwords");
  }
};
const User = mongoose.model("User", UserSchema);
export default User;

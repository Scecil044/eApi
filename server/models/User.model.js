import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MetaDataSchema = new mongoose.Schema({
  gender: { type: String },
});

const UserSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Types.ObjectId, ref: "Business" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String },
    gender: { type: String, required: true, enum: ["male", "female"] },
    password: { type: String, required: true },
    role: { type: mongoose.Types.ObjectId, required: true, ref: "Role" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBlackListed: { type: Boolean, default: false },
    metaData: { type: MetaDataSchema },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
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

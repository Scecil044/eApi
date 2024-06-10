import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";
import { findRoleByRoleId } from "../services/role.service";
import Role from "./Role.model.js";

const MetaDataSchema = new mongoose.Schema({
  gender: { type: String },
});

const UserSchema = new mongoose.Schema(
  {
    businessId: [{ type: mongoose.Types.ObjectId, ref: "Business" }],
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

UserSchema.methods.checkRole = async function () {
  try {
    this.admin = false;
    this.superAdmin = false;
    this.trader = false;
    this.systemUser = false;
    // const role = await findRoleByRoleId(this.role);
    const role = await Role.find({ _id: this.role });
    const roleName = role[0].roleName;
    if (toLower(roleName) === "admin") {
      this.admin = true;
    } else if (toLower(roleName) === "superAdmin") {
      this.superAdmin = true;
    } else if (toLower(roleName) === "trader") {
      this.trader = true;
    } else if (tolower(roleName) === "user") {
      this.systemUser = true;
    }
    return this;
  } catch (error) {
    throw new Error(error);
  }
};

UserSchema.plugin(mongoosePaginate);
// UserSchema.plugin(paginate);
const User = mongoose.model("User", UserSchema);
export default User;

import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  businessNumber: { type: String },
  businessEmail: { type: String },
  street: { type: String },
});

const BusinessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    businessName: {
      type: String,
      required: true,
    },
    yearFounded: {
      type: Date,
    },
    businessLogo: {
      type: String,
      default: "",
    },
    metaData: {
      type: AddressSchema,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    category: { type: String, enum: ["electronics", "cosmetics"] },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Business = mongoose.model("Business", BusinessSchema);
export default Business;

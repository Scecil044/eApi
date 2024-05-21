import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Types.ObjectId, ref: "Business" },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    category: { type: String },
    status: {
      type: String,
      enum: ["soldOut", "available"],
    },
    images: { type: Array },
    reviews: { type: Array },
    isDeleted: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ProductSchema.methods.checkIfSoldOut = async function () {
  const count = this.amount;
  if (count < 1) {
    this.status = "soldOut";
    await this.save();
  }
};
const Product = mongoose.model("Product", ProductSchema);
export default Product;

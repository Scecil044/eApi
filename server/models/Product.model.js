import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Types.ObjectId, ref: "Business" },
    ratingId: { type: mongoose.Types.ObjectId, ref: "Rating" },
    commentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
    title: { type: String, required: true },
    longDescription: { type: String, required: true },
    shortDescription: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    category: {
      type: String,
      enum: ["electronics", "cosmetics", "computer & gaming"],
    },
    status: {
      type: String,
      enum: ["soldOut", "available"],
      default: "available",
    },
    images: { type: Array },
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

ProductSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", ProductSchema);
export default Product;

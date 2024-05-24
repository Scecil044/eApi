import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    category: { type: String, enum: ["product", "business"] },
    rating: { type: Number },
    comments: { type: Array },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RatingSchema);
export default Rating;

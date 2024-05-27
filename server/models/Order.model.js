import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    orderedQuantity: { type: Number },
    status: { type: String, enum: ["pending", "processed", "delivered"] },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;

import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;

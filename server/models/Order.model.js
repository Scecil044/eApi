import mongoose from "mongoose";

const OrderItemsSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: "Product" },
  orderedQuantity: { type: Number },
});

const AddressSchema = new mongoose.Schema({
  address: { type: String },
  street: { type: String },
  town: { type: String },
  landMark: { type: String },
  building: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    orderNumber: { type: String, unique: true },
    items: [OrderItemsSchema],
    address: AddressSchema,
    orderedQuantity: { type: Number },
    status: {
      type: String,
      enum: ["pending", "processed", "delivered", "fulfilled", "cancelled"],
    },
    grandTotal: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;

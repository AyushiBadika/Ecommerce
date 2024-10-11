import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true }, // Total price of items before discount
  discount: { type: Number, default: 0 }, // Discount applied from coupon
  finalAmount: { type: Number, required: true }, // Total after applying coupon
  couponCode: { type: String }, // Applied coupon code
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);

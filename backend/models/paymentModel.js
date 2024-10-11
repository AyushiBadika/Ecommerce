import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    receipt: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    paymentMethod: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    paidAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

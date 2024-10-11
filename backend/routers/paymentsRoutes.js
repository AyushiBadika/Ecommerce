import express from "express";
import Razorpay from "razorpay";
import Payment from "./models/Payment.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize Razorpay instance with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new payment order
router.post("/create-order", async (req, res) => {
  const { amount, currency, userId } = req.body;

  try {
    // Options for the payment order
    const options = {
      amount: amount * 100, // Amount in smallest currency unit (paisa)
      currency: currency || "INR",
      receipt: `receipt_${Math.random() * 100000}`,
      payment_capture: 1, // Auto capture payment after authorization
    };

    // Create an order in Razorpay
    const order = await razorpay.orders.create(options);

    // Save payment order details in the database
    const payment = new Payment({
      orderId: order.id,
      userId,
      amount,
      currency: currency || "INR",
      receipt: order.receipt,
      status: "created",
    });
    await payment.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment and update the status
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  try {
    // Generate the expected signature using the order_id and payment_id
    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Update payment record in the database as 'paid'
      const payment = await Payment.findOneAndUpdate({ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id, status: "paid", paidAt: Date.now() }, { new: true });

      if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }

      res.status(200).json({ success: true, message: "Payment verified successfully", payment });
    } else {
      // If the signatures don't match, the payment verification failed
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Refund a payment
router.post("/refund", async (req, res) => {
  const { paymentId } = req.body;

  try {
    // Create a refund in Razorpay
    const refund = await razorpay.payments.refund(paymentId);

    // Update payment record in the database as 'failed' and add refund details
    const payment = await Payment.findOneAndUpdate({ paymentId }, { status: "failed", failedAt: Date.now() }, { new: true });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({ success: true, refund, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

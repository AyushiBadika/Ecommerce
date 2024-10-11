import express from "express";
import { Coupon } from "../models/coupon.js";
import { Order } from "../models/order.js";

const router = express.Router();

// Apply a coupon to an order
router.post("/apply-coupon", async (req, res) => {
  try {
    const { orderId, couponCode } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if the coupon is active and not expired
    const currentDate = new Date();
    if (!coupon.isActive || coupon.expiryDate < currentDate) {
      return res.status(400).json({ message: "Coupon is invalid or expired" });
    }

    // Check if the order meets the minimum purchase requirement
    if (order.totalAmount < coupon.minimumPurchase) {
      return res.status(400).json({ message: `Minimum purchase of $${coupon.minimumPurchase} required to use this coupon` });
    }

    // Calculate the discount (assuming it's a percentage discount)
    const discountAmount = (order.totalAmount * coupon.discount) / 100;
    const finalAmount = order.totalAmount - discountAmount;

    // Update the order with the applied coupon and final amount
    order.discount = discountAmount;
    order.finalAmount = finalAmount;
    order.couponCode = coupon.code;

    // Save the updated order
    const updatedOrder = await order.save();

    // Return the updated order
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

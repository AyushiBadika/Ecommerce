import express from "express";
import { Order } from "./models/Order.js";

const router = express.Router();

// Create a new order
router.post("/orders", async (req, res) => {
  try {
    const { userId, items, totalAmount, address, paymentMethod } = req.body;

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      address,
      paymentMethod,
    });

    // Save the order
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (Admin access)
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by user ID (User access)
router.get("/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an order status (e.g., mark as shipped/delivered)
router.put("/orders/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status and timestamp
    order.status = status;
    order.updatedAt = Date.now();

    // Save updated order
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order (Admin access)
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

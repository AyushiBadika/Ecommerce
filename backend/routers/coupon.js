import express from "express";
import { Coupon } from "../models/coupon.js";

const router = express.Router();

// Create a new coupon
router.post("/coupons", async (req, res) => {
  try {
    const { code, discount, expiryDate, minimumPurchase, isActive } = req.body;
    const newCoupon = new Coupon({ code, discount, expiryDate, minimumPurchase, isActive });
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all coupons
router.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a coupon by ID
router.get("/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a coupon by ID
router.put("/coupons/:id", async (req, res) => {
  try {
    const { code, discount, expiryDate, minimumPurchase, isActive } = req.body;
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, { code, discount, expiryDate, minimumPurchase, isActive }, { new: true });
    if (!updatedCoupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(updatedCoupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a coupon by ID
router.delete("/coupons/:id", async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

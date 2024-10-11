import express from "express";
import { Brand } from "../models/brand.js";

const router = express.Router();

// Create a new brand
router.post("/brands", async (req, res) => {
  try {
    const { name, description, country, logoUrl } = req.body;
    const newBrand = new Brand({ name, description, country, logoUrl });
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all brands
router.get("/brands", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a brand by ID
router.get("/brands/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a brand by ID
router.put("/brands/:id", async (req, res) => {
  try {
    const { name, description, country, logoUrl } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, { name, description, country, logoUrl }, { new: true });
    if (!updatedBrand) return res.status(404).json({ message: "Brand not found" });
    res.json(updatedBrand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a brand by ID
router.delete("/brands/:id", async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

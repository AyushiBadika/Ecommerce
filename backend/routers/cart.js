import express from "express";
import { Cart } from "./models/Cart.js";

const router = express.Router();

// Create or update cart (Add item to cart)
router.post("/cart", async (req, res) => {
  try {
    const { userId, productId, quantity, price } = req.body;

    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if the product is already in the cart
      const productIndex = cart.items.findIndex((item) => item.productId == productId);

      if (productIndex > -1) {
        // If the product exists, update its quantity
        cart.items[productIndex].quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.items.push({ productId, quantity, price });
      }
    } else {
      // If no cart exists for the user, create a new one
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price }],
        totalAmount: price * quantity,
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Save the cart
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get cart by user ID
router.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item quantity in the cart
router.put("/cart/:userId/item/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.items.findIndex((item) => item.productId == req.params.productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity
    cart.items[productIndex].quantity = quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Save the updated cart
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
router.delete("/cart/:userId/item/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.items.findIndex((item) => item.productId == req.params.productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.items.splice(productIndex, 1);

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Save the updated cart
    const updatedCart = await cart.save();
    res.json({ message: "Product removed from cart", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear entire cart
router.delete("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

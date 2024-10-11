import express from "express";
import upload from "../middleware/upload.js";
import { addToWishlist, createProduct, deleteProduct, getSingleProduct, rating } from "../controllers/product.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/create-product", upload.single("url"), createProduct);
router.get("/:id", getSingleProduct);
router.delete("/:id", deleteProduct);
router.post("/addToWishlist/:productID", authMiddleware, addToWishlist);
router.post("/rating", authMiddleware, rating);

export default router;

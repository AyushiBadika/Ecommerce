import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

// routes
import userRoutes from "./routers/user.js";
import authRoutes from "./routers/auth.js";
import resetPassword from "./routers/password.js";
import productRoutes from "./routers/product.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import brandRoutes from "./routers/brand.js";
import couponRoutes from "./routers/coupon.js";
import applyCoupon from "./routers/applyCoupon.js";
import cartRoutes from "./routers/cart.js";
import paymentRoutes from "./routers/paymentsRoutes.js";

const app = express();
const port = process.env.PORT || 5001;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRoutes);
app.use(authRoutes);
app.use(resetPassword);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(brandRoutes);
app.use(couponRoutes);
app.use(applyCoupon);
app.use(cartRoutes);
app.use(paymentRoutes);

try {
  await mongoose.connect(process.env.CONNECTION_STRING);
} catch (error) {
  console.log(error);
}

app.use((err, req, res, next) => {
  return res.status(500).json({ error: "Something went wrong" });
});

app.listen(port, () => {
  console.log("Server started at", port);
});

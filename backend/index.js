import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routers/user.js";
import authRoutes from "./routers/auth.js";
import cookieParser from "cookie-parser";
import resetPassword from "./routers/password.js";

const app = express();
const port = process.env.PORT || 5001;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRoutes);
app.use(authRoutes);
app.use(resetPassword);

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

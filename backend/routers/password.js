import express from "express";
import { resetPassword, verifyOtp } from "../controllers/password.js";

const router = express.Router();

router.post("/user/reset", resetPassword);
router.post("/user/verify-otp", verifyOtp);

export default router;

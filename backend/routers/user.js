import express from "express";
import { deleteUser, getUser, registerUser, updateUser } from "../controllers/user.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.get("/user/get", userAuth, getUser);
router.put("/user/update", userAuth, updateUser);
router.delete("/user/delete", userAuth, deleteUser);

export default router;

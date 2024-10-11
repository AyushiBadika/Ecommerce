import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import "dotenv/config";

async function authMiddleware(req, res, next) {
  try {
    // const { tempToken } = req.cookies || req.body;
    const { tempToken } = req.body;

    if (!tempToken) return res.status(200).json({ error: "Token not found" });

    const decoded_token = jwt.verify(tempToken, process.env.SECRET);

    const loggedInUser = await userModel.findById(decoded_token.userID);

    if (!loggedInUser) res.status(200).json({ error: "User not found" });

    req.user = loggedInUser;
    next();
  } catch (err) {
    console.log(err);
  }
}

export default authMiddleware;

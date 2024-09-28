import jwt from "jsonwebtoken";
import { findUser } from "../models/userModel.js";

export default async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;

    const { userId } = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);

    const user = await findUser({ userId });

    if (!user || user.isDeleted) {
      return res.status(404).json({ error: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthenticated request!" });
  }
}

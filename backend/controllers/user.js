import { findUser, update } from "../models/userModel.js";
import * as user from "../services/user.js";
import { isEmailValid, ispasswordValid } from "../utils/typeValidators.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(404).json({ error: "All fields are required!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email!" });
    }

    if (!ispasswordValid(password)) {
      return res.status(400).json({ error: "Password must be longer than 6 characters and include uppercase, lowercase letters, numbers, and a special character!" });
    }

    const response = await user.register({ name, email, password, role });

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong! We're working on it" });
  }
}

export async function getUser(req, res) {
  try {
    const user = req.user;
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong! We're working on it" });
  }
}

export async function updateUser(req, res) {
  try {
    const user = req.user;

    const { name, email } = req.body;

    const response = await update({ query: { userId: user.userId }, update: { $set: { name, email, password: user.password, role: user.role } }, options: { upsert: true }, method: "put" });

    if (response.ok) return res.status(200).json({ data: "User updated successfully!" });
    return res.status(500).json({ error: "Something went wrong! We're working on it" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong! We're working on it" });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = req.user;

    const response = await update({ query: { userId: user.userId }, update: { $set: { isDeleted: true } }, options: { upsert: true }, method: "delete" });

    if (response.ok) return res.status(200).json({ data: "User deleted successfully!" });

    return res.status(500).json({ error: "Something went wrong! We're working on it" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong! We're working on it" });
  }
}

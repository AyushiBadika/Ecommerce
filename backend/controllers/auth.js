import { isEmailValid, ispasswordValid } from "../utils/typeValidators.js";
import * as auth from "../services/auth.js";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json("All fields are required!");
    }
    if (!isEmailValid(email)) {
      return res.status(400).json("Email is not valid!");
    }
    if (!ispasswordValid(password)) {
      return res.status(400).json("Password is not valid!");
    }

    const response = await auth.login({ email, password });

    if (response.ok) {
      res.cookie("token", response.data?.token, {
        expires: new Date(Date.now() + 86400000),
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });

      return res.status(200).json({ data: response.data });
    }
    return res.status(404).json("Invalid credentials");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ data: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

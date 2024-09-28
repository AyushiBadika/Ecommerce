import jwt from "jsonwebtoken";
import { findUser } from "../models/userModel.js";
import bcrypt from "bcrypt";

export async function login({ email, password }) {
  try {
    const user = await findUser({ email });

    if (!user) {
      return { ok: false, status: 401, data: "Invalid email or password!" };
    }
    let token = "";
    if (await bcrypt.compare(password, user.password)) {
      token = jwt.sign({ userId: user.userId }, process.env.AUTH_TOKEN_SECRET, { expiresIn: "1d" });
      return { ok: true, status: 200, data: { user, token } };
    } else {
      return { ok: false, status: 401, data: "Invalid credentials!" };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

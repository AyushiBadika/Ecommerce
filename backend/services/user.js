import { v4 } from "uuid";
import { createUser, findUser } from "../models/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config";

export async function register({ name, email, password, role }) {
  try {
    const existingUser = await findUser({ email });

    if (existingUser) {
      return { ok: true, status: 200, data: "Email already taken!" };
    }

    const userId = v4();
    bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async function (err, hash) {
      await createUser({ userId, name, email, password: hash, role });
    });

    return { ok: true, status: 200, data: { data: "User registered successfully! Login to continue" } };
  } catch (error) {
    throw error;
  }
}

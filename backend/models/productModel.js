import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("users", userSchema);

export const createUser = async ({ userId, name, email, password, role }) => {
  const user = await userModel.create({ userId, name, email, password, role });
  return user;
};
export const findUser = async ({ email }) => {
  const user = await userModel.findOne({ email });
  return user;
};

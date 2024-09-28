import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("users", userSchema);

export const createUser = async ({ userId, name, email, password, role }) => {
  const user = await userModel.create({ userId, name, email, password, role });
  return user;
};
export const findUser = async ({ email, userId }) => {
  const user = await userModel.findOne({ $or: [{ email }, { userId }] });
  return user;
};

export const update = async ({ query, update, options }) => {
  const response = await userModel.updateOne(query, update, options);

  if (response.modifiedCount > 0) return { ok: true };
};

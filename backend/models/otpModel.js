import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const otpModel = mongoose.model("otp", otpSchema);

export const saveOtp = async ({ userId, otp }) => {
  const respone = await otpModel.create({ userId, otp, expiryTime: new Date(new Date().getTime() + 10 * 60 * 1000) });
  return respone;
};

export const findOtp = async ({ userId }) => {
  const respone = await otpModel.findOne({ userId });
  return respone;
};

export const updateOtp = async ({ query, update, options }) => {
  const response = await otpModel.updateOne(query, update, options);

  if (response.modifiedCount > 0) return { ok: true };
};

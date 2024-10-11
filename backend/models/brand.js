import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  country: { type: String },
  logoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Brand = mongoose.model("Brand", brandSchema);

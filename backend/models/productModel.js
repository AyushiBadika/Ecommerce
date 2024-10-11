import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Home", "Beauty", "Books", "Sports", "Other"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model("product", productSchema);

export const createProduct = async ({}) => {
  const user = await productModel.create({ title, description, price, category, stock, image, brand });
  return user;
};
export const findProduct = async ({ id }) => {
  const user = await productModel.findOne({ id });
  return user;
};

export const update = async ({ query, update, options }) => {
  const response = await productModel.updateOne(query, update, options);

  if (response.modifiedCount > 0) return { ok: true };
};

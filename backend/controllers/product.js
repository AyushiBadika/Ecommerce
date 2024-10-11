import mongoose from "mongoose";
import { productModel } from "../models/productModel.js";
import { userModel } from "../models/userModel.js";
import { uploadToCloudinary } from "../services/cloudinaryUpload.js";

export async function createProduct(req, res) {
  try {
    let url = await uploadToCloudinary(req);

    let { name, brand, category, price, description, inStock, inventory } = req.body;

    const product = new productModel({
      name,
      url,
      brand,
      category,
      price,
      description,
      inStock,
      inventory,
      addedBy: req.user._id,
    });
    await product.save();
    res.status(201).json({ message: "product added" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//FETCH ALL PRODCUCT
export async function getAllProducts(req, res) {
  let query = {};
  let sortArg = {};

  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.sortBy && req.query.sort) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sort.toLowerCase() === "asc" ? 1 : -1;

    sortArg[sortField] = sortOrder;
  }

  if (req.query.price) {
    const priceOperators = {
      "=": "$eq",
      "<": "$lt",
      ">": "$gt",
      "<=": "$lte",
      ">=": "$gte",
    };

    Object.keys(priceOperators).forEach((operator) => {
      if (req.query.price.startsWith(operator)) {
        query.price = {
          [priceOperators[operator]]: req.query.price.slice(operator.length),
        };
      }
    });
  }

  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: "i" }; //i: case insensitivity
  }

  const allProducts = await productModel.find(query).sort(sortArg);
  res.json(allProducts);
}

export async function deleteProduct(req, res) {
  try {
    const idToDelete = req.params.id;
    const productDeleted = await productModel.findByIdAndDelete(idToDelete);
    if (productDeleted) res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//FETCH A SINGLE PRODCUCT

export async function getSingleProduct(req, res) {
  const idToFind = req.params.id;
  const singleProduct = await productModel.findOne({ _id: idToFind });
  res.json(singleProduct);
}

export async function addToWishlist(req, res) {
  let { productID } = req.params;
  const userID = req.user._id;
  let updatedUser;

  productID = new mongoose.Schema.ObjectId(productID);

  //CHECK WHETHER PRODUCT IS ALREADY ADDED
  const user = req.user;

  const existingProduct = user.wishlist.find((ids) => ids.equals(productID));

  if (!existingProduct) {
    //push productID into wishlist
    updatedUser = await userModel.findByIdAndUpdate(userID, { $push: { wishlist: productID } }, { new: true });
  } else {
    //remove productID from wishlist
    updatedUser = await userModel.findByIdAndUpdate(
      userID,
      {
        $pull: { wishlist: productID },
      },
      { new: true }
    );
  }
  res.json(updatedUser);
}

export async function rating(req, res) {
  let { starRating, comment, productID } = req.body;
  const userID = req.user._id;

  // productID = new mongoose.Types.ObjectId(productID);

  try {
    //FIND THE PRODUCT BY ID
    const product = await productModel.findById(productID);

    //CHECK IF THE USER HAS ALREADY RATED THE PRODUCT
    const alreadyRated = product.ratings.find((ratingObj) => ratingObj.postedBy.toString() === userID.toString());

    let updatedProduct;

    if (alreadyRated) {
      //IF ALREADY RATED:
      // UPDATE THE RATING

      updatedProduct = await productModel.findOneAndUpdate(
        {
          _id: productID,
          "ratings.postedBy": userID,
        },
        {
          $set: {
            "ratings.$.comment": comment,
            "ratings.$.star": starRating,
          },
        },
        { new: true }
      );
    } else {
      //IF IT'S A NEW RATING:
      // ADD A NEW RATING

      updatedProduct = await productModel.findByIdAndUpdate(
        productID,
        {
          $push: {
            ratings: {
              star: starRating,
              comment: comment,
              postedBy: userID,
            },
          },
        },
        { new: true }
      );
    }

    // RECALCULATE TOTAL RATING

    // GET TOTAL NUMBER OF RATINGS
    const totalRating = updatedProduct.ratings.length;

    // GET THE SUM OF ALL STARS
    const ratingSum = updatedProduct.ratings.reduce((accumulator, current) => {
      return accumulator + current.star;
    }, 0);

    // GET THE AVERAGE
    const actualRating = ratingSum / totalRating;

    console.log(totalRating, ratingSum, actualRating);

    // UPDATE PRODUCT WITH NEW TOTAL RATING
    const finalProduct = await productModel.findByIdAndUpdate(productID, { totalRating: actualRating.toFixed(2) }, { new: true });

    res.json(finalProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

// Routes
import userRoutes from "./routers/user.js";
import authRoutes from "./routers/auth.js";
import resetPassword from "./routers/password.js";
import productRoutes from "./routers/product.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import brandRoutes from "./routers/brand.js";
import couponRoutes from "./routers/coupon.js";
import applyCoupon from "./routers/applyCoupon.js";
import cartRoutes from "./routers/cart.js";
import paymentRoutes from "./routers/paymentsRoutes.js";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use routes
app.use(userRoutes);
app.use(authRoutes);
app.use(resetPassword);
app.use("/product", productRoutes);
app.use(categoryRoutes);
app.use(brandRoutes);
app.use(couponRoutes);
app.use(applyCoupon);
app.use(cartRoutes);
app.use(paymentRoutes);

// Connect to MongoDB
try {
  await mongoose.connect(process.env.CONNECTION_STRING);
} catch (error) {
  console.log(error);
}

// Global error handler
app.use((err, req, res, next) => {
  return res.status(500).json({ error: "Something went wrong" });
});

// API Documentation Route
app.get("/", (req, res) =>
  res.send(
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
        }
        header {
            background: #2C3E50;
            color: #fff;
            padding: 20px 0;
            text-align: center;
            margin-bottom: 20px;
        }
        header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 400;
        }
        .container {
            width: 90%;
            margin: auto;
            padding-bottom: 50px;
        }
        h2, h3 {
            color: #34495E;
            margin-top: 20px;
        }
        p {
            margin: 10px 0;
            color: #555;
        }
        code {
            font-family: 'Courier New', monospace;
            font-size: 1.1em;
            background: #ecf0f1;
            padding: 10px;
            display: inline-block;
            border-radius: 5px;
        }
        pre {
            background-color: #f8f9f9;
            padding: 15px;
            border-left: 4px solid #2C3E50;
            overflow-x: auto;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            height: 100%;
            background: #34495E;
            color: #fff;
            padding-top: 50px;
        }
        nav ul {
            list-style: none;
            padding-left: 20px;
        }
        nav ul li {
            margin-bottom: 15px;
        }
        nav ul li a {
            color: #ecf0f1;
            text-decoration: none;
            font-size: 1.2em;
        }
        nav ul li a:hover {
            color: #1abc9c;
        }
        .content {
            margin-left: 260px;
        }
        footer {
            text-align: center;
            padding: 20px;
            background-color: #2C3E50;
            color: #fff;
            position: fixed;
            width: 100%;
            bottom: 0;
        }
        @media (max-width: 800px) {
            nav {
                position: relative;
                width: 100%;
                height: auto;
            }
            .content {
                margin-left: 0;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>E-Commerce API Documentation</h1>
    </header>
    <nav>
        <ul>
            <li><a href="#user">User Routes</a></li>
            <li><a href="#auth">Authentication Routes</a></li>
            <li><a href="#product">Product Routes</a></li>
            <li><a href="#category">Category Routes</a></li>
            <li><a href="#brand">Brand Routes</a></li>
            <li><a href="#coupon">Coupon Routes</a></li>
            <li><a href="#cart">Cart Routes</a></li>
            <li><a href="#order">Order Routes</a></li>
            <li><a href="#payment">Payment Routes</a></li>
        </ul>
    </nav>
    <div class="content container">
        <h2 id="user">User Routes</h2>
        <p>Routes related to user management, such as registration and user information.</p>
        <h3>POST /user/register</h3>
        <p>Register a new user.</p>
        <pre><code>{
  "username": "exampleUser",
  "password": "examplePass"
}</code></pre>

        <h3>POST /user/login</h3>
        <p>Log in a user.</p>
        <pre><code>{
  "username": "exampleUser",
  "password": "examplePass"
}</code></pre>

        <h3>GET /user/get</h3>
        <p>Get current user details (Authentication required).</p>

        <h3>PUT /user/update</h3>
        <p>Update user details (Authentication required).</p>

        <h3>DELETE /user/delete</h3>
        <p>Delete user (Authentication required).</p>

        <h2 id="auth">Authentication Routes</h2>
        <p>Routes for user authentication, such as login and logout.</p>

        <h2 id="product">Product Routes</h2>
        <p>Routes for managing products, including listing, adding, and removing products.</p>
        <h3>GET /products</h3>
        <p>Retrieve a list of products with optional filters.</p>

        <h3>GET /products/:id</h3>
        <p>Fetch product details by product ID.</p>

        <h2 id="category">Category Routes</h2>
        <p>Routes for managing product categories.</p>
        <h3>GET /api/categories</h3>
        <p>Retrieve a list of categories.</p>

        <h2 id="brand">Brand Routes</h2>
        <p>Routes for managing product brands.</p>
        <h3>GET /api/brands</h3>
        <p>Retrieve a list of brands.</p>

        <h2 id="coupon">Coupon Routes</h2>
        <p>Routes for managing coupons.</p>
        <h3>POST /api/coupons</h3>
        <p>Add a new coupon.</p>

        <h2 id="cart">Cart Routes</h2>
        <p>Routes for managing user shopping carts.</p>
        <h3>POST /cart/add</h3>
        <p>Add an item to the cart.</p>

        <h3>GET /cart/:userId</h3>
        <p>Fetch the cart for a specific user.</p>

        <h3>PUT /cart/update/:cartItemId</h3>
        <p>Update the quantity of a cart item.</p>

        <h3>DELETE /cart/remove/:cartItemId</h3>
        <p>Remove an item from the cart.</p>

        <h2 id="order">Order Routes</h2>
        <p>Routes for order management.</p>
        <h3>POST /orders</h3>
        <p>Create a new order.</p>

        <h3>GET /orders/user/:userId</h3>
        <p>Fetch all orders for a specific user.</p>

        <h3>PUT /orders/:orderId</h3>
        <p>Update the status of an order.</p>

        <h3>DELETE /orders/:orderId</h3>
        <p>Cancel an order.</p>

        <h2 id="payment">Payment Routes</h2>
        <p>Routes for handling payments.</p>
        <h3>POST /create-order</h3>
        <p>Create a new payment order using Razorpay.</p>

        <h3>POST /verify-payment</h3>
        <p>Verify payment after successful transaction.</p>

    </div>
    <footer>
        <p>&copy; 2024 E-Commerce API</p>
    </footer>
</body>
</html>
`
  )
);

// Start the server
app.listen(port, () => {
  console.log("Server started at", port);
});

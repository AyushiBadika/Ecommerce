# E-Commerce API

A fully featured e-commerce backend API with user authentication, product management, cart handling, and Razorpay payment integration.

## Features

- **User Authentication**
  - Login
  - Sign Up
  - Update Profile
- **Product Management**
  - Product Listing
  - Product Search
  - Product Filtering
  - Best Selling Products
  - Sale Products
- **Shopping Features**
  - Add to Cart
  - Remove from Cart
  - Update Cart Quantity
  - Place Orders
- **Order Management**
  - Order Creation
  - Order Tracking
- **Payment Integration**
  - Razorpay Payment Gateway Integration

## Technologies Used

- **Node.js** (Backend)
- **Express.js** (Web framework for Node.js)
- **MongoDB** (Database)
- **Razorpay** (Payment integration)
- **JWT** (Authentication)

## API Endpoints

### **User Authentication**

- **POST /user/register**  
  Register a new user.

- **POST /user/login**  
  Log in a user.

- **GET /user/get**  
  Get current user details (Authentication required).

- **PUT /user/update**  
  Update user details (Authentication required).

- **DELETE /user/delete**  
  Delete user (Authentication required).

### **Product Management**

- **GET /products**  
  Fetch all products with optional filters.

- **GET /products/:id**  
  Fetch product details by product ID.

### **Cart Management**

- **POST /cart/add**  
  Add an item to the cart.

- **GET /cart/:userId**  
  Fetch the cart for a specific user.

- **PUT /cart/update/:cartItemId**  
  Update the quantity of a cart item.

- **DELETE /cart/remove/:cartItemId**  
  Remove an item from the cart.

### **Order Management**

- **POST /orders**  
  Create a new order.

- **GET /orders/user/:userId**  
  Fetch all orders for a specific user.

- **PUT /orders/:orderId**  
  Update the status of an order.

- **DELETE /orders/:orderId**  
  Cancel an order.

### **Payment Integration**

- **POST /create-order**  
  Create a new payment order using Razorpay.

- **POST /verify-payment**  
  Verify payment after successful transaction.

## Getting Started

### Installation

1. Clone the repository:  
   `git clone https://github.com/AyushiBadika/Ecommerce`

2. Navigate to the project directory:  
   `cd backend`

3. Install dependencies:  
   `npm install`

4. Start the development server:  
   `npm run dev`

## Razorpay Payment Integration

This project integrates the Razorpay API to handle payments.

- Users can make payments while placing orders.
- Payment status is verified using Razorpay's API.

## MongoDB Integration

- MongoDB is used to store user details, products, orders, and cart information.

## License

MIT License

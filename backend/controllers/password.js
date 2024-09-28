import { findOtp, saveOtp, updateOtp } from "../models/otpModel.js";
import { findUser } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import "dotenv/config";

export async function resetPassword(req, res) {
  const { email } = req.body;

  const user = await findUser({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }
  req.userId = user.userId;

  await sendOtpEmail({ userId: user.userId, userEmail: user.email });

  const otpToken = await jwt.sign({ userId: user.userId }, process.env.AUTH_TOKEN_SECRET, { expiresIn: "1d" });

  res.status(200).json({ data: { message: "Otp sent successfully!" }, otpToken });
}

export async function verifyOtp(req, res) {
  const { otpToken, otp } = req.body;

  const { userId } = await jwt.verify(otpToken, process.env.AUTH_TOKEN_SECRET);

  const response = await findOtp({ userId });

  if (response.expiryTime < new Date() && Number(response.otp) === Number(otp)) return res.json("ok");

  return res.json("not ok");
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

function getMailBody({ otp }) {
  return `<!DOCTYPE html>
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Your OTP Code</title>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f4f4f4;
                              margin: 0;
                              padding: 0;
                          }
                          .container {
                              max-width: 600px;
                              margin: 0 auto;
                              background-color: #ffffff;
                              padding: 20px;
                              border-radius: 10px;
                              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                          }
                          .header {
                              text-align: center;
                              background-color: #4CAF50;
                              color: #ffffff;
                              padding: 20px;
                              border-radius: 10px 10px 0 0;
                          }
                          .header h1 {
                              margin: 0;
                              font-size: 24px;
                          }
                          .content {
                              padding: 20px;
                              text-align: center;
                          }
                          .otp {
                              font-size: 24px;
                              color: #4CAF50;
                              font-weight: bold;
                              margin: 20px 0;
                          }
                          .message {
                              font-size: 16px;
                              color: #333333;
                              margin-bottom: 20px;
                          }
                          .footer {
                              text-align: center;
                              font-size: 12px;
                              color: #888888;
                              margin-top: 20px;
                              padding-top: 10px;
                              border-top: 1px solid #dddddd;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <div class="header">
                              <h1>OTP Verification</h1>
                          </div>
                          <div class="content">
                              <p class="message">Hello,</p>
                              <p class="message">To verify your email, please use the following One-Time Password (OTP).</p>
                              <div class="otp">${otp}</div>
                              <p class="message">This code is valid for the next 10 minutes. Please do not share this code with anyone.</p>
                          </div>
                          <div class="footer">
                              <p>Thank you 😊</p>
                              <p>&copy; 2024, Inc. All rights reserved.</p>
                          </div>
                      </div>
                  </body>
                  </html>
  `;
}

export async function sendOtpEmail({ userId, userEmail }) {
  const otp = generateOtp();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAIL_USER,
      pass: process.env.NODE_MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "ayratechs@gmail.com",
    to: userEmail,
    subject: "Verify Email",
    html: getMailBody({ otp }),
  };

  const response = findOtp({ userId });

  if (response) {
    updateOtp({ query: { userId }, update: { $set: { otp } }, options: { upsert: false } });
  } else {
    saveOtp({ userId, otp });
  }

  await transporter.sendMail(mailOptions);
}

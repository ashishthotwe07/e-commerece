// config/nodemailer.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  // host: "smtp.gmail.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export default transporter;

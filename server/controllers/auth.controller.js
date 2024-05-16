import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateOTP } from "../config/mail.js";
import Verification from "../models/verification.model.js";
import transporter from "../config/nodemailer.js";
import { isValidObjectId } from "mongoose";
class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({ username, email, password: hashedPassword });
      const OTP = generateOTP();
      const verificationToken = new Verification({
        owner: newUser._id,
        token: OTP,
      });

      await verificationToken.save();
      await newUser.save();

      transporter.sendMail({
        from: "emailverfication@gmail.com",
        to: newUser.email,
        subject: "Verify Your Email Account",
        html: `<h1>${OTP}</h1>`,
      });
      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set token in cookie
      res.cookie("token", token, { httpOnly: true });
      const { password: _, ...user } = newUser.toJSON();

      res
        .status(201)
        .json({ message: "User registered successfully", token, user });
    } catch (error) {
      console.error("Error registering user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set token in cookie
      res.cookie("token", token, { httpOnly: true });
      const { password: _, ...userData } = user.toJSON();

      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Error logging in user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async signout(req, res) {
    try {
      // Clear the token cookie
      res.clearCookie("token");

      res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
      console.error("Error signing out user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async verify(req, res) {
    const { userId, otp } = req.body;
    console.log(otp);
    console.log(userId);
    if (!userId || !otp) {
      return res
        .status(400)
        .json({ message: "Invalid Request , Missing Parameters" });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid User id" });
    }

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User is not present with this user id" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is Already Verified" });
    }

    const verificationToken = await Verification.findOne({ owner: user._id });
    console.log(verificationToken);

    if (!verificationToken) {
      return res.status(400).json({ message: "Verification token not found" });
    }

    const isMatched = bcrypt.compareSync(otp, verificationToken.token);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.verified = true;

    await Verification.findByIdAndDelete(verificationToken._id);
    await user.save();

    const { password: _, ...userData } = user.toJSON();
    res.status(200).json({ message: "Email Verified", user: userData });
  }

  async resendVerificationEmail(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "Missing user ID" });
      }

      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.verified) {
        return res.status(400).json({ message: "User is already verified" });
      }

      // Delete the previous verification token
      await Verification.deleteOne({ owner: user._id });

      // Generate a new OTP
      const OTP = generateOTP();

      // Save the new OTP in the database
      const verificationToken = new Verification({
        owner: user._id,
        token: OTP,
      });
      await verificationToken.save();

      // Send the verification email with the new OTP
      transporter.sendMail({
        from: "emailverification@gmail.com",
        to: user.email,
        subject: "OTP Resend request",
        html: `<h1>${OTP}</h1>`,
      });

      res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Error resending verification email:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new AuthController();

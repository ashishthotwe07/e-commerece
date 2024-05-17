import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateOTP } from "../config/mail.js";
import crypto from "crypto";
import Verification from "../models/verification.model.js";
import transporter from "../config/nodemailer.js";
import { isValidObjectId } from "mongoose";
import ResetPassword from "../models/resetPass.model.js";
import { generateRandomToken } from "../utils/helper.js";
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
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
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

      console.log(email);
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.log("here");
        return res.status(400).json({ message: "Invalid email or password" });
      }

      console.log(password, user.password);
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("ha here");
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

    // Check if the user ID and OTP are provided
    if (!userId || !otp) {
      return res
        .status(400)
        .json({ message: "Invalid request. Missing user ID or OTP." });
    }

    // Validate the user ID format
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ message: "The provided user ID is invalid." });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    console.log(user);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with the provided ID." });
    }

    // Check if the user is already verified
    if (user.verified) {
      return res
        .status(400)
        .json({ message: "This user is already verified." });
    }

    // Find the verification token
    const verificationToken = await Verification.findOne({ owner: user._id });
    console.log(verificationToken);

    // Check if the verification token exists
    if (!verificationToken) {
      return res.status(404).json({ message: "Verification token not found." });
    }

    // Check if the provided OTP matches the token
    const isMatched = bcrypt.compareSync(otp, verificationToken.token);
    if (!isMatched) {
      return res.status(400).json({ message: "The provided OTP is invalid." });
    }

    // Mark the user as verified
    user.verified = true;

    // Delete the verification token from the database
    await Verification.findByIdAndDelete(verificationToken._id);

    // Save the updated user to the database
    await user.save();

    // Exclude the password from the user data to be returned
    const { password: _, ...userData } = user.toJSON();

    res
      .status(200)
      .json({
        message: "Your email has been verified successfully.",
        user: userData,
      });
  }

  async resendVerificationEmail(req, res) {
    try {
      const { userId } = req.body;

      // Check if the user ID is provided
      if (!userId) {
        return res
          .status(400)
          .json({
            message: "User ID is missing. Please provide a valid user ID.",
          });
      }

      // Validate the user ID format
      if (!isValidObjectId(userId)) {
        return res
          .status(400)
          .json({ message: "The provided user ID is invalid." });
      }

      // Find the user by ID
      const user = await User.findById(userId);

      // Check if the user exists
      if (!user) {
        return res
          .status(404)
          .json({ message: "No user found with the provided ID." });
      }

      // Check if the user is already verified
      if (user.verified) {
        return res
          .status(400)
          .json({ message: "This user is already verified." });
      }

      // Delete any existing verification token for the user
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
      await transporter.sendMail({
        from: "emailverification@example.com",
        to: user.email,
        subject: "OTP Resend Request",
        html: `<p>Your verification OTP is: <strong>${OTP}</strong></p>`,
      });

      res
        .status(200)
        .json({
          message: "A new verification email has been sent successfully.",
        });
    } catch (error) {
      console.error("Error resending verification email:", error);
      res
        .status(500)
        .json({
          message: "An internal server error occurred. Please try again later.",
        });
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      // Check if the user with the provided email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found with the provided email address." });
      }

      // Check if a reset token already exists and is still valid (assuming an expiration mechanism)
      const resettoken = await ResetPassword.findOne({ owner: user._id });
      if (resettoken) {
        return res
          .status(400)
          .json({
            message:
              "A reset password link has already been sent. Please check your email or try again after one hour.",
          });
      }

      const newToken = await generateRandomToken();
      // Create a new reset password token
      const resetPasswordToken = new ResetPassword({
        owner: user._id,
        token: newToken,
      });

      // Save the reset password token to the database
      await resetPasswordToken.save();

      // Send reset password email with the token
      await transporter.sendMail({
        from: "security@example.com",
        to: user.email,
        subject: "Reset Your Password",
        html: `<p>Please click <a href="http://localhost:5175/reset-password?token=${newToken}&id=${user._id}">here</a> to reset your password.</p>`,
      });

      res
        .status(200)
        .json({
          message:
            "A link to reset your password has been sent to your email address.",
        });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res
        .status(500)
        .json({
          message:
            "An error occurred while processing your request. Please try again later.",
        });
    }
  }

  async resetPassword(req, res) {
    const { password } = req.body;
    const { token, id } = req.query;

    try {
      // Check if the provided user ID is valid
      if (!isValidObjectId(id)) {
        return res
          .status(400)
          .json({ message: "The provided user ID is invalid." });
      }

      // Check if the provided token is valid
      const resetPasswordToken = await ResetPassword.findOne({ owner: id });
      if (!resetPasswordToken) {
        return res
          .status(404)
          .json({
            message: "The reset password token is invalid or has expired.",
          });
      }

      const isTokenValid = bcrypt.compareSync(token, resetPasswordToken.token);
      if (!isTokenValid) {
        return res
          .status(400)
          .json({
            message: "The reset password token is invalid or has expired.",
          });
      }

      // Verify the token owner matches the provided user ID
      if (resetPasswordToken.owner.toString() !== id) {
        return res
          .status(400)
          .json({
            message: "The provided user ID does not match the token owner.",
          });
      }

      // Find the user associated with the provided user ID
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ message: "No user found with the provided ID." });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password with the hashed password
      user.password = hashedPassword;

      // Save the updated user to the database
      await user.save();

      // Delete the reset password token from the database
      await ResetPassword.findOneAndDelete({ owner: id });

      res
        .status(200)
        .json({ message: "Your password has been reset successfully." });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res
        .status(500)
        .json({
          message: "An internal server error occurred. Please try again later.",
        });
    }
  }
}

export default new AuthController();

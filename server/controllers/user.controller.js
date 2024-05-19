import cloudinary from 'cloudinary';
import User from "../models/user.model.js";
import { isValidObjectId } from "mongoose";

class UserController {
  async updateUser(req, res) {
    try {
      const userId = req.user._id;
      const image = req.file;
      const { username, email } = req.body;

      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if username is already taken by another user
      if (username && username !== user.username) {
        const existingUserWithUsername = await User.findOne({ username });
        if (existingUserWithUsername) {
          return res.status(400).json({ message: "Username already taken" });
        }
        user.username = username;
      }

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail) {
          return res.status(400).json({ message: "Email already taken" });
        }
        user.email = email;
      }

      // Handle image upload if an image is present
      if (image) {
        const b64 = Buffer.from(image.buffer).toString("base64");
        const dataURI = "data:" + image.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "ProfileImages",
        });

        // Update user's avatar field
        user.avatar = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      await user.save();

      const { password: _, ...updatedUser } = user.toJSON();

      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new UserController();

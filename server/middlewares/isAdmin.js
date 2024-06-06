import jwt from "jsonwebtoken";
import User from "./path/to/user/model"; // Adjust the path to your User model

const isAdmin = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next(); // User is admin, proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default isAdmin;

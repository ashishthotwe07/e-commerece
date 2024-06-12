import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const authMiddleware = async (req, res, next) => {
  try {

    let token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

   
    // If token is not found in headers, check cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("here", decodedToken);
    // Fetch user from database based on token payload
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Pass user information in req object
    req.user = user;

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;

import express from "express";
import reviewController from "../controllers/productreview.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Create a new review
router.post("/", authMiddleware, reviewController.createReview);

// Get all reviews
router.get("/", reviewController.getAllReviews);

// Get reviews by product
router.get("/:productId", reviewController.getReviewsByProduct);

// Get a review by its ID
router.get("/:reviewId", reviewController.getReviewById);

// Update a review
router.put("/:reviewId", authMiddleware, reviewController.updateReview);

// Delete a review
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);

export default router;

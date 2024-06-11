import Review from "../models/productreivew.model.js";
import Product from "../models/product.model.js";

class ReviewController {
  async createReview(req, res) {
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user._id;

      if (!productId || !rating) {
        return res
          .status(400)
          .json({ error: "Product ID and rating are required fields" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingReview = await Review.findOne({
        product: productId,
        user: userId,
      });
      if (existingReview) {
        return res
          .status(400)
          .json({ error: "You have already reviewed this product" });
      }
      console.log(existingReview);

      const review = await Review.create({
        product: productId,
        user: userId,
        rating,
        comment,
      });

      await product.save();

      res.status(201).json({ message: "Review created successfully", review });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getReviewsByProduct(req, res) {
    try {
      const { productId } = req.params;

      const reviews = await Review.find({ product: productId }).populate(
        "user",
        "username"
      );

      if (!reviews) {
        return res
          .status(404)
          .json({ error: "No reviews found for this product" });
      }

      res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getReviewById(req, res) {
    try {
      const { reviewId } = req.params;

      const review = await Review.findById(reviewId).populate("user", "name");

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.status(200).json({ review });
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user._id; // Assuming user ID is available in the request

      const review = await Review.findOne({ _id: reviewId, user: userId });

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      if (rating) review.rating = rating;
      if (comment) review.comment = comment;

      await review.save();

      res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const userId = req.user._id;

      const review = await Review.findOneAndDelete({
        _id: reviewId,
        user: userId,
      });

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllReviews(req, res) {
    try {
      const reviews = await Review.find()
        .populate("user", "username")
        .populate("product", "name");

      res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getReviewsByProduct(req, res) {
    try {
      const { productId } = req.params;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const reviews = await Review.find({ product: productId }).populate(
        "user",
        "username"
      );

      res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ReviewController();

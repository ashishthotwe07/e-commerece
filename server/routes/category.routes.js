import express from "express";
import categoryController from "../controllers/category.controller.js";

const router = express.Router();

// Create a new category
router.post("/create", categoryController.createCategory);

// Get all categories
router.get("/get", categoryController.getAllCategories);

// Get category by ID
router.get("/get/:categoryId", categoryController.getCategoryById);

// Update category by ID
router.put("/update/:categoryId", categoryController.updateCategory);

// Delete category by ID
router.delete("/delete/:categoryId", categoryController.deleteCategory);
router.delete("/delete", categoryController.deleteAllCategories);

export default router;

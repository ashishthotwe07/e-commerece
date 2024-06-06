import express from "express";
import subcategoryController from "../controllers/subcategory.controller.js";

const router = express.Router();

// Create a new subcategory
router.post("/create", subcategoryController.createSubcategory);

// Get all subcategories
router.get("/get", subcategoryController.getAllSubcategories);

// Get subcategory by ID
router.get("/get/:subcategoryId", subcategoryController.getSubcategoryById);

// Get subcategory by ID
router.get(
  "/get-by-category/:categoryName",
  subcategoryController.getSubcategoriesByCategory
);

// Update subcategory by ID
router.put("/update/:subcategoryId", subcategoryController.updateSubcategory);

// Delete subcategory by ID
router.delete(
  "/delete/:subcategoryId",
  subcategoryController.deleteSubcategory
);
router.delete("/delete", subcategoryController.deleteAllSubcategories);

export default router;

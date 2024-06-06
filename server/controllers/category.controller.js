// controllers/category.controller.js
import Category from "../models/category.model.js";

import slugify from "slugify";

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name, imageUrl } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const slug = slugify(name, { lower: true });

      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }

      const category = await Category.create({ name, slug, imageUrl });

      res
        .status(201)
        .json({ message: "Category created successfully", category });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategoryById(req, res) {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ category });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { name, imageUrl } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const slug = slugify(name, { lower: true });

      const oldCategory = await Category.findById(categoryId);
      if (!oldCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      const oldName = oldCategory.name;

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name, slug, imageUrl: imageUrl || oldCategory.imageUrl },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteAllCategories(req, res) {
    try {
      await Category.deleteMany({});
      res.json({ message: "All categories deleted successfully" });
    } catch (error) {
      console.error("Error deleting all categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({
        message: "Category deleted successfully",
        category: deletedCategory,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CategoryController();

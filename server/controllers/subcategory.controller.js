import Subcategory from "../models/subcategory.model.js";
import Category from "../models/category.model.js";
import slugify from "slugify";

class SubcategoryController {
  async createSubcategory(req, res) {
    try {
      const { name, imageUrl, categoryName } = req.body;

      if (!name || !categoryName) {
        return res
          .status(400)
          .json({ error: "Name and categoryName are required fields" });
      }

      const slug = slugify(name, { lower: true });

      const existingSubcategory = await Subcategory.findOne({ slug });
      if (existingSubcategory) {
        return res.status(400).json({ error: "Subcategory already exists" });
      }

      console.log(categoryName);
      const category = await Category.findById(categoryName);

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const subcategory = await Subcategory.create({
        name,
        slug,
        imageUrl,
        category: category._id,
      });

      res
        .status(201)
        .json({ message: "Subcategory created successfully", subcategory });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSubcategoriesByCategory(req, res) {
    try {
      const { categoryName } = req.params;

      console.log(categoryName);
      const category = await Category.findOne({ name: categoryName });

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const subcategories = await Subcategory.find({ category: category._id });

      res.status(200).json({ subcategories });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllSubcategories(req, res) {
    try {
      const subcategories = await Subcategory.find().populate("category");
      res.status(200).json({ subcategories });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getSubcategoryById(req, res) {
    try {
      const { subcategoryId } = req.params;
      console.log(subcategoryId);
      const subcategory = await Subcategory.findById(subcategoryId).populate(
        "category"
      );
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.status(200).json({ subcategory });
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateSubcategory(req, res) {
    try {
      const { subcategoryId } = req.params;
      const { name, imageUrl, categoryName } = req.body;

      if (!name || !categoryName) {
        return res
          .status(400)
          .json({ error: "Name and categoryName are required fields" });
      }

      const slug = slugify(name, { lower: true });

      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const oldSubcategory = await Subcategory.findById(subcategoryId);
      if (!oldSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      const updatedSubcategory = await Subcategory.findByIdAndUpdate(
        subcategoryId,
        { name, slug, imageUrl, category: category._id },
        { new: true }
      );

      if (!updatedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory: updatedSubcategory,
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteAllSubcategories(req, res) {
    try {
      await Subcategory.deleteMany({});
      res.json({ message: "All subcategories deleted successfully" });
    } catch (error) {
      console.error("Error deleting all subcategories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteSubcategory(req, res) {
    try {
      const { subcategoryId } = req.params;
      const deletedSubcategory = await Subcategory.findByIdAndDelete(
        subcategoryId
      );
      if (!deletedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.status(200).json({
        message: "Subcategory deleted successfully",
        subcategory: deletedSubcategory,
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new SubcategoryController();

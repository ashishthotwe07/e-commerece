import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";

export default function UpdateSubcategoryForm({
  isOpen,
  onClose,
  subcategoryId,
}) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/subcategory/get/${subcategoryId}`
        );

        setName(response.data.subcategory.name);
        setImageUrl(response.data.subcategory.imageUrl || ""); // Default to empty string if no imageUrl
        setSelectedCategory(response.data.subcategory.category._id);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category/get"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (subcategoryId) {
      fetchSubcategory();
    }
    fetchCategories();
  }, [subcategoryId]);

  const handleUpdateSubcategory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/subcategory/update/${subcategoryId}`,
        {
          name,
          imageUrl,
          category: selectedCategory,
        }
      );
      console.log("Subcategory updated:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Update Subcategory</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Subcategory Name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleUpdateSubcategory}
            >
              Update Subcategory
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

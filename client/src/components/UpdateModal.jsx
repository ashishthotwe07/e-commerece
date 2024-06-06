import React, { useState, useEffect } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateModal({ isOpen, onClose, productId }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [color, setColor] = useState("");
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/${productId}`
        );
        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        setName(fetchedProduct.name);
        setBrand(fetchedProduct.brand);
        setPrice(fetchedProduct.price);
        setCategory(fetchedProduct.category.name);
        setSubcategory(fetchedProduct.subcategory.name);
        setDescription(fetchedProduct.description);
        setImages(fetchedProduct.images);
        setColor(fetchedProduct.color);
      } catch (error) {
        console.error("Error fetching product:", error);
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

    if (category) {
      const fetchSubcategories = async () => {
        try {
          console.log(category);
          const response = await axios.get(
            `http://localhost:5000/api/subcategory/get-by-category/${category}`
          );
          setSubcategories(response.data.subcategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };

      fetchSubcategories();
    }

    fetchProduct();
    fetchCategories();
  }, [productId, category]);

  if (!isOpen || !product) return null;

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);
    const filesWithPreviews = filesArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages([...newImages, ...filesWithPreviews]);
  };

  const handleRemoveImage = (index) => {
    const removedImageId = images[index].public_id;
    setRemovedImages([...removedImages, removedImageId]);
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("categoryName", category);
    formData.append("subcategoryName", subcategory);
    formData.append("description", description);
    formData.append("color", color);
    formData.append("existingImages", JSON.stringify(images));

    removedImages.forEach((imageId, index) => {
      formData.append(`removedImages[${index}]`, imageId);
    });

    newImages.forEach(({ file }) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.put(
        `http://localhost:5000/api/product/update-product/${productId}`,
        formData
      );

      const updatedProduct = response.data;
      toast.success(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div
        id="updateProductModal"
        tabIndex={-1}
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Product
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="updateProductModal"
                onClick={onClose}
              >
                <FiX className="w-5 h-5" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block
                    w-full p-2.5"
                    placeholder="Type product name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    name="brand"
                    id="brand"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="Product brand"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="$2999"
                    required
                  />
                </div>
                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus
                    :ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    id="subcategory"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value={subcategory}>{subcategory}</option>

                    {subcategories.map((subcat) => (
                      <option key={subcat._id} value={subcat.name}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    name="color"
                    id="color"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="Product color"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center space-x-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1.5 text-gray-600 hover:bg-gray-200 focus:outline-none"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {newImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`New Image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedNewImages = [...newImages];
                          updatedNewImages.splice(index, 1);
                          setNewImages(updatedNewImages);
                        }}
                        className="absolute top-0 right-0 bg-white rounded-full p-1.5 text-gray-600 hover:bg-gray-200 focus:outline-none"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write product description here"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

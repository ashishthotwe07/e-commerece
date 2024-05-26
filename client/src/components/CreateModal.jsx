import React, { useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import axios from "axios";

export default function CreateModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);
    setImages([...images, ...filesArray]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryName", category);
    formData.append("brand", brand);
    formData.append("color", color);
    formData.append("quantity", quantity);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/product/create-product",
        formData
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset form fields and close modal
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setBrand("");
    setColor("");
    setQuantity("");
    setImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <div
        id="createProductModal"
        tabIndex={-1}
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* Modal content */}
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
            {/* Modal header */}
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Product
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-target="createProductModal"
                data-modal-toggle="createProductModal"
                onClick={onClose}
              >
                <FiX className="w-5 h-5" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type product name"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="$2999"
                    required
                  />
                </div>
                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  >
                    <option value="">Select category</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    name="brand"
                    id="brand"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Product brand"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    name="color"
                    id="color"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Product color"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    name="quantity"
                    id="quantity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Product quantity"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Product Image ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-white rounded-full text-gray-700 hover:bg-gray-200"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write product description here"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Add new product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

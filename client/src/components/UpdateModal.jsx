import React, { useState, useEffect } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import axios from "axios";

export default function UpdateModal({ isOpen, onClose, productId }) {
  console.log(productId);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [color, setColor] = useState("");
  const [product, setProduct] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imageIndexToRemove, setImageIndexToRemove] = useState(null);

  console.log(product);
  useEffect(() => {
    // Fetch product data based on productId
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/${productId}`
        );
        const fetchedProduct = response.data.product;
        console.log(fetchProduct);
        setProduct(fetchedProduct);
        setName(fetchedProduct.name);
        setBrand(fetchedProduct.brand);
        setPrice(fetchedProduct.price);
        setCategory(fetchedProduct.category.name);
        setDescription(fetchedProduct.description);
        setImages(fetchedProduct.images);
        setColor(fetchedProduct.color);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

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

  // Function to handle removing an image
  const handleRemoveImage = (index) => {
    const removedImageId = images[index].public_id; // Get the public_id of the removed image
    setRemovedImages([...removedImages, removedImageId]); // Push it into the removedImages array
    const updatedImages = [...images];
    updatedImages.splice(index, 1); // Remove the image from the images array
    setImages(updatedImages); // Update the images state
  };
  // Function to confirm and remove an image
  const confirmRemoveImage = () => {
    setShowConfirmation(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("categoryName", category);
    formData.append("description", description);
    formData.append("color", color);
    formData.append("existingImages", JSON.stringify(images));

    // Append removedImages array directly
    removedImages.forEach((imageId, index) => {
      formData.append(`removedImages[${index}]`, imageId);
    });

    newImages.forEach((image) => {
      formData.append("images", image);
    });
    for (const value of formData.values()) {
      console.log(value);
    }
    // Display the key/value pairs
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/product/update-product/${productId}`,
        formData
      );

      const updatedProduct = response.data;
      console.log("Product updated successfully", updatedProduct);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
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
          {/* Modal content */}
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
            {/* Modal header */}
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                    {/* <option value="">{category}</option> */}
                    <option value="SmartPhones">Smarthpones</option>
                    <option value="PC">PC</option>
                  </select>
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

                <div
                  className="sm:col-span-2 flex items
-center space-x-2"
                >
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1.5 text-gray-600 hover:bg-gray-200 focus:outline-none"
                      >
                        <FiX className="w-4 h-4" />
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write product description here"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update product
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <p className="mb-4">Are you sure you want to remove this image?</p>
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-red-500 mr-4"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg"
                onClick={confirmRemoveImage}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

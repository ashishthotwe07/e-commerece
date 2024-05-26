import React, { useState, useEffect } from "react";
import { FiPlus, FiMoreVertical, FiEdit, FiTrash, FiX } from "react-icons/fi";
import axios from "axios";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";

export default function CRUD() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  console.log(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product/");
        console.log(response.data);
        setProducts(response.data.product);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleEditClick = (id) => {
    setSelectedProductId(id);
    setUpdateModalOpen(true);
    setDropdownOpen(null);
  };

  return (
    <div>
      {/* Start block */}
      <section className="bg-gray-50 p-3 sm:p-5 antialiased">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          {/* Start coding here */}
          <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  id="createProductModalButton"
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
                >
                  <FiPlus className="mr-2" />
                  Add product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-4">
                      Product name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Brand
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 &&
                    products.map((product) => (
                      <tr key={product._id} className="border-b">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {product.name}
                        </th>
                        <td className="px-4 py-3">{product.category.name}</td>
                        <td className="px-4 py-3">{product.brand}</td>
                        <td className="px-4 py-3 max-w-[12rem] truncate">
                          {product.description}
                        </td>
                        <td className="px-4 py-3">{product.price}</td>
                        <td className="px-4 py-3 flex items-center justify-end relative">
                          <button
                            id={`${product.id}-dropdown-button`}
                            onClick={() => handleDropdownToggle(product._id)}
                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100 p-1.5 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                            type="button"
                          >
                            {dropdownOpen === product._id ? (
                              <FiX className="w-5 h-5" />
                            ) : (
                              <FiMoreVertical className="w-5 h-5" />
                            )}
                          </button>
                          <div
                            id={`${product._id}-dropdown`}
                            className={`${
                              dropdownOpen === product._id ? "block" : "hidden"
                            } absolute right-12 border-2 top-2 z-10 mt-2 w-44 bg-white rounded divide-y divide-gray-100 shadow-2xl `}
                          >
                            <ul
                              className="py-1 text-sm text-gray-700"
                              aria-labelledby={`${product._id}-dropdown-button`}
                            >
                              <li>
                                <button
                                  className="flex items-center w-full py-2 px-4 hover:bg-gray-100"
                                  onClick={() => handleEditClick(product._id)}
                                >
                                  <FiEdit className="mr-2" />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button className="flex items-center w-full py-2 px-4 hover:bg-gray-100">
                                  <FiTrash className="mr-2" />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* End block */}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
      {isUpdateModalOpen && (
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          productId={selectedProductId}
        />
      )}
    </div>
  );
}

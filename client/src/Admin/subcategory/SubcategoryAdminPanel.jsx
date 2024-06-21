import React, { useState, useEffect } from "react";
import { FiPlus, FiMoreVertical, FiEdit, FiTrash, FiX } from "react-icons/fi";
import axios from "axios";
import CreateSubcategoryForm from "./CreateSubcategoryForm";
import UpdateSubcategoryForm from "./UpdateSubcategoryForm";

export default function SubcategoryAdminPanel() {
  const [isCreateSubcategoryModalOpen, setCreateSubcategoryModalOpen] =
    useState(false);
  const [isUpdateSubcategoryModalOpen, setUpdateSubcategoryModalOpen] =
    useState(false);
  const [isDeleteSubcategoryModalOpen, setDeleteSubcategoryModalOpen] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/subcategory/get"
        );
        console.log(response.data.subcategories);
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleEditClick = (id) => {
    setSelectedSubcategoryId(id);
    setUpdateSubcategoryModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteClick = (id) => {
    setSelectedSubcategoryId(id);
    setDeleteSubcategoryModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteSubcategory = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/subcategory/delete/${selectedSubcategoryId}`
      );
      setSubcategories(
        subcategories.filter(
          (subcategory) => subcategory._id !== selectedSubcategoryId
        )
      );
      setDeleteSubcategoryModalOpen(false);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 p-3  antialiased">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
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
                  id="createSubcategoryModalButton"
                  onClick={() => setCreateSubcategoryModalOpen(true)}
                  className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
                >
                  <FiPlus className="mr-2" />
                  Add Subcategory
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-4">
                      Image
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Subcategory Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.length > 0 &&
                    subcategories.map((subcategory) => (
                      <tr key={subcategory._id} className="border-b">
                        <td className="px-4 py-3">
                          <img
                            src={
                              subcategory.imageUrl ||
                              "https://placehold.it/100x100"
                            }
                            alt={subcategory.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </td>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {subcategory.name}
                        </th>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {subcategory.category.name}
                        </td>
                        <td className="px-4 py-3 flex items-center justify-end relative">
                          <button
                            id={`${subcategory._id}-dropdown-button`}
                            onClick={() =>
                              handleDropdownToggle(subcategory._id)
                            }
                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100 p-1.5 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                            type="button"
                          >
                            {dropdownOpen === subcategory._id ? (
                              <FiX className="w-5 h-5" />
                            ) : (
                              <FiMoreVertical className="w-5 h-5" />
                            )}
                          </button>
                          <div
                            id={`${subcategory._id}-dropdown`}
                            className={`${
                              dropdownOpen === subcategory._id
                                ? "block"
                                : "hidden"
                            } absolute right-12 border-2 bottom-3 z-10 mt-2 w-44 bg-white rounded divide-y divide-gray-100 shadow-2xl `}
                          >
                            <ul
                              className="py-1 text-sm text-gray-700"
                              aria-labelledby={`${subcategory._id}-dropdown-button`}
                            >
                              <li>
                                <button
                                  className="flex items-center w-full py-2 px-4 hover:bg-gray-100"
                                  onClick={() =>
                                    handleEditClick(subcategory._id)
                                  }
                                >
                                  <FiEdit className="mr-2" />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="flex items-center w-full py-2 px-4 hover:bg-gray-100"
                                  onClick={() =>
                                    handleDeleteClick(subcategory._id)
                                  }
                                >
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

      {/* Modals */}
      {isCreateSubcategoryModalOpen && (
        <CreateSubcategoryForm
          isOpen={isCreateSubcategoryModalOpen}
          onClose={() => setCreateSubcategoryModalOpen(false)}
        />
      )}
      {isUpdateSubcategoryModalOpen && (
        <UpdateSubcategoryForm
          isOpen={isUpdateSubcategoryModalOpen}
          onClose={() => setUpdateSubcategoryModalOpen(false)}
          subcategoryId={selectedSubcategoryId}
        />
      )}
      {isDeleteSubcategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this subcategory?</p>
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleDeleteSubcategory}
              >
                Delete
              </button>
              <button
                type="button"
                className="bg-gray-500 hover
          text-white font-bold py-2 px-4 rounded focus
          focus
          "
                onClick={() => setDeleteSubcategoryModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

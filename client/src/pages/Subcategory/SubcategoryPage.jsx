import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Loading from "../../utils/Loading";
import CategoryDropdown from "../../components/category/CategoryDropdown";

export default function SubcategoryPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true); // Set loading state to true when fetching starts
      try {
        const response = await axios.get(
          `http://localhost:5000/api/subcategory/get-by-category/${categoryId}`
        );
        setItems(response.data.subcategories);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false); // Set loading state to false when fetching ends
      }
    };

    fetchItems();
  }, [categoryId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <CategoryDropdown showImages={false} />
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-4xl font-bold text-center mb-2">
          Explore Best Of {categoryId}
        </h2>
        <p className="text-lg text-center mb-12">
          {items.length} items available
        </p>
        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-2xl mb-4">No items available</p>
            <p className="text-lg">
              Please check back later or explore other categories.
            </p>
            <Link
              to="/categories"
              className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            >
              Go to Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            {items.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
                onClick={() => fetchProducts(item._id)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-60 object-cover rounded-t-xl transition duration-300 ease-in-out transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-sm mt-2">{item.description}</p>
                  <Link
                    to={`/product-listing/${item.name}`}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Explore {item.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

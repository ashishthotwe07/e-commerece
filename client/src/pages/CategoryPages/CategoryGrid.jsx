import React, { useRef, useState, useEffect } from "react";
import { TbCategory } from "react-icons/tb";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CategoryGrid() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollLeft -= current.offsetWidth;
    } else {
      current.scrollLeft += current.offsetWidth;
    }
  };

  useEffect(() => {
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

    fetchCategories();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-indigo-600 flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase">
          <TbCategory className="mr-3 h-6 cursor-pointer" />
          <span className="font-semibold inline-block">Categories</span>
        </div>
        <Link to="/categories">See All</Link>
      </div>
      <div className="relative">
        <div className="absolute top-1/2 transform z-10 -translate-y-1/2 left-0">
          <FaArrowLeft
            className="h-8 w-8 bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
            onClick={() => scroll("left")}
          />
        </div>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="rounded overflow-hidden shadow-lg flex flex-col mx-2 min-w-[300px] w-80"
            >
              <div className="relative">
                <Link to={`/category/${category.name}`}>
                  <img
                    className="w-full h-48 object-cover"
                    src={category.imageUrl}
                    alt={category.name}
                  />
                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                </Link>
                <Link to={`/categories/${category._id}`}>
                  <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                    {category.name}
                  </div>
                </Link>
              </div>
              <div className="px-6 py-4 mb-auto">
                <Link
                  to={`/category/${category._id}`}
                  className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
                >
                  {category.name}
                </Link>
                <p className="text-gray-500 text-sm">
                  Explore the best {category.name} products.
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
          <FaArrowRight
            className="h-8 w-8 bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
            onClick={() => scroll("right")}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCategories,
  productSelector,
} from "../../redux/reducers/productSlice";

const CategoryDropdown = ({ showImages = true }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { categories } = useSelector(productSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const handleMouseEnter = (categoryName) => {
    setHoveredCategory(categoryName);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div
      className={`sticky top-0 z-10 overflow-x-auto ${
        !showImages ? "bg-gray-100 shadow-md" : "bg-white"
      }`}
    >
      <nav className="flex items-center justify-center space-x-4">
        <ul className="flex items-center justify-center space-x-4">
          {categories.map((category, index) => (
            <li
              key={category._id}
              className={`p-1 text-sm text-blue-gray-900 ${
                !showImages ? "shadow-lg rounded-lg bg-white" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={`/category/${category.name}`}
                className="flex flex-col items-center justify-center hover:text-blue-600"
              >
                {showImages && !scrolled && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-16 h-16 rounded-full mb-1"
                  />
                )}
                <div
                  className={`truncate w-full max-w-[100px] sm:max-w-none overflow-hidden whitespace-nowrap ${
                    index === 0 ? "relative" : ""
                  }`}
                >
                  <span
                    className={`block ${index === 0 ? "animate-marquee" : ""}`}
                    style={{
                      animationDuration: "10s",
                      animationIterationCount: "infinite",
                      animationTimingFunction: "linear",
                    }}
                  >
                    {category.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default CategoryDropdown;

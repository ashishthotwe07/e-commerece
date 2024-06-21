import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaThLarge,
  FaInbox,
  FaUsers,
  FaProductHunt,
  FaSignInAlt,
  FaSignOutAlt,
  FaShoppingCart,
  FaChevronDown,
  FaBox,
  FaCreditCard,
  FaFileInvoice,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const DrawerNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const location = useLocation();
  // Close all dropdowns when the route changes
  useEffect(() => {
    setIsCategoryDropdownOpen(false);
    setIsShopDropdownOpen(false);
    setIsAccountDropdownOpen(false);
    setIsOpen(false);
  }, [location]);

  const categories = [
    {
      name: "Clothing & Accessories",
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        "Kid's Clothing",
        "Accessories",
        "Jewelry",
        "Handbags",
        "Watches",
      ],
    },
    {
      name: "Electronics",
      subcategories: [
        "Mobiles",
        "TVs",
        "Computers",
        "Laptops",
        "Cameras",
        "Audio & Headphones",
      ],
    },
    {
      name: "Home & Furniture",
      subcategories: [
        "Furniture",
        "Home Decor",
        "Bedding",
        "Kitchen & Dining",
        "Storage & Organization",
        "Lighting",
      ],
    },
    {
      name: "Beauty & Personal Care",
      subcategories: [
        "Skincare",
        "Makeup",
        "Hair Care",
        "Fragrances",
        "Oral Care",
        "Personal Care",
      ],
    },

    {
      name: "Footwear",
      subcategories: [
        "Men's Footwear",
        "Women's Footwear",
        "Kid's Footwear",
        "Sports Shoes",
        "Casual Shoes",
        "Formal Shoes",
        "Sandals & Slippers",
      ],
    },
  ];

  const shopOptions = [
    { name: "Shop Categories", link: "/categories" },
    { name: "All Products", link: "/products" },
    { name: "Deals and Promotions", link: "/deals" },
    { name: "New Arrivals", link: "/new-arrivals" },
    { name: "Best Sellers", link: "/best-sellers" },
    { name: "Customer Reviews", link: "/reviews" },
    { name: "Gift Cards", link: "/gift-cards" },
    { name: "Wishlist", link: "/wishlist" },
    { name: "Order Tracking", link: "/order-tracking" },
    { name: "Support", link: "/support" },
    { name: "Brands", link: "/brands" },
  ];

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setIsCategoryDropdownOpen(false);
    setIsShopDropdownOpen(false);
    setIsAccountDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setIsShopDropdownOpen(false);
    setIsAccountDropdownOpen(false);
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleShopDropdown = () => {
    setIsAccountDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsShopDropdownOpen(!isShopDropdownOpen);
  };

  const toggleAccountDropdown = () => {
    setIsShopDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  return (
    <div>
      {/* Navigation for large devices (desktops) */}
      <nav className="hidden lg:flex items-center pl-20 justify-between bg-gray-100 px-8 py-4">
        {/* Menu Items */}
        <ul className="flex items-center space-x-8">
          <li>
            <Link
              to={"/"}
              className="text-gray-700 hover:text-gray-900 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li className="relative">
            <button
              className="text-gray-700 hover:text-gray-900 transition duration-300"
              onClick={toggleCategoryDropdown}
            >
              Category{" "}
              <FaChevronDown
                className={`${
                  isCategoryDropdownOpen ? "rotate-180" : ""
                } inline-block  ml-1`}
              />
            </button>
            <ul
              className={`${
                isCategoryDropdownOpen ? "" : "hidden"
              } absolute z-10 flex gap-4 p-3 mt-2 bg-white border border-blue-gray-50 rounded-md shadow-lg shadow-blue-gray-500/10 focus:outline-none`}
            >
              {categories.map((category, index) => (
                <li key={index} className="w-40">
                  <div className="font-semibold ml-3">
                    <Link to={`/category/${category.name}`}>
                      {category.name}
                    </Link>
                  </div>
                  <ul className="mt-2">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li key={subIndex} className="whitespace-nowrap">
                        <Link
                          to={`/product-listing/${subcategory}`}
                          className="block px-4  py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          {subcategory}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
          <li className="relative">
            <button
              className="text-gray-700 hover:text-gray-900 transition duration-300"
              onClick={toggleShopDropdown}
            >
              Shop{" "}
              <FaChevronDown
                className={`${
                  isShopDropdownOpen ? "rotate-180" : ""
                } inline-block  ml-1`}
              />
            </button>
            <ul
              className={`${
                isShopDropdownOpen ? "" : "hidden"
              } absolute z-10 gap-4 p-3 mt-2 bg-white border border-blue-gray-50 rounded-md shadow-lg shadow-blue-gray-500/10 focus:outline-none`}
            >
              {shopOptions.map((option, index) => (
                <li key={index} className="whitespace-nowrap">
                  <Link
                    to={option.link}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  >
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link
              to={"/"}
              className="text-gray-700 hover:text-gray-900 transition duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={"/"}
              className="text-gray-700 hover:text-gray-900 transition duration-300"
            >
              Our Store
            </Link>
          </li>
          <li className="relative">
            <button
              className="text-gray-700 hover:text-gray-900 transition duration-300"
              onClick={toggleAccountDropdown}
            >
              Account{" "}
              <FaChevronDown
                className={`${
                  isAccountDropdownOpen ? "rotate-180" : ""
                } inline-block  ml-1`}
              />
            </button>
            <ul
              className={`${
                isAccountDropdownOpen ? "" : "hidden"
              } absolute z-10  gap-4 p-3 mt-2 bg-white border border-blue-gray-50 rounded-md shadow-lg shadow-blue-gray-500/10 focus:outline-none`}
            >
              <li>
                <Link
                  to={"/"}
                  className="block px-4 py-2  text-sm whitespace-nowrap text-gray-800 hover:bg-gray-100"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to={"/"}
                  className="block px-4 py-2 text-sm whitespace-nowrap text-gray-800 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              to={"/"}
              className="text-gray-700 hover:text-gray-900 transition duration-300"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              to={"/"}
              className="text-gray-700 hover:text-gray-900 transition duration-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* Button to open drawer */}
      <div className="lg:hidden fixed top-4 left-4">
        <button
          className="text-gray-900 hover:text-gray-700 focus:outline-none"
          onClick={toggleDrawer}
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Drawer component */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white lg:hidden`}
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase"
        >
          Menu
        </h5>
        <button
          type="button"
          onClick={toggleDrawer}
          aria-controls="drawer-navigation"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center"
        >
          <FaTimes className="w-5 h-5" />
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={"/"}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                onClick={toggleCategoryDropdown}
              >
                <FaThLarge className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Category
                </span>
                <FaChevronDown className="w-3 h-3" />
              </button>
              <ul
                className={`${
                  isCategoryDropdownOpen ? "" : "hidden"
                } py-2 space-y-2 bg-white border border-blue-gray-50 rounded-md shadow-lg shadow-blue-gray-500/10`}
              >
                <div className="flex flex-wrap">
                  {categories.map((category, index) => (
                    <li key={index} className="w-40">
                      <div className="font-semibold ml-3">
                        <Link to={`/category/${category.name}`}>
                          {category.name}
                        </Link>
                      </div>
                      <ul className="mt-2">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <li key={subIndex} className="whitespace-nowrap">
                            <Link
                              to={`/product-listing/${subcategory}`}
                              className="block px-4  py-2 text-sm text-gray-800 hover:bg-gray-100"
                            >
                              {subcategory}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </div>
              </ul>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                onClick={toggleShopDropdown}
              >
                <FaShoppingCart className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Shop
                </span>
                <FaChevronDown className="w-3 h-3" />
              </button>
              <ul
                className={`${
                  isShopDropdownOpen ? "" : "hidden"
                } py-2 space-y-2`}
              >
                {shopOptions.map((option, index) => (
                  <li key={index} className="whitespace-nowrap">
                    <Link
                      to={option.link}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      {option.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                to={"/"}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaProductHunt className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 whitespace-nowrap">About</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/"}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaUsers className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 whitespace-nowrap">Our Store</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                onClick={toggleAccountDropdown}
              >
                <FaSignInAlt className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Account
                </span>
                <FaChevronDown className="w-3 h-3" />
              </button>
              <ul
                className={`${
                  isAccountDropdownOpen ? "" : "hidden"
                } py-2 space-y-2`}
              >
                <li>
                  <Link
                    to={"/"}
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/"}
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                to={"/"}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaInbox className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 whitespace-nowrap">Blogs</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/"}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaFileInvoice className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 whitespace-nowrap">Contact</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DrawerNavigation;

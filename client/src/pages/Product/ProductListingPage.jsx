import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { FiClock, FiShoppingBag, FiStar } from "react-icons/fi";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import ProductCard from "../../components/ProductCard";
import Loading from "../../utils/Loading";

const ProductListingPage = () => {
  const { subcategoryname } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Most Popular");
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
  };

  const handleDiscountChange = (event) => {
    const value = event.target.value;
    setSelectedDiscount(selectedDiscount === value ? null : value); // Set to null if the same value is selected again
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/product/`, {
          params: {
            subcategory: subcategoryname,
            minPrice,
            maxPrice,
            brands: brands.join(","),
            sort: sortOption,
            discount: selectedDiscount || undefined,
            search: searchQuery,
            colors: selectedColors.join(","), // Send selected color names
          },
        });
        // Calculate average rating for each product
        const productsWithAvgRating = response.data.products.map((product) => {
          const totalRating = product.reviews.reduce(
            (acc, curr) => acc + curr.rating,
            0
          );
          const averageRating =
            product.reviews.length > 0
              ? totalRating / product.reviews.length
              : 0;
          return {
            ...product,
            averageRating: averageRating,
          };
        });
        setProducts(productsWithAvgRating);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    subcategoryname,
    minPrice,
    maxPrice,
    brands,
    selectedDiscount,
    sortOption,
    searchQuery,
    selectedColors,
  ]);

  const sortOptions = [
    { name: "Most Popular", value: "Most Popular" },
    { name: "Best Rating", value: "Best Rating" },
    { name: "Newest", value: "Newest" },
    { name: "Price: Low to High", value: "Price: Low to High" },
    { name: "Price: High to Low", value: "Price: High to Low" },
  ];

  const availableBrands = [
    "Realme",
    "Samsung",
    "Apple",
    "Xiaomi",
    "Oppo",
    "Vivo",
  ];

  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Purple", hex: "#800080" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Gray", hex: "#808080" },
    { name: "Lime", hex: "#00FF00" },
    { name: "Gold", hex: "#FFD700" },
    { name: "OrangeRed", hex: "#FF4500" },
  ];
  const handleColorChange = (colorName) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(colorName)
        ? prevColors.filter((color) => color !== colorName)
        : [...prevColors, colorName]
    );
  };

  const handleFilterReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setBrands([]);
    setSelectedColors([]);
    setSearchQuery("");
    setSortOption("Most Popular");
  };

  const handleBrandChange = (brand) => {
    setBrands((prevBrands) =>
      prevBrands.includes(brand)
        ? prevBrands.filter((b) => b !== brand)
        : [...prevBrands, brand]
    );
  };

  return (
    <section className="py-10 relative">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <span>Sort products</span>
                <FaFilter
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => handleSortOptionChange(option.value)}
                          className={`${
                            sortOption === option.value
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          }  px-4 py-2 text-sm w-full text-left flex items-center`}
                        >
                          {option.value === "Most Popular" && (
                            <FiClock className="mr-2" />
                          )}
                          {option.value === "Best Rating" && (
                            <FiStar className="mr-2" />
                          )}
                          {option.value === "Newest" && (
                            <FiShoppingBag className="mr-2" />
                          )}
                          <span>{option.name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <div>
            <div className="relative inline-block text-left">
              <button
                id="dropdownCheckboxButton"
                onClick={toggleDropdown}
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                type="button"
              >
                <span>Filter Brands</span>
                <FaChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
              {isDropdownOpen && (
                <div
                  id="dropdownDefaultCheckbox"
                  className="absolute z-10 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow"
                >
                  <ul
                    className="p-3 space-y-3 text-sm text-gray-700"
                    aria-labelledby="dropdownCheckboxButton"
                  >
                    {availableBrands.map((brand, index) => (
                      <li key={index}>
                        <div className="flex items-center">
                          <input
                            id={`checkbox-item-${index}`}
                            type="checkbox"
                            value={brand}
                            checked={brands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label
                            htmlFor={`checkbox-item-${index}`}
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            {brand}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <svg
          className="my-7 w-full"
          xmlns="http://www.w3.org/2000/svg"
          width={1216}
          height={2}
          viewBox="0 0 1216 2"
          fill="none"
        >
          <path d="M0 1H1216" stroke="#E5E7EB" />
        </svg>
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
            <div className="box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
              <div className="relative w-full mb-2">
                <input
                  type="text"
                  id="searchQuery"
                  className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none focus:outline-none bg-white"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            <p className="font-medium text-sm leading-6 text-black mb-3">
              Price Range
            </p>
            <div className="flex gap-2">
              <div className="flex items-center">
                <label htmlFor="minPrice" className="text-xs text-gray-600">
                  Min Price:
                </label>
                <input
                  id="minPrice"
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  className="h-8 border border-gray-300 rounded-md ml-2 w-24 text-xs px-2"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="maxPrice" className="text-xs text-gray-600">
                  Max Price:
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className="h-8 border border-gray-300 rounded-md ml-2 w-24 text-xs px-2"
                />
              </div>
            </div>
            <div className="mt-7 box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
              <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-7">
                <p className="font-medium text-base leading-7 text-black ">
                  Filter Plans
                </p>
                <p
                  className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-indigo-600"
                  onClick={handleFilterReset}
                >
                  RESET
                </p>
              </div>
              <div className="w-full mb-7">
                <div className="accordion-group grid grid-cols-1 gap-5 sm:gap-9">
                  <div className="accordion" id="category-heading-one">
                    <button
                      className="accordion-toggle group accordion-active:text-indigo-600 inline-flex items-center justify-between leading-8 text-gray-600 w-full transition duration-500 hover:text-indigo-600 active:text-indigo-600"
                      aria-controls="category-collapse-one"
                      onClick={toggleAccordion}
                    >
                      <h5 className="font-medium text-sm text-gray-900">
                        Color
                      </h5>
                      <IoIosArrowDropdown
                        className={`${
                          isAccordionOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      id="category-collapse-one"
                      className={`accordion-content w-full px-0 overflow-hidden transition-max-height duration-500 ease-in-out ${
                        isAccordionOpen ? "max-h-96" : "max-h-0"
                      }`}
                      aria-labelledby="category-heading-one"
                    >
                      <div className="box flex flex-wrap gap-2 mt-5">
                        {colors.map((color, index) => (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full cursor-pointer ${
                              selectedColors.includes(color.name)
                                ? "border-2 border-indigo-600"
                                : ""
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            onClick={() => handleColorChange(color.name)}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-medium text-sm leading-6 text-black mb-3">
                Discount
              </p>
              <div className="box flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    id="checkbox-default-1"
                    type="checkbox"
                    value="20"
                    checked={selectedDiscount === "20"}
                    onChange={handleDiscountChange}
                    className="w-5 h-5 appearance-none border border-gray-300 rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                  />
                  <label
                    htmlFor="checkbox-default-1"
                    className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                  >
                    20% or more
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="checkbox-default-2"
                    type="checkbox"
                    value="30"
                    checked={selectedDiscount === "30"}
                    onChange={handleDiscountChange}
                    className="w-5 h-5 appearance-none border border-gray-300 rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                  />
                  <label
                    htmlFor="checkbox-default-2"
                    className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                  >
                    30% or more
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="checkbox-default-3"
                    type="checkbox"
                    value="50"
                    checked={selectedDiscount === "50"}
                    onChange={handleDiscountChange}
                    className="w-5 h-5 appearance-none border border-gray-300 rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                  />
                  <label
                    htmlFor="checkbox-default-3"
                    className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                  >
                    50% or more
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12  md:col-span-9">
            {isLoading ? (
              <Loading />
            ) : error ? (
              <div className="flex justify-center items-center h-full text-red-600">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    No products found
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product._id}
                    images={product.images} // Assuming each product object has an imageUrl property
                    name={product.name}
                    price={product.price}
                    discount={product.discountPrice} // Placeholder discount value
                    rating={product.averageRating} // Placeholder rating value
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListingPage;

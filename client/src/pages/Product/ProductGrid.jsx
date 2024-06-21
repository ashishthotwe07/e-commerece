import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdAddShoppingCart } from "react-icons/md";
import { IoStarSharp } from "react-icons/io5";
import { FaHeart, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import QuickView from "../../components/QuickView";

import {
  productSelector,
  fetchProducts,
} from "../../redux/reducers/productSlice";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { featured } = useSelector(productSelector);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  const enhancedProducts = featured?.map((product) => ({
    ...product,
    discountedPrice: calculateDiscountedPrice(
      product.price,
      product.discountPrice
    ),
    averageRating: calculateAverageRating(product.reviews),
  }));

  return (
    <section className="bg-white text-gray-700">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Featured Products
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-x-5 lg:gap-y-10">
          {enhancedProducts && enhancedProducts.length > 0 ? (
            enhancedProducts.map((product) => (
              <article className="relative group" key={product.id}>
                <div className="aspect-square overflow-hidden relative">
                  <Link to={`/product-detail/${product._id}`}>
                    <img
                      className="h-52 m-auto mix-blend-multiply object-cover"
                      src={product.images[0].url}
                      alt={product.name}
                    />
                  </Link>
                  <button
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-1 w-full bg-gray-800 text-xs md:text-sm font-bold uppercase tracking-wide text-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap"
                    onClick={() => openModal(product)}
                  >
                    Quick View
                  </button>
                  <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 bg-white p-2 rounded-3xl group-hover:opacity-100">
                    <MdAddShoppingCart
                      onClick={() => {
                        toast.success("Added to cart");
                      }}
                      className="text-xl cursor-pointer text-gray-700"
                    />
                  </div>
                </div>
                {product.discountPrice > 1 && (
                  <div className="absolute top-0 m-1 rounded-full bg-white">
                    <p className="text-[10px] rounded-full bg-black p-1 font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1">
                      Sale
                    </p>
                  </div>
                )}
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold sm:text-sm md:text-base">
                      <a
                        href="#"
                        title={product.name}
                        className="cursor-pointer"
                      >
                        {product.name}
                        <span className="absolute" aria-hidden="true"></span>
                      </a>
                    </h3>
                    <div className="mt-2 flex items-center">
                      {[...Array(5)].map((star, index) => (
                        <IoStarSharp
                          key={index}
                          className={`block h-3 w-3 align-middle ${
                            index < product.averageRating
                              ? "text-yellow-500"
                              : "text-gray-400"
                          } sm:h-4 sm:w-4`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      <FaHeart />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  {product.discountPrice && (
                    <del className="mt-px text-xs mr-3 font-semibold text-gray-600 sm:text-sm">
                      {product.price}
                    </del>
                  )}
                  <span className="text-xs font-normal sm:text-sm md:text-base">
                    <FaRupeeSign className="inline text-sm" />{" "}
                    {product.discountedPrice}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center col-span-full">
              <p>No products available.</p>
            </div>
          )}
        </div>
      </div>

      {modalIsOpen && (
        <QuickView product={selectedProduct} closeModal={closeModal} />
      )}
    </section>
  );
};

export default ProductGrid;

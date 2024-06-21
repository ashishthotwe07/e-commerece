import React from "react";
import { IoClose } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";

const QuickView = ({ product, closeModal }) => {
  if (!product) return null;

  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return totalRating / product.reviews.length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative flex w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          onClick={closeModal}
        >
          <span className="sr-only">Close</span>
          <IoClose className="h-6 w-6" />
        </button>

        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 p-8">
          <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
            <img
              src={product.images[0].url}
              alt={product.name}
              className="object-cover object-center h-full w-full"
            />
          </div>
          <div className="sm:col-span-8 lg:col-span-7">
            <h2 className="text-3xl font-bold text-gray-900 sm:pr-12">
              {product.name}
            </h2>

            <section aria-labelledby="information-heading" className="mt-4">
              <h3 id="information-heading" className="sr-only">
                Product information
              </h3>

              <div className="flex">
                {product.discountedPrice &&
                  product.discountedPrice < product.price && (
                    <p className="text-sm text-gray-900 line-through font-semibold">
                      <FaRupeeSign className="inline text-xs" /> {product.price}
                    </p>
                  )}
                <p className="text-2xl ml-2 text-gray-900 font-semibold">
                  <FaRupeeSign className="inline text-sm" />
                  {product.discountedPrice}
                </p>
              </div>
              <div className="mt-6">
                <h4 className="sr-only">Reviews</h4>
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((star, index) => (
                      <IoStarSharp
                        key={index}
                        className={`block h-4 w-4 align-middle ${
                          index < calculateAverageRating()
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600">
                    {product.reviews && product.reviews.length > 0
                      ? `${product.reviews.length} reviews`
                      : "No reviews yet"}
                  </span>
                </div>
              </div>
            </section>

            <section aria-labelledby="options-heading" className="mt-10">
              <h3 id="options-heading" className="sr-only">
                Product options
              </h3>

              <form>
                <div className="mt-4">
                  <p className={`text-sm font-medium text-gray-900`}>
                    Color: {product.color}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center border border-transparent bg-gray-700 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 "
                >
                  Add to bag
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;

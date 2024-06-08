import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToCart,
  cartSelector,
  fetchCart,
  removeFromCart,
} from "../redux/reducers/cartReducer";

const ProductCard = ({ id, images, discount, name, price, rating }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(cartSelector);
  const [loading, setLoading] = useState(false);

  // Ensure `isInCart` safely accesses item.product._id
  const isInCart = items.items.some(
    (item) => item.product && item.product._id === id
  );

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (isInCart) {
        await dispatch(removeFromCart(id)).unwrap();
        toast.success("Removed from cart");
      } else {
        await dispatch(
          addToCart({ productId: id, name, price, images, quantity: 1 })
        ).unwrap();
        toast.success("Added to cart");
      }
      await dispatch(fetchCart()).unwrap(); // Ensure state is updated after add/remove
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <a
        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
        href="#"
      >
        <img
          className="object-cover ml-4"
          src={images[0].url}
          alt="product image"
        />

        {discount && (
          <span className="absolute top-0 left-0 m-1 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
            {discount} off
          </span>
        )}
      </a>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl tracking-tight text-slate-900">{name}</h5>
        </a>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">${price}</span>
            <span className="text-sm text-slate-900 line-through">$699</span>
          </p>
          <div className="flex items-center">
            <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
              {rating}
            </span>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-full h-12 rounded-md bg-slate-900 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          disabled={loading}
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {isInCart ? "Remove from cart" : "Add to cart"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

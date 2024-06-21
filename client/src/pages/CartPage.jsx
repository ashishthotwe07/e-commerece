import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  fetchCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/reducers/cartReducer";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // Import the filled heart icon
import axios from "axios";
import Loading from "../utils/Loading";

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    items: initialItems,
    totalPrice,
    loading,
  } = useSelector((state) => state.cartReducer);

  const [items, setItems] = useState([]);
  const [clearingCart, setClearingCart] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(null); // Track which item is being removed
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleIncreaseQuantity = (itemId) => {
    dispatch(increaseQuantity(itemId));
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(decreaseQuantity(itemId));
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveFromCart = async (productId) => {
    setRemoveLoading(productId);
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setRemoveLoading(null);
    }
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await dispatch(clearCart()).unwrap();
      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setClearingCart(false);
    }
  };

  const handleToggleFavorite = (productId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [productId]: !prevFavorites[productId],
    }));
  };

  const calculateTotalPrice = () => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Shopping Cart
        </h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <FiShoppingCart className="text-gray-400 text-6xl mb-4" />
            <p className="text-lg font-medium text-gray-600">
              Your cart is currently empty.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <Link
                        to={`/product-detail/${item.product._id}`}
                        className="shrink-0 md:order-1"
                      >
                        <img
                          className="h-20 w-20"
                          src={item.product.images[0].url}
                          alt={item.product.name}
                        />
                      </Link>

                      <label htmlFor="counter-input" className="sr-only">
                        Choose quantity:
                      </label>
                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="inline-flex disabled:opacity-50 disabled:cursor-default h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                            onClick={() => handleDecreaseQuantity(item._id)}
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            type="button"
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                            onClick={() => handleIncreaseQuantity(item._id)}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900">
                            Rs. {item.product.price}
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <Link
                          to={`/product-detail/${item.product._id}`}
                          className="text-base font-medium text-gray-900 hover:underline"
                        >
                          {item.product.name}
                        </Link>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline"
                            onClick={() =>
                              handleToggleFavorite(item.product._id)
                            }
                          >
                            {favorites[item.product._id] ? (
                              <FaHeart className="me-1.5 h-5 w-5 text-red-600" />
                            ) : (
                              <FiHeart className="me-1.5 h-5 w-5" />
                            )}
                            Add to Favorites
                          </button>

                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                            onClick={() =>
                              handleRemoveFromCart(item.product._id)
                            }
                          >
                            <FiTrash2 className="me-1.5 h-5 w-5" />
                            {removeLoading === item.product._id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <p className="text-xl font-semibold text-gray-900">
                  Order summary
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500">
                        Original price
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        Rs. {calculateTotalPrice()}
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                    <dt className="text-base font-bold text-gray-900">
                      Total Items
                    </dt>
                    <dd className="text-base font-bold text-gray-900">
                      {totalItems}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-gray-900">
                      Rs. {calculateTotalPrice()}
                    </dd>
                  </dl>
                </div>

                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Proceed to Checkout
                </a>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    or{" "}
                  </span>
                  <Link
                    to="/"
                    title=""
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                  onClick={handleClearCart}
                >
                  {clearingCart ? "Clearing..." : "Clear Cart"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;

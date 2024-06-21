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
import { Link } from "react-router-dom";
import { userSelector } from "../redux/reducers/userSlice";
import { MdAddShoppingCart } from "react-icons/md";
import { FaHeart, FaRupeeSign } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import QuickView from "./QuickView";

const ProductCard = ({ id, images, discount, name, price, rating }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(cartSelector);
  const { user } = useSelector(userSelector);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Ensure `isInCart` safely accesses item.product._id
  const isInCart = items.some(
    (item) => item.product && item.product._id === id
  );

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await dispatch(
        addToCart({ productId: id, name, price, images, quantity: 1 })
      ).unwrap();
      toast.success("Added to cart");
      await dispatch(fetchCart(user._id)).unwrap();
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCart(user._id));
  }, [dispatch]);

  // Calculate discounted price if discount is available
  const discountedPrice = discount
    ? Math.round(price - (price * discount) / 100)
    : null;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <article className="relative group" key={id}>
        <div className="aspect-square overflow-hidden relative">
          <Link to={`/product-detail/${id}`}>
            <img
              className="h-52 m-auto mix-blend-multiply  object-cover"
              src={images[0].url}
              alt={name}
            />
          </Link>
          <button
            className="absolute bottom-0 left-1/2  transform -translate-x-1/2 p-1 w-full bg-gray-800 text-xs md:text-sm font-bold uppercase tracking-wide text-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap"
            onClick={openModal}
          >
            Quick View
          </button>
          <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 bg-white p-2 rounded-3xl group-hover:opacity-100">
            {!loading ? (
              <MdAddShoppingCart
                onClick={handleAddToCart}
                className={`text-xl cursor-pointer text-gray-700 }`}
              />
            ) : (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </div>
        {discount > 1 && (
          <div className="absolute top-0 m-1 rounded-full bg-white">
            <p className="text-[10px] rounded-full bg-black p-1 font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1">
              Sale
            </p>
          </div>
        )}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="text-xs font-semibold sm:text-sm md:text-base">
              <a href="#" title={name} className="cursor-pointer">
                {name}
                <span className="absolute" aria-hidden="true"></span>
              </a>
            </h3>
            <div className="mt-2 flex items-center">
              {[...Array(5)].map((star, index) => (
                <IoStarSharp
                  key={index}
                  className={`block h-3 w-3 align-middle ${
                    index < rating ? "text-yellow-500" : "text-gray-400"
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
          {discount && (
            <del className="mt-px text-xs mr-3 font-semibold text-gray-600 sm:text-sm">
              {price}
            </del>
          )}
          <span className="text-xs font-normal sm:text-sm md:text-base">
            <FaRupeeSign className="inline text-sm" /> {discountedPrice}
          </span>
        </div>
      </article>

      {showModal && <QuickView product={product} closeModal={closeModal} />}
    </>
  );
};

export default ProductCard;

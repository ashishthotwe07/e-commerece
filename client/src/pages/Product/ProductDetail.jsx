import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiTruck, FiShield } from "react-icons/fi";
import ProductReviews from "./ProductReviews";
import Loading from "../../utils/Loading";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToCart,
  removeFromCart,
  fetchCart,
} from "../../redux/reducers/cartReducer";
import { cartSelector } from "../../redux/reducers/cartReducer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { items } = useSelector(cartSelector);

  const isInCart =
    items && items.items
      ? items.items.some((item) => item.product && item.product._id === id)
      : false;

  useEffect(() => {
    fetchProductDetails();
    dispatch(fetchCart());
  }, [id, dispatch]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/${id}`
      );
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (isInCart) {
        await dispatch(removeFromCart(id)).unwrap();
        toast.success("Removed from cart");
      } else {
        await dispatch(
          addToCart({
            productId: id,
            name: product.name,
            price: product.price,
            images: product.images,
            quantity: 1,
          })
        ).unwrap();
        toast.success("Added to cart");
      }
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <Loading />;

  return (
    <div className="font-sans bg-white">
      <div className="p-6 lg:max-w-7xl max-w-4xl mx-auto">
        <section className="py-2 sm:py-4">
          <div className="container mx-auto px-4">
            <nav className="flex">
              <ol role="list" className="flex items-center">
                <li className="text-left">
                  <div className="-m-1">
                    <a
                      href="#"
                      className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    >
                      {product.category.name}
                    </a>
                  </div>
                </li>

                <li className="text-left">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <div className="-m-1">
                      <a
                        href="#"
                        className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                      >
                        {product.subcategory.name}
                      </a>
                    </div>
                  </div>
                </li>

                <li className="text-left">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <div className="-m-1">
                      <a
                        href="#"
                        className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                        aria-current="page"
                      >
                        {product.name}
                      </a>
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-3 lg:row-end-1">
                <div className="lg:flex lg:items-start">
                  <div className="lg:order-2 w-full lg:ml-5">
                    <div className="max-w-xl overflow-hidden rounded-lg">
                      <img
                        className="h-96 m-auto object-cover"
                        src={product.images[selectedImageIndex].url}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                    <div className="flex flex-row items-start lg:flex-col">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg ${
                            index === selectedImageIndex
                              ? "border-2 border-gray-400"
                              : "border-2 border-transparent"
                          } text-center`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            className="h-20 m-auto object-cover"
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <h1 className="sm:text-2xl font-bold text-gray-900">
                  {product.name} | {product.color}
                </h1>

                <div className="mt-5 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <BsStarFill
                        key={index}
                        className="block h-4 w-4 text-yellow-500"
                      />
                    ))}
                  </div>

                  <p className="ml-2 text-sm font-medium text-gray-500">
                    1,209 Reviews
                  </p>
                </div>
                <div className="flex mt-2 items-end">
                  <h1 className="text-3xl font-bold">Rs. {product.price}</h1>
                </div>

                <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="Powder"
                      className="peer sr-only"
                      checked
                    />
                    <p className="peer-checked:bg-black peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold">
                      {product.brand}
                    </p>
                  </label>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900">Features</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tags available</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800 mr-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <FaCartPlus className="shrink-0 mr-3 h-5 w-5" />
                        {isInCart ? "Item in Cart" : "Add to Cart"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                  >
                    <FaCartPlus className="shrink-0 mr-3 h-5 w-5" />
                    Buy Now
                  </button>
                </div>

                <ul className="mt-8 space-y-2">
                  <li className="flex items-center text-left text-sm font-medium text-gray-600">
                    <FiTruck className="mr-2 block h-5 w-5 align-middle text-gray-500" />
                    Free shipping worldwide
                  </li>

                  <li className="flex items-center text-left text-sm font-medium text-gray-600">
                    <FiShield className="mr-2 block h-5 w-5 align-middle text-gray-500" />
                    Cancel Anytime
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-3">
                <div className="mt-4 flow-root sm:mt-6">
                  <div>{product.description}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <ProductReviews productId={id} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;

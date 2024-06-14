import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/reducers/userSlice";
import { CgShoppingCart } from "react-icons/cg";
import { IoBagHandleSharp, IoHome } from "react-icons/io5";

import { FaUser } from "react-icons/fa";
import { cartSelector } from "../redux/reducers/cartReducer";

const Navbar = () => {
  const { user } = useSelector(userSelector);
  // const [cartCount, setCartCount] = useState(1);
  const { cartCount } = useSelector(cartSelector);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [location]);

  return (
    <>
      <nav className="block w-full  px-4  py-3 mx-auto text-blue-gray-900 shadow-lg border-b-2 bg-white">
        <div className="flex flex-wrap items-center justify-between text-blue-gray-900 gap-y-4">
          <Link
            to="/"
            className="mr-4 ml-2 block cursor-pointer py-1.5 font-sans text-base font-semibold leading-relaxed tracking-normal text-inherit antialiased"
          >
            Flowbite
          </Link>
          <div className="flex gap-1 ml-auto md:mr-4">
            <Link
              to="/"
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-900 transition-all hover:bg-blue-gray-100 active:bg-blue-gray-200"
              type="button"
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <IoHome className="w-4 h-4" />
              </span>
            </Link>
            {user ? (
              <Link
                to="/user/profile"
                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-900 transition-all hover:bg-blue-gray-100 active:bg-blue-gray-200"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaUser className="w-4 h-4" />
                </span>
              </Link>
            ) : (
              <Link
                to="/signin"
                className="relative h-10 max-h-[40px] w-20 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-900 transition-all hover:bg-blue-gray-100 active:bg-blue-gray-200"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaUser className="w-4 h-4" />
                </span>
              </Link>
            )}
            <Link
              to="/orders"
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-900 transition-all hover:bg-blue-gray-100 active:bg-blue-gray-200"
              type="button"
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <IoBagHandleSharp className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/cart-page"
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-900 transition-all hover:bg-blue-gray-100 active:bg-blue-gray-200"
              type="button"
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <CgShoppingCart className="w-4 h-4" />
              </span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="relative flex items-center justify-center w-full gap-2 md:w-max">
            <div className="relative flex-grow">
              <input
                type="search"
                className=" h-full w-full rounded-[7px] border border-blue-gray-500 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-900 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-500 placeholder-shown:border-t-blue-gray-500 focus:border-2 focus:border-blue-gray-500 focus:border-t-blue-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" Search For product "
              />
            </div>
            <button
              className="!absolute right-1 top-1 select-none rounded bg-gray-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white"
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      </nav>
      <div className="outlet">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;

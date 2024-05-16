import React, { useState } from "react";
import { FaHome, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { signOutUser, userSelector } from "../redux/reducers/userSlice";

const Navbar = () => {
  const { user } = useSelector(userSelector);
  console.log(user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(signOutUser());
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-white text-lg mr-6"
              activeClassName="text-red-500"
            >
              <FaHome className="inline-block mr-2" /> Home
            </NavLink>
          </div>
          <div className="flex items-center">
            {user ? (
              <button onClick={handleLogout} className="text-white text-lg">
                <FaSignOutAlt className="inline-block mr-2" /> Logout
              </button>
            ) : (
              <NavLink
                to="/signin"
                className="text-white text-lg"
                activeClassName="text-red-500"
              >
                <FaSignInAlt className="inline-block mr-2" /> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

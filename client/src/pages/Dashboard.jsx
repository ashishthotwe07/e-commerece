import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUser,
  updateUser,
  userSelector,
} from "../redux/reducers/userSlice";
import { Link, NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Dashboard = () => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(signOutUser());
  };

  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="flex flex-col gap-2 profile-tags p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
          <NavLink
            to="profile"
            className="flex items-center px-3 py-2.5 font-semibold bg-white outline-none  rounded-full"
          >
            Profile
          </NavLink>
          <NavLink
            to="dashboard"
            className="flex items-center px-3 py-2.5 font-semibold  outline-none hover:border rounded-full"
          >
            Admin Dashboard
          </NavLink>
          <NavLink
            to="create-category"
            className="flex items-center px-3 py-2.5 font-semibold  outline-none hover:border rounded-full"
          >
            Create Category
          </NavLink>
          <NavLink
            to="create-subcategory"
            className="flex items-center px-3 py-2.5 font-semibold  outline-none hover:border rounded-full"
          >
            Create subcategory
          </NavLink>
          <p
            onClick={handleLogout}
            className="flex cursor-pointer items-center px-3 py-2.5 font-semibold outline-none hover:border hover:rounded-full"
          >
            Logout
          </p>
        </div>
      </aside>
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

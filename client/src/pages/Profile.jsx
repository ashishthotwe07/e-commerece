import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUser,
  updateUser,
  userSelector,
} from "../redux/reducers/userSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  console.log(user);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    dispatch(signOutUser());
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handleUpdateClick = async () => {
    try {
      const formdata = new FormData();
      if (formData.username) {
        formdata.append("username", formData.username);
      }
      if (formData.email) {
        formdata.append("email", formData.email);
      }
      if (formData.image) {
        formdata.append("image", formData.image);
      }

      const res = await dispatch(updateUser(formdata)).unwrap();

      setIsEditing(false);
      setFormData({});
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
          <Link
            to="#"
            className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 outline-none border rounded-full"
          >
            Profile
          </Link>
          <Link
            to="#"
            className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 outline-none hover:border hover:rounded-full"
          >
            Account Settings
          </Link>
          <p
            onClick={handleLogout}
            className="flex cursor-pointer items-center px-3 py-2.5 font-semibold hover:text-indigo-900 outline-none hover:border hover:rounded-full"
          >
            Logout
          </p>
        </div>
      </aside>
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Profile</h2>
            <div className="grid max-w-2xl mx-auto mt-8">
              <div className="relative flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                <div className="relative m-auto w-40 h-40">
                  <img
                    className="object-cover w-full h-full p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500 cursor-pointer"
                    src={
                      formData.image
                        ? URL.createObjectURL(formData.image)
                        : user.avatar?.url
                        ? user.avatar.url
                        : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                    }
                    alt=" avatar"
                    onClick={isEditing ? handleImageClick : undefined}
                  />
                  {isEditing && (
                    <img
                      className="absolute w-6 h-6 bottom-2 right-2 cursor-pointer"
                      src="https://cdn-icons-png.flaticon.com/128/6499/6499530.png"
                      alt="Add icon"
                      onClick={handleImageClick}
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div className="items-center mt-5 text-[#202142]">
                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-2">
                  <div className="w-full">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-indigo-900 outline-none"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      defaultValue={user.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 outline-none text-sm rounded-lg block w-full p-2.5"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                </div>
                <div className="mb-2 sm:mb-2">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-indigo-900 outline-none"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 outline-none text-sm rounded-lg block w-full p-2.5"
                    placeholder="your.email@mail.com"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-5">
                <button
                  type="button"
                  onClick={isEditing ? handleUpdateClick : handleEditClick}
                  className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"
                >
                  {isEditing ? "Update" : "Edit"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="py-3.5 px-7 text-base font-medium text-indigo-900 outline-none focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

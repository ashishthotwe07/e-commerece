import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const Review = ({ review, loggedInUser, onEdit, onDelete, onReport }) => {
  const { user, rating, comment } = review;
  const isCurrentUser = user._id === loggedInUser._id;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = () => {
    onEdit(review);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    onDelete(review._id);
    setIsDropdownOpen(false);
  };

  const handleReport = () => {
    onReport(review._id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 relative bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-500 hover:text-gray-800"
          >
            <BsThreeDotsVertical />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-10">
              {isCurrentUser ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReport}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-600">{comment}</p>
        <p className="text-gray-600">
          {new Date(review.createdAt).toLocaleDateString("en-GB")}
        </p>
      </div>
    </div>
  );
};

export default Review;

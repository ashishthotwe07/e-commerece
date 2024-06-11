import React, { useState, useEffect } from "react";
import { BsStarFill } from "react-icons/bs";

const AddEditReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  review,
  isLoading,
}) => {
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [comment, setComment] = useState(review ? review.comment : "");

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [isOpen, review]);

  const handleSubmit = () => {
    const reviewData = {
      rating,
      comment,
    };
    onSubmit(reviewData);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h3 className="text-lg font-bold text-[#333] mb-4">
            {review ? "Edit Review" : "Add Review"}
          </h3>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <BsStarFill
                key={i}
                className={`w-6 h-6 cursor-pointer ${
                  i < rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            className="mt-4 p-3 border border-gray-300 rounded w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <div className="mt-4 flex justify-end">
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddEditReviewModal;

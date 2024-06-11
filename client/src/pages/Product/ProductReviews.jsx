import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddEditReviewModal from "./AddEditReviewModal";
import Review from "./Review";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/reducers/userSlice";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { user } = useSelector(userSelector);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/${productId}`
      );
      
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const addReview = async (reviewData) => {
    setIsLoading(true);
    try {
      reviewData.productId = productId;
      await axios.post(`http://localhost:5000/api/reviews/`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsModalOpen(false);
      fetchReviews();
      toast.success("Review added successfully.");
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const editReview = async (reviewData) => {
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/reviews/${selectedReview._id}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      fetchReviews();
      toast.success("Review edited successfully.");
    } catch (error) {
      console.error("Error editing review:", error);
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReviews();
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const reportReview = (reviewId) => {
    console.log("Report review:", reviewId);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Product Reviews {reviews.length}</h3>
      {reviews.length === 0 ? (
        <div className="text-gray-600">No reviews available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Review
              key={review._id}
              review={review}
              loggedInUser={user}
              onEdit={(review) => {
                setSelectedReview(review);
                setIsModalOpen(true);
              }}
              onDelete={deleteReview}
              onReport={reportReview}
            />
          ))}
        </div>
      )}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        onClick={() => {
          setSelectedReview(null);
          setIsModalOpen(true);
        }}
        disabled={isLoading}
      >
        Add Review
      </button>
      <AddEditReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={selectedReview ? editReview : addReview}
        review={selectedReview}
        productId={productId}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductReviews;

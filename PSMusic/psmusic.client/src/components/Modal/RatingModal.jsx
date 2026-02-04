import React, { useState, useEffect } from "react";
import { X, Star, Send } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import styles from "./RatingModal.module.css";
import toast from 'react-hot-toast';


const USER_NAME = "Bạn (User hiện tại)";
const ITEMS_PER_PAGE = 5;

const StarRatingDisplay = ({ rating, size = 16 }) => (
  <div className={styles["star-rating-display"]}>
    {[...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      return (
        <Star
          key={index}
          size={size}
          color="#FFD700"
          fill={ratingValue <= rating ? "#FFD700" : "#555"}
        />
      );
    })}
  </div>
);

const RatingModal = ({
  isOpen,
  onClose,
  songId,
  songTitle = "Bài Hát",
  isReviewed = false,
  onReviewSubmitted,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const indexOfLastReview = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - ITEMS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const userHasRated =
    reviews.some((review) => review.user === USER_NAME) || isReviewed;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !songId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/rating/${songId}/reviews`);
        setReviews(res.data || []);
      } catch (err) {
        //console.error("Lỗi load review:", err);
      } finally {
        setLoading(false);
        setSuccessMessage("");
        setSubmitting(false);
        setRating(0);
        setComment("");
        setHover(0);
        setCurrentPage(1);
      }
    };

    fetchReviews();
  }, [isOpen, songId]);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
      setHover(0);
      setSuccessMessage("");
      setSubmitting(false);
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userHasRated) return;
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao để đánh giá!");
      return;
    }

    const newReviewPayload = {
      rating,
      comment: comment.trim() || "(Không có bình luận)",
      user: USER_NAME,
    };

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(
        `/rating/${songId}/add-review`,
        newReviewPayload
      );

      const savedReview = res.data;

      const newReview = {
        id: savedReview.id || Date.now(),
        user: USER_NAME,
        rating: rating,
        comment: comment.trim() || "(Không có bình luận)",
        date: new Date().toLocaleDateString("vi-VN"),
        ...(savedReview.date && { date: savedReview.date }),
        ...(savedReview.createdAt && {
          date: new Date(savedReview.createdAt).toLocaleDateString("vi-VN"),
        }),
      };

      setReviews((prev) => [newReview, ...prev]);
      setCurrentPage(1);

      // setSuccessMessage(`🎉 Đã gửi đánh giá ${rating} sao thành công!`);

      if (onReviewSubmitted) {
        onReviewSubmitted(savedReview);
      }

      setRating(0);
      setComment("");
      setHover(0);
    } catch (err) {
      //console.error("Lỗi gửi đánh giá:", err);
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div
        className={styles["rating-modal"]}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles["close-btn"]} onClick={onClose}>
          <X size={20} />
        </button>

        <h3>Đánh Giá và Bình luận về "{songTitle}"</h3>
        <hr className={styles["separator"]} />

        {successMessage && (
          <div className={styles["success-message"]}>{successMessage}</div>
        )}


        <div className={styles["rate-input-container"]}>
          {!userHasRated && (
            <form className={styles["rating-form"]} onSubmit={handleSubmit}>
              {/* <p className={styles["rate-prompt"]}>
                Cảm nhận của bạn về bài hát này:
              </p> */}

              <div className={styles["star-rating"]}>
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <Star
                      key={index}
                      size={36}
                      color="#FFD700"
                      fill={
                        ratingValue <= (hover || rating)
                          ? "#FFD700"
                          : "transparent"
                      }
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      className={styles["star-icon-input"]}
                    />
                  );
                })}
              </div>

              {/* <p className={styles["rating-text"]}>
                {rating > 0
                  ? `Bạn đã chọn ${rating} sao!`
                  : "Chọn số sao của bạn"}
              </p> */}

              <textarea
                placeholder="Viết bình luận của bạn (Không bắt buộc)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                className={styles["comment-textarea"]}
              />

              <button
                type="submit"
                className={styles["submit-rating-btn"]}
                disabled={rating === 0 || submitting}
              >
                {/* <Send size={18} /> */}
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          )}
        </div>

        <hr className={styles["separator"]} />

        <div className={styles["reviews-list-container"]}>
          <h4>Bình luận từ cộng đồng</h4>

          {loading ? (
            <p className={styles["loading-reviews"]}>Đang tải đánh giá...</p>
          ) : reviews.length > 0 && (
            
            <div className={styles["reviews-list"]}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`${styles["review-item"]} ${
                    review.user === USER_NAME ? styles["user-review"] : ""
                  }`}
                >
                  <div className={styles["review-header"]}>
                    <strong>{review.user}</strong>
                    <StarRatingDisplay rating={review.rating} />
                  </div>

                  <p className={styles["review-comment"]}>{review.comment}</p>
                  <span className={styles["review-date"]}>
                    Ngày: {review.date || review.createdAt?.slice(0, 10)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

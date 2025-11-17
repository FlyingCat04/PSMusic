import React, { useState, useEffect } from "react";
import { X, Star, Send } from "lucide-react";
import './RatingModal.css';

const initialReviews = [
    {
        id: 1,
        user: "Minh Anh",
        rating: 5,
        comment: "Bài này quá hay! Nghe chill cực kỳ, hợp với những buổi tối mưa.",
        date: "2025-11-15",
    },
    {
        id: 2,
        user: "Tuan Kiet",
        rating: 4,
        comment: "Giọng ca sĩ Hoàng Dũng ấm áp, nhưng phần phối khí hơi đơn giản.",
        date: "2025-11-14",
    },
    {
        id: 3,
        user: "Hồng Nhung",
        rating: 5,
        comment: "Tuyệt vời! Nghe đi nghe lại không biết chán.",
        date: "2025-11-13",
    },
    {
        id: 4,
        user: "Hồng Nhung",
        rating: 5,
        comment: "Tuyệt vời! Nghe đi nghe lại không biết chán.",
        date: "2025-11-13",
    },
    {
        id: 5,
        user: "Hồng Nhung",
        rating: 5,
        comment: "Tuyệt vời! Nghe đi nghe lại không biết chán.",
        date: "2025-11-13",
    },
    {
        id: 6,
        user: "Hồng Nhung",
        rating: 5,
        comment: "Tuyệt vời! Nghe đi nghe lại không biết chán.",
        date: "2025-11-13",
    },{
        id: 7,
        user: "Hồng Nhung",
        rating: 5,
        comment: "Tuyệt vời! Nghe đi nghe lại không biết chán.",
        date: "2025-11-13",
    },
];

const USER_NAME = "Bạn (User hiện tại)";

const StarRatingDisplay = ({ rating, size = 16 }) => (
    <div className="star-rating-display">
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

const RatingModal = ({ isOpen, onClose, onRate, songTitle = "Bài Hát" }) => { 
    const [reviews, setReviews] = useState(initialReviews); 
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(0);
    
    const userHasRated = reviews.some(review => review.user === USER_NAME);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setRating(0);
            setComment("");
            setHover(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (userHasRated) return;

        if (rating === 0) {
            alert("Vui lòng chọn số sao để đánh giá!");
            return;
        }
        
        const newReview = {
            id: Date.now(),
            user: USER_NAME,
            rating: rating,
            comment: comment.trim() || "(Không có bình luận)",
            date: new Date().toLocaleDateString("vi-VN"),
        };
        
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        
        onRate && onRate(newReview);
        
        setComment(""); 
        setRating(0);
    };
    

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <h3>🌟 Đánh Giá và Bình luận về "{songTitle}"</h3>
                
                <div className="rate-input-container">
                    {userHasRated ? (
                        <p className="rated-message">
                            ✅ Bạn đã đánh giá bài hát này rồi!
                        </p>
                    ) : (
                        <form className="rating-form" onSubmit={handleSubmit}>
                            <p className="rate-prompt">Cảm nhận của bạn về bài hát này:</p>
                            
                            <div className="star-rating">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <Star
                                            key={index}
                                            size={36}
                                            color="#FFD700"
                                            fill={ratingValue <= (hover || rating) ? "#FFD700" : "transparent"}
                                            onClick={() => setRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                            className="star-icon-input"
                                        />
                                    );
                                })}
                            </div>
                            <p className="rating-text">
                                {rating > 0 ? `Bạn đã chọn ${rating} sao!` : "Chọn số sao của bạn"}
                            </p>
                            
                            <textarea
                                placeholder="Viết bình luận của bạn (Không bắt buộc)..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                className="comment-textarea"
                            />
                            
                            <button 
                                type="submit"
                                className="submit-rating-btn"
                                disabled={rating === 0}
                            >
                                <Send size={18} /> Gửi Đánh Giá
                            </button>
                        </form>
                    )}
                </div>

                <hr className="separator"/>
                
                <div className="reviews-list-container">
                    <h4>💬 {reviews.length} Bình luận từ cộng đồng</h4>
                    {reviews.length > 0 ? (
                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className={`review-item ${review.user === USER_NAME ? 'user-review' : ''}`}>
                                    <div className="review-header">
                                        <strong>{review.user}</strong>
                                        <StarRatingDisplay rating={review.rating} />
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <span className="review-date">Ngày: {review.date}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-reviews">Chưa có đánh giá nào cho bài hát này.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RatingModal;
import React, { useState } from 'react';
import '../assets/styles/RestaurantReviewForm.css'; // Import CSS tùy chỉnh

const RestaurantReviewForm = ({ restaurantId, existingReviews }) => {
  // State để quản lý form đánh giá
  const [rating, setRating] = useState(0); // Số sao
  const [comment, setComment] = useState(''); // Bình luận
  const [reviews, setReviews] = useState(existingReviews || []); // Danh sách đánh giá
  const [hoverRating, setHoverRating] = useState(0); // Số sao khi hover (cho hiệu ứng)

  // Xử lý khi người dùng gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const newReview = {
      user: 'Người dùng',
      rating,
      comment,
      date: new Date().toLocaleDateString(), // Ngày gửi đánh giá
    };

    // Cập nhật danh sách đánh giá
    setReviews([newReview, ...reviews]);

    // Reset form sau khi gửi
    setRating(0);
    setComment('');
  };

  return (
    <div className="rest-review-form-container">
      <h2>Đánh giá nhà hàng</h2>

      {/* Form nhập đánh giá */}
      <form onSubmit={handleSubmit} className="rest-review-form">
        <div className="rest-rating-input">
          <label>Đánh giá của bạn:</label>
          <div className="rest-stars">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={index}
                  className={`rest-star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        <div className="rest-comment-input">
          <label>Bình luận:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
            rows="4"
            required
          />
        </div>
        <button type="submit" className="rest-submit-btn">
          Gửi đánh giá
        </button>
      </form>

      {/* Hiển thị danh sách đánh giá */}
      <div className="rest-reviews-list">
        <h3>Các đánh giá ({reviews.length})</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="rest-review-item">
              <div className="rest-review-header">
                <span className="rest-review-user">{review.user}</span>
                <span className="rest-review-date">{review.date}</span>
              </div>
              <div className="rest-review-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`rest-star ${i < review.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="rest-review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantReviewForm;
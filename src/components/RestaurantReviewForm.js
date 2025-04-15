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
      user: 'Người dùng', // Tạm thời giả lập, có thể thay bằng thông tin người dùng thực tế
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
    <div className="review-form-container">
      <h2>Đánh giá nhà hàng</h2>

      {/* Form nhập đánh giá */}
      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-input">
          <label>Đánh giá của bạn:</label>
          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={index}
                  className={`star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
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

        <div className="comment-input">
          <label>Bình luận:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
            rows="4"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Gửi đánh giá
        </button>
      </form>

      {/* Hiển thị danh sách đánh giá */}
      <div className="reviews-list">
        <h3>Các đánh giá ({reviews.length})</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <span className="review-user">{review.user}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="review-comment">{review.comment}</p>
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
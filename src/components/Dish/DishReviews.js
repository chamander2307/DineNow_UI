import React, { useState, useEffect } from 'react';
import '../../assets/styles/DishReviews.css';

// Hàm hiển thị sao dựa trên số điểm
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star filled' : 'star'}>
        ★
      </span>
    );
  }
  return <div className="star-rating">{stars}</div>;
};

const DishReviews = ({ reviews }) => {
  // Quản lý danh sách đánh giá (bao gồm đánh giá ban đầu và đánh giá mới)
  const [reviewList, setReviewList] = useState(reviews);
  // Quản lý trạng thái form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Cập nhật reviewList khi reviews thay đổi (ví dụ: khi props thay đổi)
  useEffect(() => {
    setReviewList(reviews);
  }, [reviews]);

  // Xử lý gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const newReview = {
      author: 'Người dùng', // Có thể thay bằng tên người dùng thực tế (nếu có đăng nhập)
      date: new Date().toISOString().split('T')[0], // Ngày hiện tại (định dạng YYYY-MM-DD)
      content: comment,
      rating: rating,
    };

    setReviewList([...reviewList, newReview]);
    // Reset form
    setRating(0);
    setComment('');
  };

  return (
    <div className="dish-reviews">
      <h3 className="dish-reviews-title">Đánh giá và Bài viết</h3>

      {/* Form đánh giá */}
      <div className="review-form">
        <h4>Viết đánh giá của bạn</h4>
        <div className="star-input">
          <label>Đánh giá: </label>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? 'star filled' : 'star'}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          className="review-comment"
          placeholder="Nhập bình luận của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Gửi
        </button>
      </div>

      {/* Danh sách đánh giá */}
      {reviewList.length === 0 ? (
        <p>Chưa có đánh giá nào cho món ăn này.</p>
      ) : (
        <ul className="dish-reviews-items">
          {reviewList.map((review, index) => (
            <li key={index} className="dish-review-item">
              <div className="dish-review-header">
                <span className="dish-review-author">{review.author}</span>
                <span className="dish-review-date">{review.date}</span>
              </div>
              {review.rating && <StarRating rating={review.rating} />}
              <p className="dish-review-content">{review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DishReviews;
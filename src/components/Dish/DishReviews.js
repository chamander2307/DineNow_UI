import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { addMenuItemReview, fetchAllMenuItemReviews } from '../../services/reviewService';
import '../../assets/styles/Dish/DishReviews.css';

// Component hiển thị sao đánh giá
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

const DishReviews = ({ menuItemId }) => {
  const { user } = useContext(UserContext);
  const currentUser = user?.fullName || user?.email || 'Người dùng';

  const [reviewList, setReviewList] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchAllMenuItemReviews(menuItemId);
      setReviewList(data);
    };
    if (menuItemId) loadReviews();
  }, [menuItemId]);

  useEffect(() => {
    const userHasReviewed = reviewList.some(review => review.author === currentUser);
    setIsFormVisible(!userHasReviewed);
  }, [reviewList, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const newReview = {
  rating,
  content: comment,
};

const result = await addMenuItemReview(menuItemId, newReview);
if (result) {
  setReviewList([result, ...reviewList]);
  setRating(0);
  setComment('');
  setIsFormVisible(false);
} else {
  alert('Không thể gửi đánh giá. Vui lòng thử lại.');
}

  };

  return (
    <div className="dish-reviews">
      <h3 className="dish-reviews-title">Đánh giá và Bài viết</h3>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="star-input">
            <label>Đánh giá: </label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="comment-input">
            <label>Bình luận:</label>
            <textarea
              className="review-comment"
              placeholder="Nhập bình luận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Gửi đánh giá</button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        <h3>Các đánh giá ({reviewList.length})</h3>
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
                <div className="dish-review-rating">
                  {review.rating && <StarRating rating={review.rating} />}
                </div>
                <p className="dish-review-content">{review.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DishReviews;

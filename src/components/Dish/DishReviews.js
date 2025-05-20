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
  const [comment, setComment] = useState(''); // Đổi tên từ content thành comment
  const [hoverRating, setHoverRating] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('menuItemId:', menuItemId); // Debug ID
        const data = await fetchAllMenuItemReviews(menuItemId);
        console.log('Dữ liệu từ fetchAllMenuItemReviews:', data);
        const reviews = Array.isArray(data) ? data : [];
        const processedReviews = reviews.map(review => ({
          author: review.reviewerName || 'Ẩn danh', // Ánh xạ từ reviewerName
          date: review.reviewDate || new Date().toISOString(), // Ánh xạ từ reviewDate
          comment: review.comment || 'Không có nội dung', // Sử dụng comment
          rating: review.rating || 0,
        }));
        setReviewList(processedReviews);
      } catch (err) {
        console.error('Lỗi khi tải đánh giá:', err);
        setError('Không thể tải danh sách đánh giá. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
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
      comment, // Gửi comment, API tự thêm reviewerName và reviewDate
    };

    try {
      const result = await addMenuItemReview(menuItemId, newReview);
      if (result) {
        const processedResult = {
          ...result,
          author: result.reviewerName || currentUser,
          date: result.reviewDate || new Date().toISOString(),
          comment: result.comment || comment,
          rating: result.rating || rating,
        };
        setReviewList([processedResult, ...reviewList]);
        setRating(0);
        setComment('');
        setIsFormVisible(false);
      } else {
        alert('Không thể gửi đánh giá. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
      alert('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

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
                  <span className="dish-review-author">{review.author || 'Ẩn danh'}</span>
                  <span className="dish-review-date">{review.date ? new Date(review.date).toLocaleDateString() : 'Chưa có ngày'}</span>
                </div>
                <div className="dish-review-rating">
                  {review.rating && <StarRating rating={review.rating} />}
                </div>
                <p className="dish-review-content">{review.comment || 'Không có nội dung'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DishReviews;
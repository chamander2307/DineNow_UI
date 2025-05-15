import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { fetchRestaurantReviews, addRestaurantReview } from '../../services/reviewService';
import { getCustomerOrdersByRestaurant } from '../../services/orderService';
import '../../assets/styles/Restaurant/RestaurantReviewForm.css';

const RestaurantReviewForm = ({ restaurantId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const currentUser = user?.fullName || user?.email || 'Người dùng';

  // Lấy danh sách đánh giá và kiểm tra đơn hàng
  useEffect(() => {
    const loadData = async () => {
      try {
        // Lấy danh sách đánh giá
        const reviewData = await fetchRestaurantReviews(restaurantId);
        setReviews(reviewData || []);

        // Kiểm tra đơn hàng
        if (user) {
          const orderData = await getCustomerOrdersByRestaurant(restaurantId);
          setHasOrdered(Array.isArray(orderData?.data) && orderData.data.length > 0);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [restaurantId, user]);

  // Gửi đánh giá mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const reviewData = { rating, comment };
    try {
      const newReview = await addRestaurantReview(restaurantId, reviewData);
      if (newReview) {
        setReviews([{
          user: currentUser,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toLocaleDateString(),
        }, ...reviews]);
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    }
  };

  return (
    <div className="rest-review-form-container">
      <h2>Đánh giá nhà hàng</h2>

      {hasOrdered && user ? (
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
          <div className="rest-form-actions">
            <button type="submit" className="rest-submit-btn">
              Gửi đánh giá
            </button>
          </div>
        </form>
      ) : (
        <p>Bạn cần đặt hàng và đăng nhập để gửi đánh giá.</p>
      )}

      <div className="rest-reviews-list">
        <h3>Các đánh giá ({reviews.length})</h3>
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length > 0 ? (
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
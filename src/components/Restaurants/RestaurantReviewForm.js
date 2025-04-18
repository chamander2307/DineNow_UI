import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext
import '../../assets/styles/RestaurantReviewForm.css'; // Import CSS tùy chỉnh

const RestaurantReviewForm = ({ restaurantId, existingReviews }) => {
  // State để quản lý form đánh giá
  const [rating, setRating] = useState(0); // Số sao
  const [comment, setComment] = useState(''); // Bình luận
  const [reviews, setReviews] = useState(existingReviews || []); // Danh sách đánh giá
  const [hoverRating, setHoverRating] = useState(0); // Số sao khi hover (cho hiệu ứng)
  const [isFormVisible, setIsFormVisible] = useState(true); // Trạng thái hiển thị form
  const [editIndex, setEditIndex] = useState(null); // Chỉ số của đánh giá đang chỉnh sửa
  const [editRating, setEditRating] = useState(0); // Số sao khi chỉnh sửa
  const [editComment, setEditComment] = useState(''); // Bình luận khi chỉnh sửa

  // Lấy thông tin người dùng từ UserContext
  const { user } = useContext(UserContext);
  const currentUser = user?.fullName || user?.email || 'Người dùng';

  // Xử lý khi người dùng gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const newReview = {
      user: currentUser, // Sử dụng thông tin người dùng hiện tại
      rating,
      comment,
      date: new Date().toLocaleDateString(), // Ngày gửi đánh giá
    };

    // Cập nhật danh sách đánh giá
    setReviews([newReview, ...reviews]);

    // Reset form và ẩn form
    setRating(0);
    setComment('');
    setIsFormVisible(false);
  };

  // Xử lý xóa đánh giá
  const handleDelete = (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      const updatedReviews = reviews.filter((_, i) => i !== index);
      setReviews(updatedReviews);
      // Hiện lại form sau khi xóa, bất kể danh sách có rỗng hay không
      setIsFormVisible(true);
    }
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (index) => {
    const review = reviews[index];
    setEditIndex(index);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setIsFormVisible(true);
  };

  // Xử lý cập nhật đánh giá
  const handleUpdate = (e) => {
    e.preventDefault();
    if (editRating === 0 || editComment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const updatedReviews = [...reviews];
    updatedReviews[editIndex] = {
      ...updatedReviews[editIndex],
      rating: editRating,
      comment: editComment,
      date: new Date().toLocaleDateString(), // Cập nhật ngày
    };
    setReviews(updatedReviews);
    setEditIndex(null);
    setEditRating(0);
    setEditComment('');
    setIsFormVisible(false);
  };

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditRating(0);
    setEditComment('');
    setIsFormVisible(false);
  };

  return (
    <div className="rest-review-form-container">
      <h2>Đánh giá nhà hàng</h2>

      {/* Form nhập đánh giá - Chỉ hiển thị nếu isFormVisible là true */}
      {isFormVisible && (
        <form onSubmit={editIndex !== null ? handleUpdate : handleSubmit} className="rest-review-form">
          <div className="rest-rating-input">
            <label>Đánh giá của bạn:</label>
            <div className="rest-stars">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={index}
                    className={`rest-star ${starValue <= (hoverRating || (editIndex !== null ? editRating : rating)) ? 'filled' : ''}`}
                    onClick={() => (editIndex !== null ? setEditRating(starValue) : setRating(starValue))}
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
              value={editIndex !== null ? editComment : comment}
              onChange={(e) => (editIndex !== null ? setEditComment(e.target.value) : setComment(e.target.value))}
              placeholder="Nhập bình luận của bạn..."
              rows="4"
              required
            />
          </div>
          <div className="rest-form-actions">
            <button type="submit" className="rest-submit-btn">
              {editIndex !== null ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                className="rest-cancel-btn"
                onClick={handleCancelEdit}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      )}

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
              {/* Chỉ hiển thị nút "Sửa" và "Xóa" nếu đánh giá thuộc về người dùng hiện tại */}
              {review.user === currentUser && (
                <div className="rest-review-actions">
                  <button
                    className="rest-edit-btn"
                    onClick={() => handleEdit(index)}
                  >
                    Sửa
                  </button>
                  <button
                    className="rest-delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    Xóa
                  </button>
                </div>
              )}
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
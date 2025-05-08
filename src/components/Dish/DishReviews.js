import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext
import '../../assets/styles/Dish/DishReviews.css';

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
  // Lấy thông tin người dùng từ UserContext
  const { user } = useContext(UserContext);
  const currentUser = user?.fullName || user?.email || 'Người dùng';

  // Quản lý danh sách đánh giá
  const [reviewList, setReviewList] = useState(reviews || []);
  // Quản lý trạng thái form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0); // Số sao khi hover
  const [isFormVisible, setIsFormVisible] = useState(true); // Trạng thái hiển thị form
  const [editIndex, setEditIndex] = useState(null); // Chỉ số của đánh giá đang chỉnh sửa
  const [editRating, setEditRating] = useState(0); // Số sao khi chỉnh sửa
  const [editComment, setEditComment] = useState(''); // Bình luận khi chỉnh sửa

  // Cập nhật reviewList khi reviews thay đổi
  useEffect(() => {
    setReviewList(reviews || []);
  }, [reviews]);

  // Kiểm tra xem người dùng đã có đánh giá chưa
  useEffect(() => {
    const userHasReviewed = reviewList.some(review => review.author === currentUser);
    setIsFormVisible(!userHasReviewed || editIndex !== null);
  }, [reviewList, currentUser, editIndex]);

  // Xử lý gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }

    const newReview = {
      author: currentUser,
      date: new Date().toLocaleDateString(), // Ngày hiện tại
      content: comment,
      rating: rating,
    };

    setReviewList([newReview, ...reviewList]);
    // Reset form và ẩn form
    setRating(0);
    setComment('');
    setIsFormVisible(false);
  };

  // Xử lý xóa đánh giá
  const handleDelete = (index) => {
    if (reviewList[index].author !== currentUser) {
      alert('Bạn chỉ có thể xóa đánh giá của chính mình!');
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      const updatedReviews = reviewList.filter((_, i) => i !== index);
      setReviewList(updatedReviews);
      // Không hiện lại form vì mỗi người dùng chỉ được viết 1 đánh giá
      // Nhưng form sẽ tự động hiển thị lại do useEffect kiểm tra userHasReviewed
    }
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (index) => {
    if (reviewList[index].author !== currentUser) {
      alert('Bạn chỉ có thể chỉnh sửa đánh giá của chính mình!');
      return;
    }
    const review = reviewList[index];
    setEditIndex(index);
    setEditRating(review.rating);
    setEditComment(review.content);
    setIsFormVisible(true);
  };

  // Xử lý cập nhật đánh giá
  const handleUpdate = (e) => {
    e.preventDefault();
    if (editRating === 0 || editComment.trim() === '') {
      alert('Vui lòng chọn số sao và nhập bình luận!');
      return;
    }
    if (reviewList[editIndex].author !== currentUser) {
      alert('Bạn chỉ có thể chỉnh sửa đánh giá của chính mình!');
      return;
    }

    const updatedReviews = [...reviewList];
    updatedReviews[editIndex] = {
      ...updatedReviews[editIndex],
      rating: editRating,
      content: editComment,
      date: new Date().toLocaleDateString(), // Cập nhật ngày
    };
    setReviewList(updatedReviews);
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
    <div className="dish-reviews">
      <h3 className="dish-reviews-title">Đánh giá và Bài viết</h3>

      {/* Form đánh giá */}
      {isFormVisible && (
        <form onSubmit={editIndex !== null ? handleUpdate : handleSubmit} className="review-form">
          <div className="star-input">
            <label>Đánh giá: </label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || (editIndex !== null ? editRating : rating)) ? 'filled' : ''}`}
                  onClick={() => (editIndex !== null ? setEditRating(star) : setRating(star))}
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
              value={editIndex !== null ? editComment : comment}
              onChange={(e) => (editIndex !== null ? setEditComment(e.target.value) : setComment(e.target.value))}
              rows="4"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editIndex !== null ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
            </button>
            {editIndex !== null && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                Hủy
              </button>
            )}
          </div>
        </form>
      )}

      {/* Danh sách đánh giá */}
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
                {review.author === currentUser && (
                  <div className="review-actions">
                    <button className="edit-btn" onClick={() => handleEdit(index)}>
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>
                      Xóa
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DishReviews;
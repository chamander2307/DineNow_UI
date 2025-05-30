import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { filterMenuItems } from "../../services/menuItemService";
import DishCard from "../../components/Dish/DishCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import "../../assets/styles/Dish/AllDishes.css";

const AllDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalItems, setTotalItems] = useState(0); // Tổng số món ăn
  const itemsPerPage = 20; // Số món mỗi trang
  const location = useLocation();

  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams(location.search);
        const filterData = {
          city: params.get("city") || "",
          district: params.get("district") || "",
          mainCategoryId: params.get("mainCategoryId") || "",
          restaurantTypeId: params.get("restaurantTypeId") || "",
          minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
          maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
        };

        const response = await filterMenuItems(filterData, currentPage, itemsPerPage);
        const dishesData = Array.isArray(response.data) ? response.data : [];
        setDishes(dishesData);
        setTotalItems(response.totalItems || dishesData.length); // Giả sử API trả về totalItems
        console.log("Dishes data in AllDishes:", dishesData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
        setError("Không tìm thấy món ăn phù hợp.");
      } finally {
        setLoading(false);
      }
    };
    loadDishes();
  }, [location.search, currentPage]); // Thêm currentPage vào dependencies

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <FilterBar />
      <div className="ad-page">
        <div className="ad-section-header center"></div>
        {error && <div className="ad-error-message">{error}</div>}
        {loading ? (
          <p className="ad-loading">Đang tải...</p>
        ) : dishes.length === 0 ? (
          <p className="ad-no-results">Không tìm thấy món ăn.</p>
        ) : (
          <>
            <div className="ad-dishes-grid">
              {dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  restaurantId={dish.restaurantId || null}
                />
              ))}
            </div>
            {/* Phân trang */}
            <div className="rl-pagination">
              <button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trang trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index ? "active" : ""}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Trang sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllDishes;
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchMenuItems, filterMenuItems } from "../../services/menuItemService";
import DishCard from "../../components/Dish/DishCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import "../../assets/styles/Dish/AllDishes.css";

const AllDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  const location = useLocation();

  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams(location.search);
        const filterData = {
          city: params.get("city") || "",
          mainCategoryId: params.get("mainCategoryId") || "",
          restaurantTypeId: params.get("restaurantTypeId") || "",
          minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
          maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
        };

        // Kiểm tra có bộ lọc nào không
        const hasFilters = Object.values(filterData).some(
          (value) => value !== "" && value !== undefined
        );

        let response;
        if (hasFilters) {
          response = await filterMenuItems({
            ...filterData,
            page: currentPage,
            size: itemsPerPage,
          });
        } else {
          response = await fetchMenuItems(currentPage, itemsPerPage);
        }

        // Log để debug
        console.log("API response:", response);

        // Xử lý phản hồi
        let dishesData, totalItems;
        if (hasFilters) {
          // filterMenuItems trả về { data: [] } hoặc { data: { content: [], totalElements: number } }
          if (Array.isArray(response.data)) {
            dishesData = response.data;
            totalItems = dishesData.length; // Tạm thời, cần backend thêm totalElements
          } else {
            dishesData = Array.isArray(response.data?.content) ? response.data.content : [];
            totalItems = response.data?.totalElements || dishesData.length;
          }
        } else {
          // fetchMenuItems trả về { data: { content: [], totalElements: number } }
          dishesData = Array.isArray(response.data?.content) ? response.data.content : [];
          totalItems = response.data?.totalElements || dishesData.length;
        }

        console.log("Dishes data:", dishesData);
        setDishes(dishesData);
        setTotalItems(totalItems);

      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
        console.error("Error response:", error.response?.data);
        setError("Không tìm thấy món ăn phù hợp.");
      } finally {
        setLoading(false);
      }
    };
    loadDishes();
  }, [location.search, currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons);

    if (end - start < maxButtons) {
      start = Math.max(0, end - maxButtons);
    }

    return Array.from({ length: end - start }, (_, index) => start + index).map((page) => (
      <button
        key={page}
        className={currentPage === page ? "active" : ""}
        onClick={() => handlePageChange(page)}
      >
        {page + 1}
      </button>
    ));
  };

  return (
    <div className="all-dishes-container">
      <FilterBar />
      <div className="ad-page">
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
            {totalPages > 1 && (
              <div className="rl-pagination">
                <button
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trang trước
                </button>
                {renderPaginationButtons()}
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllDishes;
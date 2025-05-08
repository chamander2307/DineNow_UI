import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import {
  fetchOwnerReservations,
  updateReservationStatus,
} from "../../services/reservationService";

const OwnerReservationList = () => {
  const [restaurantList, setRestaurantList] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOwnerRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadReservations(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const loadOwnerRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const data = Array.isArray(res) ? res : [];
      setRestaurantList(data);
      if (data.length > 0) setSelectedRestaurantId(data[0].id);
    } catch (err) {
      console.error("Lỗi tải danh sách nhà hàng", err);
    }
  };

  const loadReservations = async (restaurantId) => {
    try {
      const res = await fetchOwnerReservations(restaurantId);
      setReservations(res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách đặt bàn", err);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển sang trạng thái "${newStatus}"?`)) return;
    try {
      await updateReservationStatus(reservationId, newStatus);
      setMessage("Cập nhật thành công");
      loadReservations(selectedRestaurantId);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái", err);
      setMessage("Cập nhật thất bại");
    }
  };

  return (
    <OwnerLayout>
      <div className="owner-reservation-list">
        <h2>Quản lý đặt bàn</h2>

        <select
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
        >
          {restaurantList.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {message && <p>{message}</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.customerName}</td>
                <td>{r.reservationTime}</td>
                <td>{r.note}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === "PENDING" && (
                    <>
                      <button onClick={() => handleStatusChange(r.id, "ACCEPTED")}>Duyệt</button>
                      <button onClick={() => handleStatusChange(r.id, "REJECTED")}>Từ chối</button>
                    </>
                  )}
                  {r.status === "ACCEPTED" && (
                    <button onClick={() => handleStatusChange(r.id, "COMPLETED")}>Hoàn tất</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OwnerLayout>
  );
};

export default OwnerReservationList;

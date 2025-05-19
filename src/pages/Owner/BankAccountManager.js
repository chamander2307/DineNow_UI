import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { getBankAccount, createBankAccount, updateBankAccount } from "../../services/bankAccountService";
import "../../assets/styles/owner/MenuItem.css";

Modal.setAppElement("#root");

const BankAccountManager = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBankAccount();
  }, []);

  const loadBankAccount = async () => {
    setLoading(true);
    try {
      const res = await getBankAccount();
      if (res?.data) {
        setBankAccount(res.data);
      }
    } catch (err) {
      toast.error("Không thể tải thông tin tài khoản: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      accountHolderName: bankAccount?.accountHolderName || "",
      accountNumber: bankAccount?.accountNumber || "",
      bankName: bankAccount?.bankName || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.accountHolderName || !formData.accountNumber || !formData.bankName) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    try {
      if (bankAccount) {
        const res = await updateBankAccount(formData);
        toast.success("Cập nhật tài khoản thành công!");
        setBankAccount(res.data);
      } else {
        const res = await createBankAccount(formData);
        toast.success("Tạo tài khoản thành công!");
        setBankAccount(res);
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Lỗi khi lưu tài khoản: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="menu-manager-header">
        <h2>Quản lý Tài khoản Ngân hàng</h2>
        {!bankAccount && (
          <button
            className="btn-create"
            onClick={() => {
              setFormData({ accountHolderName: "", accountNumber: "", bankName: "" });
              setShowModal(true);
            }}
            disabled={loading}
          >
            + Tạo tài khoản
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
          <span>Đang tải...</span>
        </div>
      ) : !bankAccount ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Chưa có tài khoản ngân hàng.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên chủ tài khoản</th>
              <th>Số tài khoản</th>
              <th>Ngân hàng</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bankAccount.accountHolderName}</td>
              <td>{bankAccount.accountNumber}</td>
              <td>{bankAccount.bankName}</td>
              <td>{new Date(bankAccount.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={handleEdit}>Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
        >
          <div className="modal-header">
            <h2>{bankAccount ? "Sửa tài khoản" : "Tạo tài khoản"}</h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-content">
            <div className="form-group">
              <label>Tên chủ tài khoản</label>
              <input
                className="form-input"
                name="accountHolderName"
                placeholder="Nhập tên chủ tài khoản"
                value={formData.accountHolderName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số tài khoản</label>
              <input
                className="form-input"
                name="accountNumber"
                placeholder="Nhập số tài khoản"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tên ngân hàng</label>
              <input
                className="form-input"
                name="bankName"
                placeholder="Nhập tên ngân hàng"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Đang xử lý..." : "Lưu"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}
    </OwnerLayout>
  );
};

export default BankAccountManager;
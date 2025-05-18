import axios from '../config/axios';

export const OwnerDashboard = async () => {
    try {
        const response = await axios.get(`/api/owner/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin dashboard:", error);
        throw error;
    }
};
//y thông tin dashboard của admin
export const AdminDashboard = async () => {
    try {
        const response = await axios.get(`/api/admin/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin dashboard:", error);
        throw error;
    }
}
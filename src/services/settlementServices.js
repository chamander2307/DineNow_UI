import axios from "../config/axios";

//Lấy danh sách tất cả nhà hàng cần tất toán
export const fetchAllSettlements = async () => {
  try {
    const res = await axios.get('/api/admin/settlement/unsettled');
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất toán:", error);
    throw error;
  }
};
//Lấy chi tiết tất toán
export const fetchSettlementsDetails = async (settlementId) => {
  try {
    const res = await axios.get(`/api/admin/settlement/summary/${settlementId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tất toán:", error);
    throw error;
  }
};
//tạo thông tin đã thanh toán cho nhà hàng
export const createSettlements = async (settlementData)=>{
    try{
        const res=await axios.post('/api/admin/settment/confirm', settlementData);
        return res.data;
    }catch(error){
        console.error("Lỗi khi tạo thông tin thanh toán:", error);
        throw error;
    }
}
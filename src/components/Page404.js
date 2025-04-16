import React from 'react';
import '../assets/styles/Page404.css'; // Nhập file CSS cho trang 404

const Page404 = () => {
  return (
    <section className="page-404">
      <div className="container">
        <div className="row">
          <div className="col">
            {/* Hình nền 404 */}
            <div className="four-zero-four-bg">
              <h1 className="text-center">404</h1>
            </div>
            {/* Nội dung thông báo */}
            <div className="content-box-404">
              <h3 className="h2">Có vẻ như bạn đã bị lạc</h3>
              <p>Trang bạn đang tìm kiếm không có sẵn!</p>
              <a href="/" className="link-404">
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page404; // Xuất thành phần Page404 để sử dụng ở nơi khác
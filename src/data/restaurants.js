import restaurant1 from "../assets/img/restaurant1.jpg";
import restaurant2 from "../assets/img/restaurant2.jpg";
import restaurant3 from "../assets/img/restaurant3.jpg";

import lau from "../assets/img/lau.png";
import nuong from "../assets/img/nuong.png";
import han from "../assets/img/han.png";
import chay from "../assets/img/chay.png";
import nhat from "../assets/img/nhat.png";
import quannhau from "../assets/img/quannhau.png";

export const restaurants = [
  {
    id: 1,
    name: "Nhà hàng Hàn Quốc",
    image: restaurant1,
    images: [restaurant1, restaurant2, restaurant3], // 👈 slider ảnh nhà hàng
    location: "TP. HCM",
    style: "Lẩu - Nướng",
    address: "123 Đường Ẩm Thực",
    visits: 25412,
    rating: 4.5,
    menuItems: [
      {
        id: "m1",
        name: "Lẩu Bulgogi",
        price: 99000,
        image: lau,
        category: "Cơm",
        rating: 4.5,
      },
      {
        id: "m2",
        name: "Thịt nướng BBQ",
        price: 129000,
        image: nuong,
        category: "Món thêm",
        rating: 4.8,
      },
      {
        id: "m3",
        name: "Canh rong biển",
        price: 49000,
        image: han,
        category: "Canh",
        rating: 8.7,
      },
    ],
    reviews: [
      { user: "Nguyễn Văn A", comment: "Rất ngon, đáng thử!", rating: 5 },
      { user: "Lê Minh", comment: "Không gian ổn", rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Ẩm thực Chay & Nhật",
    image: restaurant2,
    images: [restaurant2, restaurant3, restaurant1],
    location: "Hà Nội",
    style: "Chay - Nhật",
    address: "456 Phố Cổ",
    visits: 17230,
    rating: 4.3,
    menuItems: [
      {
        id: "m4",
        name: "Cơm chay thập cẩm",
        price: 79000,
        image: chay,
        category: "Cơm",
        rating: 4.6,
      },
      {
        id: "m5",
        name: "Sushi Nhật",
        price: 89000,
        image: nhat,
        category: "Món thêm",
        rating: 4.4,
      },
      {
        id: "m6",
        name: "Gỏi rong biển",
        price: 55000,
        image: quannhau,
        category: "Món thêm",
        rating: 4.1,
      },
    ],
    reviews: [
      { user: "Trần Văn B", comment: "Sạch sẽ, nhẹ nhàng", rating: 5 },
    ],
  },
];

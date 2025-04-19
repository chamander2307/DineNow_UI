  import React, { useEffect, useState } from 'react';
  import { useParams } from 'react-router-dom';
  import DishReviews from '../../components/Dish/DishReviews';
  import '../../assets/styles/DishDetail.css';

  import restaurant1 from '../../assets/img/restaurant1.jpg';
  // Dữ liệu giả lập (thay thế bằng API thực tế nếu có)
  const mockDishes = [
    {
      id: '1',
      name: 'Lẩu',
      image: restaurant1,
      description: 'Món lẩu thơm ngon với nước dùng đậm đà, rau tươi và thịt mềm.',
      price: 99000,
      reviews: [
        {
          author: 'Nguyễn Văn A',
          date: '2025-04-10',
          content: 'Lẩu rất ngon, nước dùng đậm đà, rất đáng thử!',
          rating: 5,
        },
      ],
    },
    {
      id: '4',
      name: 'Cơm Thố Heo Giòn Teriyaki',
      image: restaurant1,
      description: 'Cơm thố với thịt heo giòn sốt Teriyaki đậm đà, kèm rau củ tươi ngon.',
      price: 99000,
      reviews: [
        {
          author: 'Nguyễn Văn A',
          date: '2025-04-15',
          content: 'Thịt heo giòn rụm, sốt Teriyaki rất ngon!',
          rating: 4,
        },
        {
          author: 'Trần Thị B',
          date: '2025-04-16',
          content: 'Món ăn đẹp mắt, giá hơi cao nhưng đáng thử.',
          rating: 4,
        },
      ],
    },
    {
      id: '5',
      name: 'Cơm Thố Gà + Ốp La',
      image: restaurant1,
      description: 'Cơm thố nóng hổi với gà mềm và trứng ốp la béo ngậy.',
      price: 37000,
      reviews: [
        {
          author: 'Lê Văn C',
          date: '2025-04-14',
          content: 'Món ăn đơn giản nhưng rất ngon, giá hợp lý.',
          rating: 3,
        },
      ],
    },
    {
      id: '9',
      name: 'Canh chua',
      image: restaurant1,
      description: 'Canh chua nấu với cá và rau củ, vị chua thanh mát.',
      price: 11000,
      reviews: [
        {
          author: 'Lê Thị G',
          date: '2025-04-10',
          content: 'Canh chua ngon, vị vừa miệng, giá rẻ.',
          rating: 4,
        },
      ],
    },
    {
      id: '12',
      name: 'Sushi',
      image: restaurant1,
      description: 'Sushi tươi ngon với các loại cá và cơm dẻo, chuẩn vị Nhật Bản.',
      price: 37000,
      reviews: [
        {
          author: 'Phạm Thị D',
          date: '2025-04-13',
          content: 'Sushi rất tươi, giá cả hợp lý!',
          rating: 5,
        },
      ],
    },
  ];

  const DishDetail = () => {
    const { id } = useParams();
    const [dish, setDish] = useState(null);

    useEffect(() => {
      const foundDish = mockDishes.find((dish) => dish.id === id);
      setDish(foundDish);
    }, [id]);

    if (!dish) {
      return <div>Đang tải...</div>;
    }

    return (
      <div className="dish-detail">
        <h1 className="dish-title">{dish.name}</h1>
        <div className="dish-content">
          <img src={dish.image} alt={dish.name} className="dish-images" />
          <div className="dish-info">
            <p className="dish-description">{dish.description}</p>
            <p className="dish-price">Giá: {dish.price.toLocaleString('vi-VN')} VNĐ</p>
          </div>
        </div>
        <DishReviews reviews={dish.reviews} />
      </div>
    );
  };

  export default DishDetail;
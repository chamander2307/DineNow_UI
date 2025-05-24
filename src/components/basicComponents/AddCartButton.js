import React, { useState } from 'react';
import { createOrder } from '../../services/orderService';
import './QuantityControl.css';

const QuantityControl = ({ restaurantId, menuItemId }) => {
  const [quantity, setQuantity] = useState(1);

  const onIncrease = async () => {
    try {
      await createOrder(restaurantId, { menuItemId, quantity: quantity + 1 });
      setQuantity(quantity + 1);
    } catch (error) {
      console.error("Lỗi thêm món vào giỏ:", error);
    }
  };

  const onDecrease = async () => {
    if (quantity > 1) {
      try {
        await createOrder(restaurantId, { menuItemId, quantity: quantity - 1 });
        setQuantity(quantity - 1);
      } catch (error) {
        console.error("Lỗi giảm số lượng:", error);
      }
    }
  };

  return (
    <div className="quantity-control">
      <button className="remove-btn" onClick={onDecrease}>−</button>
      <span className="item-quantity">{quantity}</span>
      <button className="add-btn" onClick={onIncrease}>+</button>
    </div>
  );
};

export default QuantityControl;
  
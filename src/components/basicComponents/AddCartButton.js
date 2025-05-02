
import React from 'react';
import './QuantityControl.css';

const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="quantity-control">
      <button className="remove-btn" onClick={onDecrease}>
        −
      </button>
      <span className="item-quantity">{quantity}</span>
      <button className="add-btn" onClick={onIncrease}>
        +
      </button>
    </div>
  );
};

export default QuantityControl;
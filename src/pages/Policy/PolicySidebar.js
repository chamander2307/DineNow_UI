import React, { useState } from 'react';

const sections = {
  'Thông Tin Chung': [
    'Chính sách DineNow',
    'Tài khoản người dùng',
    'Mua sắm an toàn',
    'Ứng dụng DineNow',
    'Khác',
    'Hướng dẫn chung',
  ],
  'Đặt Bàn & Ưu Đãi': ['Ưu đãi thành viên', 'Mã giảm giá'],
  'Thanh Toán': ['Phương thức thanh toán', 'Bảo mật thanh toán'],
};

const PolicySidebar = ({ selected, onSelect }) => {
  const [expanded, setExpanded] = useState('Thông Tin Chung');

  return (
    <div className="policy-sidebar">
      {Object.entries(sections).map(([group, items]) => (
        <div key={group} className="policy-group">
          <div
            className="policy-group-title"
            onClick={() => setExpanded(group === expanded ? '' : group)}
          >
            {group}
          </div>
          {expanded === group && (
            <ul>
              {items.map((item) => (
                <li
                  key={item}
                  className={selected === item ? 'active' : ''}
                  onClick={() => onSelect(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PolicySidebar;

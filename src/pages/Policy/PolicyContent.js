// src/pages/Policy/PolicyContent.js
import React from 'react';
import policies from '../../data/policies';

const PolicyContent = ({ selectedKey }) => {
  const policy = policies[selectedKey];

  if (!policy) {
    return <p>Vui lòng chọn một mục bên trái để xem nội dung.</p>;
  }

  return (
    <div className="policy-content">
      <h1>{policy.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: policy.content }} />
    </div>
  );
};

export default PolicyContent;

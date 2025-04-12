// src/pages/Policy/PolicyPage.js
import React, { useState } from 'react';
import PolicySidebar from './PolicySidebar';
import PolicyContent from './PolicyContent';
import './Policy.css';

const PolicyPage = () => {
  const [selectedKey, setSelectedKey] = useState('chinh-sach-dinenow');

  return (
    <div className="policy-layout">
      <aside className="policy-sidebar">
        <PolicySidebar selectedKey={selectedKey} onSelect={setSelectedKey} />
      </aside>
      <section className="policy-content">
        <PolicyContent selectedKey={selectedKey} />
      </section>
    </div>
  );
};

export default PolicyPage;

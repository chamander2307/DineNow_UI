// src/components/MonthPicker.js
import React, { useState } from "react";
import '../../assets/styles/owner/OwnerRevenueDashboard.css';
const MonthPicker = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value.year);
  const [selectedMonth, setSelectedMonth] = useState(value.month);

  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const handleSelect = () => {
    onChange({ year: selectedYear, month: selectedMonth });
    setIsOpen(false);
  };

  const handlePrevYear = () => setSelectedYear(selectedYear - 1);
  const handleNextYear = () => setSelectedYear(selectedYear + 1);

  return (
    <div className="month-picker-wrapper">
      <input
        type="text"
        value={`${months[selectedMonth - 1]} ${selectedYear}`}
        onClick={() => !disabled && setIsOpen(true)}
        readOnly
        disabled={disabled}
        className="form-input month-picker-input"
      />
      {isOpen && (
        <>
          <div className="month-picker-backdrop" onClick={() => setIsOpen(false)} />
          <div className="month-picker-modal">
            <div className="month-picker-header">
              <button className="year-nav-btn" onClick={handlePrevYear}>&lt;</button>
              <span className="year-display">{selectedYear}</span>
              <button className="year-nav-btn" onClick={handleNextYear}>&gt;</button>
            </div>
            <div className="month-picker-grid">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`month-btn ${selectedMonth === index + 1 ? "selected" : ""}`}
                  onClick={() => setSelectedMonth(index + 1)}
                >
                  {month}
                </button>
              ))}
            </div>
            <div className="month-picker-footer">
              <button className="select-btn" onClick={handleSelect}>Chọn</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthPicker;
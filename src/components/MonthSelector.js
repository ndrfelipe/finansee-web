import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MonthSelector = ({ currentMonth, onPrevious, onNext }) => {
  return (
    <div className="month-selector-container">
      <button onClick={onPrevious} className="month-nav-button">
        <FaChevronLeft />
      </button>
      <span className="current-month-display">
        {currentMonth}
      </span>
      <button onClick={onNext} className="month-nav-button">
        <FaChevronRight />
      </button>
    </div>
  );
};

export default MonthSelector;
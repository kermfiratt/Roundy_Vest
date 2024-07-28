import React from 'react';
import './Popup.css';

const Popup = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  const handleInvestClick = () => {
    window.location.href = 'https://www.getmidas.com/'; // Replace with actual URL
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p>Do you want to round the cost and invest?</p>
        <button onClick={handleInvestClick}>Invest</button>
      </div>
    </div>
  );
};

export default Popup;

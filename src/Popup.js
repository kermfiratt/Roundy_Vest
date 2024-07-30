import React, { useState } from 'react';
import './Popup.css';

const Popup = ({ show, onClose, price, roundedPrice, investmentAmount }) => {
  const [showSecondPopup, setShowSecondPopup] = useState(false);

  const handleInvestClick = () => {
    setShowSecondPopup(true);
  };

  const handleProceedClick = () => {
    window.open('https://www.getmidas.com', '_blank'); // Replace with the actual URL
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="popup">
        <div className="popup-content">
          <span className="close" onClick={onClose}>&times;</span>
          <p>The item costs ${price.toFixed(2)}. Do you want to round it up to ${roundedPrice.toFixed(2)} and invest the difference of ${investmentAmount.toFixed(2)}?</p>
          <button id="invest-button" onClick={handleInvestClick}>Invest</button>
          <button id="no-button" onClick={onClose}>No</button>
        </div>
      </div>
      {showSecondPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowSecondPopup(false)}>&times;</span>
            <p>You are about to invest ${investmentAmount.toFixed(2)}. Do you want to proceed?</p>
            <button id="proceed-button" onClick={handleProceedClick}>Proceed</button>
            <button id="cancel-button" onClick={() => setShowSecondPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;

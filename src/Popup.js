import React, { useState } from 'react';
import './Popup.css';

const Popup = ({ show, onClose, price, roundedPrice, investmentAmount, category }) => {
  const [showSummary, setShowSummary] = useState(false);

  const handleInvestClick = () => {
    setShowSummary(true);
  };

  const handleProceedClick = () => {
    chrome.runtime.sendMessage({ action: 'showInvestPage', investmentAmount, category }, function(response) {
      console.log("Invest page response:", response);
    });
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        {!showSummary ? (
          <>
            <p>The item costs ${price.toFixed(2)}. Do you want to round it up to ${roundedPrice.toFixed(2)} and invest the difference of ${investmentAmount.toFixed(2)}?</p>
            <button id="invest-button" onClick={handleInvestClick}>Invest</button>
            <button id="no-button" onClick={onClose}>No</button>
          </>
        ) : (
          <>
            <p>You are about to invest ${investmentAmount.toFixed(2)} in {category} stock. Do you want to proceed?</p>
            <button id="proceed-button" onClick={handleProceedClick}>Proceed</button>
            <button id="cancel-button" onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;

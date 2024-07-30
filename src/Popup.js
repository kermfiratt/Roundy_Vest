import React, { useState } from 'react';
import './Popup.css';

const Popup = ({ show, onClose, price, roundedPrice, investmentAmount }) => {
  const [showSecondPopup, setShowSecondPopup] = useState(false);

  const handleInvestClick = () => {
    setShowSecondPopup(true);
  };

  const handleSecondPopupClose = () => {
    setShowSecondPopup(false);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      {!showSecondPopup ? (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={onClose}>&times;</span>
            <p>The item costs ${price.toFixed(2)}. Do you want to round it up to ${roundedPrice.toFixed(2)} and invest the difference of ${investmentAmount.toFixed(2)}?</p>
            <button id="invest-button" onClick={handleInvestClick}>Invest</button>
            <button id="no-button" onClick={onClose}>No</button>
          </div>
        </div>
      ) : (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleSecondPopupClose}>&times;</span>
            <p>Do you want to buy an Apple stock with the rounded amount of ${investmentAmount.toFixed(2)}?</p>
            <p>Current Apple stock price: $150.00</p> {/* Replace with actual stock price */}
            <p>You can buy approximately {(investmentAmount / 150).toFixed(3)} shares of Apple stock.</p>
            <button id="confirm-invest-button" onClick={() => window.open('https://www.getmidas.com', '_blank')}>Confirm</button>
            <button id="cancel-invest-button" onClick={handleSecondPopupClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;

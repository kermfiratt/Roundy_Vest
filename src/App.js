import React from 'react';
import Popup from './Popup';

const App = ({ showPopup, setShowPopup, price, roundedPrice, investmentAmount }) => {
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && <Popup show={showPopup} onClose={handleClosePopup} price={price} roundedPrice={roundedPrice} investmentAmount={investmentAmount} />}
    </div>
  );
};

export default App;

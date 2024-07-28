import React from 'react';
import Popup from './Popup';

const App = ({ showPopup, setShowPopup }) => {
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && <Popup show={showPopup} onClose={handleClosePopup} />}
    </div>
  );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function Main() {
  const [showPopup, setShowPopup] = React.useState(false);

  React.useEffect(() => {
    console.log("Main component mounted");
    chrome.runtime.onMessage.addListener((message) => {
      console.log("Message received in React:", message);
      if (message.action === 'displayPopup') {
        setShowPopup(true);
      }
    });
  }, []);

  return (
    <div>
      <App showPopup={showPopup} setShowPopup={setShowPopup} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

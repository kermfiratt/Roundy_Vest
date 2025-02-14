import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function Main() {
  const [showPopup, setShowPopup] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [roundedPrice, setRoundedPrice] = React.useState(0);
  const [investmentAmount, setInvestmentAmount] = React.useState(0);

  React.useEffect(() => {
    console.log("Main component mounted");
    chrome.runtime.onMessage.addListener((message) => {
      console.log("Message received in React:", message);
      if (message.action === 'displayPopup') {
        setPrice(message.price);
        setRoundedPrice(message.roundedPrice);
        setInvestmentAmount(message.investmentAmount);
        setShowPopup(true);
      }
    });
  }, []);

  return (
    <div>
      <App showPopup={showPopup} setShowPopup={setShowPopup} price={price} roundedPrice={roundedPrice} investmentAmount={investmentAmount} />
    </div>
  );
}

// Updated React 18 rendering method
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Main />);

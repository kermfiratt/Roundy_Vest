chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayPopup') {
    console.log('Displaying popup from background script');
    chrome.tabs.sendMessage(sender.tab.id, { action: 'displayPopup', price: message.price, roundedPrice: message.roundedPrice, investmentAmount: message.investmentAmount, category: message.category }, function(response) {
      console.log('Popup display response:', response);
    });
  } else if (message.action === 'showInvestPage') {
    let url = 'https://www.getmidas.com';
    if (message.category === 'shoes') {
      url = 'https://www.getmidas.com/shoes-stock';
    } else if (message.category === 'clothing') {
      url = 'https://www.getmidas.com/clothing-stock';
    } else if (message.category === 'electronics') {
      url = 'https://www.getmidas.com/canli-borsa/miatk-hisse/';
    } else if (message.category === 'cosmetics') {
      url = 'https://www.getmidas.com/cosmetics-stock';
    }
    console.log('Opening investment page:', url);
    chrome.tabs.create({ url: url });
    sendResponse({ status: 'Investment page opened' });
  }
});

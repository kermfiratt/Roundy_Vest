chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayPopup') {
    console.log('Displaying popup from background script');
    chrome.tabs.sendMessage(sender.tab.id, { action: 'displayPopup', price: message.price, roundedPrice: message.roundedPrice, investmentAmount: message.investmentAmount }, function(response) {
      console.log('Popup display response:', response);
    });
  } else if (message.action === 'showInvestPage') {
    console.log('Opening investment page');
    chrome.tabs.create({ url: 'https://www.getmidas.com' });
    sendResponse({ status: 'Investment page opened' });
  }
});

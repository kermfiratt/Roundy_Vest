chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayPopup') {
    console.log('Displaying popup from background script');
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'displayPopup',
      price: message.price,
      roundedPrice: message.roundedPrice,
      investmentAmount: message.investmentAmount
    }, function(response) {
      console.log('Popup display response:', response);
    });
  } else if (message.action === 'showInvestPage') {
    let url = 'https://robinhood.com/us/en/invest/';
    
       //    if (message.investmentAmount) {
      //   url += `/invest?amount=${message.investmentAmount}`;   (TO ADD THE AMOUNT TO URL IN THE FUTURE)
     //    }

    console.log('Opening investment page:', url);
    chrome.tabs.create({ url: url });
    sendResponse({ status: 'Investment page opened' });
  } else if (message.action === 'setLastTotalPrice') {
    chrome.storage.local.set({ lastTotalPrice: message.data }, function() {
      console.log('Total price saved to local storage from background script');
      sendResponse({ status: 'Total price saved' });
    });
    return true; // Indicate that we will respond asynchronously
  } else if (message.action === 'getLastTotalPrice') {
    chrome.storage.local.get(['lastTotalPrice'], function(result) {
      sendResponse({ lastTotalPrice: result.lastTotalPrice });
    });
    return true; // Indicate that we will respond asynchronously
  }
});



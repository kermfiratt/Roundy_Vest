// Function to store the eBay OAuth token when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  const ebayToken = 'v^1.1#i^1#f^0#r^0#I^3#p^3#t^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';  // Replace this with the actual eBay OAuth token
  chrome.storage.local.set({ ebayToken }, function() {
    console.log('eBay OAuth token stored successfully.');
  });
});

// Listener to handle messages from content.js or other parts of the extension
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
    
    console.log('Opening investment page:', url);
    chrome.tabs.create({ url: url });
    sendResponse({ status: 'Investment page opened' });
    
  } else if (message.action === 'setLastTotalPrice') {
    chrome.storage.local.set({ lastTotalPrice: message.data }, function() {
      console.log('Total price saved to local storage from background script');
      sendResponse({ status: 'Total price saved' });
    });
    return true;  // Indicates asynchronous response
  } else if (message.action === 'getLastTotalPrice') {
    chrome.storage.local.get(['lastTotalPrice'], function(result) {
      sendResponse({ lastTotalPrice: result.lastTotalPrice });
    });
    return true;  // Indicates asynchronous response
  } else if (message.action === 'getEbayToken') {
    // Retrieve eBay OAuth token from storage and send it to content.js
    chrome.storage.local.get(['ebayToken'], function(result) {
      if (result.ebayToken) {
        sendResponse({ token: result.ebayToken });
      } else {
        console.error('eBay OAuth token not found');
        sendResponse({ error: 'eBay OAuth token not found' });
      }
    });
    return true;  // Indicates asynchronous response
  }
});

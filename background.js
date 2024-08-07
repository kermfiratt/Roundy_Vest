chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayPopup') {
    console.log('Displaying popup from background script');
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'displayPopup',
      price: message.price,
      roundedPrice: message.roundedPrice,
      investmentAmount: message.investmentAmount
    }, (response) => {
      console.log('Popup display response:', response);
    });
  } else if (message.action === 'showInvestPage') {
    let url = 'https://www.getmidas.com';
    if (message.category === 'shoes') {
      url = 'https://www.getmidas.com/shoes-stock';
    } else if (message.category === 'clothing') {
      url = 'https://www.getmidas.com/clothing-stock';
    } else if (message.category === 'electronics') {
      url = 'https://www.getmidas.com/electronics-stock';
    } else if (message.category === 'cosmetics') {
      url = 'https://www.getmidas.com/cosmetics-stock';
    }
    console.log('Opening investment page:', url);
    chrome.tabs.create({ url: url });
    sendResponse({ status: 'Investment page opened' });
  } else if (message.action === 'setLastTotalPrice') {
    chrome.storage.local.set({ lastTotalPrice: message.data }, () => {
      console.log('Total price saved to local storage from background script');
      sendResponse({ status: 'Total price saved' });
    });
    return true; // Indicate that we will respond asynchronously
  } else if (message.action === 'getLastTotalPrice') {
    chrome.storage.local.get(['lastTotalPrice'], (result) => {
      sendResponse({ lastTotalPrice: result.lastTotalPrice });
    });
    return true; // Indicate that we will respond asynchronously
  }
});

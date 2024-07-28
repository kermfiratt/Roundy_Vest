chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayPopup') {
    console.log('Displaying popup from background script');
    chrome.tabs.sendMessage(sender.tab.id, { action: 'displayPopup' }, function(response) {
      console.log('Popup display response:', response);
    });
  } else if (message.action === 'showInvestPage') {
    console.log('Opening investment page');
    chrome.tabs.create({ url: 'https://www.investmentpage.com' }); // Replace with actual URL
    sendResponse({ status: 'Investment page opened' });
  }
});

console.log("Content script loaded");

let lastTotalPrice = null;

// Check for specific URL patterns
function checkURLForActions() {
  if (window.location.href.includes("nav_cart") || window.location.href.includes("sepet")) {
    console.log("URL includes nav_cart or sepet, fetching subtotal price");
    if (window.location.href.includes("amazon")) {
      fetchSubtotalPriceAmazon();
    } else if (window.location.href.includes("trendyol")) {
      fetchSubtotalPriceTrendyol();
    }
  } else if (window.location.href.includes("from=cheetah") || window.location.href.includes("isProceedPayment=true") || window.location.href.includes("odeme")) {
    console.log("URL includes from=cheetah, displaying popup");
    displayPopupWithSavedPrice();
  }
}

checkURLForActions();

// Function to fetch subtotal price from Amazon
function fetchSubtotalPriceAmazon() {
  const subtotalElement = document.querySelector('#sc-subtotal-amount-activecart span, #sc-subtotal-amount-buybox span');
  if (subtotalElement) {
    const subtotalText = subtotalElement.textContent.trim();
    const subtotal = parseFloat(subtotalText.replace(/[^\d,]/g, '').replace(/,/g, '').replace(/\./g, ''));
    const convertedSubtotal = subtotal / 100;
    if (!isNaN(convertedSubtotal)) {
      lastTotalPrice = convertedSubtotal;
      chrome.storage.local.set({ lastTotalPrice }, function() {
        console.log(`Subtotal price saved: ${convertedSubtotal}`);
      });
    } else {
      console.log("Failed to parse subtotal price on Amazon");
    }
  } else {
    console.log("Subtotal price element not found on Amazon");
  }
}

// Function to fetch subtotal price from Trendyol
function fetchSubtotalPriceTrendyol() {
  const subtotalElement = document.querySelector('.basket-summary .total .total-price');
  if (subtotalElement) {
    const subtotalText = subtotalElement.textContent.trim();
    const subtotal = parseFloat(subtotalText.replace(/[^\d,]/g, '').replace('.', '').replace(',', '.'));
    if (!isNaN(subtotal)) {
      lastTotalPrice = subtotal;
      chrome.storage.local.set({ lastTotalPrice }, function() {
        console.log(`Subtotal price saved: ${subtotal}`);
      });
    } else {
      console.log("Failed to parse subtotal price for Trendyol");
    }
  } else {
    console.log("Subtotal price element not found on Trendyol");
  }
}

function displayPopupWithSavedPrice() {
  chrome.storage.local.get(['lastTotalPrice'], function(result) {
    if (result.lastTotalPrice) {
      const price = result.lastTotalPrice;
      let roundedPrice = 0;

      if (price <= 50) {
        roundedPrice = 100;
      } else if (price >= 75 && price < 500) {
        roundedPrice = 150;
      } else if (price >= 500 && price < 1000) {
        roundedPrice = 750;
      } else if (price >= 1000 && price < 2000) {
        roundedPrice = 1250;
      } else if (price >= 2000) {
        roundedPrice = Math.ceil(price / 1000) * 1000;
      }

      const investmentAmount = roundedPrice - price;
      console.log(`Total Price: ${price}, Rounded Price: ${roundedPrice}, Investment Amount: ${investmentAmount}`);
      chrome.runtime.sendMessage({ action: 'displayPopup', price, roundedPrice, investmentAmount }, function(response) {
        console.log("Displayed popup after navigation");
      });
    } else {
      console.log("No saved total price available to display after navigation");
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === 'displayPopup') {
    const { price, roundedPrice, investmentAmount } = message;
    if (price !== undefined && roundedPrice !== undefined && investmentAmount !== undefined) {
      const popupHTML = `
        <div class="popup">
          <div class="popup-content">
            <button class="close">&times;</button>
            <p>The total cost is $${price.toFixed(2)}. Do you want to round it up to $${roundedPrice.toFixed(2)} and invest the difference of $${investmentAmount.toFixed(2)}?</p>
            <button id="invest-button">Invest</button>
            <button id="no-button">No</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', popupHTML);
      document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.popup').remove();
      });
      document.querySelector('#invest-button').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'showInvestPage', investmentAmount }, function(response) {
          console.log("Invest page response:", response);
        });
        document.querySelector('.popup').remove();
      });
      document.querySelector('#no-button').addEventListener('click', () => {
        document.querySelector('.popup').remove();
      });
      sendResponse({ status: "Popup displayed" });
    } else {
      console.error('Price information is missing.');
    }
  }
});

chrome.storage.local.get(['lastTotalPrice'], function(result) {
  if (result.lastTotalPrice) {
    lastTotalPrice = result.lastTotalPrice;
    console.log('Restored last total price from local storage');
  }
});

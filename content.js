console.log("Content script loaded");

let lastPopupData = null;

// Check for specific URL pattern
function checkURLForRefresh() {
  if (window.location.href.includes("sw_refresh")) {
    console.log("URL includes sw_refresh, displaying popup");
    chrome.storage.local.get(['lastPopupData'], function(result) {
      if (result.lastPopupData) {
        chrome.runtime.sendMessage({ action: 'displayPopup', ...result.lastPopupData }, function(response) {
          console.log("Displayed popup after navigation");
        });
      } else {
        console.log("No popup data available to display after navigation");
      }
    });
  }
}

checkURLForRefresh();

// Event listener for the "Add to Cart" button
document.addEventListener('click', function(event) {
  console.log("Document clicked", event.target);

  const addToCartSelectors = [
    'input#add-to-cart-button',
    'button#add-to-cart-button',
    'input[name="submit.add-to-cart"]',
    'button[name="submit.add-to-cart"]',
    '.add-to-cart-button',
    '.add-to-cart',
    'button.a-button-text',
    'input.a-button-input[name="submit.addToCart"]',
    'input[name="submit.addToCart"]',
    'button[name="submit.addToCart"]',
    'input#add-to-cart-button-ubb', // Turkish add to cart button
    'input[name="submit.add-to-cart-ubb"]', // Turkish add to cart button
    'input#add-to-cart-button-ubb', // Turkish add to cart button
    'button[name="submit.add-to-cart-ubb"]', // Turkish add to cart button
    'button#add-to-cart-button-ubb', // Turkish add to cart button
  ];

  const clickedElement = event.target;
  console.log("Clicked element:", clickedElement);

  const isAddToCartButton = addToCartSelectors.some(selector => clickedElement.matches(selector));

  if (isAddToCartButton) {
    if (!clickedElement.disabled) {
      console.log("Add to Cart button clicked and is enabled");

      // Find the closest parent element that contains the price
      const parentElement = clickedElement.closest('div[data-asin], div[data-index], div.pdpContext');
      if (parentElement) {
        const priceSelectors = [
          '#priceblock_ourprice',
          '#priceblock_dealprice',
          '#priceblock_saleprice',
          '.priceBlockBuyingPriceString',
          '.a-price .a-offscreen',
          '.a-price-whole',
          '.prc-dsc' // Trendyol price
        ];

        let price = null;
        for (let selector of priceSelectors) {
          const priceElement = parentElement.querySelector(selector);
          if (priceElement) {
            const priceText = priceElement.textContent.trim();
            price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            if (!isNaN(price)) {
              break;
            }
          }
        }

        if (price !== null) {
          const roundedPrice = Math.ceil(price / 100) * 100;
          const investmentAmount = roundedPrice - price;
          console.log(`Price: ${price}, Rounded Price: ${roundedPrice}, Investment Amount: ${investmentAmount}`);

          // Detect category
          let category = 'general';
          const url = window.location.href.toLowerCase();
          const textContent = parentElement.textContent.toLowerCase();

          if (url.includes('shoe') || url.includes('sneaker') || url.includes('boot') || textContent.includes('shoe') || textContent.includes('sneaker') || textContent.includes('boot')) {
            category = 'shoes';
          } else if (url.includes('clothing') || url.includes('apparel') || url.includes('shirt') || textContent.includes('clothing') || textContent.includes('apparel') || textContent.includes('shirt')) {
            category = 'clothing';
          } else if (url.includes('keyboard') || url.includes('mouse') || url.includes('computer') || url.includes('tablet') || url.includes('phone') || url.includes('printer') || textContent.includes('keyboard') || textContent.includes('mouse') || textContent.includes('computer') || textContent.includes('tablet') || textContent.includes('phone') || textContent.includes('printer')) {
            category = 'electronics';
          } else if (url.includes('cosmetic') || url.includes('beauty') || textContent.includes('cosmetic') || textContent.includes('beauty')) {
            category = 'cosmetics';
          }

          lastPopupData = { price, roundedPrice, investmentAmount, category };

          chrome.storage.local.set({ lastPopupData }, function() {
            console.log('Popup data saved to local storage');
          });

          chrome.runtime.sendMessage({ action: 'displayPopup', price, roundedPrice, investmentAmount, category }, function(response) {
            console.log("Message response:", response);
          });
        } else {
          console.log("Price element not found or failed to parse price");
        }
      } else {
        console.log("Parent element containing price not found");
      }
    } else {
      console.log("Add to Cart button clicked but is disabled");
      observeButtonState(clickedElement);
    }
  } else {
    console.log("Clicked element is not an Add to Cart button");
  }
});


function observeButtonState(button) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'disabled' && !button.disabled) {
        console.log("Add to Cart button is now enabled");

        // Find the closest parent element that contains the price
        const parentElement = button.closest('div[data-asin], div[data-index], div.pdpContext');
        if (parentElement) {
          const priceSelectors = [
            '#priceblock_ourprice',
            '#priceblock_dealprice',
            '#priceblock_saleprice',
            '.priceBlockBuyingPriceString',
            '.a-price .a-offscreen',
            '.a-price-whole',
            '.prc-dsc' // Trendyol price
          ];

          let price = null;
          for (let selector of priceSelectors) {
            const priceElement = parentElement.querySelector(selector);
            if (priceElement) {
              const priceText = priceElement.textContent.trim();
              price = parseFloat(priceText.replace(/[^\d.]/g, ''));
              if (!isNaN(price)) {
                break;
              }
            }
          }

          if (price !== null) {
            const roundedPrice = Math.ceil(price / 100) * 100;
            const investmentAmount = roundedPrice - price;
            console.log(`Price: ${price}, Rounded Price: ${roundedPrice}, Investment Amount: ${investmentAmount}`);

            // Detect category
            let category = 'general';
            const url = window.location.href.toLowerCase();
            const textContent = parentElement.textContent.toLowerCase();

            if (url.includes('shoe') || url.includes('sneaker') || url.includes('boot') || textContent.includes('shoe') || textContent.includes('sneaker') || textContent.includes('boot')) {
              category = 'shoes';
            } else if (url.includes('clothing') || url.includes('apparel') || url.includes('shirt') || textContent.includes('clothing') || textContent.includes('apparel') || textContent.includes('shirt')) {
              category = 'clothing';
            } else if (url.includes('keyboard') || url.includes('mouse') || url.includes('computer') || url.includes('tablet') || url.includes('phone') || url.includes('printer') || textContent.includes('keyboard') || textContent.includes('mouse') || textContent.includes('computer') || textContent.includes('tablet') || textContent.includes('phone') || textContent.includes('printer')) {
              category = 'electronics';
            } else if (url.includes('cosmetic') || url.includes('beauty') || textContent.includes('cosmetic') || textContent.includes('beauty')) {
              category = 'cosmetics';
            }

            lastPopupData = { price, roundedPrice, investmentAmount, category };

            chrome.storage.local.set({ lastPopupData }, function() {
              console.log('Popup data saved to local storage');
            });

            chrome.runtime.sendMessage({ action: 'displayPopup', price, roundedPrice, investmentAmount, category }, function(response) {
              console.log("Message response:", response);
            });
          } else {
            console.log("Price element not found or failed to parse price");
          }
          observer.disconnect();
        } else {
          console.log("Parent element containing price not found");
        }
      }
    });
  });

  observer.observe(button, { attributes: true });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === 'displayPopup') {
    const { price, roundedPrice, investmentAmount, category } = message;
    lastPopupData = { price, roundedPrice, investmentAmount, category };
    if (price !== undefined && roundedPrice !== undefined && investmentAmount !== undefined) {
      const popupHTML = `
        <div class="popup">
          <div class="popup-content">
            <button class="close">&times;</button>
            <p>The item costs $${price.toFixed(2)}. Do you want to round it up to $${roundedPrice.toFixed(2)} and invest the difference of $${investmentAmount.toFixed(2)}?</p>
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
        chrome.runtime.sendMessage({ action: 'showInvestPage', category, investmentAmount }, function(response) {
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

chrome.storage.local.get(['lastPopupData'], function(result) {
  if (result.lastPopupData) {
    lastPopupData = result.lastPopupData;
    console.log('Restored popup data from local storage');
  }
});

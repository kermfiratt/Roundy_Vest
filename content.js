console.log("Content script loaded");

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
    'input[value="Sepete Ekle"]', // Turkish add to cart button
    'button[value="Sepete Ekle"]', // Turkish add to cart button
    '.add-to-basket-button-text' // Trendyol add to cart button
  ];

  const clickedElement = event.target;
  console.log("Clicked element:", clickedElement);

  const isAddToCartButton = addToCartSelectors.some(selector => clickedElement.matches(selector));

  if (isAddToCartButton) {
    if (!clickedElement.disabled) {
      console.log("Add to Cart button clicked and is enabled");

      // Handle different sites
      let price = null;
      let roundedPrice = null;
      let investmentAmount = null;

      if (window.location.hostname.includes("amazon")) {
        const parentElement = clickedElement.closest('div[data-asin], div[data-index]');
        if (parentElement) {
          const priceSelectors = [
            '#priceblock_ourprice',
            '#priceblock_dealprice',
            '#priceblock_saleprice',
            '.priceBlockBuyingPriceString',
            '.a-price .a-offscreen',
            '.a-price-whole'
          ];

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
        }
      } else if (window.location.hostname.includes("trendyol")) {
        const priceElement = document.querySelector('.prc-dsc');
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        }
      }

      if (price !== null) {
        roundedPrice = Math.ceil(price / 100) * 100;
        investmentAmount = roundedPrice - price;
        console.log(`Price: ${price}, Rounded Price: ${roundedPrice}, Investment Amount: ${investmentAmount}`);
        chrome.runtime.sendMessage({ action: 'displayPopup', price, roundedPrice, investmentAmount }, function(response) {
          console.log("Message response:", response);
        });
      } else {
        console.log("Price element not found or failed to parse price");
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

        // Handle different sites
        let price = null;
        let roundedPrice = null;
        let investmentAmount = null;

        if (window.location.hostname.includes("amazon")) {
          const parentElement = button.closest('div[data-asin], div[data-index]');
          if (parentElement) {
            const priceSelectors = [
              '#priceblock_ourprice',
              '#priceblock_dealprice',
              '#priceblock_saleprice',
              '.priceBlockBuyingPriceString',
              '.a-price .a-offscreen',
              '.a-price-whole'
            ];

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
          }
        } else if (window.location.hostname.includes("trendyol")) {
          const priceElement = document.querySelector('.prc-dsc');
          if (priceElement) {
            const priceText = priceElement.textContent.trim();
            price = parseFloat(priceText.replace(/[^\d.]/g, ''));
          }
        }

        if (price !== null) {
          roundedPrice = Math.ceil(price / 100) * 100;
          investmentAmount = roundedPrice - price;
          console.log(`Price: ${price}, Rounded Price: ${roundedPrice}, Investment Amount: ${investmentAmount}`);
          chrome.runtime.sendMessage({ action: 'displayPopup', price, roundedPrice, investmentAmount }, function(response) {
            console.log("Message response:", response);
          });
        } else {
          console.log("Price element not found or failed to parse price");
        }
        observer.disconnect();
      }
    });
  });

  observer.observe(button, { attributes: true });
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

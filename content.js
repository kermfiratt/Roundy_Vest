console.log("Content script loaded");

let lastTotalPrice = null;

// Check for specific URL patterns
function checkURLForActions() {
    if (window.location.href.includes("nav_cart") || window.location.href.includes("sepet") || window.location.href.includes("sepetim")) {
        console.log("URL includes nav_cart or sepet or sepetim, fetching subtotal price");
        if (window.location.href.includes("amazon")) {
            fetchSubtotalPriceAmazon();
        } else if (window.location.href.includes("trendyol")) {
            fetchSubtotalPriceTrendyol();
        } else if (window.location.href.includes("hepsiburada")) {
            fetchSubtotalPriceHepsiburada();
        }
    } else if (window.location.href.includes("from=cheetah") || window.location.href.includes("isProceedPayment=true") || window.location.href.includes("odeme")) {
        console.log("URL includes from=cheetah or odeme, displaying popup");
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

// Function to show the loading animation
function showLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.cssText = `
        border: 8px solid #f3f3f3;
        border-radius: 50%;
        border-top: 8px solid #3498db;
        width: 60px;
        height: 60px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
    `;

    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
}

// Function to hide the loading animation
function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
    }
}

// CSS for spinner animation (to be included directly in the content.js)
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// Function to fetch subtotal price from Trendyol
function fetchSubtotalPriceTrendyol() {
    const subtotalElement = document.querySelector('.pb-summary-box-prices');
    if (subtotalElement) {
        const subtotalText = subtotalElement.textContent.trim().split(' ')[0];
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

// Function to fetch subtotal price from Hepsiburada
function fetchSubtotalPriceHepsiburada() {
    const subtotalElement = document.querySelector('.total_price_3V-CM');
    if (subtotalElement) {
        const subtotalText = subtotalElement.textContent.trim();
        const subtotal = parseFloat(subtotalText.replace(/[^\d,]/g, '').replace('.', '').replace(',', '.'));
        if (!isNaN(subtotal)) {
            lastTotalPrice = subtotal;
            chrome.storage.local.set({ lastTotalPrice }, function() {
                console.log(`Subtotal price saved: ${subtotal}`);
            });
        } else {
            console.log("Failed to parse subtotal price for Hepsiburada");
        }
    } else {
        console.log("Subtotal price element not found on Hepsiburada");
    }
}

// Function to display the popup with the saved price
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

// Function to add the "Find the Best Deal" button
function addFindBestDealButton() {
    // Create the button element
    const bestDealButton = document.createElement('button');
    bestDealButton.innerText = 'Find the Best Deal';
    bestDealButton.id = 'best-deal-button';
    bestDealButton.style.cssText = `
        background-color: #ffa500;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

    // Append the button to the body of the page
    document.body.appendChild(bestDealButton);

    // Add an event listener to the button for clicks
    bestDealButton.addEventListener('click', function() {
        const productName = document.querySelector('#productTitle')?.innerText.trim();
        console.log('Finding the best deal for:', productName);
        showLoadingAnimation();  // Show the loading animation
        searchForBestDeal(productName);
    });
}

// Call the function to add the button
addFindBestDealButton();

// Function to search for the best deal
async function searchForBestDeal(productName) {
    try {
        const response = await fetch(`http://localhost:3000/scrape?productName=${encodeURIComponent(productName)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const bestDeal = await response.json();
        hideLoadingAnimation();  // Hide the loading animation once the best deal is found

        if (bestDeal) {
            console.log(`Best deal found on ${bestDeal.site} for $${bestDeal.price}. Link: ${bestDeal.link}`);
            displayBestDeal(bestDeal);
        } else {
            console.log('No deal found.');
        }
    } catch (error) {
        hideLoadingAnimation();  // Hide the loading animation in case of error
        console.error('Error finding the best deal:', error);
        alert('An error occurred while searching for the best deal. Please try again later.');
    }
}

// Function to display the best deal to the user
function displayBestDeal(deal) {
  const dealMessage = `
      We found a better deal on ${deal.site} for ${deal.price}!
      <a href="${deal.link}" target="_blank">Click here to buy</a>
  `;

  const dealPopup = document.createElement('div');
  dealPopup.id = 'deal-popup';
  dealPopup.style.cssText = `
      background-color: #fff;
      color: #000;
      padding: 20px;
      border-radius: 10px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 1001;
  `;
  dealPopup.innerHTML = dealMessage;

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.cssText = `
      display: block;
      margin: 20px auto 0;
      padding: 10px 20px;
      background-color: #ffa500;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
  `;

  closeButton.addEventListener('click', () => {
      document.body.removeChild(dealPopup);
  });

  dealPopup.appendChild(closeButton);
  document.body.appendChild(dealPopup);
}
console.log("Content script loaded");

let lastTotalPrice = null;

// Check for specific URL patterns
function checkURLForActions() {
    if (window.location.href.includes("nav_cart") || window.location.href.includes("sepet") || window.location.href.includes("sepetim")) {
        console.log("URL includes nav_cart or sepet, fetching subtotal price");
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
            chrome.storage.local.set({ lastTotalPrice }, () => {
                console.log(`Subtotal price saved: ${convertedSubtotal}`);
            });
        } else {
            console.log("Failed to parse subtotal price on Amazon");
        }
    } else {
        console.log("Subtotal price element not found on Amazon");
    }
}

// Function to display the popup with the saved price
function displayPopupWithSavedPrice() {
    chrome.storage.local.get(['lastTotalPrice'], (result) => {
        if (result.lastTotalPrice) {
            const price = result.lastTotalPrice;
            let roundedPrice = calculateRoundedPrice(price);
            const investmentAmount = roundedPrice - price;

            console.log(`Total Price: ${price}, Rounded Price: ${roundedPrice}, Investment Amount: ${investmentAmount}`);

            chrome.runtime.sendMessage({ action: 'displayPopup', price, roundedPrice, investmentAmount }, (response) => {
                console.log("Displayed popup after navigation");
            });
        } else {
            console.warn("No saved total price available to display after navigation");
        }
    });
}

// Helper function to calculate the rounded price
function calculateRoundedPrice(price) {
    if (price <= 50) {
        return 100;
    } else if (price >= 75 && price < 500) {
        return 150;
    } else if (price >= 500 && price < 1000) {
        return 750;
    } else if (price >= 1000 && price < 2000) {
        return 1250;
    } else if (price >= 2000) {
        return Math.ceil(price / 1000) * 1000;
    }
}

// Listener for messages to display the popup
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
                chrome.runtime.sendMessage({ action: 'showInvestPage', investmentAmount }, (response) => {
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

// Restore last saved total price from local storage
chrome.storage.local.get(['lastTotalPrice'], (result) => {
    if (result.lastTotalPrice) {
        lastTotalPrice = result.lastTotalPrice;
        console.log('Restored last total price from local storage:', lastTotalPrice);
    }
});

// Function to add the "Find the Best Deal" button to the page
function addFindBestDealButton() {
    if (!document.getElementById('best-deal-button')) {
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

        document.body.appendChild(bestDealButton);

        // On click, search for the best deal
        bestDealButton.addEventListener('click', () => {
            const productName = document.querySelector('#productTitle')?.innerText.trim();
            if (productName) {
                console.log('Finding the best deal for:', productName);
                showLoadingAnimation();  // Show loading animation
                searchForBestDeal(productName); // Search for the best deal using backend server
            } else {
                console.warn('Product name not found.');
            }
        });
    }
}

// Function to search for the best deal by sending a request to the backend server
function searchForBestDeal(productName) {
    fetch(`http://localhost:3000/search?productName=${encodeURIComponent(productName)}`)
        .then(response => response.json())
        .then(data => {
            hideLoadingAnimation();  // Hide loading animation when results are received

            if (data && data.length > 0) {
                const deals = data.flatMap(site => site.deals);
                if (deals.length > 0) {
                    const bestDeal = deals.reduce((prev, current) => (prev.price < current.price) ? prev : current);
                    displayBestDeal(bestDeal);
                } else {
                    displayNoBetterDeal();
                }
            } else {
                displayNoBetterDeal();
            }
        })
        .catch(error => {
            hideLoadingAnimation();  // Hide loading animation on error
            console.error('Error finding the best deal:', error);
            alert('An error occurred while searching for the best deal. Please try again later.');
        });
}

// Function to show loading animation
function showLoadingAnimation() {
    if (!document.getElementById('loading-overlay')) {
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
            animation: spin 2s linear infinite;
        `;

        loadingOverlay.appendChild(spinner);
        document.body.appendChild(loadingOverlay);

        // CSS for spinner animation
        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `;
        document.head.appendChild(style);
    }
}

// Function to hide the loading animation
function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
    }
}

// Function to display the best deal in a popup
function displayBestDeal(deal) {
    const dealMessage = `
        We found a better deal on ${deal.site} for $${deal.price}!
        <a href="${deal.itemUrl}" target="_blank">Click here to buy</a>
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
        z-index: 10001;
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

// Function to display a message when no better deal is found
function displayNoBetterDeal() {
    const message = `
        <p>No better deal was found on eBay, Walmart, or Best Buy.</p>
    `;

    const popup = document.createElement('div');
    popup.id = 'no-deal-popup';
    popup.style.cssText = `
        background-color: #fff;
        color: #000;
        padding: 20px;
        border-radius: 10px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 10001;
    `;
    popup.innerHTML = message;

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
        document.body.removeChild(popup);
    });

    popup.appendChild(closeButton);
    document.body.appendChild(popup);
}

// Call function to add the "Find the Best Deal" button when page loads
addFindBestDealButton();

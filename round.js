console.log("Content script loaded");

let lastTotalPrice = null;

// Check for specific URL patterns to decide actions
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

// Function to display the popup with the saved price
function displayPopupWithSavedPrice() {
    chrome.storage.local.get(['lastTotalPrice'], function(result) {
        if (result.lastTotalPrice) {
            const price = result.lastTotalPrice;
            let percent = 10; // Default to 10%
            let addedAmount = price * (percent / 100);
            let totalAmountWithInvestment = price + addedAmount;

            const popupHTML = `
                <div class="popup-overlay">
                    <div class="popup">
                        <div class="popup-content">
                            <button class="close">&times;</button>
                            <p class="popup-text">The total cost is $${price.toFixed(2)}.</p>
                            <div class="percentage-buttons">
                                <div class="button-row">
                                    <button class="percent-btn" data-percent="5">5%</button>
                                    <button class="percent-btn" data-percent="10">10%</button>
                                </div>
                                <div class="button-row">
                                    <button class="percent-btn" data-percent="20">20%</button>
                                    <input type="number" class="custom-input" id="custom-input" placeholder="Custom %" min="1" />
                                </div>
                            </div>
                            <p class="popup-text" id="added-amount">You will add: $${addedAmount.toFixed(2)} (10%)</p>
                            <p class="popup-text" id="total-with-investment">Total After Investment: $${totalAmountWithInvestment.toFixed(2)}</p>
                            <button id="invest-button">Invest</button>
                            <button id="no-button">No</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', popupHTML);

            // Close button functionality
            document.querySelector('.close').addEventListener('click', () => {
                document.querySelector('.popup-overlay').remove();
            });

            // Percentage button functionality
            document.querySelectorAll('.percent-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const selectedPercent = parseInt(this.getAttribute('data-percent'));
                    updateAddedAmount(price, selectedPercent);
                });
            });

            // Custom percentage input field handling
            document.querySelector('#custom-input').addEventListener('input', function() {
                const customPercent = parseFloat(this.value);
                if (!isNaN(customPercent)) {
                    updateAddedAmount(price, customPercent);
                }
            });

            // Default action (10%)
            updateAddedAmount(price, percent);

            // Invest button functionality
            document.querySelector('#invest-button').addEventListener('click', () => {
                const investmentAmount = addedAmount;
                chrome.runtime.sendMessage({ action: 'showInvestPage', investmentAmount }, function(response) {
                    console.log("Invest page response:", response);
                });
                document.querySelector('.popup-overlay').remove();
            });

            // No button functionality
            document.querySelector('#no-button').addEventListener('click', () => {
                document.querySelector('.popup-overlay').remove();
            });

        } else {
            console.warn("No saved total price available to display after navigation");
        }
    });
}

// Function to update the added amount and total with investment based on the selected percentage
function updateAddedAmount(price, percent) {
    const addedAmount = price * (percent / 100);
    const totalAmountWithInvestment = price + addedAmount;
    document.getElementById('added-amount').innerText = `You will add: $${addedAmount.toFixed(2)} (${percent}%)`;
    document.getElementById('total-with-investment').innerText = `Total After Investment: $${totalAmountWithInvestment.toFixed(2)}`;
}

// Restore last saved total price from local storage
chrome.storage.local.get(['lastTotalPrice'], function(result) {
    if (result.lastTotalPrice) {
        lastTotalPrice = result.lastTotalPrice;
        console.log('Restored last total price from local storage:', lastTotalPrice);
    }
});

// CSS Styles (included directly in the script)
const style = document.createElement('style');
style.innerHTML = `
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup {
        background-color: #fff;
        color: #333;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 350px;
        text-align: center;
        font-family: Arial, sans-serif;
    }
    
    .popup-content {
        position: relative;
    }

    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #333;
        font-size: 20px;
        cursor: pointer;
    }

    .popup-text {
        color: #333;
        font-size: 18px;
        margin: 15px 0;
    }

    .percentage-buttons {
        margin: 15px 0;
    }

    .button-row {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
    }

    .percent-btn {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        flex: 1;
        margin: 0 5px;
        cursor: pointer;
    }

    .percent-btn:hover {
        background-color: #0056b3;
    }

    .custom-input {
        flex: 1;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        width: 70px;
        margin: 0 5px;
        text-align: center;
    }

    #invest-button, #no-button {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 12px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        margin: 10px 0;
    }

    #invest-button:hover, #no-button:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(style);

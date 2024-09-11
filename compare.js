
// Simulated API call for testing
function searchForBestDeal(productName) {
    // Extract the first 3 words from the product name
    const firstThreeWords = productName.split(" ").slice(0, 3).join(" ");

    // Simulate a 2-second delay to mimic an API request
    setTimeout(() => {
        // Simulated "best deal" data
        const simulatedBestDeal = {
            site: 'eBay',
            itemUrl: 'https://www.ebay.com/itm/simulated-item-url',  // Simulated eBay item link
            itemName: firstThreeWords  // Use the first three words of the product name
        };

        // Hide the loading animation after the simulated response
        hideLoadingAnimation();

        // Display the simulated best deal in a popup
        displayBestDeal(simulatedBestDeal);
    }, 2000);  // 2-second delay to simulate network call
}

// Function to add the "Find the Best Deal" button to the page
function addFindBestDealButton() {
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

    // On click, search for the best deal (simulated for testing)
    bestDealButton.addEventListener('click', function() {
        const productName = document.querySelector('#productTitle')?.innerText.trim();
        console.log('Finding the best deal for:', productName);
        showLoadingAnimation();  // Show loading animation
        searchForBestDeal(productName); // Simulated best deal
    });
}

// Function to show loading animation
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
        We found a better deal on ${deal.site} for the item: ${deal.itemName}!
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
        <p>No better deal was found on eBay.</p>
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

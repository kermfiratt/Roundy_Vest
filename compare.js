// Function to search for the best deal
function searchForBestDeal(productName) {
    // Ensure productName is valid to avoid split errors
    if (!productName || typeof productName !== "string") {
        console.error("Invalid product name:", productName);
        return;
    }
    
    const firstThreeWords = productName.split(" ").slice(0, 3).join(" ");
    const productImageElement = document.querySelector('#imgTagWrapperId img') || document.querySelector('#landingImage');
    const productImage = productImageElement ? productImageElement.src : 'https://via.placeholder.com/300x300?text=No+Image+Available';

    // Show loading while searching for a deal
    showLoadingAnimation();

    // Simulating an API call to fetch the best deal from multiple websites
    setTimeout(() => {
        const simulatedBestDeal = {
            site: 'eBay',
            itemUrl: 'https://www.ebay.com/itm/simulated-item-url',
            itemName: firstThreeWords,
            itemImage: productImage,
            itemPrice: '$12.99'
        };

        // Hide loading and show the deal
        hideLoadingAnimation();
        displayBestDeal(simulatedBestDeal);
    }, 2000);
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

    // Add spinner animation
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
        <div class="popup-content">
            <h2>We found a better deal on ${deal.site}!</h2>
            <img src="${deal.itemImage}" alt="Product Image" style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px; margin-right: 20px;">
            <p><strong>Item:</strong> ${deal.itemName}</p>
            <p><strong>Price:</strong> ${deal.itemPrice}</p>
            <a href="${deal.itemUrl}" target="_blank" class="deal-link">Click here to buy</a>
        </div>
    `;

    const dealPopup = document.createElement('div');
    dealPopup.id = 'deal-popup';
    dealPopup.style.cssText = `
        background-color: #f9f9f9;
        color: #000;
        padding: 20px;
        border-radius: 10px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        width: 350px;
        text-align: center;
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
        font-size: 16px;
    `;

    closeButton.addEventListener('click', () => {
        document.body.removeChild(dealPopup);
    });

    dealPopup.appendChild(closeButton);
    document.body.appendChild(dealPopup);
}

// Attach the functions to the window object so they can be accessed globally
window.searchForBestDeal = searchForBestDeal;
window.displayBestDeal = displayBestDeal;

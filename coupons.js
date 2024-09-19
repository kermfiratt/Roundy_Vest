console.log("Coupons script loaded");

// Function to simulate fetching coupons
function searchForCoupons() {
    // Simulate a delay to mimic an API request for coupons
    showLoadingAnimation();  // Show loading animation while searching

    setTimeout(() => {
        const simulatedCoupon = {
            code: "SAVE10",
            discount: "10%",
            description: "Get 10% off on your purchase!"
        };

        hideLoadingAnimation();
        displayCoupon(simulatedCoupon);
    }, 2000);
}

// Attach the function to the window object so it's accessible globally
window.searchForCoupons = searchForCoupons;

// Function to display the coupon in a popup
function displayCoupon(coupon) {
    const couponMessage = `
        <div class="coupon-content">
            <h2 style="color: #28a745; font-weight: bold;">Coupon Found!</h2>
            <div style="background: #fffbe6; border: 2px dashed #28a745; padding: 20px; border-radius: 10px;">
                <p style="font-size: 18px; color: #000;"><strong>Code:</strong> ${coupon.code}</p>
                <p style="font-size: 18px; color: #000;"><strong>Discount:</strong> ${coupon.discount}</p>
                <p style="font-size: 18px; color: #000;"><strong>Description:</strong> ${coupon.description}</p>
            </div>
        </div>
    `;

    const couponPopup = document.createElement('div');
    couponPopup.id = 'coupon-popup';
    couponPopup.style.cssText = `
        background-color: #f9f9f9;
        color: #000;
        padding: 20px;
        border-radius: 15px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        width: 400px;
        text-align: center;
    `;
    couponPopup.innerHTML = couponMessage;

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
        document.body.removeChild(couponPopup);
    });

    couponPopup.appendChild(closeButton);
    document.body.appendChild(couponPopup);
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

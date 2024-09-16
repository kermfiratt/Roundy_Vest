console.log("Coupons script loaded");

// Function to simulate fetching coupons
function searchForCoupons() {
    // Simulate a delay to mimic an API request for coupons
    setTimeout(() => {
        // Simulated coupon data
        const simulatedCoupon = {
            code: "SAVE10",  // Simulated coupon code
            discount: "10%",  // Simulated discount percentage
            description: "Get 10% off on your purchase!"  // Simulated description
        };

        // Hide the loading animation after the simulated response
        hideLoadingAnimation();

        // Display the simulated coupon in a popup
        displayCoupon(simulatedCoupon);
    }, 2000);  // 2-second delay to simulate network call
}

// Function to add the "Find Coupons" button to the page
function addFindCouponsButton() {
    const couponsButton = document.createElement('button');
    couponsButton.innerText = 'Find Coupons';
    couponsButton.id = 'find-coupons-button';
    couponsButton.style.cssText = `
        background-color: #ffa500;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        position: fixed;
        bottom: 20px;
        left: 200px;
        z-index: 1000;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        width: 150px;
    `;

    document.body.appendChild(couponsButton);

    // On click, search for coupons (simulated for testing)
    couponsButton.addEventListener('click', function () {
        console.log('Searching for coupons...');
        showLoadingAnimation();  // Show loading animation
        searchForCoupons();  // Simulated coupon search
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
        border-top: 8px solid #ffa500;
        width: 60px;
        height: 60px;
        animation: spin 1.5s linear infinite;
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

// Call function to add the "Find Coupons" button when page loads
addFindCouponsButton();

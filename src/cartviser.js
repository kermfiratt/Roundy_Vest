console.log("CartViser script loaded");

import { showHistoryPopup } from './historyitem.js';
import { showPriceHistoryPopup } from './aitime.js';
import { searchForCoupons } from '../coupons.js';
import { searchForBestDeal } from '../compare.js';

// Simulated stock prices (can be replaced with real data later)
const stockPrices = [
    { symbol: "AAPL", price: "$150.34", change: "+1.2%" },
    { symbol: "TSLA", price: "$780.00", change: "-0.6%" },
    { symbol: "AMZN", price: "$3300.14", change: "+0.4%" },
    { symbol: "GOOGL", price: "$2750.15", change: "-1.1%" },
    { symbol: "MSFT", price: "$290.12", change: "+2.0%" },
    { symbol: "NFLX", price: "$525.50", change: "-0.8%" },
    { symbol: "NVDA", price: "$620.75", change: "+1.7%" },
    { symbol: "ADBE", price: "$450.10", change: "+0.5%" },
    { symbol: "UBER", price: "$48.23", change: "-1.0%" },
    { symbol: "SAMS", price: "$90.12", change: "+0.6%" },
    { symbol: "FB", price: "$350.55", change: "+1.4%" },
    { symbol: "DIS", price: "$185.25", change: "-0.9%" },
    { symbol: "PYPL", price: "$278.50", change: "+1.3%" },
    { symbol: "TWTR", price: "$45.89", change: "+0.9%" },
    { symbol: "BABA", price: "$218.36", change: "+0.5%" },
    { symbol: "ORCL", price: "$85.23", change: "-1.2%" }
];

// Function to toggle the CartViser panel
function toggleCartViserPanel() {
    const panel = document.getElementById('cartviser-panel');
    panel.classList.toggle('visible');
}

// Function to add CartViser button
function addCartViserButton() {
    const cartViserButton = document.createElement('button');
    cartViserButton.innerText = 'CartViser';
    cartViserButton.id = 'cartviser-button';
    cartViserButton.style.cssText = `
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

    cartViserButton.addEventListener('click', toggleCartViserPanel);
    document.body.appendChild(cartViserButton);
}

// Function to create the CartViser panel with stock ticker in the header
function createCartViserPanel() {
    const panelHTML = `
        <div id="cartviser-panel" class="cartviser-panel hidden">
            <div class="cartviser-panel-header">
                <h2>CartViser</h2>
                <div class="stock-ticker">
                    <div class="scrolling-text">
    ${stockPrices.map(stock => `
        <span>
            ${stock.symbol}: ${stock.price} 
            <span style="color: ${stock.change.startsWith('-') ? 'red' : 'green'};">
                (${stock.change})
            </span>
        </span>`).join('')}
                    </div>
                </div>
                <button class="close-panel">&times;</button>
            </div>
            <div class="cartviser-panel-ads">
                <!-- Ads section -->
                <div class="ad">
                    <img src="https://logo.clearbit.com/apple.com" alt="Apple" />
                    <p>Apple</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/tesla.com" alt="Tesla" />
                    <p>Tesla</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/amazon.com" alt="Amazon" />
                    <p>Amazon</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" />
                    <p>Microsoft</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/nvidia.com" alt="Nvidia" />
                    <p>Nvidia</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/adobe.com" alt="Adobe" />
                    <p>Adobe</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/uber.com" alt="Uber" />
                    <p>Uber</p>
                </div>
                <div class="ad">
                    <img src="https://logo.clearbit.com/samsung.com" alt="Samsung" />
                    <p>Samsung</p>
                </div>
            </div>
            <div class="cartviser-panel-content">
                <button id="feature-history" class="feature-button">History</button>
                <button id="feature-price-history" class="feature-button">Check Price History</button>
                <button id="feature-coupons" class="feature-button">Find Coupons</button>
                <button id="feature-best-deal" class="feature-button">Find Best Deal</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);
    
    document.querySelector('.close-panel').addEventListener('click', toggleCartViserPanel);
    
    // Assign click events to each feature button and close the panel after triggering
    document.getElementById('feature-history').addEventListener('click', () => {
        showHistoryPopup();
        toggleCartViserPanel(); // Close panel after action
    });

    document.getElementById('feature-price-history').addEventListener('click', () => {
        showPriceHistoryPopup();
        toggleCartViserPanel(); // Close panel after action
    });
    
    document.getElementById('feature-coupons').addEventListener('click', () => {
        window.searchForCoupons();
        toggleCartViserPanel(); // Close panel after action
    });
    
    document.getElementById('feature-best-deal').addEventListener('click', () => {
        window.searchForBestDeal();
        toggleCartViserPanel(); // Close panel after action
    });
}
    
// Add styles for the CartViser panel, buttons, ads, and stock ticker
const style = document.createElement('style');
style.innerHTML = `
    #cartviser-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        max-height: 40%;
        background-color: #f9f9f9;
        border-top: 2px solid #ffa500;
        display: none;
        flex-direction: column;
        box-shadow: 0px -4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1001;
    }

    #cartviser-panel.visible {
        display: flex;
    }

    .cartviser-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background-color: #ffa500;
        color: white;
        position: relative;
    }

    .stock-ticker {
        width: 90%;
        overflow: hidden;
        white-space: nowrap;
        position: absolute;
        right: 10px;
        padding-left: 5px;
    }

    .scrolling-text {
        animation: scroll-left 20s linear infinite;
    }

    .scrolling-text span {
        display: inline-block;
        padding-right: 20px;
    }

    @keyframes scroll-left {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(-100%);
        }
    }

    .cartviser-panel-ads {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        margin: 5px 0;
        padding: 8px;
        background-color: #fff;
    }

    .ad {
        text-align: center;
        margin: 5px;
    }

    .ad img {
        width: 40px;
        height: 40px;
        margin-bottom: 5px;
    }

    .cartviser-panel-content {
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .feature-button {
        background-color: #ffa500;
        color: white;
        border: none;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
        width: 130px;
        margin: 5px;
        text-align: center;
    }

    .close-panel {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        padding: 5px;
    }
`;
document.head.appendChild(style);

// Initialize CartViser button and panel
addCartViserButton();
createCartViserPanel();
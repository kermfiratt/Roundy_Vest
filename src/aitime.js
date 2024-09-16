import Chart from 'chart.js/auto';

console.log("Price Timing script loaded");

// Variable to hold chart instance
let chartInstance = null;

// Generate random price data for 12 months
function generateRandomPriceData() {
    const prices = [];
    const dates = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
        const month = new Date();
        month.setMonth(currentDate.getMonth() - i);
        dates.push(month.toLocaleString('default', { month: 'short', year: 'numeric' }));
        prices.push((Math.random() * 100 + 50).toFixed(2));  // Simulating price between 50 and 150
    }

    return { prices: prices.reverse(), dates: dates.reverse() };
}

// Function to add the "Check Price History" button to the page
function addPriceTimingButton() {
    const priceTimingButton = document.createElement('button');
    priceTimingButton.innerText = 'Check Price History';
    priceTimingButton.id = 'price-timing-button';
    priceTimingButton.style.cssText = `
        background-color: #ffa500;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        position: fixed;
        bottom: 60px;
        left: 20px;
        z-index: 1000;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(priceTimingButton);

    priceTimingButton.addEventListener('click', function () {
        showPriceHistoryPopup();
    });
}

// Function to create a chart in the pop-up
function createPriceChart(prices, dates) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Destroy previous chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Price History',
                data: prices,
                borderColor: '#ff9800',
                fill: false,
                tension: 0.1,
                pointBackgroundColor: '#ffa500',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                }
            }
        }
    });
}

// Function to show price history popup
function showPriceHistoryPopup() {
    const { prices, dates } = generateRandomPriceData();

    const popupHTML = `
        <div class="popup-overlay">
            <div class="popup">
                <button class="close">&times;</button>
                <h2>Price History (Last 12 Months)</h2>
                <canvas id="priceChart" width="400" height="250"></canvas>
                <p class="best-buy-date">Best time to buy: <strong>${dates[prices.indexOf(Math.min(...prices))]}</strong></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    createPriceChart(prices, dates);

    document.querySelector('.close').addEventListener('click', () => {
        // Clean up the popup and destroy the chart instance
        if (chartInstance) {
            chartInstance.destroy();
        }
        document.querySelector('.popup-overlay').remove();
    });
}

// Add CSS styles for the popup and buttons
const style = document.createElement('style');
style.innerHTML = `
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 90%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup {
        background-color: white;
        color: #333;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 400px;
        height: 350px;
        text-align: center;
    }

    .close {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }

    .best-buy-date {
        margin-top: 10px;
        font-size: 18px;
    }

    canvas {
        margin-top: 10px;
    }
`;
document.head.appendChild(style);

// Call function to add the "Check Price History" button when page loads
addPriceTimingButton();

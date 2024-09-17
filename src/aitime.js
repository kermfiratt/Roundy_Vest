import Chart from 'chart.js/auto';

export function showPriceHistoryPopup() {
    console.log("Price Timing script loaded");

    let chartInstance = null;

    function generateRandomPriceData() {
        const prices = [];
        const dates = [];
        const currentDate = new Date();

        for (let i = 0; i < 12; i++) {
            const month = new Date();
            month.setMonth(currentDate.getMonth() - i);
            dates.push(month.toLocaleString('default', { month: 'short', year: 'numeric' }));
            prices.push((Math.random() * 100 + 50).toFixed(2));
        }

        return { prices: prices.reverse(), dates: dates.reverse() };
    }

    function createPriceChart(prices, dates) {
        const ctx = document.getElementById('priceChart').getContext('2d');

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

    const { prices, dates } = generateRandomPriceData();

    const popupHTML = `
        <div class="popup-overlay">
            <div class="popup" style="width: 400px; height: 450px;">
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
        if (chartInstance) {
            chartInstance.destroy();
        }
        document.querySelector('.popup-overlay').remove();
    });
}

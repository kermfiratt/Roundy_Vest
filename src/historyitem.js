export function showHistoryPopup() {
    const historyData = JSON.parse(localStorage.getItem('visitedItems')) || [];

    // Avoid loading duplicate items
    const uniqueHistoryData = [...new Map(historyData.map(item => [item.url, item])).values()];

    let popupHTML = `
        <div class="popup-overlay">
            <div class="popup">
                <button class="close">&times;</button>
                <h2>Visited Items</h2>
                <div class="history-items" style="overflow-y: auto; max-height: 400px;">
    `;

    if (uniqueHistoryData.length === 0) {
        popupHTML += `<p>No items visited yet.</p>`;
    } else {
        uniqueHistoryData.forEach(item => {
            popupHTML += `<img src="${item.imgSrc}" alt="Visited Item" style="width: 100px; height: 100px; margin: 10px;" onclick="window.location.href='${item.url}'" />`;
        });
    }

    popupHTML += `
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.popup-overlay').remove();
    });
}

// Track visited items when navigating to a new page
function trackVisitedItem() {
    const productImageElement = document.querySelector('#imgTagWrapperId img') || document.querySelector('#landingImage');
    const productUrl = window.location.href;
    const productImage = productImageElement ? productImageElement.src : 'https://via.placeholder.com/300x300?text=No+Image+Available';

    let visitedItems = JSON.parse(localStorage.getItem('visitedItems')) || [];

    const itemExists = visitedItems.some(item => item.url === productUrl);

    if (!itemExists) {
        visitedItems.push({
            imgSrc: productImage,
            url: productUrl
        });

        localStorage.setItem('visitedItems', JSON.stringify(visitedItems));
    }
}

trackVisitedItem();

// CSS for the popup is handled in cartviser.js

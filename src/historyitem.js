// Function to track visited items
function trackVisitedItem() {
    const productImageElement = document.querySelector('#imgTagWrapperId img') || document.querySelector('#landingImage');
    const productUrl = window.location.href;
    const productImage = productImageElement ? productImageElement.src : 'https://via.placeholder.com/300x300?text=No+Image+Available';  // Fallback image if not found

    // Get existing history from localStorage
    let visitedItems = JSON.parse(localStorage.getItem('visitedItems')) || [];

    // Check if the item is already in the history
    const itemExists = visitedItems.some(item => item.url === productUrl);

    // If item is not already in the history, add it
    if (!itemExists) {
        visitedItems.push({
            imgSrc: productImage,
            url: productUrl
        });

        // Store updated history in localStorage
        localStorage.setItem('visitedItems', JSON.stringify(visitedItems));
    }
}

// Call the tracking function when a user navigates to a new page
trackVisitedItem();

// Function to add the "History" button to the page
function addHistoryButton() {
    const historyButton = document.createElement('button');
    historyButton.innerText = 'History';
    historyButton.id = 'history-button';
    historyButton.style.cssText = `
        background-color: #ffa500;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        position: fixed;
        bottom: 60px;  /* Adjusted to match other buttons */
        left: 300px;   /* Adjust to position next to other buttons */
        z-index: 1000;
        border-radius: 5px;
        width: 200px;  /* Ensure all buttons are of equal size */
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(historyButton);

    historyButton.addEventListener('click', function () {
        showHistoryPopup();  // This function will display the history of visited items
    });
}

// Function to show the visited history popup
function showHistoryPopup() {
    const historyData = JSON.parse(localStorage.getItem('visitedItems')) || [];

    let popupHTML = `
        <div class="popup-overlay">
            <div class="popup">
                <button class="close">&times;</button>
                <h2>Visited Items</h2>
                <div class="history-items">
    `;

    if (historyData.length === 0) {
        popupHTML += `<p>No items visited yet.</p>`;
    } else {
        historyData.forEach(item => {
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

// CSS styles for the popup and button
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
        background-color: white;
        color: #333;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 400px;
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

    .history-items {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .history-items img {
        cursor: pointer;
        transition: transform 0.2s;
    }

    .history-items img:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// Call the function to add the history button when the page loads
addHistoryButton();

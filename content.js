console.log("Content script loaded");

document.addEventListener('click', function(event) {
  console.log("Document clicked", event.target);

  const addToCartSelectors = [
    'input#add-to-cart-button',
    'button#add-to-cart-button',
    'input[name="submit.add-to-cart"]',
    'button[name="submit.add-to-cart"]',
    '.add-to-cart-button',
    '.add-to-cart',
    'button.a-button-text',
    'input.a-button-input[name="submit.addToCart"]',
    'input[name="submit.addToCart"]',
    'button[name="submit.addToCart"]',
    'input#add-to-cart-button-ubb', // Turkish add to cart button
    'input[name="submit.add-to-cart-ubb"]', // Turkish add to cart button
    'input#add-to-cart-button-ubb', // Turkish add to cart button
    'button[name="submit.add-to-cart-ubb"]', // Turkish add to cart button
    'button#add-to-cart-button-ubb', // Turkish add to cart button
    'input[value="Sepete Ekle"]', // Turkish add to cart button
    'button[value="Sepete Ekle"]' // Turkish add to cart button
  ];

  const clickedElement = event.target;
  console.log("Clicked element:", clickedElement);

  const isAddToCartButton = addToCartSelectors.some(selector => clickedElement.matches(selector));
  
  if (isAddToCartButton) {
    if (!clickedElement.disabled) {
      console.log("Add to Cart button clicked and is enabled");
      chrome.runtime.sendMessage({ action: 'displayPopup' }, function(response) {
        console.log("Message response:", response);
      });
      console.log("Message sent: displayPopup");
    } else {
      console.log("Add to Cart button clicked but is disabled");
      observeButtonState(clickedElement);
    }
  } else {
    console.log("Clicked element is not an Add to Cart button");
  }
});

function observeButtonState(button) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'disabled' && !button.disabled) {
        console.log("Add to Cart button is now enabled");
        chrome.runtime.sendMessage({ action: 'displayPopup' }, function(response) {
          console.log("Message response:", response);
        });
        console.log("Message sent: displayPopup");
        observer.disconnect();
      }
    });
  });

  observer.observe(button, { attributes: true });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === 'displayPopup') {
    const popupHTML = `
      <div class="popup">
        <div class="popup-content">
          <span class="close">&times;</span>
          <p>Do you want to round the cost and invest?</p>
          <button id="invest-button">Invest</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    document.querySelector('.close').addEventListener('click', () => {
      document.querySelector('.popup').remove();
    });
    document.querySelector('#invest-button').addEventListener('click', () => {
      alert('Invest button clicked');
      document.querySelector('.popup').remove();
    });
    sendResponse({ status: "Popup displayed" });
  }
});

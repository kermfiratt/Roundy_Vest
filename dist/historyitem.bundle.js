(()=>{var n,e,t,o;n=document.querySelector("#imgTagWrapperId img")||document.querySelector("#landingImage"),e=window.location.href,t=n?n.src:"https://via.placeholder.com/300x300?text=No+Image+Available",(o=JSON.parse(localStorage.getItem("visitedItems"))||[]).some((function(n){return n.url===e}))||(o.push({imgSrc:t,url:e}),localStorage.setItem("visitedItems",JSON.stringify(o)));var i,r=document.createElement("style");r.innerHTML="\n    .popup-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0, 0, 0, 0.7);\n        z-index: 10001;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n    }\n\n    .popup {\n        background-color: white;\n        color: #333;\n        padding: 20px;\n        border-radius: 10px;\n        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n        width: 400px;\n        text-align: center;\n    }\n\n    .close {\n        position: absolute;\n        top: 5px;\n        right: 5px;\n        background: none;\n        border: none;\n        font-size: 20px;\n        cursor: pointer;\n    }\n\n    .history-items {\n        display: flex;\n        justify-content: center;\n        flex-wrap: wrap;\n    }\n\n    .history-items img {\n        cursor: pointer;\n        transition: transform 0.2s;\n    }\n\n    .history-items img:hover {\n        transform: scale(1.1);\n    }\n",document.head.appendChild(r),(i=document.createElement("button")).innerText="History",i.id="history-button",i.style.cssText="\n        background-color: #ffa500;\n        color: white;\n        border: none;\n        padding: 10px 20px;\n        font-size: 16px;\n        cursor: pointer;\n        position: fixed;\n        bottom: 60px;  /* Adjusted to match other buttons */\n        left: 300px;   /* Adjust to position next to other buttons */\n        z-index: 1000;\n        border-radius: 5px;\n        width: 200px;  /* Ensure all buttons are of equal size */\n        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);\n    ",document.body.appendChild(i),i.addEventListener("click",(function(){var n,e;n=JSON.parse(localStorage.getItem("visitedItems"))||[],e='\n        <div class="popup-overlay">\n            <div class="popup">\n                <button class="close">&times;</button>\n                <h2>Visited Items</h2>\n                <div class="history-items">\n    ',0===n.length?e+="<p>No items visited yet.</p>":n.forEach((function(n){e+='<img src="'.concat(n.imgSrc,'" alt="Visited Item" style="width: 100px; height: 100px; margin: 10px;" onclick="window.location.href=\'').concat(n.url,"'\" />")})),e+="\n                </div>\n            </div>\n        </div>\n    ",document.body.insertAdjacentHTML("beforeend",e),document.querySelector(".close").addEventListener("click",(function(){document.querySelector(".popup-overlay").remove()}))}))})();
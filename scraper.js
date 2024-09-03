const puppeteer = require('puppeteer');

async function scrapeBestDeal(productName) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // List of e-commerce sites to scrape
    const sites = [
        {
            name: "Amazon",
            url: `https://www.amazon.com/s?k=${encodeURIComponent(productName)}`,
            priceSelector: '.a-price-whole',  // This is just an example selector, you will need to find the correct one
            linkSelector: '.a-link-normal.a-text-normal'
        },
        {
            name: "eBay",
            url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(productName)}`,
            priceSelector: '.s-item__price',
            linkSelector: '.s-item__link'
        },
        // Add more sites as needed
    ];

    let bestDeal = null;

    for (const site of sites) {
        try {
            await page.goto(site.url, { waitUntil: 'networkidle2' });

            // Get the first product's price and link
            const price = await page.$eval(site.priceSelector, el => parseFloat(el.innerText.replace(/[^0-9.]/g, '')));
            const link = await page.$eval(site.linkSelector, el => el.href);

            if (!bestDeal || price < bestDeal.price) {
                bestDeal = {
                    site: site.name,
                    price: price,
                    link: link
                };
            }
        } catch (error) {
            console.error(`Failed to scrape ${site.name}:`, error);
        }
    }

    await browser.close();
    return bestDeal;
}

module.exports = { scrapeBestDeal };

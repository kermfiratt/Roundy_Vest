// server.js

const express = require('express');
const cors = require('cors'); // Import the cors package
const { scrapeBestDeal } = require('./scraper');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

app.get('/scrape', async (req, res) => {
    const productName = req.query.productName;
    try {
        const productData = await scrapeBestDeal(productName);
        res.json(productData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product data.' });
    }
});

app.listen(port, () => {
    console.log(`Scraping server listening at http://localhost:${port}`);
});

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS to allow the content script to send requests to the server
app.use(cors());

// API keys from environment variables
const EBAY_API_KEY = process.env.EBAY_API_KEY;
const WALMART_API_KEY = process.env.WALMART_API_KEY;
const BESTBUY_API_KEY = process.env.BESTBUY_API_KEY;

// Endpoint to search for the best deals
app.get('/search', async (req, res) => {
    const query = req.query.productName;

    if (!query) {
        return res.status(400).json({ error: 'No product name provided' });
    }

    try {
        const results = await searchProducts(query);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch product data' });
    }
});

// Function to search eBay products by keyword
const searchEbayProducts = async (query) => {
    try {
        const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${EBAY_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        const items = response.data.itemSummaries;

        if (items) {
            return items.map(item => ({
                title: item.title,
                price: item.price.value,
                currency: item.price.currency,
                itemUrl: item.itemWebUrl
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching eBay data:', error.message);
        return [];
    }
};

// Function to search Walmart products by keyword
const searchWalmartProducts = async (query) => {
    try {
        const url = `https://api.walmartlabs.com/v1/search?query=${encodeURIComponent(query)}&format=json&apiKey=${WALMART_API_KEY}`;

        const response = await axios.get(url);

        const items = response.data.items;

        if (items) {
            return items.map(item => ({
                title: item.name,
                price: item.salePrice,
                itemUrl: item.productUrl
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching Walmart data:', error.message);
        return [];
    }
};

// Function to search Best Buy products by keyword
const searchBestBuyProducts = async (query) => {
    try {
        const url = `https://api.bestbuy.com/v1/products(name=${encodeURIComponent(query)}*)?apiKey=${BESTBUY_API_KEY}&format=json`;

        const response = await axios.get(url);

        const items = response.data.products;

        if (items) {
            return items.map(item => ({
                title: item.name,
                price: item.salePrice,
                itemUrl: item.url
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching Best Buy data:', error.message);
        return [];
    }
};

// Function to search for the best deal across multiple platforms
const searchProducts = async (query) => {
    const results = [];

    // Search on eBay
    try {
        const ebayResults = await searchEbayProducts(query);
        results.push({ site: 'eBay', deals: ebayResults });
    } catch (error) {
        console.error('Error fetching from eBay:', error.message);
    }

    // Search on Walmart
    try {
        const walmartResults = await searchWalmartProducts(query);
        results.push({ site: 'Walmart', deals: walmartResults });
    } catch (error) {
        console.error('Error fetching from Walmart:', error.message);
    }

    // Search on Best Buy
    try {
        const bestBuyResults = await searchBestBuyProducts(query);
        results.push({ site: 'Best Buy', deals: bestBuyResults });
    } catch (error) {
        console.error('Error fetching from Best Buy:', error.message);
    }

    return results;
};

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

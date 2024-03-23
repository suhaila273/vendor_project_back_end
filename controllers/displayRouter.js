const express = require('express');
const router = express.Router();
const productModel = require('../Models/productModel'); // Assuming you have a productModel defined

// GET endpoint to list products by vendor ID
router.get('/products_by_vendor/:vendor_id', async (req, res) => {
    const vendorId = req.params.vendor_id;

    try {
        // Find all products associated with the given vendor ID
        const products = await productModel.find({ vendor_id: vendorId });

        // Return the list of products as a response
        res.status(200).json(products);
    } catch (error) {
        // If an error occurs during the database query, return a 500 Internal Server Error response
        console.error('Error fetching products by vendor:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

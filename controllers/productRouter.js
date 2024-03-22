const express = require("express");
const path = require('path');
const router = express.Router();
const productModel = require("../Models/productModel");
const multer = require('multer');

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({
    storage: Storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'fssai') {
            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Only PDF files are allowed for FSSAI documents!'));
            }
        }
        // Allow other file types for product_img[] field
        cb(null, true);
    }
}).fields([
    { name: 'fssai', maxCount: 1 }, // Assuming only one PDF file is uploaded for FSSAI
    { name: 'product_img', maxCount: 10 } // Allowing up to 10 image files for product images
]);

//Api to add products

router.post('/add_product', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(400).send(err.message); // Sending an appropriate error response
        }

        const discount = req.body.discount;
        const price = req.body.price;
        const discount_price = calculateDiscountPrice(price, discount);

        // Create an array to store image paths
        const productImgPaths = [];

        // Check if files were uploaded for product_img field
        if (req.files['product_img']) {
            // Loop through uploaded files and push their paths to productImgPaths array
            req.files['product_img'].forEach(file => {
                productImgPaths.push(file.path);
            });
        }

        const newProduct = new productModel({
            product_name: req.body.product_name,
            price: req.body.price,
            discount: req.body.discount,
            discount_price: discount_price,
            short_desc: req.body.short_desc,
            long_desc: req.body.long_desc,
            vendor_id: req.body.vendor_id,
            category_id: req.body.category_id,
            video_link: req.body.video_link,
            fssai: req.files['fssai'] ? req.files['fssai'][0].path : '', // Assuming only one PDF file is uploaded for FSSAI
            product_img: productImgPaths.join(','), // Join image paths into a single string separated by commas
            stock: req.body.stock,
            quantity: req.body.quantity
        });

        try {
            await newProduct.save();
            res.send("Successfully Added");
            console.log("added successfuly")
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to add product");
        }
    });
});

// to view products 

router.get("/view_product", async (req, res) => {
    try {
        const result = await productModel.find();
        res.json(result);
        console.log("fetch success")
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch products");
    }
});

function calculateDiscountPrice(price, discount) {
    const discountedAmount = (parseInt(price) * (parseInt(discount) / 100));
    return (parseInt(price) - discountedAmount).toString();
}

module.exports = router;

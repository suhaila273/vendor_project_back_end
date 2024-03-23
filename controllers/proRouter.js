const express=require("express")
const path=require('path')
const router=express.Router()
const productModel=require("../Models/productModel")

const multer=require('multer')

const Storage=multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let ext=path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

//const upload=multer({
 //   storage:Storage
//}).array('product_img[]')

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

//API to upload product details

router.post('/product_upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            const discount = req.body.discount;
            const price = req.body.price;
            const discount_price = calculateDiscountPrice(price, discount);
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
                stock: req.body.stock,
                quantity: req.body.quantity,
                fssai: req.files['fssai'][0].path // Assuming only one file for fssai
            });

            // Handling multiple product_img files
            if (req.files['product_img']) {
                let path = '';
                req.files['product_img'].forEach(function (file, index, arr) {
                    path = path + file.path + ',';
                });
                path = path.substring(0, path.lastIndexOf(","));
                newProduct.product_img = path;
            }

            newProduct.save()
                .then(() => res.send("Successfully uploaded"))
                .catch(err => console.log(err));
        }
    });
});

router.get("/viewproduct",async(req,res)=>{
    let result=await productModel.find()
    console.log("successfuly displayed")
    res.json(result)
});

//---------------------------------------------------------------------------------

router.put('/update_product/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error uploading files' });
        }

        const productId = req.params.id;

        // Extract other product details from request body
        const {
            product_name,
            price,
            discount,
            short_desc,
            long_desc,
            vendor_id,
            category_id,
            video_link,
            stock,
            quantity
        } = req.body;

         // Handling fssai file
         let fssai = '';
         if (req.files['fssai'] && req.files['fssai'][0]) {
             fssai = req.files['fssai'][0].path;
         }

        let product_img = '';

        // Handling product_img files
        if (req.files['product_img']) {
            req.files['product_img'].forEach((file) => {
                product_img += file.path + ',';
            });
            product_img = product_img.slice(0, -1); // Remove the last comma
        }


        try {
            const updatedProduct = await productModel.findByIdAndUpdate(productId, {
                product_name,
                price,
                discount,
                short_desc,
                long_desc,
                vendor_id,
                category_id,
                video_link,
                stock,
                quantity,
                fssai,
                product_img
            }, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});


//--------------------------------------------------------------------------------

// DELETE : to delete a product by ID
router.delete('/delete_product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
    
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//-------------------------------------------------------------------------------

function calculateDiscountPrice(price, discount) {
    const discountedAmount = (parseInt(price) * (parseInt(discount) / 100));
    return (parseInt(price) - discountedAmount).toString();
}


module.exports=router
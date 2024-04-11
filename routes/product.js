const express = require('express');
const router = express.Router();
const Product = require('./schemas/product');

// Route để lấy tất cả sản phẩm
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm.' });
    }
});

// Route để xem chi tiết sản phẩm
router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    
    try {
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm.' });
    }
});

// Route để thêm sản phẩm
router.post('/products', checkAdmin, async (req, res) => {
    const { name, category, price, image } = req.body;

    try {
        const product = new Product({
            name,
            category,
            price,
            image
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
    }
});

// Route để xóa sản phẩm
router.delete('/products/:id', checkAdmin, async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }

        await product.remove();
        res.json({ message: 'Xóa sản phẩm thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    }
});

// Route để sửa sản phẩm
router.put('/products/:id', checkAdmin, async (req, res) => {
    const productId = req.params.id;
    const { name, category, price, image } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.image = image;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi sửa sản phẩm.' });
    }
});


module.exports = router;
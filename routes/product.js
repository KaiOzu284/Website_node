const express = require('express');
const router = express.Router();
const Product = require('./schemas/product');
const ResponseHandle = require('./helper/ResponseHandle');
const multer = require('multer'); // Sử dụng Multer để xử lý tải lên hình ảnh
// Route để lấy tất cả sản phẩm
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        ResponseHandle.ResponseSend(res, true, 200, products);
    } catch (error) {
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi lấy sản phẩm.' });
    }
});

// Route để xem chi tiết sản phẩm
router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    
    try {
        const product = await Product.findById(productId);
        
        if (!product) {
            return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm.' });
        }

        ResponseHandle.ResponseSend(res, true, 200, product);
    } catch (error) {
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi lấy sản phẩm.' });
    }
});

// Cấu hình Multer để lưu trữ hình ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route để thêm sản phẩm với hình ảnh
router.post('/addProducts', upload.single('image'), async (req, res) => {
    const { name, category, price } = req.body;

    try {
        // Kiểm tra xem có file hình ảnh được gửi lên không
        if (!req.file) {
            return ResponseHandle.ResponseSend(res, false, 400, { message: 'Vui lòng chọn một hình ảnh.' });
        }

        // Tạo sản phẩm mới với đường dẫn hình ảnh
        const newProduct = new Product({
            name,
            category,
            price,
            imagePath: req.file.path // Đường dẫn của hình ảnh được lưu vào trường imagePath
        });

        await newProduct.save();
        // res.status(201).json(newProduct);
        ResponseHandle.ResponseSend(res, true, 200, newProduct);
    } catch (error) {
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
    }
});


module.exports = router;

// Route để xóa sản phẩm
router.delete('/products/:id', checkAdmin, async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm.' });
        }

        await product.remove();
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Xóa sản phẩm thành công.' });
    } catch (error) {
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    }
});

// Route để sửa sản phẩm
router.put('/products/:id', checkAdmin, async (req, res) => {
    const productId = req.params.id;
    const { name, category, price, image } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm.' });
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.image = image;

        await product.save();
        ResponseHandle.ResponseSend(res, true, 200, product);
    } catch (error) {
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi sửa sản phẩm.' });
    }
});


module.exports = router;

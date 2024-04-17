const express = require('express');
const router = express.Router();
const Product = require('../schemas/product');
const ResponseHandle = require('../helper/ResponseHandle');
const Category = require('../schemas/category');
const multer = require('multer');
const path = require('path');

// Cấu hình Multer để lưu trữ hình ảnh vào thư mục 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Điều chỉnh đường dẫn tới thư mục public/images từ thư mục gốc của dự án
        const relativePath = path.join(__dirname, '..', 'public', 'images');
        cb(null, relativePath);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });

// Route lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name'); // Giả sử rằng trường category là một tham chiếu đến một collection khác
        const productData = products.map(product => ({
            ...product.toObject(),
            categoryName: product.category.name // Thêm trường categoryName để gửi về client
        }));
        ResponseHandle.ResponseSend(res, true, 200, productData);
    } catch (error) {
        console.error (error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi lấy sản phẩm.' });
    }
});


// Route xem chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm.' });
        }
        ResponseHandle.ResponseSend(res, true, 200, product);
    } catch (error) {
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi lấy sản phẩm.' });
    }
});

// Route thêm sản phẩm mới với hình ảnh
// router.post('/new', upload.single('image'), async (req, res) => {
//     const { name, category, price } = req.body;
//     if (!req.file) {
//         console.log("Không tìm thấy file ảnh trong yêu cầu");
//         return ResponseHandle.ResponseSend(res, false, 400, { message: 'Vui lòng chọn một hình ảnh.' });
//     }
//     const newProduct = new Product({
//         name,
//         category,
//         price,
//         image: req.file.path
//     });
//     try {
//         await newProduct.save();
//         ResponseHandle.ResponseSend(res, true, 201, newProduct);
//     } catch (error) {
//         console.error("Lỗi khi thêm sản phẩm: ", error);
//         ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
//     }
// });
router.post('/new', upload.single('image'), async (req, res) => {
    const { name, category, price } = req.body;
    if (!req.file) {
        console.log("Không tìm thấy file ảnh trong yêu cầu");
        return ResponseHandle.ResponseSend(res, false, 400, { message: 'Vui lòng chọn một hình ảnh.' });
    }

    // Tạo đường dẫn tương đối cho hình ảnh
    const imagePath = req.file.path.replace(/\\/g, '/').split('/public/')[1];

    const newProduct = new Product({
        name,
        category,
        price,
        image: imagePath  // Lưu đường dẫn tương đối
    });

    try {
        await newProduct.save();
        ResponseHandle.ResponseSend(res, true, 201, newProduct);
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm: ", error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
    }
});

// Route xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm để xóa.' });
        }
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Xóa sản phẩm thành công.',product });
    } catch (error) {
        console.error (error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    }
});

// Route sửa thông tin sản phẩm
// router.put('/:id', upload.single('image'), async (req, res) => {
//     // Lấy dữ liệu từ body của request, chỉ bao gồm các trường có sẵn
//     const updateData = {};
//     const fields = ['name', 'category', 'price', 'imagePath'];
//     fields.forEach(field => {
//         if (req.body[field] !== undefined) {
//             updateData[field] = req.body[field];
//         }
//     });

//     // Nếu có file ảnh được tải lên, cập nhật đường dẫn hình ảnh mới
//     if (req.file) {
//         updateData.imagePath = req.file.path;
//     }

//     if (Object.keys(updateData).length === 0) {
//         return ResponseHandle.ResponseSend(res, false, 400, { message: 'Không có dữ liệu cập nhật.' });
//     }

//     try {
//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true, runValidators: true }
//         );
//         if (!product) {
//             return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm để cập nhật.' });
//         }
//         ResponseHandle.ResponseSend(res, true, 200, product);
//     } catch (error) {
//         console.error("Error updating product:", error);
//         ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi cập nhật sản phẩm: ' + error.message });
//     }
// });
router.put('/:id', upload.single('image'), async (req, res) => {
    const updateData = {};
    const fields = ['name', 'category', 'price'];
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    if (req.file) {
        updateData.image = req.file.path.replace(/\\/g, '/').split('/public/')[1]; // Cập nhật đường dẫn tương đối
    }

    if (Object.keys(updateData).length === 0) {
        return ResponseHandle.ResponseSend(res, false, 400, { message: 'Không có dữ liệu cập nhật.' });
    }

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!product) {
            return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy sản phẩm để cập nhật.' });
        }
        ResponseHandle.ResponseSend(res, true, 200, product);
    } catch (error) {
        console.error("Error updating product:", error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi cập nhật sản phẩm: ' + error.message });
    }
});



module.exports = router;

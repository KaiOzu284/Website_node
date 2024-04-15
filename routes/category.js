const Category = require('../schemas/category');
const ResponseHandle = require('../helper/ResponseHandle');
const express = require('express');
const router = express.Router();

//Tạo Danh Mục Mới:
router.post('/categories', async (req, res) => {
  const { name } = req.body;

  try {
    const category = new Category({ name });
    await category.save();

    ResponseHandle.ResponseSend(res, true, 201, { message: 'Danh mục đã được tạo thành công', category });
  } catch (error) {
    ResponseHandle.ResponseSend(res, false, 400, { message: 'Đã xảy ra lỗi khi tạo danh mục', error });
  }
});

//Đọc Tất Cả Danh Mục:
router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find();
      ResponseHandle.ResponseSend(res, true, 200, { categories });
    } catch (error) {
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi đọc danh mục', error });
    }
  });

  //Đọc Một Danh Mục Cụ Thể:
  router.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const category = await Category.findById(id);
      if (!category) {
        return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy danh mục' });
      }
      ResponseHandle.ResponseSend(res, true, 200, { category });
    } catch (error) {
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi đọc danh mục', error });
    }
  });
  
// Cập Nhật Danh Mục:
router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const category = await Category.findById(id);
      if (!category) {
        return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy danh mục' });
      }
  
      category.name = req.body.name; // Cập nhật tên danh mục
  
      await category.save(); // Lưu thay đổi vào cơ sở dữ liệu
  
      ResponseHandle.ResponseSend(res, true, 200, { message: 'Danh mục đã được cập nhật', category });
    } catch (error) {
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi cập nhật danh mục', error });
    }
  });

  //Xóa Danh Mục:
  router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy danh mục' });
      }
      ResponseHandle.ResponseSend(res, true, 200, { message: 'Danh mục đã được xóa', category });
    } catch (error) {
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi khi xóa danh mục', error });
    }
  });
  module.exports = router;
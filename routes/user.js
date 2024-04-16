const express = require('express');
const router = express.Router();
const User = require('../schemas/user'); // Đảm bảo đường dẫn đến schema User chính xác
const bcrypt = require('bcryptjs');
const ResponseHandle = require('../helper/ResponseHandle');


// GET danh sách tất cả người dùng
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      ResponseHandle.ResponseSend(res, true, 200, { message: 'Danh sách người dùng', users });
    } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi lấy danh sách người dùng' });
    }
  });

// Xóa người dùng
  router.delete('/:id', async (req, res)=> {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return ResponseHandle.ResponseSend(res, false, 404, { message: 'Người dùng không tồn tại' });
      }
      ResponseHandle.ResponseSend(res, true, 200, { message: 'Danh sách người dùng' });
    } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi xóa người dùng' });
    }
  });

// Lấy thông tin chi tiết của một người dùng
router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return ResponseHandle.ResponseSend(res, false, 404, { message: 'Người dùng không tồn tại' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi tìm người dùng' });
    }
  });

// Cập nhật người dùng
router.put('/:id',  async (req, res) => {
  const { email, username, password } = req.body;
  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
          email,
          username,
          password: hashedPassword
      }, { new: true });

      if (!updatedUser) {
          return ResponseHandle.ResponseSend(res, false, 404, { message: 'Người dùng không tồn tại' });
      }
      res.status(200).json({ message: 'Người dùng đã được cập nhật', user: updatedUser });
  } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi cập nhật người dùng' });
  }
});



module.exports = router;


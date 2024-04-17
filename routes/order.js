const express = require('express');
const router = express.Router();
const Order = require('../schemas/order');  // Đường dẫn tùy thuộc vào cấu trúc thư mục của bạn
const ResponseHandle = require('../helper/ResponseHandle');
const jwt = require('jsonwebtoken');


function verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
  
    if (!bearerHeader) {
      return ResponseHandle.ResponseSend(res, false, 403, 'Token không hợp lệ');
    }
  
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
  
    jwt.verify(token, 'yourSecretKey', (err, decoded) => {
      if (err) {
        console.error(err);  // In ra lỗi để debug
        return ResponseHandle.ResponseSend(res, false, 403, 'Token không hợp lệ');
      }
      req.userId = decoded.userId; // Lưu userId vào req để sử dụng trong route
      next();
    });
  }
router.post('/checkout', verifyToken, async (req, res) => {
    const { totalPrice, address } = req.body;
    const userId = req.userId; // Giả sử userId đã được thêm vào req thông qua middleware xác thực

    try {
        const newOrder = new Order({
            userId,
            totalPrice,
            address
        });

        await newOrder.save();
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Lấy giỏ hàng thành công', order: newOrder });
    } catch (error) {
        console.error('Error creating order: ', error);
        ResponseHandle.ResponseSend(res, false, 500, 'Lỗi khi tạo đơn hàng');
    }
});
// GET all orders
router.get('/',  async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'username');
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Lấy đơn hàng thành công',orders});
    } catch (error) {
        console.error('Error retrieving orders:', error);
        ResponseHandle.ResponseSend(res, false, 500, 'Lấy đơn hàng thất bại');
    }
});

module.exports = router;

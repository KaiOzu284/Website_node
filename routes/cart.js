const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../schemas/cart');
const ResponseHandle = require('../helper/ResponseHandle');
// Middleware để xác thực token
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
  // Route để lấy thông tin giỏ hàng của người dùng
  router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId; // Lấy userId đã được xác thực từ middleware

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price');
        if (cart) {
            ResponseHandle.ResponseSend(res, true, 200, { message: 'Lấy giỏ hàng thành công', cart: cart });
        } else {
            ResponseHandle.ResponseSend(res, false, 404, { message: 'Giỏ hàng không tồn tại.' });
        }
    } catch (error) {
        console.error('Error retrieving cart: ', error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi lấy thông tin giỏ hàng.' });
    }
});


// Route để xóa giỏ hàng của người dùng
router.delete('/', verifyToken, async (req, res) => {
    const userId = req.userId; // Lấy userId từ token đã xác thực

    try {
        const result = await Cart.findOneAndDelete({ user: userId });
        if (result) {
            ResponseHandle.ResponseSend(res, true, 200, { message: 'Giỏ hàng đã được xóa thành công.' });
        } else {
            ResponseHandle.ResponseSend(res, false, 404, { message: 'Không tìm thấy giỏ hàng để xóa.' });
        }
    } catch (error) {
        console.error('Error deleting cart: ', error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi xóa giỏ hàng.' });
    }
});
// Thêm sản phẩm vào giỏ hàng
router.post('/add', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    // Chuyển đổi quantity thành số nguyên
    const addedQuantity = parseInt(quantity, 10);
    if (isNaN(addedQuantity) || addedQuantity <= 0) {
        return ResponseHandle.ResponseSend(res, false, 400, { message: 'Số lượng sản phẩm không hợp lệ.' });
    }

    console.log(`Received quantity to add: ${addedQuantity}`);  // Log giá trị quantity nhận được

    try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.product == productId);
            if (itemIndex > -1) {
                console.log(`Original quantity in cart: ${cart.items[itemIndex].quantity}`);  // Log số lượng hiện tại trong giỏ
                // Cập nhật số lượng nếu sản phẩm đã có
                cart.items[itemIndex].quantity += addedQuantity;
                console.log(`Updated quantity in cart: ${cart.items[itemIndex].quantity}`);  // Log số lượng sau khi cập nhật
            } else {
                // Thêm sản phẩm mới nếu chưa có
                cart.items.push({ product: productId, quantity: addedQuantity });
            }
            cart = await cart.save();
        } else {
            // Tạo giỏ hàng mới nếu chưa có
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: addedQuantity }]
            });
        }
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Thêm giỏ hàng thành công', cart });
    } catch (error) {
        console.error(error);
        ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi thêm sản phẩm vào giỏ hàng.' });
    }
});



// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', verifyToken, async (req, res) => {
    const { itemId } = req.body;
    const userId = req.userId; // Sử dụng userId từ token đã được xác thực
  
    try {
      let cart = await Cart.findOne({ user: userId });
      if (cart) {
        // Xóa sản phẩm khỏi giỏ
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        cart = await cart.save();
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Xóa giỏ hàng thành công', cart });
      } else {
        ResponseHandle.ResponseSend(res, false, 404, { message: 'Giỏ hàng không tồn tại.' });
      }
    } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.' });
    }
  });

module.exports = router;

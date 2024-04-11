const express = require('express');
const router = express.Router();
const User = require('../schemas/user');// Import User schema
const bcrypt = require('bcryptjs');
const ResponseHandle = require('../helper/ResponseHandle');
const jwt = require('jsonwebtoken');
const transporter = require('../helper/nodeEmail');
const SECRET_KEY = process.env.SECRET_KEY || 'yourSecretKey';
require('express-async-errors');


//Route đăng ký
router.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = jwt.sign({ username: newUser.username, role: newUser.role }, 'yourSecretKey', { expiresIn: '1h' });

    ResponseHandle.ResponseSend(res, true, 201, { message: 'Đăng ký thành công', token });
  } catch (error) {
    ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
  }
});

// Route đăng nhập
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign({ userId: user.id ,username: user.username, role: user.role }, 'yourSecretKey', { expiresIn: '1h' });
        ResponseHandle.ResponseSend(res, true, 200, { message: 'Đăng nhập thành công', token });
      } else {
        ResponseHandle.ResponseSend(res, false, 400, { message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
      }
    } else {
      ResponseHandle.ResponseSend(res, false, 400, { message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
  }
});

// Kiểm tra role
function checkAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return ResponseHandle.ResponseSend(res, false, 403, 'Bạn không có quyền truy cập trang này!');
  }

  jwt.verify(token.split(' ')[1], 'yourSecretKey', (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return ResponseHandle.ResponseSend(res, false, 403, 'Bạn không có quyền truy cập trang này!');
    }
    next();
  });
}

// Middleware để xác thực token
// Middleware để xác thực token
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


// Route đổi mật khẩu
router.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return ResponseHandle.ResponseSend(res, false, 400, { message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    console.log('Day la mk:', isMatch);

    if (isMatch) {
      // Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      ResponseHandle.ResponseSend(res, true, 200, { message: 'Mật khẩu đã được thay đổi thành công' });
    } else {
      ResponseHandle.ResponseSend(res, false, 400, { message: 'Mật khẩu cũ không chính xác' });
    }
  } catch (error) {
    console.error(error);
    ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
  }
});



// Route cho việc quên mật khẩu
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });

      if (user) {
          // Tạo token để thiết lập lại mật khẩu
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

          // Gửi email chứa link reset password tới user
          const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

          let mailOptions = {
              from: 'testhutech284@gmail.com',  // Địa chỉ email của bạn
              to: email,
              subject: 'Reset Password',
              text: `Vui lòng click vào đường link sau để thiết lập lại mật khẩu: ${resetPasswordLink}`
          };

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log(error);
                  ResponseHandle.ResponseSend(res, false, 500, { message: 'Lỗi khi gửi email' });
              } else {
                  ResponseHandle.ResponseSend(res, true, 200, { message: 'Vui lòng kiểm tra email để thiết lập lại mật khẩu' });
              }
          });
      } else {
          ResponseHandle.ResponseSend(res, false, 400, { message: 'Email không tồn tại' });
      }
  } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
  }
});

// Route để thiết lập lại mật khẩu
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
      // Giải mã token để lấy userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findById(decoded.userId);
      user.password = hashedPassword;
      await user.save();

      ResponseHandle.ResponseSend(res, true, 200, { message: 'Mật khẩu đã được thiết lập lại thành công' });
  } catch (error) {
      console.error(error);
      ResponseHandle.ResponseSend(res, false, 500, { message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
  }
});

router.get('/admin', checkAdmin, (req, res) => {
  res.render('admin');  // Render trang admin nếu người dùng có quyền truy cập
});



module.exports = router;
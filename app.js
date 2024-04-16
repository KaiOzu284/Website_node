
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./db');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
var app = express();

// Cài đặt view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Sử dụng các middleware cơ bản
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Phục vụ các tập tin tĩnh từ thư mục 'public'
app.use('/public', express.static('public'));

// Cấu hình các tuyến đường cơ bản
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
// Thêm tuyến đường GET cho forgotPassword
app.get('/forgotPassword', function(req, res) {
  res.render('forgotPassword');  // Sử dụng EJS để render trang
});

// Xử lý lỗi 404, chuyển tiếp đến trình xử lý lỗi
app.use(function(req, res, next) {
  next(createError(404));
});

// Trình xử lý lỗi
app.use(function(err, req, res, next) {
  // Chỉ hiển thị thông tin lỗi trong môi trường phát triển
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Hiển thị trang lỗi
  res.status(err.status || 500);
  res.render('error');
});

// Kết nối cơ sở dữ liệu
connectDB();

// Xuất biến app để sử dụng ở những nơi khác
module.exports = app;

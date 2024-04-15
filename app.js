// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const connectDB = require('./db');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var authRouter = require('./routes/auth');
// const categoryRouter = require('./routes/category');
// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// // Cung cấp truy cập tĩnh cho thư mục public
// app.use('/public', express.static('public'));
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/auth', authRouter);
// app.use('/category', categoryRouter);
// app.get('/forgotPassword', (req, res) => {
//   // Xử lý logic tại đây (ví dụ: hiển thị trang quên mật khẩu)
//   res.render('forgotPassword'); // Ví dụ: sử dụng template engine như EJS hoặc Handlebars để render trang quên mật khẩu
// });
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// connectDB();
// module.exports = app;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
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
app.use('/users', usersRouter);
app.use('/auth', authRouter);
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

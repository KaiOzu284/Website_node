const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true cho cổng 465, false cho các cổng khác như 587
    auth: {
        user: 'testhutech284@gmail.com', // Thay đổi thành email thực của bạn
        pass: 'ignb iyac yofx daag' // Mật khẩu ứng dụng hoặc mật khẩu thực, đảm bảo an toàn
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;

 
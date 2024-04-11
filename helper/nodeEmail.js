const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testhutech284@gmail.com',  // Địa chỉ email của bạn
        pass: 'hoanguyen284'  // Mật khẩu email của bạn
    }
});
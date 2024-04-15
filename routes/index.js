var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.get('/changePassword', function(req, res, next) {
  res.render('changePassword', { title: 'ChangePassword' });
});
router.get('/forgetPassword', function(req, res, next) {
  res.render('forgetPassword', { title: 'ForgetPassword' });
});
router.get('/resetPassword', function(req, res, next) {
  res.render('resetPassword', { title: 'ResetPassword' });
});

module.exports = router;

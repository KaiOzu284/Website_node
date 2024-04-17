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
router.get('/adminProduct', function(req, res, next) {
  res.render('adminProduct', { title: 'Product' });
});
router.get('/adminProduct_Edit', function(req, res, next) {
  res.render('adminProduct_Edit', { title: 'Product' });
});
router.get('/adminProduct_Add', function(req, res, next) {
  res.render('adminProduct_Add', { title: 'Product' });
});
router.get('/adminCategory', function(req, res, next) {
  res.render('adminCategory', { title: 'Category' });
});
router.get('/adminCategory_Add', function(req, res, next) {
  res.render('adminCategory_Add', { title: 'Category' });
});
router.get('/adminCategory_Edit', function(req, res, next) {
  res.render('adminCategory_Edit', { title: 'Category' });
});
router.get('/adminCategory_Add', function(req, res, next) {
  res.render('adminCategory_Add', { title: 'Category' });
});
router.get('/adminUser', function(req, res, next) {
  res.render('adminUser', { title: 'User' });
});
router.get('/adminUser_Edit', function(req, res, next) {
  res.render('adminUser_Edit', { title: 'User' });
});
router.get('/adminProduct_Add', function(req, res, next) {
  res.render('adminProduct_Add', { title: 'Product' });
});
router.get('/adminOrder', function(req, res, next) {
  res.render('adminOrder', { title: 'Order' });
});
router.get('/usercart', function(req, res, next) {
  res.render('usercart', { title: 'cart' });
});
router.get('/checkout', function(req, res, next) {
  res.render('checkout', { title: 'checkout' });
});
router.get('/success', function(req, res, next) {
  res.render('success', { title: 'success' });
});
module.exports = router;

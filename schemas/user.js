const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],  // Vai trò có thể là 'user' hoặc 'admin'
    default: 'user'  // Mặc định là 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  collection: 'User'  // Tên của bảng (collection)
});

const User = mongoose.model('User', userSchema);

module.exports = User;

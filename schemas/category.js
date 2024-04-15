const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
}, {
    collection: 'Category'  // Tên của bảng (collection)
  });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    status: {
        type: String,
        enum: ['created', 'reopened'],
        default: 'created',
    },
});

const BlogModel = mongoose.model('Blog', blogSchema);

module.exports = BlogModel;

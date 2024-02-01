const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const BlogModel = require('../models/blog.js');
const router=express.Router();

// Lưu blog
router.post('/add-blog', (req, res) => {
    const blogData = req.body;
    const newBlog = new BlogModel({ 
        title: blogData.title,
        content: blogData.content,
    });

    newBlog.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Đã xảy ra lỗi khi thêm blog.');
        });
});

// Lấy danh sách blog
router.get('/blogs', async (req, res) => {
    const blogPosts = await BlogModel.find(); // Sử dụng BlogModel thay vì Blog
    res.send(blogPosts);
});

// Lấy thông tin blog theo ID
router.get('/blog/:id', async (req, res) => {
    const blogId = req.params.id;
    const blogPost = await BlogModel.findById(blogId); // Sử dụng BlogModel thay vì Blog
    res.send(blogPost);
});
// Sửa blog
router.put('/edit-blog/:id', async (req, res) => {
    const blogId = req.params.id;
    const { title, content } = req.body;

    try {
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            blogId,
            { title, content },
            { new: true }
        );

        res.json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).send('Đã xảy ra lỗi khi cập nhật blog.');
    }
});

// Xóa blog
router.delete('/delete-blog/:id', async (req, res) => {
    const blogId = req.params.id;

    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).send('Không tìm thấy blog để xóa.');
        }

        res.json(deletedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).send('Đã xảy ra lỗi khi xóa blog.');
    }
});
module.exports = router;

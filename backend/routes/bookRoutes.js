const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lấy danh sách tất cả các sách
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
});

// Thêm sách mới (nếu frontend có tính năng này)
router.post('/', async (req, res, next) => {
    try {
        const { title, author, description, quantity } = req.body;
        const result = await pool.query(
            'INSERT INTO books (title, author, description, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, description, quantity]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
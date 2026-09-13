const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Lấy danh sách tài liệu thư viện
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM library ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST: Thêm tài liệu/tiêu chí mới
router.post('/', async (req, res) => {
    try {
        const { title, author, category, description } = req.body;
        const query = `
            INSERT INTO library (title, author, category, description) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const newItem = await pool.query(query, [title, author, category, description]);
        res.status(201).json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT: Cập nhật tài liệu/tiêu chí
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category, description } = req.body;
        const query = `
            UPDATE library 
            SET title = $1, author = $2, category = $3, description = $4 
            WHERE id = $5 
            RETURNING *
        `;
        const updated = await pool.query(query, [title, author, category, description, id]);
        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE: Xóa tài liệu
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM library WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa tài liệu thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
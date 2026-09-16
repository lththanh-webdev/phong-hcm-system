const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Lấy danh sách câu hỏi trắc nghiệm
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM quiz ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Lỗi lấy danh sách câu hỏi:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST: Thêm câu hỏi trắc nghiệm mới
router.post('/', async (req, res) => {
    try {
        const { question, options, correct_option, explanation } = req.body;
        const query = `
            INSERT INTO quiz (question, options, correct_option, explanation) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const newQuiz = await pool.query(query, [question, options, correct_option, explanation]);
        res.status(201).json(newQuiz.rows[0]);
    } catch (err) {
        console.error('Lỗi thêm câu hỏi:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// PUT: Cập nhật câu hỏi trắc nghiệm (Đã bổ sung thêm để hỗ trợ tính năng sửa trên Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { question, options, correct_option, explanation } = req.body;
        const query = `
            UPDATE quiz 
            SET question = $1, options = $2, correct_option = $3, explanation = $4 
            WHERE id = $5 
            RETURNING *
        `;
        const updated = await pool.query(query, [question, options, correct_option, explanation, id]);
        res.json(updated.rows[0]);
    } catch (err) {
        console.error('Lỗi cập nhật câu hỏi:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Xóa câu hỏi
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM quiz WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa câu hỏi thành công' });
    } catch (err) {
        console.error('Lỗi xóa câu hỏi:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Lấy danh sách câu hỏi
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM quiz ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST: Thêm câu hỏi trắc nghiệm
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE: Xóa câu hỏi
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM quiz WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa câu hỏi thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
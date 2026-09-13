const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách tri ân & tổng số lượt dâng hoa/thắp hương
router.get('/', async (req, res) => {
    try {
        const tributes = await db.query('SELECT * FROM tributes ORDER BY created_at DESC LIMIT 20');
        const countFlower = await db.query("SELECT COUNT(*) FROM tributes WHERE tribute_type = 'flower'");
        const countIncense = await db.query("SELECT COUNT(*) FROM tributes WHERE tribute_type = 'incense'");

        res.json({
            success: true,
            flowers: parseInt(countFlower.rows[0].count),
            incenses: parseInt(countIncense.rows[0].count),
            messages: tributes.rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// [MỚI] API dành cho Admin xem danh sách chi tiết những ai đã thắp hương
router.get('/admin/incenses', async (req, res) => {
    try {
        const query = `
            SELECT id, author_name, unit_name, message, created_at 
            FROM tributes 
            WHERE tribute_type = 'incense' 
            ORDER BY created_at DESC
        `;
        const result = await db.query(query);
        res.json({
            success: true,
            total: result.rowCount,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Gửi lượt Dâng hoa / Thắp hương mới
router.post('/', async (req, res) => {
    const { author_name, unit_name, tribute_type, message } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO tributes (author_name, unit_name, tribute_type, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [author_name || 'Chiến sĩ', unit_name || 'Đơn vị', tribute_type, message || 'Thành kính tưởng niệm']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
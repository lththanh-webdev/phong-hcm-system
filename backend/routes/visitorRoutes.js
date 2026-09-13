const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lấy danh sách lượt truy cập gần đây
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM visitor_logs ORDER BY created_at DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        console.error("Lỗi GET /api/visitors:", err.message);
        res.status(500).send('Server Error');
    }
});

// Ghi nhận lượt truy cập mới
router.post('/', async (req, res) => {
    try {
        const { endpoint } = req.body;
        const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const user_agent = req.headers['user-agent'];

        await pool.query(
            'INSERT INTO visitor_logs (ip_address, user_agent, endpoint) VALUES ($1, $2, $3)',
            [ip_address, user_agent, endpoint || '/']
        );
        res.status(201).send({ success: true });
    } catch (err) {
        console.error("Lỗi POST /api/visitors:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
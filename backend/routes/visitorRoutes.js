const express = require('express');
const router = express.Router();
const pool = require('../config/db');


router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM visitor_logs ORDER BY id DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        console.error("Lỗi GET /api/visitors:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { endpoint } = req.body;
        // Lấy IP chuẩn xác (tận dụng cấu hình trust proxy từ server.js)
        const ip_address = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const user_agent = req.headers['user-agent'] || '';

        await pool.query(
            'INSERT INTO visitor_logs (ip_address, user_agent, endpoint) VALUES ($1, $2, $3)',
            [ip_address, user_agent, endpoint || '/']
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Lỗi POST /api/visitors:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
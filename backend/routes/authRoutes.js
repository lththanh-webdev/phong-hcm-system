const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const upload = require('../middlewares/upload');
const verifyAdmin = require('../middlewares/auth');

// Tự động sinh khóa bí mật mới mỗi khi server restart (giúp reset toàn bộ token cũ khi build lại web)
const JWT_SECRET = process.env.JWT_SECRET || Math.random().toString(36) + Date.now().toString(36);

// Đăng nhập Admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRes = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userRes.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại' });
        }

        const user = userRes.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, user: { username: user.username, full_name: user.full_name } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// API Upload file dùng chung cho Admin
router.post('/upload', verifyAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Chưa chọn file upload' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

module.exports = router;
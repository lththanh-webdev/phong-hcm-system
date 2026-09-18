const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const upload = require('../middlewares/upload');
const verifyAdmin = require('../middlewares/auth');
const path = require('path');

// Import Supabase client từ file cấu hình dùng chung
const supabase = require('../config/supabase');

// Khuyến nghị: Nên đặt biến JWT_SECRET vào mục Environment trên Render, nếu không có sẽ dùng chuỗi mặc định an toàn này
const JWT_SECRET = process.env.JWT_SECRET || 'phong-hcm-secure-jwt-secret-key-2026';

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

        res.json({ 
            success: true, 
            token, 
            user: { username: user.username, full_name: user.full_name } 
        });
    } catch (err) {
        console.error('Lỗi đăng nhập:', err.message);
        res.status(500).json({ success: false, message: 'Lỗi Server: ' + err.message });
    }
});

// API Upload file dùng chung cho Admin (Đã chuyển sang Supabase Storage)
router.post('/upload', verifyAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Chưa chọn file upload' });
        }

        // 1. Tạo tên file độc đáo tránh trùng lặp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + path.extname(req.file.originalname);
        const filePath = `public/${fileName}`; // Thư mục lưu bên trong Bucket trên Supabase

        // 2. Upload file dạng Buffer lên Supabase Storage (Bucket 'uploads')
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (uploadError) {
            throw new Error(uploadError.message);
        }

        // 3. Lấy Public URL vĩnh viễn từ Supabase Storage
        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath);
        
        res.json({ success: true, fileUrl: publicUrl });
    } catch (err) {
        console.error('Lỗi upload file:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
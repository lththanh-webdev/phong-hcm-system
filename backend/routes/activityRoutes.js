const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET: Lấy danh sách hoạt động (Sắp xếp an toàn theo id giảm dần)
router.get('/', async (req, res) => {
    try {
        // Dùng ORDER BY id DESC để tránh lỗi nếu bảng chưa tạo cột created_at
        const result = await pool.query('SELECT * FROM activities ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Lỗi lấy danh sách hoạt động:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST: Thêm hoạt động mới
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, category, summary, content, created_at } = req.body;
        let image_url = null;
        
        if (req.file) {
            // Tự động nhận diện domain hiện tại (Hỗ trợ cả Localhost và Render Cloud)
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            image_url = `${baseUrl}/uploads/${req.file.filename}`;
        }

        let query, values;
        if (created_at && created_at.trim() !== '') {
            query = `
                INSERT INTO activities (title, category, summary, content, image_url, created_at) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *
            `;
            values = [title, category, summary, content, image_url, created_at];
        } else {
            query = `
                INSERT INTO activities (title, category, summary, content, image_url) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *
            `;
            values = [title, category, summary, content, image_url];
        }

        const newActivity = await pool.query(query, values);
        res.status(201).json(newActivity.rows[0]);
    } catch (err) {
        console.error('Lỗi thêm hoạt động:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// PUT: Cập nhật hoạt động
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, summary, content, created_at } = req.body;
        let image_url = null;
        
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            image_url = `${baseUrl}/uploads/${req.file.filename}`;
        }

        let query, values;
        if (image_url && created_at && created_at.trim() !== '') {
            query = `UPDATE activities SET title=$1, category=$2, summary=$3, content=$4, image_url=$5, created_at=$6 WHERE id=$7 RETURNING *`;
            values = [title, category, summary, content, image_url, created_at, id];
        } else if (image_url) {
            query = `UPDATE activities SET title=$1, category=$2, summary=$3, content=$4, image_url=$5 WHERE id=$6 RETURNING *`;
            values = [title, category, summary, content, image_url, id];
        } else if (created_at && created_at.trim() !== '') {
            query = `UPDATE activities SET title=$1, category=$2, summary=$3, content=$4, created_at=$5 WHERE id=$6 RETURNING *`;
            values = [title, category, summary, content, created_at, id];
        } else {
            query = `UPDATE activities SET title=$1, category=$2, summary=$3, content=$4 WHERE id=$5 RETURNING *`;
            values = [title, category, summary, content, id];
        }

        const updated = await pool.query(query, values);
        res.json(updated.rows[0]);
    } catch (err) {
        console.error('Lỗi cập nhật hoạt động:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Xóa hoạt động
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM activities WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa hoạt động thành công' });
    } catch (err) {
        console.error('Lỗi xóa hoạt động:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
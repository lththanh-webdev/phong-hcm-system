const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET: Lấy danh sách media (Sắp xếp an toàn theo id giảm dần)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM media ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Lỗi lấy danh sách media:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST: Tải lên file MP3/MP4 mới
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, artist, media_type } = req.body;
        let file_url = '';
        
        if (req.file) {
            // Tự động nhận diện domain chuẩn trên Render hoặc Localhost
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            file_url = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const query = `
            INSERT INTO media (title, artist, media_type, file_url) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const newMedia = await pool.query(query, [title, artist, media_type, file_url]);
        res.status(201).json(newMedia.rows[0]);
    } catch (err) {
        console.error('Lỗi tải lên media:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Xóa bản ghi media
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM media WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa media thành công' });
    } catch (err) {
        console.error('Lỗi xóa media:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
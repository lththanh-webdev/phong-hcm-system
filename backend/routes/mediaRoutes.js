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

// GET: Lấy danh sách media
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST: Tải lên file MP3/MP4 mới
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, artist, media_type } = req.body;
        const file_url = req.file ? `/uploads/${req.file.filename}` : '';

        const query = `
            INSERT INTO media (title, artist, media_type, file_url) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const newMedia = await pool.query(query, [title, artist, media_type, file_url]);
        res.status(201).json(newMedia.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE: Xóa bản ghi media
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM media WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa media thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
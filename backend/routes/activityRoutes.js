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

// GET: Lấy danh sách hoạt động
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM activities ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST: Thêm hoạt động mới
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, category, summary, content, created_at } = req.body;
        let image_url = null;
        if (req.file) {
            image_url = `http://localhost:5002/uploads/${req.file.filename}`;
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT: Cập nhật hoạt động
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, summary, content, created_at } = req.body;
        let image_url = null;
        if (req.file) {
            image_url = `http://localhost:5002/uploads/${req.file.filename}`;
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE: Xóa hoạt động
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM activities WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa hoạt động thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
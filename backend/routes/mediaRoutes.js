const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Khởi tạo Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Sử dụng memoryStorage để giữ file trong RAM dạng Buffer (tránh ghi vào ổ đĩa tạm của Render)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Giới hạn tối đa 50MB cho file nhạc/video
});

// Hàm hỗ trợ upload lên Supabase Storage và trả về Public URL vĩnh viễn
async function uploadToSupabase(file) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    const filePath = `public/${fileName}`; // Thư mục lưu bên trong Bucket trên Supabase

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads') 
        .upload(filePath, file.buffer, {
            contentType: file.mimetype, // Cực kỳ quan trọng để nhận diện MP3, MP4, Ảnh
            upsert: false
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    // Lấy Public URL chuẩn Cloud của file
    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Hàm hỗ trợ xóa file trên Supabase Storage khi xóa bản ghi
async function deleteFromSupabase(fileUrl) {
    if (!fileUrl) return;
    try {
        const marker = '/uploads/';
        const parts = fileUrl.split(marker);
        if (parts.length > 1) {
            const filePath = parts[1]; // Lấy đường dẫn phía sau bucket (ví dụ: public/17000000-abc.mp4)
            await supabase.storage.from('uploads').remove([filePath]);
        }
    } catch (err) {
        console.error('Lỗi khi xóa file trên Supabase:', err.message);
    }
}

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

// POST: Tải lên file MP3/MP4/Ảnh mới lên Supabase Storage
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, artist, media_type } = req.body;
        let file_url = '';
        
        if (req.file) {
            // Đẩy tệp trực tiếp lên Supabase
            file_url = await uploadToSupabase(req.file);
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

// DELETE: Xóa bản ghi media VÀ xóa luôn file tương ứng trên Supabase Storage
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Lấy file_url để biết đường dẫn file cần xóa trên Supabase
        const oldRecord = await pool.query('SELECT file_url FROM media WHERE id = $1', [id]);
        if (oldRecord.rows.length > 0 && oldRecord.rows[0].file_url) {
            await deleteFromSupabase(oldRecord.rows[0].file_url);
        }

        // 2. Xóa dữ liệu trong PostgreSQL
        await pool.query('DELETE FROM media WHERE id = $1', [id]);
        
        res.json({ message: 'Đã xóa media và tệp liên quan thành công!' });
    } catch (err) {
        console.error('Lỗi xóa media:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
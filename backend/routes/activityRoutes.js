const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

// Import Supabase client từ file cấu hình dùng chung
const supabase = require('../config/supabase');

// Cấu hình Multer lưu file tạm vào RAM (Memory Storage) dưới dạng Buffer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Giới hạn tối đa 50MB (đủ cho Ảnh, MP3, Video MP4 dung lượng vừa)
});

// Hàm hỗ trợ upload lên Supabase Storage và trả về Public URL
async function uploadToSupabase(file) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    const filePath = `public/${fileName}`; // Thư mục lưu bên trong Bucket 'uploads'

    // Tiến hành upload buffer lên Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads') // Đảm bảo tên bucket chính xác trên Supabase của bạn là 'uploads'
        .upload(filePath, file.buffer, {
            contentType: file.mimetype, // CỰC KỲ QUAN TRỌNG: Giúp trình duyệt nhận diện đúng định dạng ảnh, mp3 hay mp4
            upsert: false
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    // Lấy Public URL vĩnh viễn của file
    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Hàm hỗ trợ xóa file rác trên Supabase Storage
async function deleteFromSupabase(fileUrl) {
    if (!fileUrl) return;
    try {
        const marker = '/uploads/';
        const parts = fileUrl.split(marker);
        if (parts.length > 1) {
            const filePath = parts[1]; // Lấy phần đường dẫn phía sau bucket (ví dụ: public/17000000-abc.mp4)
            await supabase.storage.from('uploads').remove([filePath]);
        }
    } catch (err) {
        console.error('Lỗi khi xóa file cũ trên Supabase:', err.message);
    }
}

// ================= ROUTE XỬ LÝ =================

// GET: Lấy danh sách hoạt động
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM activities ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Lỗi lấy danh sách hoạt động:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST: Thêm hoạt động mới (Hỗ trợ upload file ảnh, mp3, mp4)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, category, summary, content, created_at } = req.body;
        let image_url = null;
        
        if (req.file) {
            // Đẩy tệp lên Supabase Storage
            image_url = await uploadToSupabase(req.file);
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

// PUT: Cập nhật hoạt động (Thay file mới thì tự động xóa file cũ trên Storage)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, summary, content, created_at } = req.body;
        
        // Lấy thông tin record hiện tại trong database
        const oldRecord = await pool.query('SELECT image_url FROM activities WHERE id = $1', [id]);
        let image_url = oldRecord.rows.length > 0 ? oldRecord.rows[0].image_url : null;
        
        if (req.file) {
            // Nếu người dùng chọn tải lên file mới, xóa file cũ đi trước để tiết kiệm dung lượng Supabase
            if (image_url) {
                await deleteFromSupabase(image_url);
            }
            // Upload file mới lên Supabase
            image_url = await uploadToSupabase(req.file);
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

// DELETE: Xóa hoạt động (Đồng thời xóa tệp trên Supabase Storage)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Lấy đường dẫn file để xóa khỏi Supabase Storage trước khi xóa dòng trong database
        const oldRecord = await pool.query('SELECT image_url FROM activities WHERE id = $1', [id]);
        if (oldRecord.rows.length > 0 && oldRecord.rows[0].image_url) {
            await deleteFromSupabase(oldRecord.rows[0].image_url);
        }

        await pool.query('DELETE FROM activities WHERE id = $1', [id]);
        res.json({ message: 'Đã xóa hoạt động và tệp liên quan thành công!' });
    } catch (err) {
        console.error('Lỗi xóa hoạt động:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
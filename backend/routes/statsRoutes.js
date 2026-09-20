const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Lấy thống kê số lượng dữ liệu toàn hệ thống từ Supabase
router.get('/', async (req, res) => {
    try {
        // Thực hiện đếm số lượng bản ghi từ các bảng đồng thời bằng Promise.all để tối ưu tốc độ
        const [
            activitiesRes, 
            libraryRes, 
            mediaRes, 
            quizRes, 
            visitorRes, 
            feedbacksRes, 
            booksRes, 
            borrowedBooksRes
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM activities'),
            pool.query('SELECT COUNT(*) FROM library'),
            pool.query('SELECT COUNT(*) FROM media'),
            pool.query('SELECT COUNT(*) FROM quiz'),
            // Phòng hờ nếu bảng visitor_logs chưa có thì trả về 0 để không làm sập API
            pool.query('SELECT COUNT(*) FROM visitor_logs').catch(() => ({ rows: [{ count: 0 }] })),
            // Bổ sung đếm tổng số bản ghi từ bảng feedbacks
            pool.query('SELECT COUNT(*) FROM feedbacks').catch(() => ({ rows: [{ count: 0 }] })),
            // Tổng số lượng sách trong bảng books
            pool.query('SELECT COUNT(*) FROM books').catch(() => ({ rows: [{ count: 0 }] })),
            // Số lượng sách đang mượn trong bảng books (dựa vào trạng thái status hoặc is_borrowed)
            pool.query("SELECT COUNT(*) FROM books WHERE status = 'borrowed' OR status = 'Đang mượn' OR is_borrowed = true").catch(() => ({ rows: [{ count: 0 }] }))
        ]);

        res.status(200).json({
            success: true,
            data: {
                activities: parseInt(activitiesRes.rows[0].count, 10) || 0,
                library: parseInt(libraryRes.rows[0].count, 10) || 0,
                media: parseInt(mediaRes.rows[0].count, 10) || 0,
                quizzes: parseInt(quizRes.rows[0].count, 10) || 0,
                visitors: parseInt(visitorRes.rows[0].count, 10) || 0,
                feedbacks: parseInt(feedbacksRes.rows[0].count, 10) || 0,
                books: parseInt(booksRes.rows[0].count, 10) || 0,
                borrowings: parseInt(borrowedBooksRes.rows[0].count, 10) || 0
            }
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê hệ thống:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
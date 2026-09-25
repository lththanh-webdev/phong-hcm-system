const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. Lấy danh sách phiếu mượn (kết hợp JOIN với bảng library để lấy tên sách - book_title)
router.get('/', async (req, res, next) => {
    try {
        const query = `
            SELECT b.*, l.title as book_title 
            FROM books b 
            LEFT JOIN library l ON b.library_id = l.id 
            ORDER BY b.id DESC
        `;
        const result = await pool.query(query);
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
});

// 2. Tạo phiếu mượn sách mới (POST /api/books)
router.post('/', async (req, res, next) => {
    try {
        const { library_id, user_name, rank, position, borrow_date } = req.body;
        
        // Xử lý ngày mượn và tính hạn trả tự động sau 7 ngày
        const bDate = borrow_date ? new Date(borrow_date) : new Date();
        const dueDate = new Date(bDate);
        dueDate.setDate(dueDate.getDate() + 7);

        const formattedBorrowDate = bDate.toISOString().split('T')[0];
        const formattedDueDate = dueDate.toISOString().split('T')[0];

        // Thực hiện thêm vào bảng books với các cột chuẩn xác
        const result = await pool.query(
            `INSERT INTO books (library_id, user_name, rank, position, borrow_date, due_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [library_id, user_name, rank, position, formattedBorrowDate, formattedDueDate, 'borrowed']
        );

        // Cập nhật trạng thái cuốn sách trong bảng library thành 'borrowed'
        if (library_id) {
            await pool.query(
                `UPDATE library SET status = 'borrowed' WHERE id = $1`,
                [library_id]
            );
        }

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// 3. Xác nhận trả sách (PUT /api/books/:id/return)
router.put('/:id/return', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { return_date } = req.body;
        const rDate = return_date || new Date().toISOString().split('T')[0];

        // Lấy thông tin phiếu mượn để biết library_id tương ứng
        const borrowRecord = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (borrowRecord.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn' });
        }
        const libraryId = borrowRecord.rows[0].library_id;

        // Cập nhật trạng thái phiếu mượn thành 'returned'
        const result = await pool.query(
            `UPDATE books SET status = 'returned', return_date = $1 WHERE id = $2 RETURNING *`,
            [rDate, id]
        );

        // Cập nhật lại trạng thái sách trong bảng library thành 'available'
        if (libraryId) {
            await pool.query(
                `UPDATE library SET status = 'available' WHERE id = $1`,
                [libraryId]
            );
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// 4. Xóa bản ghi phiếu mượn (DELETE /api/books/:id)
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi cần xóa' });
        }

        res.json({
            success: true,
            message: 'Đã xóa bản ghi thành công'
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
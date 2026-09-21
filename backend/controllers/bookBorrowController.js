const pool = require('../config/db');

// Hàm tính hạn trả (7 ngày sau ngày mượn)
function calculateDueDate(borrowDateStr) {
    const d = borrowDateStr ? new Date(borrowDateStr) : new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
}

// 1. GET: Lấy danh sách mượn/trả (Kết hợp JOIN với bảng library)
exports.getAllBorrows = async (req, res) => {
    try {
        const query = `
            SELECT b.*, l.title as book_title, l.so_vao_so, l.category, l.author 
            FROM books b
            LEFT JOIN library l ON b.library_id = l.id
            ORDER BY b.id DESC
        `;
        const result = await pool.query(query);

        const today = new Date().toISOString().split('T')[0];
        const formattedData = result.rows.map(item => ({
            id: item.id,
            library_id: item.library_id,
            book_title: item.book_title || 'Sách đã xóa',
            so_vao_so: item.so_vao_so || '',
            category: item.category || '',
            author: item.author || '',
            user_name: item.user_name,
            rank: item.rank,
            position: item.position,
            borrow_date: item.borrow_date ? item.borrow_date.toISOString().split('T')[0] : '',
            due_date: item.due_date ? item.due_date.toISOString().split('T')[0] : '',
            return_date: item.return_date ? item.return_date.toISOString().split('T')[0] : null,
            status: item.status,
            isOverdue: item.status === 'borrowed' && item.due_date && new Date(item.due_date).toISOString().split('T')[0] < today
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        console.error('Lỗi lấy danh sách mượn sách:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. POST: Đăng ký mượn & Cập nhật trạng thái sách trong library
exports.createBorrow = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { library_id, user_name, rank, position, borrow_date } = req.body;

        if (!library_id || !user_name) {
            return res.status(400).json({ error: 'Thiếu thông tin sách hoặc tên người mượn' });
        }

        const bDate = borrow_date || new Date().toISOString().split('T')[0];
        const dDate = calculateDueDate(bDate);

        // Thêm bản ghi vào bảng books
        const insertQuery = `
            INSERT INTO books (library_id, user_name, rank, position, borrow_date, due_date, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'borrowed')
            RETURNING *;
        `;
        const borrowResult = await client.query(insertQuery, [library_id, user_name, rank || '', position || '', bDate, dDate]);

        // Cập nhật trạng thái sách trong bảng library thành 'borrowed'
        await client.query(`UPDATE library SET status = 'borrowed' WHERE id = $1`, [library_id]);

        await client.query('COMMIT');
        res.status(201).json(borrowResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Lỗi tạo phiếu mượn:', err.message);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// 3. PUT: Trả sách & Cập nhật trạng thái sách về 'available'
exports.returnBook = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { return_date } = req.body;
        const rDate = return_date || new Date().toISOString().split('T')[0];

        // Lấy library_id của phiếu mượn
        const getRecord = await client.query('SELECT library_id FROM books WHERE id = $1', [id]);
        if (getRecord.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Không tìm thấy phiếu mượn này' });
        }
        const library_id = getRecord.rows[0].library_id;

        // Cập nhật trạng thái phiếu mượn thành returned
        await client.query(
            `UPDATE books SET status = 'returned', return_date = $1 WHERE id = $2`,
            [rDate, id]
        );

        // Cập nhật lại sách trong library thành available
        if (library_id) {
            await client.query(`UPDATE library SET status = 'available' WHERE id = $1`, [library_id]);
        }

        await client.query('COMMIT');
        res.json({ message: 'Xác nhận trả sách thành công' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Lỗi trả sách:', err.message);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// 4. DELETE: Xóa phiếu mượn
exports.deleteBorrow = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu mượn cần xóa' });
        }
        res.json({ message: 'Đã xóa bản ghi mượn sách' });
    } catch (err) {
        console.error('Lỗi xóa phiếu mượn:', err.message);
        res.status(500).json({ error: err.message });
    }
};
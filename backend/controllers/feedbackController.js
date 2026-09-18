const pool = require('../config/db');

// 1. Tạo mới một góp ý (Dành cho người dùng gửi lên từ giao diện)
exports.createFeedback = async (req, res) => {
    try {
        const { name, email, content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Nội dung góp ý không được để trống!' 
            });
        }

        const query = `
            INSERT INTO feedbacks (name, email, content, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING *;
        `;
        const values = [name ? name.trim() : 'Ẩn danh', email ? email.trim() : '', content.trim()];
        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Gửi hòm thư góp ý thành công! Xin cảm ơn ý kiến đóng góp của đồng chí.',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Lỗi khi lưu góp ý:', err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server khi gửi góp ý, vui lòng thử lại sau.' 
        });
    }
};

// 2. Lấy danh sách toàn bộ góp ý (Dành cho trang Quản trị Admin)
exports.getAllFeedbacks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách góp ý:', err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server khi tải danh sách góp ý.' 
        });
    }
};

// 3. Xóa góp ý theo ID (Dành cho Admin xử lý)
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM feedbacks WHERE id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy góp ý cần xóa.' });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa góp ý thành công.'
        });
    } catch (err) {
        console.error('Lỗi khi xóa góp ý:', err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server khi xóa góp ý.' 
        });
    }
};
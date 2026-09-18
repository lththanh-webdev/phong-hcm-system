const pool = require('../config/db');

// 1. Lấy toàn bộ danh sách góp ý cho trang Admin
exports.getAllFeedback = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Lỗi lấy danh sách:', err.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách.' });
    }
};

// 2. Người dùng gửi góp ý/tin nhắn lần đầu (Chatbot phản hồi NGAY LẬP TỨC)
exports.createFeedback = async (req, res) => {
    try {
        const { name, unit, category, content } = req.body;
        if (!name || !unit || !content) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc!' });
        }

        // Nội dung chào mừng tự động của Chatbot lần đầu
        const initialAiReply = `🤖 [Trợ lý AI]: Chào đồng chí ${name} (${unit}), hệ thống đã tiếp nhận ý kiến của đơn vị. Ban biên tập sẽ xem xét và phản hồi trong thời gian sớm nhất!`;

        const query = `
            INSERT INTO feedback (name, unit, category, content, status, admin_reply, created_at) 
            VALUES ($1, $2, $3, $4, 'pending', $5, NOW()) 
            RETURNING *;
        `;
        const result = await pool.query(query, [name, unit, category || 'Chung', content, initialAiReply]);

        res.status(201).json({
            success: true,
            message: 'Gửi thành công!',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Lỗi tạo góp ý:', err.message);
        res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

// 3. Người dùng gửi thêm tin nhắn tiếp theo (Áp dụng quy tắc Chatbot thông minh 1 tiếng)
exports.sendFollowUpMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { newContent } = req.body;

        const fbCheck = await pool.query('SELECT * FROM feedback WHERE id = $1', [id]);
        if (fbCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nội dung góp ý.' });
        }
        const fb = fbCheck.rows[0];

        // 🕒 Kiểm tra quy tắc 1 tiếng
        let shouldAIBotReply = false;
        const now = new Date();

        if (!fb.last_admin_reply_at) {
            // Nếu admin chưa từng phản hồi, tính từ lúc tạo/nhắn tin lần đầu
            const createdAt = new Date(fb.created_at);
            const diffHours = (now - createdAt) / (1000 * 60 * 60);
            if (diffHours >= 1) shouldAIBotReply = true;
        } else {
            // Nếu admin đã phản hồi trước đó, tính thời gian từ lần admin phản hồi cuối
            const lastAdminReply = new Date(fb.last_admin_reply_at);
            const diffHours = (now - lastAdminReply) / (1000 * 60 * 60);
            if (diffHours >= 1) shouldAIBotReply = true;
        }

        // Cập nhật thêm nội dung tin nhắn mới vào cột content
        const updatedContent = `${fb.content}\n[Bổ sung]: ${newContent}`;
        let updatedAdminReply = fb.admin_reply;

        if (shouldAIBotReply) {
            // Nếu quá 1 tiếng mà admin chưa vào trả lời -> Chatbot lên tiếng hỗ trợ tiếp
            updatedAdminReply += `\n🤖 [Trợ lý AI]: Do quá 1 tiếng Ban biên tập chưa phản hồi trực tiếp, hệ thống ghi nhận ý kiến bổ sung của đồng chí và tiếp tục chuyển lịch trực tiếp đến chỉ huy đơn vị.`;
        } else {
            // Dưới 1 tiếng: Chatbot hoàn toàn giữ im lặng, không phản hồi thêm để chờ Admin
            console.log('Chưa đủ 1 tiếng, chatbot im lặng để nhường quyền cho Admin.');
        }

        const updateQuery = `
            UPDATE feedback 
            SET content = $1, admin_reply = $2, status = 'pending' 
            WHERE id = $3 
            RETURNING *;
        `;
        const updateResult = await pool.query(updateQuery, [updatedContent, updatedAdminReply, id]);

        res.json({
            success: true,
            bot_replied: shouldAIBotReply,
            message: shouldAIBotReply ? 'Chatbot đã tự động trả lời do quá 1 tiếng.' : 'Đã gửi tin nhắn, chatbot đang chờ admin xử lý.',
            data: updateResult.rows[0]
        });

    } catch (err) {
        console.error('Lỗi follow-up:', err.message);
        res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

// 4. Admin phản hồi trực tiếp (Lưu mốc thời gian `last_admin_reply_at`)
exports.adminReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyContent } = req.body;

        if (!replyContent) {
            return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được để trống.' });
        }

        const query = `
            UPDATE feedback 
            SET admin_reply = admin_reply || E'\\n[Admin Phản Hồi]: ' || $1, 
                status = 'replied', 
                last_admin_reply_at = NOW() 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await pool.query(query, [replyContent, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy ID góp ý.' });
        }

        res.json({ success: true, message: 'Đã gửi phản hồi từ Admin thành công!', data: result.rows[0] });
    } catch (err) {
        console.error('Lỗi admin reply:', err.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi phản hồi.' });
    }
};

// 5. Xóa góp ý
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM feedback WHERE id = $1', [id]);
        res.json({ success: true, message: 'Đã xóa thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa.' });
    }
};
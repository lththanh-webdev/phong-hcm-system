const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

// 🌐 Cấu hình trust proxy (Giúp server nhận đúng IP người dùng thực tế khi chạy trên Render/Vercel)
app.set('trust proxy', true);

// 🛠️ Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 Middleware tự động ghi nhận lượt truy cập website vào Database
app.use(async (req, res, next) => {
    // Chỉ ghi log cho các request gọi vào đường dẫn /api
    if (req.path.startsWith('/api')) {
        try {
            const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'] || '';
            const endpoint = req.originalUrl;
            
            await pool.query(
                'INSERT INTO visitor_logs (ip_address, user_agent, endpoint) VALUES ($1, $2, $3)',
                [ip, userAgent, endpoint]
            );
        } catch (err) {
            console.error('Lỗi ghi nhận visitor log:', err.message);
        }
    }
    next();
});

// 🚀 Khai báo các Routes chính của hệ thống
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/tributes', require('./routes/tributeRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));        // Thống kê truy cập
app.use('/api/visitors', require('./routes/visitorRoutes')); // Quản lý visitor
app.use('/api/feedback', require('./routes/feedbackRoutes')); // 🌟 Quản lý Hòm thư góp ý

// 🏠 Trang chủ API kiểm tra trạng thái server
app.get('/', (req, res) => {
    res.json({ message: '[Phòng Hồ Chí Minh Server] API đang hoạt động bình thường trên Cloud Storage!' });
});

app.use('/api/borrows', require('./routes/bookBorrowRoutes'));

// 🛡️ Middleware xử lý lỗi tập trung toàn cục (Global Error Handler)
app.use((err, req, res, next) => {
    console.error('Lỗi Server không bắt được:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Đã xảy ra lỗi hệ thống nội bộ!', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// 🔌 Khởi động Server
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
    console.log(`[Phòng Hồ Chí Minh Server] API đang chạy tại cổng ${PORT}`);
});

// Xử lý đóng ứng dụng an toàn (Graceful Shutdown)
process.on('SIGTERM', () => {
    console.log('Nhận tín hiệu tắt server, đang dọn dẹp kết nối...');
    server.close(() => {
        pool.end();
        console.log('Đã đóng kết nối Database và Server.');
        process.exit(0);
    });
});
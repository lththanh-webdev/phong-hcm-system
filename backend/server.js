const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
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


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/tributes', require('./routes/tributeRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));
app.use('/api/borrowings', require('./routes/bookBorrowRoutes')); // Giữ lại 1 dòng duy nhất ở đây


app.get('/', (req, res) => {
    res.json({ message: '[Phòng Hồ Chí Minh Server] API đang hoạt động bình thường trên Cloud Storage!' });
});

app.use((err, req, res, next) => {
    console.error('Lỗi Server không bắt được:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Đã xảy ra lỗi hệ thống nội bộ!', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});


const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
    console.log(`[Phòng Hồ Chí Minh Server] API đang chạy tại cổng ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('Nhận tín hiệu tắt server, đang dọn dẹp kết nối...');
    server.close(() => {
        pool.end();
        console.log('Đã đóng kết nối Database và Server.');
        process.exit(0);
    });
});
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware tự động ghi nhận lượt truy cập website vào Database
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'] || '';
            const endpoint = req.originalUrl;
            await pool.query(
                'INSERT INTO visitor_logs (ip_address, user_agent, endpoint) VALUES ($1, $2, $3)',
                [ip, userAgent, endpoint]
            );
        } catch (err) {
            // Bỏ qua lỗi log để không ảnh hưởng luồng chính
        }
    }
    next();
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Routes Integration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/tributes', require('./routes/tributeRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/stats', require('./routes/statsRoutes')); // Thống kê truy cập
app.use('/api/visitors', require('./routes/visitorRoutes'));

const PORT = process.env.PORT || 5002;

// Trang chủ API cơ bản
app.get('/', (req, res) => {
    res.json({ message: '[Phòng Hồ Chí Minh Server] API đang hoạt động bình thường!' });
});

app.listen(PORT, () => {
    console.log(`[Phòng Hồ Chí Minh Server] API đang chạy tại http://localhost:${PORT}`);
});
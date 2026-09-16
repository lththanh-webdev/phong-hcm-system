const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({ success: false, message: 'Rất tiếc, bạn chưa đăng nhập!' });
    }

    // Đồng bộ chuỗi khóa bí mật dự phòng với file authRoutes.js
    const JWT_SECRET = process.env.JWT_SECRET || 'phong-hcm-secure-jwt-secret-key-2026';

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyAdmin;
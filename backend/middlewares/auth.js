const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({ success: false, message: 'Rất tiếc, bạn chưa đăng nhập!' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key_phong_hcm', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyAdmin;
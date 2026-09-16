const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Sử dụng đường dẫn tuyệt đối để đảm bảo an toàn tuyệt đối khi chạy trên Render/Cloud
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Đặt tên file theo Unix Timestamp để tránh trùng lặp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn tối đa 50MB (cho nhạc, video, tài liệu)
});

module.exports = upload;
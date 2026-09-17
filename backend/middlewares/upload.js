const multer = require('multer');

// Sử dụng memoryStorage để lưu file tạm vào RAM dưới dạng Buffer (không ghi vào ổ đĩa Render)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn tối đa 50MB (ảnh, tài liệu, video, nhạc)
});

module.exports = upload;
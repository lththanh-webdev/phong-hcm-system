const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
// (Tùy chọn) Import middleware xác thực token Admin nếu có:
// const verifyToken = require('../middlewares/authMiddleware');

// Route công khai cho phép người dùng gửi góp ý
router.post('/', feedbackController.createFeedback);

// Route dành cho Admin xem danh sách góp ý
router.get('/', feedbackController.getAllFeedbacks); 

// Route dành cho Admin xóa góp ý theo ID
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
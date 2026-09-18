const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/', feedbackController.getAllFeedback);
router.post('/', feedbackController.createFeedback);
router.post('/message/:id', feedbackController.sendFollowUpMessage); // Gửi tin nhắn tiếp theo (kiểm tra 1 tiếng)
router.put('/reply/:id', feedbackController.adminReply); // Admin phản hồi
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
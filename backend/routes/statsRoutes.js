const express = require('express');
const router = express.Router();

// Định nghĩa API lấy thống kê hệ thống
router.get('/', async (req, res) => {
  try {
 

    res.status(200).json({
      success: true,
      data: {
        activities: 0,
        library: 0,
        media: 0,
        quizzes: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
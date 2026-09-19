const express = require('express');
const router = express.Router();
const bookBorrowController = require('../controllers/bookBorrowController');
const verifyAdmin = require('../middlewares/auth');

// GET: Lấy danh sách phiếu mượn trả
router.get('/', bookBorrowController.getAllBorrows);

// POST: Tạo phiếu mượn sách mới (Yêu cầu quyền Admin)
router.post('/', verifyAdmin, bookBorrowController.createBorrow);

// PUT: Xác nhận trả sách (Yêu cầu quyền Admin)
router.put('/:id/return', verifyAdmin, bookBorrowController.returnBook);

// DELETE: Xóa phiếu mượn (Yêu cầu quyền Admin)
router.delete('/:id', verifyAdmin, bookBorrowController.deleteBorrow);

module.exports = router;
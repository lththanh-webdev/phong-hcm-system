const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const verifyAdmin = require('../middlewares/auth');

// GET: Lấy danh sách tài liệu (Public - Hỗ trợ Tìm kiếm, Lọc mảng sách, Sắp xếp A-Z)
router.get('/', libraryController.getAllBooks);

// GET: Lấy chi tiết 1 tài liệu theo ID (Public)
router.get('/:id', libraryController.getBookById);

// POST: Thêm tài liệu mới (Yêu cầu quyền Admin)
router.post('/', verifyAdmin, libraryController.createBook);

// PUT: Cập nhật thông tin tài liệu (Yêu cầu quyền Admin)
router.put('/:id', verifyAdmin, libraryController.updateBook);

// DELETE: Xóa tài liệu khỏi thư viện (Yêu cầu quyền Admin)
router.delete('/:id', verifyAdmin, libraryController.deleteBook);

module.exports = router;
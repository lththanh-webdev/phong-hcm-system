// controllers/libraryController.js
const supabase = require('../config/supabase');

// 1. GET: Lấy danh sách tài liệu (Hỗ trợ Tìm kiếm, Lọc mảng sách, Sắp xếp A-Z)
exports.getAllBooks = async (req, res) => {
    try {
        const { category, search, sortKey, sortOrder } = req.query;

        let query = supabase.from('library').select('*');

        // Lọc theo mảng sách
        if (category && category !== 'Tất cả sách') {
            query = query.eq('category', category);
        }

        // Tìm kiếm theo tên sách, tác giả, số vào sổ, môn loại
        if (search) {
            query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,so_vao_so.ilike.%${search}%,mon_loai.ilike.%${search}%`);
        }

        // Sắp xếp động
        const column = sortKey || 'id';
        const isAscending = sortOrder === 'asc';
        query = query.order(column, { ascending: isAscending });

        const { data, error } = await query;
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Lỗi lấy danh sách thư viện:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. GET: Lấy chi tiết 1 cuốn sách
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('library')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'Không tìm thấy tài liệu' });
    }
};

// 3. POST: Thêm tài liệu mới (10 trường chính + phụ)
exports.createBook = async (req, res) => {
    try {
        const {
            title, author, category, description,
            noi_xuat_ban, nam_xuat_ban, kho_sach, so_trang, gia_tien, so_vao_so, mon_loai,
            ngay_vao_so, ngay_xuat, phu_chu
        } = req.body;

        const { data, error } = await supabase
            .from('library')
            .insert([{
                title, author, category, description: description || '',
                noi_xuat_ban, nam_xuat_ban, kho_sach, so_trang, gia_tien, so_vao_so, mon_loai,
                ngay_vao_so, ngay_xuat, phu_chu,
                status: 'available'
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Lỗi thêm tài liệu:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 4. PUT: Cập nhật tài liệu
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const { data, error } = await supabase
            .from('library')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        console.error('Lỗi cập nhật tài liệu:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 5. DELETE: Xóa tài liệu
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('library').delete().eq('id', id);

        if (error) throw error;
        res.json({ message: 'Đã xóa tài liệu thành công' });
    } catch (err) {
        console.error('Lỗi xóa tài liệu:', err.message);
        res.status(500).json({ error: err.message });
    }
};
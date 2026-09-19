// controllers/bookBorrowController.js
const supabase = require('../config/supabase');

function calculateDueDate(borrowDateStr) {
    const d = borrowDateStr ? new Date(borrowDateStr) : new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
}

// 1. GET: Lấy danh sách mượn/trả (Kèm liên kết bảng library)
exports.getAllBorrows = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('books')
            .select(`
                *,
                library (
                    id, title, author, category, so_vao_so, mon_loai
                )
            `)
            .order('id', { ascending: false });

        if (error) throw error;

        const today = new Date().toISOString().split('T')[0];
        const formattedData = data.map(item => ({
            id: item.id,
            library_id: item.library_id,
            book_title: item.library?.title || 'Sách đã xóa',
            so_vao_so: item.library?.so_vao_so || '',
            category: item.library?.category || '',
            user_name: item.user_name,
            rank: item.rank,
            position: item.position,
            borrow_date: item.borrow_date,
            due_date: item.due_date,
            return_date: item.return_date,
            status: item.status,
            isOverdue: item.status === 'borrowed' && item.due_date && item.due_date < today
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Lỗi lấy danh sách mượn sách:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. POST: Đăng ký mượn & Đổi trạng thái sách sang 'borrowed'
exports.createBorrow = async (req, res) => {
    try {
        const { library_id, user_name, rank, position, borrow_date } = req.body;

        if (!library_id || !user_name) {
            return res.status(400).json({ error: 'Thiếu thông tin sách hoặc tên người mượn' });
        }

        const bDate = borrow_date || new Date().toISOString().split('T')[0];
        const dDate = calculateDueDate(bDate);

        // Tạo phiếu mượn
        const { data: borrowData, error: borrowError } = await supabase
            .from('books')
            .insert([{
                library_id,
                user_name,
                rank: rank || '',
                position: position || '',
                borrow_date: bDate,
                due_date: dDate,
                status: 'borrowed'
            }])
            .select();

        if (borrowError) throw borrowError;

        // Cập nhật trạng thái sách trong bảng library thành 'borrowed'
        await supabase.from('library').update({ status: 'borrowed' }).eq('id', library_id);

        res.status(201).json(borrowData[0]);
    } catch (err) {
        console.error('Lỗi tạo phiếu mượn:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 3. PUT: Trả sách & Đổi trạng thái sách về 'available'
exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { return_date } = req.body;
        const rDate = return_date || new Date().toISOString().split('T')[0];

        // Lấy library_id từ phiếu mượn
        const { data: borrowRecord, error: getError } = await supabase
            .from('books')
            .select('library_id')
            .eq('id', id)
            .single();

        if (getError || !borrowRecord) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu mượn này' });
        }

        // Cập nhật phiếu mượn
        const { error: returnError } = await supabase
            .from('books')
            .update({ status: 'returned', return_date: rDate })
            .eq('id', id);

        if (returnError) throw returnError;

        // Cập nhật trạng thái sách trong library thành 'available'
        if (borrowRecord.library_id) {
            await supabase.from('library').update({ status: 'available' }).eq('id', borrowRecord.library_id);
        }

        res.json({ message: 'Xác nhận trả sách thành công' });
    } catch (err) {
        console.error('Lỗi trả sách:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 4. DELETE: Xóa phiếu mượn
exports.deleteBorrow = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('books').delete().eq('id', id);

        if (error) throw error;
        res.json({ message: 'Đã xóa bản ghi mượn sách' });
    } catch (err) {
        console.error('Lỗi xóa phiếu mượn:', err.message);
        res.status(500).json({ error: err.message });
    }
};
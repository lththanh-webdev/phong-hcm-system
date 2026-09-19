<template>
  <div class="admin-library-container">
    <div class="section-top">
      <div>
        <h3>Quản Lý Thư Viện & Mượn Trả</h3>
        <p class="subtitle">Hệ thống tra cứu, quản lý danh mục sách và theo dõi mượn trả</p>
      </div>
      <!-- Tab Navigation -->
      <div class="tab-nav">
        <button :class="{ active: activeTab === 'library' }" @click="activeTab = 'library'">📚 Thư viện sách</button>
        <button :class="{ active: activeTab === 'manager' }" @click="activeTab = 'manager'">🔄 Quản lý Mượn/Trả</button>
      </div>
    </div>

    <!-- ================= TAB 1: THƯ VIỆN SÁCH ================= -->
    <div v-if="activeTab === 'library'" class="glass-panel slide-in">
      <!-- Bộ lọc và Tìm kiếm -->
      <div class="filter-bar">
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="🔍 Tìm kiếm tên sách, tác giả..." />
        </div>
      </div>

      <!-- Bảng Danh Sách Sách -->
      <div class="table-responsive mt-3">
        <table class="data-table book-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Mảng loại</th>
              <th>Năm XB</th>
              <th>Kho</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="book in filteredBooks" 
              :key="book.id" 
              @click="openBookDetail(book)"
              :class="{ 'row-borrowed': book.status === 'borrowed' }"
              class="clickable-row"
            >
              <td>#{{ book.so_vao_so }}</td>
              <td class="font-bold">{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.category }}</td>
              <td>{{ book.nam_xuat_ban }}</td>
              <td>{{ book.kho_sach }}</td>
              <td>
                <span class="badge" :class="book.status === 'available' ? 'badge-ai' : 'badge-amber'">
                  {{ book.status === 'available' ? 'Sẵn sàng' : 'Đang cho mượn' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="7" class="no-data">Không tìm thấy sách nào phù hợp.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= TAB 2: QUẢN LÝ MƯỢN TRẢ ================= -->
    <div v-if="activeTab === 'manager'" class="glass-panel slide-in">
      <div class="d-flex justify-between align-center mb-3">
        <h4>Danh sách phiếu mượn ({{ borrowList.length }})</h4>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Người mượn</th>
              <th>Cấp bậc / Chức vụ</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in enrichedBorrowList" :key="item.id">
              <td><strong>{{ item.user_name }}</strong></td>
              <td>{{ item.rank }}<br><small class="text-muted">{{ item.position }}</small></td>
              <td class="book-title-cell">{{ item.book_title }}</td>
              <td>{{ formatDate(item.borrow_date) }}</td>
              <td>
                {{ formatDate(item.due_date) }}
                <span v-if="item.isOverdue && item.status === 'borrowed'" class="overdue-text">(Quá hạn)</span>
              </td>
              <td>
                <span class="badge" :class="getBorrowStatusClass(item)">
                  {{ getBorrowStatusText(item) }}
                </span>
              </td>
              <td class="action-btns">
                <button v-if="item.status === 'borrowed'" @click="openReturnModal(item)" class="btn-ai">🔄 Trả sách</button>
                <button @click="deleteBorrow(item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="borrowList.length === 0">
              <td colspan="7" class="no-data">Chưa có dữ liệu mượn sách.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= MODALS ================= -->
    
    <!-- 1. Modal Chi tiết sách -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content glass-panel">
        <div class="modal-header">
          <h4>Chi tiết sách</h4>
          <button class="btn-close" @click="showDetailModal = false">✖</button>
        </div>
        <div class="modal-body" v-if="selectedBook">
          <div class="book-info-card">
            <h2>{{ selectedBook.title }}</h2>
            <p><strong>Tác giả:</strong> {{ selectedBook.author }}</p>
            <p><strong>Mảng loại:</strong> {{ selectedBook.category }}</p>
            <p><strong>Số vào sổ:</strong> {{ selectedBook.so_vao_so }} | <strong>Kho:</strong> {{ selectedBook.kho_sach }}</p>
            <p><strong>Nơi XB:</strong> {{ selectedBook.noi_xuat_ban }} ({{ selectedBook.nam_xuat_ban }})</p>
            <p><strong>Giá tiền:</strong> {{ selectedBook.gia_tien }}</p>
            <div class="status-box mt-3" :class="selectedBook.status === 'available' ? 'bg-success-light' : 'bg-warning-light'">
              Trạng thái: <strong>{{ selectedBook.status === 'available' ? 'Sẵn sàng cho mượn' : 'Đang có người mượn' }}</strong>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="selectedBook.status === 'available'" @click="openBorrowModal" class="btn-primary w-100">📝 Đăng ký mượn sách</button>
          <button v-else @click="findAndOpenReturnModal" class="btn-ai w-100">🔄 Nhận lại sách (Trả sách)</button>
        </div>
      </div>
    </div>

    <!-- 2. Modal Đăng ký mượn sách -->
    <div v-if="showBorrowModal" class="modal-overlay" @click.self="showBorrowModal = false">
      <div class="modal-content glass-panel">
        <div class="modal-header">
          <h4>Đăng ký mượn sách</h4>
          <button class="btn-close" @click="showBorrowModal = false">✖</button>
        </div>
        <div class="modal-body form-group">
          <label>Tên sách</label>
          <input type="text" :value="selectedBook.title" disabled class="input-disabled" />
          
          <label>Họ tên người mượn (*)</label>
          <input type="text" v-model="borrowForm.user_name" placeholder="Nhập họ tên..." />
          
          <div class="flex-row">
            <div class="w-50">
              <label>Cấp bậc</label>
              <input type="text" v-model="borrowForm.rank" placeholder="VD: Thượng úy..." />
            </div>
            <div class="w-50">
              <label>Chức vụ</label>
              <input type="text" v-model="borrowForm.position" placeholder="VD: Trợ lý..." />
            </div>
          </div>

          <label>Ngày mượn (Bỏ trống sẽ lấy hôm nay)</label>
          <input type="date" v-model="borrowForm.borrow_date" />
          
          <p class="note-text"><em>* Hạn trả mặc định là 7 ngày kể từ ngày mượn.</em></p>
        </div>
        <div class="modal-footer flex-row">
          <button @click="showBorrowModal = false" class="btn-secondary w-50">Hủy</button>
          <button @click="submitBorrow" class="btn-primary w-50">Xác nhận mượn</button>
        </div>
      </div>
    </div>

    <!-- 3. Modal Trả sách -->
    <div v-if="showReturnModal" class="modal-overlay" @click.self="showReturnModal = false">
      <div class="modal-content glass-panel">
        <div class="modal-header">
          <h4>Xác nhận trả sách</h4>
          <button class="btn-close" @click="showReturnModal = false">✖</button>
        </div>
        <div class="modal-body form-group">
          <label>Người trả</label>
          <input type="text" :value="returnForm.user_name" disabled class="input-disabled" />
          
          <label>Sách trả</label>
          <input type="text" :value="returnForm.book_title" disabled class="input-disabled" />

          <label>Ngày trả thực tế (Bỏ trống sẽ lấy hôm nay)</label>
          <input type="date" v-model="returnForm.return_date" />
        </div>
        <div class="modal-footer flex-row">
          <button @click="showReturnModal = false" class="btn-secondary w-50">Hủy</button>
          <button @click="submitReturn" class="btn-ai w-50">Xác nhận đã thu hồi</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'library',
      searchQuery: '',
      selectedCategory: 'Tất cả sách',
      categories: ['Tất cả sách', 'Mảng sách về Đảng', 'Mảng sách về Bác Hồ', 'Mảng sách về Quân sự', 'Sách về văn học', 'Sách pháp luật', 'Mảng sách khác'],
      
      // Mock data sách dựa trên ảnh 1 & 2
      books: [
        { id: 1, so_vao_so: '0001', title: 'Dự Thảo Các Văn Kiện Trình ĐH XIII', author: 'Nhiều tác giả', category: 'Mảng sách về Đảng', nam_xuat_ban: '2020', kho_sach: '19x27', gia_tien: '37.000đ', noi_xuat_ban: 'H', status: 'available' },
        { id: 2, so_vao_so: '0010', title: 'Xây Dựng QĐNDVN', author: 'Phan Văn Giang', category: 'Mảng sách về Quân sự', nam_xuat_ban: '2025', kho_sach: '16x24', gia_tien: '86.000đ', noi_xuat_ban: 'H', status: 'available' },
        { id: 3, so_vao_so: '0016', title: 'Tư Tưởng Hồ Chí Minh', author: 'Nhiều tác giả', category: 'Mảng sách về Bác Hồ', nam_xuat_ban: '2025', kho_sach: '16x24', gia_tien: '45.000đ', noi_xuat_ban: 'H', status: 'borrowed' },
        { id: 4, so_vao_so: '0020', title: 'Những nhận thức về tư duy mới', author: 'Nguyễn Văn Minh', category: 'Mảng sách về Đảng', nam_xuat_ban: '2021', kho_sach: '14.5x20.5', gia_tien: '51.000đ', noi_xuat_ban: 'H', status: 'available' },
        { id: 5, so_vao_so: '0050', title: 'Bộ luật hình sự năm 2015', author: 'Nhiều tác giả', category: 'Sách pháp luật', nam_xuat_ban: '2025', kho_sach: '13x19', gia_tien: '130.000đ', noi_xuat_ban: 'H', status: 'available' },
        { id: 6, so_vao_so: '0060', title: 'Cà phê phố cũ', author: 'Trần Thanh Cảnh', category: 'Sách về văn học', nam_xuat_ban: '2026', kho_sach: 'EMPTY', gia_tien: '-', noi_xuat_ban: '-', status: 'available' }
      ],

      // Dữ liệu quản lý mượn
      borrowList: [
        { id: 101, book_id: 3, book_title: 'Tư Tưởng Hồ Chí Minh', user_name: 'Trần Văn B', rank: 'Thượng Sĩ', position: 'Tiểu đội trưởng', borrow_date: '2026-09-10', due_date: '2026-09-17', status: 'borrowed' }
      ],

      // State Modals
      showDetailModal: false,
      showBorrowModal: false,
      showReturnModal: false,
      selectedBook: null,
      selectedBorrowRecord: null,

      // Forms
      borrowForm: { user_name: '', rank: '', position: '', borrow_date: '' },
      returnForm: { user_name: '', book_title: '', return_date: '' }
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const matchCategory = this.selectedCategory === 'Tất cả sách' || book.category === this.selectedCategory;
        const matchSearch = book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      });
    },
    enrichedBorrowList() {
      const today = new Date().toISOString().split('T')[0];
      return this.borrowList.map(item => {
        return {
          ...item,
          isOverdue: item.status === 'borrowed' && item.due_date < today
        };
      }).sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
    }
  },
  methods: {
    // Tiện ích xử lý ngày tháng
    getTodayDateString() {
      const today = new Date();
      // Chỉnh múi giờ phù hợp nếu cần, mặc định lấy định dạng YYYY-MM-DD
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    addDaysToDate(dateString, days) {
      const date = new Date(dateString);
      date.setDate(date.getDate() + days);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    },

    // Logic UI
    getBorrowStatusClass(item) {
      if (item.status === 'returned') return 'badge-sky';
      if (item.isOverdue) return 'badge-danger';
      return 'badge-amber';
    },
    getBorrowStatusText(item) {
      if (item.status === 'returned') return 'Đã trả';
      if (item.isOverdue) return 'Quá hạn';
      return 'Đang mượn';
    },

    // Mở Modal
    openBookDetail(book) {
      this.selectedBook = book;
      this.showDetailModal = true;
    },
    openBorrowModal() {
      this.borrowForm = { user_name: '', rank: '', position: '', borrow_date: this.getTodayDateString() };
      this.showDetailModal = false;
      this.showBorrowModal = true;
    },
    findAndOpenReturnModal() {
      const record = this.borrowList.find(b => b.book_id === this.selectedBook.id && b.status === 'borrowed');
      if (record) {
        this.openReturnModal(record);
        this.showDetailModal = false;
      }
    },
    openReturnModal(item) {
      this.selectedBorrowRecord = item;
      this.returnForm = { 
        user_name: item.user_name, 
        book_title: item.book_title, 
        return_date: this.getTodayDateString() 
      };
      this.showReturnModal = true;
    },

    // Xử lý Form
    submitBorrow() {
      if (!this.borrowForm.user_name.trim()) {
        alert("Vui lòng nhập tên người mượn!");
        return;
      }
      const borrowDate = this.borrowForm.borrow_date || this.getTodayDateString();
      const dueDate = this.addDaysToDate(borrowDate, 7);

      this.borrowList.push({
        id: Date.now(),
        book_id: this.selectedBook.id,
        book_title: this.selectedBook.title,
        user_name: this.borrowForm.user_name,
        rank: this.borrowForm.rank,
        position: this.borrowForm.position,
        borrow_date: borrowDate,
        due_date: dueDate,
        status: 'borrowed'
      });

      // Cập nhật trạng thái sách trong DB giả lập
      const bookIdx = this.books.findIndex(b => b.id === this.selectedBook.id);
      if (bookIdx > -1) this.books[bookIdx].status = 'borrowed';

      this.showBorrowModal = false;
      alert(`Đã tạo phiếu mượn cho ${this.borrowForm.user_name}`);
    },

    submitReturn() {
      // Cập nhật record
      const recordIdx = this.borrowList.findIndex(b => b.id === this.selectedBorrowRecord.id);
      if (recordIdx > -1) {
        this.borrowList[recordIdx].status = 'returned';
        this.borrowList[recordIdx].return_date = this.returnForm.return_date || this.getTodayDateString();
      }

      // Cập nhật trạng thái sách thành sẵn sàng
      const bookIdx = this.books.findIndex(b => b.id === this.selectedBorrowRecord.book_id);
      if (bookIdx > -1) this.books[bookIdx].status = 'available';

      this.showReturnModal = false;
      alert(`Đã nhận lại sách: ${this.returnForm.book_title}`);
    },

    deleteBorrow(id) {
      if (!confirm('Bạn có chắc muốn xóa bản ghi này? (Sách sẽ không được tự động cập nhật trạng thái)')) return;
      this.borrowList = this.borrowList.filter(b => b.id !== id);
    }
  }
};
</script>

<style scoped>
/* =========== GLOBAL & LAYOUT =========== */
.admin-library-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 15px;
}
.section-top h3 { margin: 0 0 5px 0; font-size: 1.5rem; color: #fff; }
.subtitle { margin: 0; font-size: 0.9rem; color: #94a3b8; }

/* =========== TABS NAVIGATION =========== */
.tab-nav {
  display: flex;
  gap: 10px;
  background: rgba(15, 23, 42, 0.6);
  padding: 5px;
  border-radius: 10px;
}
.tab-nav button {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}
.tab-nav button.active {
  background: #3b82f6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* =========== GLASS PANEL =========== */
.glass-panel {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
}
.slide-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* =========== CATEGORIES & SEARCH =========== */
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.category-tabs button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
}
.category-tabs button:hover { background: rgba(255, 255, 255, 0.1); }
.category-tabs button.active { background: #10b981; color: #fff; border-color: #10b981; }
.search-box input {
  width: 100%;
  max-width: 400px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  outline: none;
}
.search-box input:focus { border-color: #3b82f6; }

/* =========== TABLES =========== */
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); white-space: nowrap; }

/* Trạng thái sách đã mượn (Màu vàng nhạt chữ đen) */
.book-table .clickable-row { cursor: pointer; transition: background 0.2s; }
.book-table .clickable-row:hover { background: rgba(255, 255, 255, 0.05); }
.row-borrowed {
  background-color: #fef08a !important; /* Vàng nhạt */
  color: #1e293b !important; /* Chữ đen/xám đậm để dễ đọc */
}
.row-borrowed td, .row-borrowed .font-bold { color: #1e293b !important; }

/* =========== BADGES & UTILS =========== */
.badge { display: inline-block; padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge-ai { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.badge-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.badge-sky { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3); }

.overdue-text { color: #ef4444; font-weight: bold; font-size: 0.8rem; margin-left: 5px; }
.font-bold { font-weight: bold; }
.text-muted { color: #94a3b8; }
.mt-3 { margin-top: 15px; }
.mb-3 { margin-bottom: 15px; }
.w-50 { width: 50%; }
.w-100 { width: 100%; }
.flex-row { display: flex; gap: 15px; }
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }

/* =========== BUTTONS =========== */
.action-btns { display: flex; gap: 8px; }
button { font-family: inherit; }
.btn-ai { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s;}
.btn-ai:hover { background: rgba(16, 185, 129, 0.4); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s;}
.btn-del:hover { background: rgba(239, 68, 68, 0.4); }
.btn-primary { background: #3b82f6; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;}
.btn-primary:hover { background: #2563eb; }
.btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-secondary:hover { background: rgba(255,255,255,0.2); }

/* =========== MODAL =========== */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #1e293b;
  width: 90%; max-width: 500px;
  border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
}
.modal-header h4 { margin: 0; font-size: 1.2rem; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; }
.modal-body { padding: 20px; }
.modal-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 10px; }

/* Form trong Modal */
.form-group label { display: block; margin-bottom: 5px; color: #cbd5e1; font-size: 0.9rem; margin-top: 12px; }
.form-group label:first-child { margin-top: 0; }
.form-group input {
  width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px;
  background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff; outline: none;
}
.form-group input:focus { border-color: #3b82f6; }
.input-disabled { background: rgba(255,255,255,0.05) !important; color: #94a3b8 !important; cursor: not-allowed; }
.note-text { font-size: 0.8rem; color: #94a3b8; margin-top: 10px; }

/* Chi tiết sách */
.book-info-card h2 { margin: 0 0 15px 0; color: #38bdf8; }
.book-info-card p { margin: 8px 0; font-size: 0.95rem; }
.status-box { padding: 12px; border-radius: 8px; text-align: center; font-size: 1rem; }
.bg-success-light { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; }
.bg-warning-light { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; }
</style>
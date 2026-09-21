<template>
  <div class="admin-borrow-container">
    <!-- Header Section -->
    <div class="section-top">
      <div class="header-title">
        <div class="icon-badge">📖</div>
        <div>
          <h3>Quản Lý Mượn & Trả Sách</h3>
          <p class="subtitle">Tra cứu danh mục sách thực tế và theo dõi nhật ký mượn trả toàn hệ thống</p>
        </div>
      </div>
      
      <div class="tab-nav">
        <button :class="{ active: activeTab === 'library' }" @click="activeTab = 'library'">
          📚 Danh Mục Sách <span class="badge-count">{{ books.length }}</span>
        </button>
        <button :class="{ active: activeTab === 'manager' }" @click="activeTab = 'manager'">
          🔄 Nhật Ký Mượn/Trả <span class="badge-count">{{ borrowList.length }}</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon books-icon">📚</div>
        <div class="stat-info">
          <span class="stat-value">{{ books.length }}</span>
          <span class="stat-label">Tổng số đầu sách</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon available-icon">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ availableBooksCount }}</span>
          <span class="stat-label">Sẵn sàng cho mượn</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon borrowed-icon">⏳</div>
        <div class="stat-info">
          <span class="stat-value">{{ activeBorrowsCount }}</span>
          <span class="stat-label">Đang được mượn</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon overdue-icon">⚠️</div>
        <div class="stat-info">
          <span class="stat-value text-danger">{{ overdueBorrowsCount }}</span>
          <span class="stat-label">Phiếu quá hạn</span>
        </div>
      </div>
    </div>

    <!-- Tab 1: Library Catalog -->
    <div v-if="activeTab === 'library'" class="glass-panel slide-in">
      <div class="toolbar-wrapper">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm theo tên sách, tác giả, số vào sổ, môn loại..." 
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="category-pills">
          <button 
            v-for="cat in categories" 
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="table-responsive mt-3">
        <table class="data-table book-table">
          <thead>
            <tr>
              <th @click="sortBy('id')" class="sortable-th">
                <div class="th-content">STT <span class="sort-icon" :class="{ active: sortKey === 'id' }">{{ sortKey === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('author')" class="sortable-th">
                <div class="th-content">Tác giả <span class="sort-icon" :class="{ active: sortKey === 'author' }">{{ sortKey === 'author' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('title')" class="sortable-th">
                <div class="th-content">Tên sách <span class="sort-icon" :class="{ active: sortKey === 'title' }">{{ sortKey === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('noi_xuat_ban')" class="sortable-th">
                <div class="th-content">Nơi XB <span class="sort-icon" :class="{ active: sortKey === 'noi_xuat_ban' }">{{ sortKey === 'noi_xuat_ban' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('nam_xuat_ban')" class="sortable-th">
                <div class="th-content">Năm XB <span class="sort-icon" :class="{ active: sortKey === 'nam_xuat_ban' }">{{ sortKey === 'nam_xuat_ban' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('kho_sach')" class="sortable-th">
                <div class="th-content">Khổ <span class="sort-icon" :class="{ active: sortKey === 'kho_sach' }">{{ sortKey === 'kho_sach' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('so_trang')" class="sortable-th text-center">
                <div class="th-content center">Trang <span class="sort-icon" :class="{ active: sortKey === 'so_trang' }">{{ sortKey === 'so_trang' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('gia_tien')" class="sortable-th text-right">
                <div class="th-content right">Giá tiền <span class="sort-icon" :class="{ active: sortKey === 'gia_tien' }">{{ sortKey === 'gia_tien' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('so_vao_so')" class="sortable-th text-center">
                <div class="th-content center">Số vào sổ <span class="sort-icon" :class="{ active: sortKey === 'so_vao_so' }">{{ sortKey === 'so_vao_so' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th @click="sortBy('mon_loai')" class="sortable-th text-center">
                <div class="th-content center">Môn loại <span class="sort-icon" :class="{ active: sortKey === 'mon_loai' }">{{ sortKey === 'mon_loai' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}</span></div>
              </th>
              <th class="text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(book, index) in filteredAndSortedBooks" 
              :key="book.id" 
              @click="openBookDetail(book)"
              :class="{ 'row-borrowed': book.status === 'borrowed' }"
              class="clickable-row"
            >
              <td class="text-subtle font-mono">{{ index + 1 }}</td>
              <td class="text-author">{{ book.author || '-' }}</td>
              <td class="font-bold text-title">{{ book.title }}</td>
              <td class="text-subtle text-center">{{ book.noi_xuat_ban || '-' }}</td>
              <td class="text-subtle text-center">{{ book.nam_xuat_ban || '-' }}</td>
              <td class="text-subtle">{{ book.kho_sach || '-' }}</td>
              <td class="text-center font-mono">{{ book.so_trang || '-' }}</td>
              <td class="text-right font-mono text-price">{{ book.gia_tien || '-' }}</td>
              <td class="text-center"><span class="code-badge">{{ book.so_vao_so || '-' }}</span></td>
              <td class="text-center"><span class="cat-tag">{{ book.mon_loai || '-' }}</span></td>
              <td class="text-center">
                <span class="badge" :class="book.status === 'available' ? 'badge-success' : 'badge-warning'">
                  {{ book.status === 'available' ? 'Sẵn sàng' : 'Đang mượn' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredAndSortedBooks.length === 0">
              <td colspan="11" class="no-data">Không tìm thấy dữ liệu sách phù hợp.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 2: Borrow Manager -->
    <div v-if="activeTab === 'manager'" class="glass-panel slide-in">
      <div class="d-flex justify-between align-center mb-3">
        <h4 class="m-0 text-gold">Danh sách phiếu mượn & trả sách</h4>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Người mượn</th>
              <th>Cấp bậc / Chức vụ</th>
              <th>Tên sách mượn</th>
              <th class="text-center">Ngày mượn</th>
              <th class="text-center">Hạn trả</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in enrichedBorrowList" :key="item.id">
              <td><strong class="text-highlight">{{ item.user_name }}</strong></td>
              <td>{{ item.rank || '-' }}<br><small class="text-muted">{{ item.position }}</small></td>
              <td class="font-bold">{{ item.book_title }}</td>
              <td class="text-center font-mono">{{ formatDate(item.borrow_date) }}</td>
              <td class="text-center font-mono">
                {{ formatDate(item.due_date) }}
                <span v-if="item.isOverdue && item.status === 'borrowed'" class="overdue-badge">(Quá hạn)</span>
              </td>
              <td class="text-center">
                <span class="badge" :class="getBorrowStatusClass(item)">
                  {{ getBorrowStatusText(item) }}
                </span>
              </td>
              <td class="action-btns text-right">
                <button v-if="item.status === 'borrowed'" @click="openReturnModal(item)" class="btn-action btn-return">🔄 Trả sách</button>
                <button @click="deleteBorrow(item.id)" class="btn-action btn-delete">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="borrowList.length === 0">
              <td colspan="7" class="no-data">Chưa có bản ghi mượn sách nào trong hệ thống.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Book Detail -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content glass-panel scale-in">
        <div class="modal-header">
          <h4>Thông tin chi tiết sách</h4>
          <button class="btn-close" @click="showDetailModal = false">✕</button>
        </div>
        <div class="modal-body" v-if="selectedBook">
          <div class="book-info-card">
            <h2 class="book-modal-title">{{ selectedBook.title }}</h2>
            <div class="info-grid">
              <p><strong>Tác giả:</strong> {{ selectedBook.author || 'Nhiều tác giả' }}</p>
              <p><strong>Mảng sách:</strong> {{ selectedBook.category }}</p>
              <p><strong>Số vào sổ:</strong> {{ selectedBook.so_vao_so || '-' }}</p>
              <p><strong>Môn loại:</strong> {{ selectedBook.mon_loai || '-' }}</p>
              <p><strong>Nơi XB:</strong> {{ selectedBook.noi_xuat_ban || '-' }} ({{ selectedBook.nam_xuat_ban || '-' }})</p>
              <p><strong>Khổ sách:</strong> {{ selectedBook.kho_sach || '-' }}</p>
              <p><strong>Số trang:</strong> {{ selectedBook.so_trang || '-' }} trang</p>
              <p><strong>Giá tiền:</strong> {{ selectedBook.gia_tien || '-' }}</p>
            </div>
            <div class="status-box mt-3" :class="selectedBook.status === 'available' ? 'bg-success-light' : 'bg-warning-light'">
              Trạng thái: <strong>{{ selectedBook.status === 'available' ? 'Sẵn sàng cho mượn' : 'Đang cho mượn' }}</strong>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="selectedBook.status === 'available'" @click="openBorrowModal" class="btn-primary w-100">📝 Đăng ký mượn cuốn này</button>
          <button v-else @click="findAndOpenReturnModal" class="btn-return w-100">🔄 Xác nhận nhận lại sách</button>
        </div>
      </div>
    </div>

    <!-- Modal: Borrow Form -->
    <div v-if="showBorrowModal" class="modal-overlay" @click.self="showBorrowModal = false">
      <div class="modal-content glass-panel scale-in">
        <div class="modal-header">
          <h4>Phiếu đăng ký mượn sách</h4>
          <button class="btn-close" @click="showBorrowModal = false">✕</button>
        </div>
        <div class="modal-body form-group">
          <label>Tên sách mượn</label>
          <input type="text" :value="selectedBook.title" disabled class="input-disabled" />
          
          <label class="mt-2">Họ và tên người mượn (*)</label>
          <input type="text" v-model="borrowForm.user_name" placeholder="Nhập họ tên đầy đủ..." />
          
          <div class="flex-row mt-2">
            <div class="w-50">
              <label>Cấp bậc</label>
              <input type="text" v-model="borrowForm.rank" placeholder="VD: Thượng úy..." />
            </div>
            <div class="w-50">
              <label>Chức vụ</label>
              <input type="text" v-model="borrowForm.position" placeholder="VD: Trợ lý..." />
            </div>
          </div>

          <label class="mt-2">Ngày mượn</label>
          <input type="date" v-model="borrowForm.borrow_date" />
          <p class="note-text"><em>* Hạn trả được tính tự động sau 07 ngày kể từ ngày mượn.</em></p>
        </div>
        <div class="modal-footer flex-row">
          <button @click="showBorrowModal = false" class="btn-secondary w-50">Hủy bỏ</button>
          <button @click="submitBorrow" class="btn-primary w-50">Xác nhận mượn</button>
        </div>
      </div>
    </div>

    <!-- Modal: Return Form -->
    <div v-if="showReturnModal" class="modal-overlay" @click.self="showReturnModal = false">
      <div class="modal-content glass-panel scale-in">
        <div class="modal-header">
          <h4>Xác nhận trả sách</h4>
          <button class="btn-close" @click="showReturnModal = false">✕</button>
        </div>
        <div class="modal-body form-group">
          <label>Người trả sách</label>
          <input type="text" :value="returnForm.user_name" disabled class="input-disabled" />
          
          <label class="mt-2">Tên sách trả</label>
          <input type="text" :value="returnForm.book_title" disabled class="input-disabled" />

          <label class="mt-2">Ngày trả thực tế</label>
          <input type="date" v-model="returnForm.return_date" />
        </div>
        <div class="modal-footer flex-row">
          <button @click="showReturnModal = false" class="btn-secondary w-50">Hủy bỏ</button>
          <button @click="submitReturn" class="btn-return w-50">Thu hồi sách</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const getApiUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
  return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
};

export default {
  name: 'AdminBookBorrow',
  props: {
    library: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 'library',
      searchQuery: '',
      selectedCategory: 'Tất cả sách',
      sortKey: 'id',
      sortOrder: 'asc',
      
      categories: [
        'Tất cả sách', 
        'Mảng sách về Đảng', 
        'Mảng sách về Bác Hồ', 
        'Mảng sách về Quân đội', 
        'Sách về văn học', 
        'Sách pháp luật', 
        'Các loại sách khác'
      ],
      
      books: [],
      borrowList: [],

      showDetailModal: false,
      showBorrowModal: false,
      showReturnModal: false,
      selectedBook: null,
      selectedBorrowRecord: null,

      borrowForm: { user_name: '', rank: '', position: '', borrow_date: '' },
      returnForm: { user_name: '', book_title: '', return_date: '' }
    };
  },
  computed: {
    availableBooksCount() {
      return this.books.filter(b => b.status === 'available').length;
    },
    activeBorrowsCount() {
      return this.borrowList.filter(b => b.status === 'borrowed').length;
    },
    overdueBorrowsCount() {
      const today = new Date().toISOString().split('T')[0];
      return this.borrowList.filter(b => b.status === 'borrowed' && b.due_date < today).length;
    },
    filteredAndSortedBooks() {
      let result = this.books.filter(book => {
        const matchCategory = this.selectedCategory === 'Tất cả sách' || book.category === this.selectedCategory;
        const q = this.searchQuery.toLowerCase().trim();
        const matchSearch = !q || 
          (book.title && book.title.toLowerCase().includes(q)) || 
          (book.author && book.author.toLowerCase().includes(q)) ||
          (book.so_vao_so && book.so_vao_so.toLowerCase().includes(q)) ||
          (book.mon_loai && book.mon_loai.toLowerCase().includes(q));
        
        return matchCategory && matchSearch;
      });

      if (this.sortKey) {
        result.sort((a, b) => {
          let valA = a[this.sortKey] ?? '';
          let valB = b[this.sortKey] ?? '';

          if (this.sortKey === 'id' || this.sortKey === 'so_trang') {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
          } else {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
          }

          if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return result;
    },

    enrichedBorrowList() {
      const today = new Date().toISOString().split('T')[0];
      return this.borrowList.map(item => ({
        ...item,
        isOverdue: item.status === 'borrowed' && item.due_date < today
      })).sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
    }
  },
  watch: {
    library: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val) && val.length > 0) {
          this.books = val;
        } else {
          this.fetchBooks();
        }
      }
    }
  },
  mounted() {
    this.fetchBooks();
    this.fetchBorrows();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return token 
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } 
        : { 'Content-Type': 'application/json' };
    },

    async fetchBooks() {
      try {
        const res = await fetch(`${getApiUrl()}/api/library`, { headers: this.getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          this.books = Array.isArray(data) ? data : (data.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách sách:", err);
      }
    },

    async fetchBorrows() {
      try {
        const res = await fetch(`${getApiUrl()}/api/borrows`, { headers: this.getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          this.borrowList = Array.isArray(data) ? data : (data.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách phiếu mượn:", err);
      }
    },

    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },

    getTodayDateString() {
      return new Date().toISOString().split('T')[0];
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    },

    getBorrowStatusClass(item) {
      if (item.status === 'returned') return 'badge-info';
      if (item.isOverdue) return 'badge-danger';
      return 'badge-warning';
    },
    getBorrowStatusText(item) {
      if (item.status === 'returned') return 'Đã trả';
      if (item.isOverdue) return 'Quá hạn';
      return 'Đang mượn';
    },

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
      // Kiểm tra linh hoạt: hỗ trợ cả book_id hoặc library_id tùy thuộc vào cấu trúc trả về của API /api/borrows
const record = this.borrowList.find(b => 
  (b.book_id === this.selectedBook.id || b.library_id === this.selectedBook.id) && 
  b.status === 'borrowed'
);
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

    async submitBorrow() {
      if (!this.borrowForm.user_name.trim()) {
        this.$emit('toast', 'Vui lòng nhập họ tên người mượn!', 'error');
        return;
      }

      try {
        const payload = {
          library_id: this.selectedBook.id,
          user_name: this.borrowForm.user_name,
          rank: this.borrowForm.rank,
          position: this.borrowForm.position,
          borrow_date: this.borrowForm.borrow_date || this.getTodayDateString()
        };

        const res = await fetch(`${getApiUrl()}/api/borrows`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.$emit('toast', `Đã tạo phiếu mượn cho ${this.borrowForm.user_name}`, 'success');
          this.showBorrowModal = false;
          this.fetchBooks();
          this.fetchBorrows();
          this.$emit('refresh');
        } else {
          this.$emit('toast', 'Lỗi khi đăng ký mượn sách!', 'error');
        }
      } catch (err) {
        this.$emit('toast', 'Lỗi kết nối máy chủ!', 'error');
      }
    },

    async submitReturn() {
      try {
        const payload = {
          return_date: this.returnForm.return_date || this.getTodayDateString()
        };

        const res = await fetch(`${getApiUrl()}/api/borrows/${this.selectedBorrowRecord.id}/return`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.$emit('toast', `Đã thu hồi thành công cuốn sách!`, 'success');
          this.showReturnModal = false;
          this.fetchBooks();
          this.fetchBorrows();
          this.$emit('refresh');
        } else {
          this.$emit('toast', 'Lỗi khi xác nhận trả sách!', 'error');
        }
      } catch (err) {
        this.$emit('toast', 'Lỗi kết nối máy chủ!', 'error');
      }
    },

    async deleteBorrow(id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi phiếu mượn này?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/borrows/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });

        if (res.ok) {
          this.$emit('toast', 'Đã xóa bản ghi phiếu mượn thành công!', 'success');
          this.fetchBorrows();
        } else {
          this.$emit('toast', 'Không thể xóa bản ghi này!', 'error');
        }
      } catch (err) {
        this.$emit('toast', 'Lỗi kết nối máy chủ!', 'error');
      }
    }
  }
};
</script>

<style scoped>
.admin-borrow-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 4px;
}

/* Header Section */
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  flex-wrap: wrap;
  gap: 16px;
}
.header-title { display: flex; align-items: center; gap: 14px; }
.icon-badge {
  font-size: 1.8rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05));
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1);
}
.section-top h3 { margin: 0; font-size: 1.45rem; font-weight: 700; color: #ffd700; letter-spacing: 0.3px; }
.subtitle { margin: 4px 0 0 0; font-size: 0.88rem; color: #94a3b8; }

/* Tabs */
.tab-nav {
  display: flex;
  gap: 6px;
  background: rgba(11, 19, 43, 0.9);
  padding: 5px;
  border-radius: 14px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
.tab-nav button {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-nav button:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
.tab-nav button.active {
  background: linear-gradient(135deg, #da251d 0%, #7f0a0a 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(218, 37, 29, 0.4);
}
.badge-count {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.stat-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 215, 0, 0.3);
}
.stat-icon {
  font-size: 1.6rem;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.books-icon { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.available-icon { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.borrowed-icon { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
.overdue-icon { background: rgba(239, 68, 68, 0.15); color: #f87171; }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: #fff; font-family: monospace; }
.stat-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

/* Glass Panel */
.glass-panel {
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 18px;
  padding: 24px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}
.slide-in { animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

/* Toolbar & Search */
.toolbar-wrapper { display: flex; flex-direction: column; gap: 16px; }
.search-box { position: relative; display: flex; align-items: center; width: 100%; }
.search-icon { position: absolute; left: 16px; font-size: 1rem; opacity: 0.6; }
.search-box input {
  width: 100%;
  background: #090e1d;
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #fff;
  padding: 13px 40px 13px 46px;
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}
.search-box input:focus { border-color: #ffd700; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15); }
.clear-btn { position: absolute; right: 14px; background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem; }

/* Category Pills */
.category-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; }
.category-pills::-webkit-scrollbar { height: 4px; }
.category-pills::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
.category-pills button {
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.category-pills button:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.category-pills button.active {
  background: #ffd700;
  color: #0f172a;
  font-weight: 700;
  border-color: #ffd700;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.25);
}

/* Tables */
.table-responsive { width: 100%; overflow-x: auto; margin-top: 10px; }
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.9rem; }
.data-table th { background: #090e1d; color: #ffd700; font-weight: 600; padding: 14px 16px; border-bottom: 2px solid rgba(255, 215, 0, 0.25); white-space: nowrap; }
.data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); vertical-align: middle; }

.sortable-th { cursor: pointer; user-select: none; }
.sortable-th:hover { color: #fff; }
.th-content { display: flex; align-items: center; gap: 6px; }
.th-content.center { justify-content: center; }
.th-content.right { justify-content: flex-end; }
.sort-icon { font-size: 0.75rem; opacity: 0.4; }
.sort-icon.active { opacity: 1; color: #ffd700; }

.clickable-row { cursor: pointer; transition: background 0.2s ease; }
.clickable-row:hover { background: rgba(255, 215, 0, 0.06); }
.row-borrowed { background-color: rgba(245, 158, 11, 0.08) !important; }

/* Text & Badges */
.font-mono { font-family: monospace; }
.font-bold { font-weight: 600; }
.text-title { color: #f8fafc; }
.text-author { color: #cbd5e1; }
.text-subtle { color: #94a3b8; }
.text-price { color: #38bdf8; font-weight: 600; }
.text-highlight { color: #60a5fa; }
.text-gold { color: #ffd700; }
.text-muted { color: #64748b; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-danger { color: #f87171 !important; }

.code-badge { background: rgba(255, 255, 255, 0.06); padding: 4px 10px; border-radius: 6px; font-family: monospace; border: 1px solid rgba(255,255,255,0.04); }
.cat-tag { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; }

.badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
.badge-success { background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
.badge-warning { background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
.badge-danger { background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
.badge-info { background: rgba(14, 165, 233, 0.18); color: #38bdf8; border: 1px solid rgba(14,165,233,0.3); }
.overdue-badge { color: #ef4444; font-weight: 700; font-size: 0.78rem; margin-left: 4px; }

/* Buttons */
.btn-action { padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s ease; }
.btn-return { background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35); }
.btn-return:hover { background: rgba(16, 185, 129, 0.3); }
.btn-delete { background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35); margin-left: 6px; }
.btn-delete:hover { background: rgba(239, 68, 68, 0.3); }
.btn-primary { background: linear-gradient(135deg, #da251d 0%, #a21914 100%); color: #fff; border: none; padding: 11px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(218, 37, 29, 0.35); transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.9; }
.btn-secondary { background: rgba(255, 255, 255, 0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 11px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.12); }

/* Modals */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(3, 7, 18, 0.8);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  padding: 16px;
}
.modal-content {
  background: #0f172a;
  width: 100%; max-width: 540px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.modal-header h4 { margin: 0; font-size: 1.15rem; color: #ffd700; font-weight: 600; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
.btn-close:hover { color: #fff; }
.modal-body { padding: 24px; }
.modal-footer { padding: 18px 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 12px; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem; }
.book-modal-title { color: #ffd700; font-size: 1.35rem; margin-top: 0; margin-bottom: 16px; font-weight: 700; }
.status-box { padding: 12px; border-radius: 10px; text-align: center; font-size: 0.9rem; }
.bg-success-light { background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
.bg-warning-light { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }

.form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px; font-weight: 500; }
.form-group input {
  width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px;
  background: #090e1d; border: 1px solid rgba(255, 215, 0, 0.2); color: #fff; outline: none; font-size: 0.92rem;
}
.form-group input:focus { border-color: #ffd700; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15); }
.input-disabled { background: rgba(255, 255, 255, 0.04) !important; color: #64748b !important; border-color: rgba(255,255,255,0.06) !important; }
.note-text { font-size: 0.8rem; color: #64748b; margin-top: 8px; }

/* Utilities */
.m-0 { margin: 0; }
.mt-2 { margin-top: 12px; }
.mt-3 { margin-top: 18px; }
.mb-3 { margin-bottom: 18px; }
.w-50 { width: 50%; }
.w-100 { width: 100%; }
.flex-row { display: flex; gap: 12px; }
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.no-data { text-align: center; padding: 50px 0; color: #64748b; font-size: 0.95rem; }
</style>
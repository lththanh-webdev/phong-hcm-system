<template>
  <div class="admin-borrow-container">
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
          📚 Danh Mục Sách ({{ books.length }})
        </button>
        <button :class="{ active: activeTab === 'manager' }" @click="activeTab = 'manager'">
          🔄 Nhật Ký Mượn/Trả ({{ borrowList.length }})
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'library'" class="glass-panel slide-in">
      
      <div class="toolbar-wrapper">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm tên sách, tác giả, số vào sổ, môn loại..." 
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
                <div class="th-content">
                  STT 
                  <span class="sort-icon" :class="{ active: sortKey === 'id' }">
                    {{ sortKey === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('author')" class="sortable-th">
                <div class="th-content">
                  Tác giả 
                  <span class="sort-icon" :class="{ active: sortKey === 'author' }">
                    {{ sortKey === 'author' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('title')" class="sortable-th">
                <div class="th-content">
                  Tên sách 
                  <span class="sort-icon" :class="{ active: sortKey === 'title' }">
                    {{ sortKey === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('noi_xuat_ban')" class="sortable-th">
                <div class="th-content">
                  Nơi XB 
                  <span class="sort-icon" :class="{ active: sortKey === 'noi_xuat_ban' }">
                    {{ sortKey === 'noi_xuat_ban' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('nam_xuat_ban')" class="sortable-th">
                <div class="th-content">
                  Năm XB 
                  <span class="sort-icon" :class="{ active: sortKey === 'nam_xuat_ban' }">
                    {{ sortKey === 'nam_xuat_ban' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('kho_sach')" class="sortable-th">
                <div class="th-content">
                  Khổ 
                  <span class="sort-icon" :class="{ active: sortKey === 'kho_sach' }">
                    {{ sortKey === 'kho_sach' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('so_trang')" class="sortable-th text-center">
                <div class="th-content center">
                  Trang 
                  <span class="sort-icon" :class="{ active: sortKey === 'so_trang' }">
                    {{ sortKey === 'so_trang' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('gia_tien')" class="sortable-th text-right">
                <div class="th-content right">
                  Giá tiền 
                  <span class="sort-icon" :class="{ active: sortKey === 'gia_tien' }">
                    {{ sortKey === 'gia_tien' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('so_vao_so')" class="sortable-th text-center">
                <div class="th-content center">
                  Số vào sổ 
                  <span class="sort-icon" :class="{ active: sortKey === 'so_vao_so' }">
                    {{ sortKey === 'so_vao_so' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>
              <th @click="sortBy('mon_loai')" class="sortable-th text-center">
                <div class="th-content center">
                  Môn loại 
                  <span class="sort-icon" :class="{ active: sortKey === 'mon_loai' }">
                    {{ sortKey === 'mon_loai' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
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
              <td colspan="11" class="no-data">Không tìm thấy dữ liệu sách.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'manager'" class="glass-panel slide-in">
      <div class="d-flex justify-between align-center mb-3">
        <h4 class="m-0 text-gold">Danh sách phiếu mượn trả</h4>
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
                <span v-if="item.isOverdue && item.status === 'borrowed'" class="overdue-text">(Quá hạn)</span>
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
              <td colspan="7" class="no-data">Chưa có bản ghi mượn sách nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content glass-panel">
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

    <div v-if="showBorrowModal" class="modal-overlay" @click.self="showBorrowModal = false">
      <div class="modal-content glass-panel">
        <div class="modal-header">
          <h4>Phiếu đăng ký mượn sách</h4>
          <button class="btn-close" @click="showBorrowModal = false">✕</button>
        </div>
        <div class="modal-body form-group">
          <label>Tên sách mượn</label>
          <input type="text" :value="selectedBook.title" disabled class="input-disabled" />
          
          <label class="mt-2">Họ và tên người mượn (*)</label>
          <input type="text" v-model="borrowForm.user_name" placeholder="Nhập họ tên người mượn..." />
          
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
          <p class="note-text"><em>* Hạn trả tự động tính 07 ngày kể từ ngày mượn.</em></p>
        </div>
        <div class="modal-footer flex-row">
          <button @click="showBorrowModal = false" class="btn-secondary w-50">Hủy</button>
          <button @click="submitBorrow" class="btn-primary w-50">Xác nhận mượn</button>
        </div>
      </div>
    </div>

    <div v-if="showReturnModal" class="modal-overlay" @click.self="showReturnModal = false">
      <div class="modal-content glass-panel">
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
          <button @click="showReturnModal = false" class="btn-secondary w-50">Hủy</button>
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
        'Mảng sách về Quân sự', 
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
      const record = this.borrowList.find(b => b.library_id === this.selectedBook.id && b.status === 'borrowed');
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
  gap: 20px;
  color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  flex-wrap: wrap;
  gap: 16px;
}
.header-title { display: flex; align-items: center; gap: 14px; }
.icon-badge {
  font-size: 1.8rem;
  background: rgba(255, 215, 0, 0.15);
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}
.section-top h3 { margin: 0; font-size: 1.4rem; font-weight: 700; color: #ffd700; }
.subtitle { margin: 4px 0 0 0; font-size: 0.85rem; color: #94a3b8; }

.tab-nav {
  display: flex;
  gap: 6px;
  background: rgba(15, 23, 42, 0.8);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}
.tab-nav button {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 9px 18px;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.25s ease;
}
.tab-nav button.active {
  background: linear-gradient(135deg, #da251d 0%, #7f0a0a 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(218, 37, 29, 0.35);
}

.glass-panel {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.slide-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.toolbar-wrapper { display: flex; flex-direction: column; gap: 16px; }
.search-box { position: relative; display: flex; align-items: center; width: 100%; }
.search-icon { position: absolute; left: 14px; font-size: 0.95rem; opacity: 0.6; }
.search-box input {
  width: 100%;
  background: #0b132b;
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #fff;
  padding: 12px 40px 12px 42px;
  border-radius: 12px;
  font-size: 0.92rem;
  outline: none;
}
.search-box input:focus { border-color: #ffd700; }
.clear-btn { position: absolute; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; }

.category-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.category-pills button {
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 0.83rem;
  cursor: pointer;
}
.category-pills button.active {
  background: #ffd700;
  color: #150101;
  font-weight: 700;
  border-color: #ffd700;
}

.table-responsive { width: 100%; overflow-x: auto; margin-top: 10px; }
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.88rem; }
.data-table th { background: #0b132b; color: #ffd700; font-weight: 600; padding: 12px 14px; border-bottom: 1px solid rgba(255, 215, 0, 0.2); white-space: nowrap; }
.data-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); vertical-align: middle; }

.sortable-th { cursor: pointer; }
.th-content { display: flex; align-items: center; gap: 6px; }
.th-content.center { justify-content: center; }
.th-content.right { justify-content: flex-end; }
.sort-icon { font-size: 0.72rem; opacity: 0.4; }
.sort-icon.active { opacity: 1; color: #ffd700; }

.clickable-row { cursor: pointer; transition: background 0.2s ease; }
.clickable-row:hover { background: rgba(255, 215, 0, 0.05); }
.row-borrowed { background-color: rgba(245, 158, 11, 0.1) !important; }

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

.code-badge { background: rgba(255, 255, 255, 0.08); padding: 3px 8px; border-radius: 6px; font-family: monospace; }
.cat-tag { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; padding: 3px 8px; border-radius: 6px; font-size: 0.78rem; }

.badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.badge-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.badge-info { background: rgba(14, 165, 233, 0.2); color: #38bdf8; }

.btn-action { padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; }
.btn-return { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
.btn-delete { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); margin-left: 6px; }
.btn-primary { background: #da251d; color: #fff; border: none; padding: 10px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; }
.btn-secondary { background: rgba(255, 255, 255, 0.1); color: #fff; border: none; padding: 10px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; }

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #0f172a;
  width: 90%; max-width: 520px;
  border-radius: 18px;
  border: 1px solid rgba(255, 215, 0, 0.25);
  overflow: hidden;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.modal-header h4 { margin: 0; font-size: 1.1rem; color: #ffd700; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; }
.modal-body { padding: 20px; }
.modal-footer { padding: 16px 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.88rem; }
.book-modal-title { color: #ffd700; font-size: 1.25rem; margin-top: 0; }
.status-box { padding: 10px; border-radius: 8px; text-align: center; }
.bg-success-light { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.bg-warning-light { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

.form-group label { display: block; font-size: 0.83rem; color: #94a3b8; margin-bottom: 6px; }
.form-group input {
  width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px;
  background: #0b132b; border: 1px solid rgba(255, 215, 0, 0.2); color: #fff; outline: none;
}
.input-disabled { background: rgba(255, 255, 255, 0.05) !important; color: #64748b !important; }
.note-text { font-size: 0.78rem; color: #64748b; margin-top: 6px; }

.m-0 { margin: 0; }
.mt-2 { margin-top: 10px; }
.mt-3 { margin-top: 15px; }
.mb-3 { margin-bottom: 15px; }
.w-50 { width: 50%; }
.w-100 { width: 100%; }
.flex-row { display: flex; gap: 12px; }
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.no-data { text-align: center; padding: 40px 0; color: #64748b; }
.overdue-text { color: #ef4444; font-weight: bold; font-size: 0.8rem; margin-left: 4px; }
</style>
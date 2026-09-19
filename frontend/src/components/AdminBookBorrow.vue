<template>
  <div class="admin-library-container">
    <!-- Header tiêu đề & chuyển Tab -->
    <div class="section-top">
      <div class="header-title">
        <div class="icon-badge">📚</div>
        <div>
          <h3>Quản Lý Thư Viện & Mượn Trả</h3>
          <p class="subtitle">Hệ thống tra cứu, quản lý danh mục sách và theo dõi mượn trả</p>
        </div>
      </div>
      
      <!-- Tab Navigation -->
      <div class="tab-nav">
        <button :class="{ active: activeTab === 'library' }" @click="activeTab = 'library'">
          <span>📚</span> Danh Mục Sách ({{ books.length }})
        </button>
        <button :class="{ active: activeTab === 'manager' }" @click="activeTab = 'manager'">
          <span>🔄</span> Quản Lý Mượn/Trả ({{ borrowList.length }})
        </button>
      </div>
    </div>

    <!-- ================= TAB 1: DANH MỤC SÁCH ================= -->
    <div v-if="activeTab === 'library'" class="glass-panel slide-in">
      
      <!-- Thanh công cụ: Tìm kiếm & Lọc Mảng sách (Gọn gàng, hiện đại) -->
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

        <!-- Category Pills dạng cuộn mượt -->
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

      <!-- Bảng Danh Sách Sách (Đủ 10 trường dữ liệu + Nút Sắp xếp Phễu/Mũi tên) -->
      <div class="table-responsive mt-3">
        <table class="data-table book-table">
          <thead>
            <tr>
              <!-- 1. STT (id) -->
              <th @click="sortBy('id')" class="sortable-th">
                <div class="th-content">
                  STT 
                  <span class="sort-icon" :class="{ active: sortKey === 'id' }">
                    {{ sortKey === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 2. Tác giả (author) -->
              <th @click="sortBy('author')" class="sortable-th">
                <div class="th-content">
                  Tác giả 
                  <span class="sort-icon" :class="{ active: sortKey === 'author' }">
                    {{ sortKey === 'author' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 3. Tên sách (title) -->
              <th @click="sortBy('title')" class="sortable-th">
                <div class="th-content">
                  Tên sách 
                  <span class="sort-icon" :class="{ active: sortKey === 'title' }">
                    {{ sortKey === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 4. Nơi XB (noi_xuat_ban) -->
              <th @click="sortBy('noi_xuat_ban')" class="sortable-th">
                <div class="th-content">
                  Nơi XB 
                  <span class="sort-icon" :class="{ active: sortKey === 'noi_xuat_ban' }">
                    {{ sortKey === 'noi_xuat_ban' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 5. Năm XB (nam_xuat_ban) -->
              <th @click="sortBy('nam_xuat_ban')" class="sortable-th">
                <div class="th-content">
                  Năm XB 
                  <span class="sort-icon" :class="{ active: sortKey === 'nam_xuat_ban' }">
                    {{ sortKey === 'nam_xuat_ban' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 6. Khổ (kho_sach) -->
              <th @click="sortBy('kho_sach')" class="sortable-th">
                <div class="th-content">
                  Khổ 
                  <span class="sort-icon" :class="{ active: sortKey === 'kho_sach' }">
                    {{ sortKey === 'kho_sach' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 7. Trang (so_trang) -->
              <th @click="sortBy('so_trang')" class="sortable-th text-center">
                <div class="th-content center">
                  Trang 
                  <span class="sort-icon" :class="{ active: sortKey === 'so_trang' }">
                    {{ sortKey === 'so_trang' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 8. Giá tiền (gia_tien) -->
              <th @click="sortBy('gia_tien')" class="sortable-th text-right">
                <div class="th-content right">
                  Giá tiền 
                  <span class="sort-icon" :class="{ active: sortKey === 'gia_tien' }">
                    {{ sortKey === 'gia_tien' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 9. Số vào sổ (so_vao_so) -->
              <th @click="sortBy('so_vao_so')" class="sortable-th text-center">
                <div class="th-content center">
                  Số vào sổ 
                  <span class="sort-icon" :class="{ active: sortKey === 'so_vao_so' }">
                    {{ sortKey === 'so_vao_so' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- 10. Môn loại (mon_loai) -->
              <th @click="sortBy('mon_loai')" class="sortable-th text-center">
                <div class="th-content center">
                  Môn loại 
                  <span class="sort-icon" :class="{ active: sortKey === 'mon_loai' }">
                    {{ sortKey === 'mon_loai' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                  </span>
                </div>
              </th>

              <!-- Trạng thái mượn trả -->
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
              <!-- 1. STT -->
              <td class="text-subtle font-mono">{{ index + 1 }}</td>
              
              <!-- 2. Tác giả -->
              <td class="text-author">{{ book.author || '-' }}</td>
              
              <!-- 3. Tên sách -->
              <td class="font-bold text-title">{{ book.title }}</td>
              
              <!-- 4. Nơi XB -->
              <td class="text-subtle text-center">{{ book.noi_xuat_ban || '-' }}</td>
              
              <!-- 5. Năm XB -->
              <td class="text-subtle text-center">{{ book.nam_xuat_ban || '-' }}</td>
              
              <!-- 6. Khổ -->
              <td class="text-subtle">{{ book.kho_sach || '-' }}</td>
              
              <!-- 7. Trang -->
              <td class="text-center font-mono">{{ book.so_trang || '-' }}</td>
              
              <!-- 8. Giá tiền -->
              <td class="text-right font-mono text-price">{{ book.gia_tien || '-' }}</td>
              
              <!-- 9. Số vào sổ -->
              <td class="text-center">
                <span class="code-badge">{{ book.so_vao_so }}</span>
              </td>
              
              <!-- 10. Môn loại -->
              <td class="text-center">
                <span class="cat-tag">{{ book.mon_loai || '-' }}</span>
              </td>
              
              <!-- Trạng thái -->
              <td class="text-center">
                <span class="badge" :class="book.status === 'available' ? 'badge-success' : 'badge-warning'">
                  {{ book.status === 'available' ? 'Sẵn sàng' : 'Đang mượn' }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredAndSortedBooks.length === 0">
              <td colspan="11" class="no-data">
                <div class="empty-state">
                  <span>🔍</span>
                  <p>Không tìm thấy dữ liệu sách phù hợp.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= TAB 2: QUẢN LÝ MƯỢN TRẢ ================= -->
    <div v-if="activeTab === 'manager'" class="glass-panel slide-in">
      <div class="d-flex justify-between align-center mb-3">
        <h4 class="m-0">Danh sách phiếu mượn trả hiện tại</h4>
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
              <td>{{ item.rank }}<br><small class="text-muted">{{ item.position }}</small></td>
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
              <td colspan="7" class="no-data">Chưa có bản ghi mượn trả nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= MODALS ================= -->
    
    <!-- Modal Chi Tiết Sách -->
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
              <p><strong>Mảng loại:</strong> {{ selectedBook.category }}</p>
              <p><strong>Số vào sổ:</strong> {{ selectedBook.so_vao_so }}</p>
              <p><strong>Môn loại:</strong> {{ selectedBook.mon_loai }}</p>
              <p><strong>Nơi XB:</strong> {{ selectedBook.noi_xuat_ban }} ({{ selectedBook.nam_xuat_ban }})</p>
              <p><strong>Khổ sách:</strong> {{ selectedBook.kho_sach }}</p>
              <p><strong>Số trang:</strong> {{ selectedBook.so_trang }} trang</p>
              <p><strong>Giá tiền:</strong> {{ selectedBook.gia_tien }}</p>
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

    <!-- Modal Đăng Ký Mượn Sách -->
    <div v-if="showBorrowModal" class="modal-overlay" @click.self="showBorrowModal = false">
      <div class="modal-content glass-panel">
        <div class="modal-header">
          <h4>Phiếu đăng ký mượn sách</h4>
          <button class="btn-close" @click="showBorrowModal = false">✕</button>
        </div>
        <div class="modal-body form-group">
          <label>Tên sách mượn</label>
          <input type="text" :value="selectedBook.title" disabled class="input-disabled" />
          
          <label>Họ và tên người mượn (*)</label>
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

    <!-- Modal Trả Sách -->
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
export default {
  data() {
    return {
      activeTab: 'library',
      searchQuery: '',
      selectedCategory: 'Tất cả sách',
      sortKey: 'id',
      sortOrder: 'asc', // 'asc' hoặc 'desc'
      
      categories: [
        'Tất cả sách', 
        'Mảng sách về Đảng', 
        'Mảng sách về Bác Hồ', 
        'Mảng sách về Quân sự', 
        'Sách về văn học', 
        'Sách pháp luật', 
        'Mảng sách khác'
      ],
      
      // Mock Data khớp chính xác với 10 cột trong cơ sở dữ liệu Supabase của bạn
      books: [
        { id: 21, so_vao_so: '0067', title: 'Dự Thảo Các Văn Kiện Trình ĐH XIII', author: 'Nhiều tác giả', category: 'Mảng sách về Đảng', noi_xuat_ban: 'H', nam_xuat_ban: '2025', kho_sach: '13×19', so_trang: '76', gia_tien: '14.000đ', mon_loai: '3KV4', status: 'available' },
        { id: 22, so_vao_so: '0068', title: 'Xây Dựng QĐNDVN Trong Tình Hình Mới', author: 'Phan Văn Giang', category: 'Mảng sách về Quân sự', noi_xuat_ban: 'H', nam_xuat_ban: '2025', kho_sach: '13×19', so_trang: '76', gia_tien: '14.000đ', mon_loai: '3KV4', status: 'available' },
        { id: 23, so_vao_so: '0069', title: 'Tư Tưởng Hồ Chí Minh Về Quân Sự', author: 'Nhiều tác giả', category: 'Mảng sách về Bác Hồ', noi_xuat_ban: 'H', nam_xuat_ban: '2006', kho_sach: '13×19', so_trang: '100', gia_tien: '4.500đ', mon_loai: '3KV4', status: 'borrowed' },
        { id: 24, so_vao_so: '0070', title: 'Giáo Trình Lí Luận Chính Trị', author: 'Nguyễn Văn A', category: 'Mảng sách về Đảng', noi_xuat_ban: 'H', nam_xuat_ban: '2007', kho_sach: '13×19', so_trang: '80', gia_tien: '4.300đ', mon_loai: '3KV4', status: 'available' },
        { id: 25, so_vao_so: '0071', title: 'Nghiên Cứu Tác Tác Chiến Hiện Đại', author: 'Lê Văn C', category: 'Mảng sách về Quân sự', noi_xuat_ban: 'H', nam_xuat_ban: '2008', kho_sach: '13×19', so_trang: '40', gia_tien: '2.500đ', mon_loai: '3KV4', status: 'available' }
      ],

      borrowList: [
        { id: 101, book_id: 23, book_title: 'Tư Tưởng Hồ Chí Minh Về Quân Sự', user_name: 'Trần Văn B', rank: 'Thượng Sĩ', position: 'Tiểu đội trưởng', borrow_date: '2026-09-10', due_date: '2026-09-17', status: 'borrowed' }
      ],

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
    // Tìm kiếm + Lọc + Sắp xếp động A-Z / Z-A
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

      // Xử lý sắp xếp theo cột
      if (this.sortKey) {
        result.sort((a, b) => {
          let valA = a[this.sortKey] ?? '';
          let valB = b[this.sortKey] ?? '';

          // Ép kiểu số nếu là trang hoặc id
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
  methods: {
    // Hàm đảo chiều sắp xếp khi nhấn vào tiêu đề cột
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },

    getTodayDateString() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    addDaysToDate(dateString, days) {
      const date = new Date(dateString);
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
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

    submitBorrow() {
      if (!this.borrowForm.user_name.trim()) {
        alert("Vui lòng nhập họ tên người mượn!");
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

      const bookIdx = this.books.findIndex(b => b.id === this.selectedBook.id);
      if (bookIdx > -1) this.books[bookIdx].status = 'borrowed';

      this.showBorrowModal = false;
    },

    submitReturn() {
      const recordIdx = this.borrowList.findIndex(b => b.id === this.selectedBorrowRecord.id);
      if (recordIdx > -1) {
        this.borrowList[recordIdx].status = 'returned';
        this.borrowList[recordIdx].return_date = this.returnForm.return_date || this.getTodayDateString();
      }

      const bookIdx = this.books.findIndex(b => b.id === this.selectedBorrowRecord.book_id);
      if (bookIdx > -1) this.books[bookIdx].status = 'available';

      this.showReturnModal = false;
    },

    deleteBorrow(id) {
      if (!confirm('Bạn có chắc muốn xóa bản ghi mượn này?')) return;
      this.borrowList = this.borrowList.filter(b => b.id !== id);
    }
  }
};
</script>

<style scoped>
/* ================= PREMIER DARK THEME ================= */
.admin-library-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #f1f5f9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0b0f17;
  padding: 24px;
  border-radius: 20px;
}

/* HEADER */
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 16px;
}
.header-title { display: flex; align-items: center; gap: 14px; }
.icon-badge {
  font-size: 1.8rem;
  background: rgba(59, 130, 246, 0.15);
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.section-top h3 { margin: 0; font-size: 1.4rem; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; }
.subtitle { margin: 4px 0 0 0; font-size: 0.85rem; color: #94a3b8; }

/* TAB NAV */
.tab-nav {
  display: flex;
  gap: 6px;
  background: #161f30;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
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
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-nav button.active {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

/* GLASS PANEL */
.glass-panel {
  background: rgba(18, 26, 43, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.slide-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* TOOLBAR & SEARCH BAR */
.toolbar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.search-icon {
  position: absolute;
  left: 14px;
  font-size: 0.95rem;
  opacity: 0.6;
}
.search-box input {
  width: 100%;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 12px 40px 12px 42px;
  border-radius: 12px;
  font-size: 0.92rem;
  outline: none;
  transition: all 0.2s;
}
.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
}

/* CATEGORY PILLS */
.category-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}
.category-pills button {
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 0.83rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.category-pills button:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.category-pills button.active {
  background: #10b981;
  color: #042f2e;
  font-weight: 700;
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

/* TABLE STYLING */
.table-responsive { width: 100%; overflow-x: auto; margin-top: 10px; }
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.88rem;
}
.data-table th {
  background: #0f172a;
  color: #94a3b8;
  font-weight: 600;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  user-select: none;
}
.data-table th:first-child { border-top-left-radius: 10px; }
.data-table th:last-child { border-top-right-radius: 10px; }

.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

/* SORTABLE HEADERS */
.sortable-th { cursor: pointer; transition: background 0.2s; }
.sortable-th:hover { background: #1a2436; color: #fff; }
.th-content { display: flex; align-items: center; gap: 6px; }
.th-content.center { justify-content: center; }
.th-content.right { justify-content: flex-end; }
.sort-icon { font-size: 0.72rem; opacity: 0.4; }
.sort-icon.active { opacity: 1; color: #38bdf8; font-weight: bold; }

/* CLICKABLE ROW & HOVER */
.clickable-row { cursor: pointer; transition: background 0.15s ease; }
.clickable-row:hover { background: rgba(255, 255, 255, 0.03); }

/* ĐẶC BIỆT: Hàng sách đang mượn (Highlight nhẹ nhàng sang trọng) */
.row-borrowed {
  background-color: rgba(245, 158, 11, 0.08) !important;
}
.row-borrowed:hover { background-color: rgba(245, 158, 11, 0.14) !important; }

/* TEXT FORMATTING & BADGES */
.font-mono { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
.font-bold { font-weight: 600; }
.text-title { color: #f8fafc; font-size: 0.9rem; }
.text-author { color: #cbd5e1; }
.text-subtle { color: #94a3b8; font-size: 0.83rem; }
.text-price { color: #38bdf8; font-weight: 600; }
.text-highlight { color: #60a5fa; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.code-badge {
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.cat-tag {
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.badge-info { background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3); }

/* BUTTONS & ACTIONS */
.btn-action {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.btn-return { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.btn-return:hover { background: rgba(16, 185, 129, 0.35); }
.btn-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.25); margin-left: 6px; }
.btn-delete:hover { background: rgba(239, 68, 68, 0.3); }

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

/* MODAL STYLING */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #111827;
  width: 90%; max-width: 520px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.modal-header h4 { margin: 0; font-size: 1.1rem; color: #fff; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; }
.modal-body { padding: 20px; }
.modal-footer { padding: 16px 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); }

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 0.88rem;
}
.book-modal-title { color: #38bdf8; font-size: 1.25rem; margin-top: 0; margin-bottom: 14px; }
.status-box { padding: 10px; border-radius: 8px; text-align: center; font-size: 0.9rem; }
.bg-success-light { background: rgba(16, 185, 129, 0.1); color: #34d399; }
.bg-warning-light { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }

/* FORMS IN MODAL */
.form-group label { display: block; font-size: 0.83rem; color: #94a3b8; margin-bottom: 6px; }
.form-group input {
  width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px;
  background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff; outline: none; font-size: 0.9rem;
}
.input-disabled { background: rgba(255, 255, 255, 0.03) !important; color: #64748b !important; }
.note-text { font-size: 0.78rem; color: #64748b; margin-top: 6px; }

/* UTILS */
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
.empty-state span { font-size: 2rem; display: block; margin-bottom: 8px; }
</style>
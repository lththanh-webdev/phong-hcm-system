<template>
  <div class="library-container">
    <!-- Header Thư Viện -->
    <div class="library-hero">
      <div class="hero-badge">✨ Tủ Sách Tri Thức & Văn Hóa</div>
      <h2>THƯ VIỆN SỐ TRỰC TUYẾN</h2>
      <p>Khám phá không gian tủ sách thông minh, tương tác trực quan và hiện đại</p>

      <!-- Thanh tìm kiếm thông minh -->
      <div class="search-box-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tên sách, tác giả, chuyên mục..." 
          class="smart-search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search-btn">✕</button>
      </div>
    </div>

    <!-- Bộ lọc nhanh danh mục -->
    <div class="category-filters">
      <button 
        v-for="cat in categories" 
        :key="cat" 
        @click="selectedCategory = cat"
        :class="{ active: selectedCategory === cat }"
        class="filter-pill"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Danh Sách Các Ngăn Tủ Chuyên Đề (Accordion) -->
    <div class="drawers-wrapper">
      <div class="drawer-section-title">
        <span class="icon-title">🏛️</span>
        <div>
          <h3>Hệ Thống Tủ Sách Chuyên Đề</h3>
          <p>Nhấn vào từng ngăn tủ để mở/đóng danh mục tài liệu</p>
        </div>
      </div>

      <div 
        v-for="(drawer, index) in filteredDrawers" 
        :key="index" 
        class="drawer-card"
        :class="{ open: drawer.isOpen }"
      >
        <!-- Tiêu đề ngăn tủ -->
        <div class="drawer-header" @click="toggleDrawer(index)">
          <div class="drawer-header-left">
            <span class="drawer-badge">Ngăn {{ String(index + 1).padStart(2, '0') }}</span>
            <h4>{{ drawer.title }}</h4>
            <span class="book-count">({{ drawer.books.length }} tài liệu)</span>
          </div>
          <div class="drawer-header-right">
            <span class="toggle-text">{{ drawer.isOpen ? 'Thu gọn' : 'Mở ngăn' }}</span>
            <span class="arrow-icon" :class="{ rotated: drawer.isOpen }">▼</span>
          </div>
        </div>

        <!-- Nội dung sách bên trong ngăn (Dạng Grid phản hồi tự động) -->
        <transition name="drawer-expand">
          <div v-if="drawer.isOpen" class="drawer-body">
            <div v-if="drawer.books.length > 0" class="books-grid">
              <div v-for="book in drawer.books" :key="book.id" class="book-item-card">
                <div class="book-card-top">
                  <span class="book-cat-tag">{{ book.category }}</span>
                  <div class="book-icon-badge">📖</div>
                </div>
                <div class="book-info">
                  <h5 :title="book.title">{{ book.title }}</h5>
                  <p class="book-author">👤 {{ book.author || 'Đang cập nhật' }}</p>
                  <p class="book-desc">{{ truncate(book.description, 70) }}</p>
                </div>
                <div class="book-card-actions">
                  <button @click="readBook(book)" class="btn-read">
                    <span>📖 Đọc ngay</span>
                  </button>
                  <button @click="downloadBook(book)" class="btn-download" title="Tải tài liệu">
                    📥
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="empty-drawer">
              <p>📭 Hiện chưa có tài liệu nào trong ngăn tủ này.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Modal Đọc Sách Nhanh -->
    <transition name="modal-fade">
      <div v-if="selectedBook" class="book-modal-overlay" @click="selectedBook = null">
        <div class="book-modal-content" @click.stop>
          <div class="modal-header">
            <span class="modal-category">{{ selectedBook.category }}</span>
            <button @click="selectedBook = null" class="close-modal-btn">✕</button>
          </div>
          <h3>{{ selectedBook.title }}</h3>
          <p class="modal-author"><strong>Tác giả / Biên soạn:</strong> {{ selectedBook.author || 'Đang cập nhật' }}</p>
          <div class="modal-body-scroll">
            <p>{{ selectedBook.description }}</p>
          </div>
          <div class="modal-footer">
            <button @click="selectedBook = null" class="btn-close-modal">Đóng cửa sổ</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'Tất cả',
      categories: ['Tất cả', 'Mảng sách về Đảng', 'Mảng sách về Bác Hồ', 'Mảng sách về Quân đội', 'Sách về văn học', 'Sách pháp luật'],
      libraryList: [],
      selectedBook: null
    };
  },
  computed: {
    groupedDrawers() {
      // Định nghĩa sẵn 5 ngăn tủ chuyên đề chính
      const predefinedCategories = [
        'Mảng sách về Đảng',
        'Mảng sách về Bác Hồ',
        'Mảng sách về Quân đội',
        'Sách về văn học',
        'Sách pháp luật'
      ];

      return predefinedCategories.map((catName, idx) => {
        const matchedBooks = this.libraryList.filter(book => {
          const matchCat = book.category && book.category.trim().toLowerCase() === catName.trim().toLowerCase();
          const matchesSearch = this.searchQuery === '' || 
            book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            matchCat;
          return matchCat && matchesSearch;
        });

        // Nếu có từ khóa tìm kiếm mà ngăn này khớp, hoặc mặc định mở ngăn đầu tiên
        const isOpen = idx === 0 || this.searchQuery.trim() !== '' || matchedBooks.length > 0;

        return {
          title: catName,
          books: matchedBooks,
          isOpen: isOpen
        };
      });
    },
    filteredDrawers() {
      if (this.selectedCategory === 'Tất cả') {
        return this.groupedDrawers;
      }
      return this.groupedDrawers.filter(d => d.title === this.selectedCategory);
    }
  },
  mounted() {
    this.fetchLibraryData();
  },
  methods: {
    async fetchLibraryData() {
      try {
        const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
        const baseUrl = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
        const res = await fetch(`${baseUrl}/api/library`);
        if (res.ok) {
          this.libraryList = await res.json();
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu thư viện:', err);
      }
    },
    toggleDrawer(index) {
      this.groupedDrawers[index].isOpen = !this.groupedDrawers[index].isOpen;
    },
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    readBook(book) {
      this.selectedBook = book;
    },
    downloadBook(book) {
      alert(`Đang chuẩn bị tải xuống tài liệu: "${book.title}"`);
    }
  }
};
</script>

<style scoped>
.library-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  color: #edf2f4;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
}

/* Hero Section */
.library-hero {
  text-align: center;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 40px 20px;
  margin-bottom: 30px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
}
.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}
.library-hero h2 {
  font-size: 2rem;
  color: #ffd700;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
}
.library-hero p {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0 0 25px 0;
}

/* Smart Search Box */
.search-box-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}
.smart-search-input {
  width: 100%;
  background: rgba(11, 19, 43, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 14px 45px 14px 45px;
  border-radius: 30px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
}
.smart-search-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2), inset 0 2px 5px rgba(0,0,0,0.5);
}
.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}
.clear-search-btn {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}
.clear-search-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

/* Category Filters */
.category-filters {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 15px;
  margin-bottom: 25px;
  scrollbar-width: thin;
}
.filter-pill {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.filter-pill:hover, .filter-pill.active {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  border-color: #ffd700;
}

/* Drawers Wrapper */
.drawers-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.drawer-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 5px;
}
.drawer-section-title .icon-title {
  font-size: 1.8rem;
  background: rgba(255, 215, 0, 0.1);
  padding: 10px;
  border-radius: 12px;
}
.drawer-section-title h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
}
.drawer-section-title p {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Drawer Card Styling */
.drawer-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: border-color 0.2s;
}
.drawer-card.open {
  border-color: rgba(255, 215, 0, 0.3);
}
.drawer-header {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: rgba(30, 41, 59, 0.4);
  user-select: none;
}
.drawer-header:hover {
  background: rgba(30, 41, 59, 0.7);
}
.drawer-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.drawer-badge {
  background: #ffd700;
  color: #0b132b;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
}
.drawer-header-left h4 {
  margin: 0;
  font-size: 1.05rem;
  color: #fff;
}
.book-count {
  font-size: 0.8rem;
  color: #94a3b8;
}
.drawer-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
}
.arrow-icon {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}
.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* Drawer Body & Books Grid (FIXED OVERFLOW BY USING GRID AUTO-FILL) */
.drawer-body {
  padding: 20px;
  background: rgba(11, 19, 43, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.empty-drawer {
  text-align: center;
  color: #8d99ae;
  padding: 20px;
  font-style: italic;
}

/* Book Item Card */
.book-item-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.book-item-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}
.book-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.book-cat-tag {
  font-size: 0.7rem;
  background: rgba(2, 132, 199, 0.2);
  color: #38bdf8;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
}
.book-icon-badge {
  font-size: 1.2rem;
}
.book-info h5 {
  margin: 0 0 6px 0;
  font-size: 0.95rem;
  color: #fff;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.book-author {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin: 0 0 8px 0;
}
.book-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0 0 15px 0;
  line-height: 1.4;
  height: 3em;
  overflow: hidden;
}
.book-card-actions {
  display: flex;
  gap: 8px;
}
.btn-read {
  flex: 1;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  text-align: center;
}
.btn-read:hover {
  opacity: 0.9;
}
.btn-download {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}
.btn-download:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Modal Styling */
.book-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}
.book-modal-content {
  background: #0f172a;
  border: 1px solid rgba(255, 215, 0, 0.3);
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.modal-category {
  font-size: 0.75rem;
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
}
.close-modal-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-modal-btn:hover {
  color: #fff;
}
.book-modal-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #fff;
}
.modal-author {
  font-size: 0.85rem;
  color: #cbd5e1;
  margin: 0 0 15px 0;
}
.modal-body-scroll {
  overflow-y: auto;
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 20px;
  padding-right: 5px;
  max-height: 40vh;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
}
.btn-close-modal {
  background: #334155;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-close-modal:hover {
  background: #475569;
}

/* Animations */
.drawer-expand-enter-active, .drawer-expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}
.drawer-expand-enter-from, .drawer-expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .library-hero {
    padding: 25px 15px;
  }
  .library-hero h2 {
    font-size: 1.5rem;
  }
  .drawer-header {
    padding: 14px 16px;
  }
  .drawer-header-left h4 {
    font-size: 0.95rem;
  }
  .books-grid {
    grid-template-columns: 1fr;
  }
}
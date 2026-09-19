<template>
  <div class="library-page">
    <!-- Hero Banner cuốn hút -->
    <div class="library-hero">
      <div class="hero-glow"></div>
      <div class="hero-badge">✨ Tủ Sách Tri Thức & Văn Hóa</div>
      <h2 class="section-title">THƯ VIỆN SỐ TRỰC TUYẾN</h2>
      <p class="section-subtitle">Trải nghiệm không gian tủ sách thông minh, tương tác trực quan và hiện đại</p>
      
      <!-- Thanh tìm kiếm thông minh -->
      <div class="library-toolbar">
        <div class="search-box-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm tài liệu, tác giả, chuyên mục..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">&times;</button>
        </div>
      </div>
    </div>

    <!-- Bố cục Tủ Sách Chính & Pháp Luật -->
    <div class="shelves-container">
      
      <!-- TỦ CHÍNH TRỊ - VĂN HỌC -->
      <div class="book-shelf main-political-shelf">
        <div class="shelf-main-header">
          <div class="shelf-title-group">
            <div class="shelf-icon-wrapper">🏛️</div>
            <div class="shelf-text-wrap">
              <h3>Tủ Sách Chính Trị - Văn Học</h3>
              <span class="shelf-desc">Hệ thống 5 ngăn tủ chuyên đề</span>
            </div>
          </div>
          <div class="shelf-stats">
            <span class="stat-pill">📚 {{ totalLeftDocs }} tài liệu</span>
          </div>
        </div>

        <div class="drawers-container fixed-shelf-box">
          <div 
            v-for="(cat, index) in leftCategories" 
            :key="cat" 
            class="drawer-item-card"
            @click="openCategoryDetail(cat)"
          >
            <div class="drawer-left-info">
              <span class="drawer-number">Ngăn 0{{ index + 1 }}</span>
              <h4 class="drawer-title">
                <span class="bullet-glow"></span> {{ cat }}
              </h4>
            </div>
            <div class="drawer-right-meta">
              <span class="drawer-count">({{ getDocsByCategory(cat).length }} tài liệu)</span>
              <span class="drawer-arrow-icon">➔</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TỦ BÊN PHẢI: Tủ Sách Pháp Luật -->
      <div class="book-shelf law-shelf-container">
        <div class="shelf-header">
          <div class="shelf-title-group">
            <div class="shelf-icon-wrapper law-icon">⚖️</div>
            <div class="shelf-text-wrap">
              <h3>Tủ Sách Pháp Luật</h3>
              <span class="shelf-desc">Văn bản, Luật định & Quy chế</span>
            </div>
          </div>
          
          <div class="sort-box" ref="rightSortBox">
            <div class="custom-select-trigger" @click="rightDropdownOpen = !rightDropdownOpen">
              <span>{{ rightSort === 'date-desc' ? '⚡ Mới' : '🔤 A-Z' }}</span>
              <span class="dropdown-arrow" :class="{ 'is-open': rightDropdownOpen }">▼</span>
            </div>
            <div v-if="rightDropdownOpen" class="custom-dropdown-menu">
              <div class="dropdown-option" :class="{ active: rightSort === 'date-desc' }" @click="setRightSort('date-desc')">⚡ Mới cập nhật</div>
              <div class="dropdown-option" :class="{ active: rightSort === 'name-asc' }" @click="setRightSort('name-asc')">🔤 Tên (A-Z)</div>
            </div>
          </div>
        </div>

        <div class="doc-list right-list fixed-shelf-box">
          <div v-if="filteredRightDocs.length === 0" class="no-data">Chưa có tài liệu pháp luật nào phù hợp...</div>
          
          <div v-for="doc in filteredRightDocs" :key="doc.id" class="doc-card law-card" @click="openBookDetail(doc)">
            <div class="doc-card-indicator law-indicator"></div>
            <div class="doc-info">
              <div class="doc-top-row">
                <span class="doc-date">📅 {{ formatDate(doc.created_at) }}</span>
              </div>
              <h4 class="doc-title">{{ doc.title }}</h4>
              <p class="doc-meta">🏛️ {{ doc.author || 'Cơ quan biên soạn' }}</p>
            </div>
            <div class="doc-actions" @click.stop>
              <button class="btn-action btn-read" @click="openBookDetail(doc)">📖 Đọc</button>
              <button class="btn-action btn-download" @click="handleDownload(doc)">📥 Tải</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL HIỂN THỊ DANH SÁCH CHUYÊN MỤC -->
    <div v-if="selectedCategory" class="book-modal-overlay" @click="closeCategoryDetail">
      <div class="book-object-wrapper animate-book-open category-modal-wrapper" @click.stop>
        <button class="close-book-btn" @click="closeCategoryDetail">&times;</button>
        
        <div class="category-modal-header">
          <div class="shelf-title-group">
            <div class="shelf-icon-wrapper">🏛️</div>
            <div class="shelf-text-wrap">
              <span class="category-modal-subtitle">Trang danh mục tủ sách</span>
              <h3>{{ selectedCategory }}</h3>
            </div>
          </div>

          <div class="category-modal-toolbar">
            <span class="stat-pill">📚 {{ filteredCategoryDocs.length }} tài liệu</span>
            
            <div class="sort-box" ref="categorySortBox">
              <div class="custom-select-trigger" @click="categoryDropdownOpen = !categoryDropdownOpen">
                <span>{{ categorySort === 'date-desc' ? '⚡ Mới cập nhật' : '🔤 Tên (A-Z)' }}</span>
                <span class="dropdown-arrow" :class="{ 'is-open': categoryDropdownOpen }">▼</span>
              </div>
              <div v-if="categoryDropdownOpen" class="custom-dropdown-menu">
                <div class="dropdown-option" :class="{ active: categorySort === 'date-desc' }" @click="setCategorySort('date-desc')">⚡ Mới cập nhật</div>
                <div class="dropdown-option" :class="{ active: categorySort === 'name-asc' }" @click="setCategorySort('name-asc')">🔤 Tên (A-Z)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="category-modal-body fixed-shelf-box">
          <div v-if="filteredCategoryDocs.length === 0" class="no-data">
            📭 Danh mục này hiện chưa có tài liệu nào phù hợp...
          </div>

          <div class="doc-list">
            <div 
              v-for="doc in filteredCategoryDocs" 
              :key="doc.id" 
              class="doc-card" 
              @click="openBookDetail(doc)"
            >
              <div class="doc-card-indicator"></div>
              <div class="doc-info">
                <div class="doc-top-row">
                  <span class="doc-date">📅 {{ formatDate(doc.created_at) }}</span>
                </div>
                <h4 class="doc-title">{{ doc.title }}</h4>
                <p class="doc-meta">✍️ {{ doc.author || 'Đang cập nhật' }}</p>
              </div>
              <div class="doc-actions" @click.stop>
                <button class="btn-action btn-read" @click="openBookDetail(doc)">📖 Đọc</button>
                <button class="btn-action btn-download" @click="handleDownload(doc)">📥 Tải</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ĐỌC SÁCH FULL MÀN HÌNH TỐI ƯU (CÓ TÍNH NĂNG MỞ RỘNG 3/4 MÀN HÌNH) -->
    <div v-if="selectedDoc" class="book-modal-overlay" @click="closeBookDetail">
      <div 
        class="book-object-wrapper animate-book-open fullscreen-reader-wrapper" 
        :class="{ 'is-expanded-reader': isReaderExpanded }"
        @click.stop
      >
        <button class="close-book-btn" @click="closeBookDetail">&times;</button>

        <div class="reader-container" :class="{ 'expanded-layout': isReaderExpanded }">
          
          <!-- Header của tài liệu: Thu nhỏ lại chiếm 1 phần khi mở rộng -->
          <div class="reader-header" :class="{ 'compact-header': isReaderExpanded }">
            <span class="reader-author-badge">✒️ {{ selectedDoc.author || 'Đang cập nhật' }}</span>
            <h2 class="reader-title">{{ selectedDoc.title }}</h2>
            <div class="reader-meta-info">
              <span>📅 Ngày cập nhật: {{ formatDate(selectedDoc.created_at) }}</span>
            </div>
            <div class="gold-divider"></div>
          </div>

          <!-- Nội dung sách: Mở rộng chiếm 3/4 khi nhấn nút full -->
          <div class="reader-content-box" :class="{ 'expanded-content-box': isReaderExpanded }">
            <div class="page-content-header">
              <h4>📖 Nội Dung Chi Tiết Tác Phẩm</h4>
              <button class="btn-expand-toggle" @click="isReaderExpanded = !isReaderExpanded" :title="isReaderExpanded ? 'Thu nhỏ bảng điều khiển' : 'Phóng to nội dung'">
                {{ isReaderExpanded ? '🗗 Thu nhỏ' : '🗖 Phóng to (3/4)' }}
              </button>
            </div>

            <div class="book-scrollable-content" :key="currentBookPage">
              <div v-for="(para, idx) in currentParagraphs" :key="idx" class="book-paragraph">
                {{ para }}
              </div>
            </div>
          </div>

          <!-- Thanh điều hướng trang dưới cùng -->
          <div class="book-footer-pagination">
            <button class="btn-page-nav" @click="prevPage" :disabled="currentBookPage === 1" :class="{ disabled: currentBookPage === 1 }">
              ◀ Trang trước
            </button>
            <span class="page-indicator">Trang {{ currentBookPage }} / {{ totalBookPages }}</span>
            <button class="btn-page-nav" @click="nextPage" :disabled="currentBookPage === totalBookPages" :class="{ disabled: currentBookPage === totalBookPages }">
              Trang sau ▶
            </button>
            <button class="btn-download-page" @click="handleDownload(selectedDoc)" title="Tải file sách">
              📥 Tải Sách
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default {
  data() {
    return {
      docs: [],
      searchQuery: '',
      selectedDoc: null,
      currentBookPage: 1,
      charsPerPage: 600,
      
      selectedCategory: null,
      categorySort: 'date-desc',
      categoryDropdownOpen: false,

      rightSort: 'date-desc',
      rightDropdownOpen: false,

      isReaderExpanded: false,

      leftCategories: [
        'Mảng sách về Đảng',
        'Mảng sách về Bác Hồ',
        'Mảng sách về Quân đội',
        'Sách về văn học',
        'Các loại sách khác'
      ]
    }
  },
  computed: {
    totalLeftDocs() {
      return this.docs.filter(d => d.category && d.category.trim().toLowerCase() !== 'sách pháp luật').length;
    },
    filteredCategoryDocs() {
      if (!this.selectedCategory) return [];
      let list = this.docs.filter(d => {
        if (!d.category) return false;
        return d.category.trim().toLowerCase() === this.selectedCategory.trim().toLowerCase();
      });
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(d => 
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.author && d.author.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q))
        );
      }
      return list.sort((a, b) => {
        if (this.categorySort === 'name-asc') {
          return (a.title || '').localeCompare(b.title || '');
        } else {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
    },
    filteredRightDocs() {
      let list = this.docs.filter(d => d.category && d.category.trim().toLowerCase() === 'sách pháp luật');
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(d => 
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.author && d.author.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q))
        );
      }
      return list.sort((a, b) => {
        if (this.rightSort === 'name-asc') {
          return (a.title || '').localeCompare(b.title || '');
        } else {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
    },
    totalBookPages() {
      if (!this.selectedDoc || !this.selectedDoc.description) return 1;
      return Math.max(1, Math.ceil(this.selectedDoc.description.length / this.charsPerPage));
    },
    currentParagraphs() {
      if (!this.selectedDoc) return [];
      const text = this.selectedDoc.description || 'Chưa có bản mô tả chi tiết cho cuốn sách này.';
      const start = (this.currentBookPage - 1) * this.charsPerPage;
      const end = start + this.charsPerPage;
      const pageText = text.substring(start, end);
      return pageText.split('\n').filter(p => p.trim() !== '');
    }
  },
  mounted() {
    this.fetchLibraryDocs();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    openCategoryDetail(cat) {
      this.selectedCategory = cat;
      this.categorySort = 'date-desc';
      this.categoryDropdownOpen = false;
    },
    closeCategoryDetail() {
      this.selectedCategory = null;
    },
    setCategorySort(val) {
      this.categorySort = val;
      this.categoryDropdownOpen = false;
    },
    setRightSort(val) {
      this.rightSort = val;
      this.rightDropdownOpen = false;
    },
    getDocsByCategory(categoryName) {
      return this.docs.filter(d => {
        if (!d.category) return false;
        return d.category.trim().toLowerCase() === categoryName.trim().toLowerCase();
      });
    },
    async fetchLibraryDocs() {
      try {
        const { data, error } = await supabase.from('library').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        this.docs = data || [];
      } catch (err) {
        console.error('Lỗi tải dữ liệu thư viện từ Supabase:', err);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'Gần đây';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleDateString('vi-VN');
    },
    openBookDetail(doc) {
      this.selectedDoc = doc;
      this.currentBookPage = 1;
      this.isReaderExpanded = false;
    },
    closeBookDetail() {
      this.selectedDoc = null;
      this.currentBookPage = 1;
      this.isReaderExpanded = false;
    },
    prevPage() {
      if (this.currentBookPage > 1) {
        this.currentBookPage--;
      }
    },
    nextPage() {
      if (this.currentBookPage < this.totalBookPages) {
        this.currentBookPage++;
      }
    },
    handleDownload(doc) {
      const content = `========================================\nTÊN SÁCH: ${doc.title}\nCHUYÊN MỤC: ${doc.category}\nTÁC GIẢ: ${doc.author || 'N/A'}\nNGÀY CẬP NHẬT: ${this.formatDate(doc.created_at)}\n========================================\n\nNỘI DUNG CHI TIẾT:\n${doc.description || ''}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(doc.title || 'Tai_lieu').replace(/[^a-zA-Z0-9À-ỹ]/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },
    handleClickOutside(e) {
      const rightSortBox = this.$refs.rightSortBox;
      if (rightSortBox && !rightSortBox.contains(e.target)) {
        this.rightDropdownOpen = false;
      }
      const categorySortBox = this.$refs.categorySortBox;
      if (categorySortBox && !categorySortBox.contains(e.target)) {
        this.categoryDropdownOpen = false;
      }
    }
  }
}
</script>

<style scoped>
.library-page {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 16px;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, sans-serif;
  background: radial-gradient(circle at 50% 0%, #2b0b0b 0%, #120303 60%, #080101 100%);
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
}

.library-page *, .library-page *::before, .library-page *::after {
  box-sizing: border-box;
}

/* Hero Banner */
.library-hero {
  position: relative;
  text-align: center;
  margin-bottom: 24px;
  padding: 24px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(139, 0, 0, 0.2) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: 100%;
}

.hero-glow {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 100px;
  background: #ffd700;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-title {
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  word-break: break-word;
}

.section-subtitle {
  color: #cbd5e1;
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  max-width: 650px;
  margin: 0 auto 16px auto;
  padding: 0 10px;
}

/* Search Box */
.library-toolbar { display: flex; justify-content: center; width: 100%; }
.search-box-wrapper { position: relative; width: 100%; max-width: 580px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 16px; font-size: 0.95rem; }
.search-input {
  width: 100%;
  padding: 10px 40px 10px 42px;
  border-radius: 50px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-size: 0.88rem;
  outline: none;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
  transition: all 0.3s;
}
.search-input:focus { border-color: #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
.clear-search { position: absolute; right: 14px; background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; }

/* Shelves Container */
.shelves-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  align-items: stretch;
}

@media(max-width: 1024px) {
  .shelves-container { grid-template-columns: 1fr; }
}

.book-shelf {
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  height: 530px;
}

@media(max-width: 1024px) {
  .book-shelf { height: 480px; }
}

.fixed-shelf-box {
  flex: 1;
  height: auto !important;
  max-height: none !important;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.4) rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fixed-shelf-box::-webkit-scrollbar { width: 5px; }
.fixed-shelf-box::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.4); border-radius: 10px; }

.shelf-main-header, .shelf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: 12px;
  margin-bottom: 14px;
  flex-shrink: 0;
  gap: 10px;
}

.shelf-title-group { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
.shelf-icon-wrapper {
  width: 42px; height: 42px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 140, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.law-icon { background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.1)); border-color: rgba(34, 197, 94, 0.4); }

.shelf-text-wrap { min-width: 0; flex: 1; overflow: hidden; }
.shelf-text-wrap h3 { color: #ffd700; font-size: clamp(0.95rem, 1.5vw, 1.15rem); font-weight: 800; margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.shelf-desc { font-size: 0.75rem; color: #94a3b8; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stat-pill { background: rgba(255,215,0,0.1); color: #ffd700; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(255,215,0,0.25); white-space: nowrap; }

.drawers-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.drawer-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background: linear-gradient(90deg, rgba(45, 20, 20, 0.9) 0%, rgba(20, 10, 10, 0.9) 100%);
  border: 1px solid rgba(255, 215, 0, 0.18);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
  width: 100%;
  flex: 1;
}

.drawer-item-card:hover {
  background: linear-gradient(90deg, rgba(65, 28, 28, 0.95), rgba(35, 15, 15, 0.95));
  border-color: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 215, 0, 0.2);
}

.drawer-left-info { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
.drawer-number {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}
.drawer-title {
  color: #38bdf8;
  font-size: clamp(0.82rem, 1.3vw, 0.95rem);
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.bullet-glow { width: 6px; height: 6px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 6px #38bdf8; flex-shrink: 0; }

.drawer-right-meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.drawer-count { font-size: 0.78rem; color: #94a3b8; }
.drawer-arrow-icon { color: #ffd700; font-size: 0.95rem; font-weight: 700; transition: transform 0.2s; }
.drawer-item-card:hover .drawer-arrow-icon { transform: translateX(4px); }

.right-list { display: flex; flex-direction: column; gap: 10px; }
.doc-card {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  background: rgba(30, 15, 15, 0.85);
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
  transition: 0.2s;
  gap: 12px;
  width: 100%;
}
.doc-card:hover { border-color: #ffd700; }
.doc-info { flex: 1; min-width: 0; }
.doc-top-row { display: flex; gap: 8px; margin-bottom: 3px; align-items: center; flex-wrap: wrap; }
.doc-date { font-size: 0.72rem; color: #94a3b8; }

.doc-title { 
  color: #fff; 
  font-size: clamp(0.82rem, 1.3vw, 0.9rem); 
  font-weight: 700; 
  margin: 0 0 3px 0; 
  white-space: normal; 
  word-break: break-word; 
  overflow-wrap: break-word; 
  line-height: 1.4;
}

.doc-meta { font-size: 0.75rem; color: #cbd5e1; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-actions { display: flex; gap: 6px; flex-shrink: 0; }
.btn-action { padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
.btn-read { background: rgba(59,130,246,0.2); color: #93c5fd; }
.btn-read:hover { background: #3b82f6; color: #fff; }
.btn-download { background: rgba(239,68,68,0.2); color: #fca5a5; }
.btn-download:hover { background: #ef4444; color: #fff; }
.no-data { color: #94a3b8; font-style: italic; text-align: center; padding: 30px; font-size: 0.88rem; }

/* Custom Dropdown */
.sort-box { position: relative; flex-shrink: 0; }
.custom-select-trigger {
  background: rgba(30, 15, 15, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  white-space: nowrap;
}
.dropdown-arrow { font-size: 0.58rem; transition: transform 0.2s; }
.dropdown-arrow.is-open { transform: rotate(180deg); }
.custom-dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: #1e0e0e;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
  z-index: 50;
  width: 140px;
  overflow: hidden;
}
.dropdown-option {
  padding: 8px 12px;
  font-size: 0.78rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-option:hover { background: rgba(255, 215, 0, 0.15); color: #ffd700; }
.dropdown-option.active { background: rgba(255, 215, 0, 0.25); color: #ffd700; font-weight: 700; }

@media(max-width: 600px) {
  .library-page { padding: 10px 8px; }
  .book-shelf { height: auto; min-height: 440px; padding: 14px; }
  .fixed-shelf-box { max-height: 380px; }
  .doc-card { flex-direction: column; align-items: flex-start; gap: 8px; }
  .doc-actions { width: 100%; justify-content: flex-end; }
  .shelf-main-header, .shelf-header { flex-direction: column; align-items: flex-start; }
  .shelf-stats, .sort-box { align-self: flex-end; margin-top: 4px; }
}

/* Modal Sách Mở Chung */
.book-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 12px;
}

.book-object-wrapper {
  background: linear-gradient(135deg, #200d0d 0%, #0c0404 100%);
  width: 100%;
  max-width: 900px;
  height: 85vh;
  max-height: 750px;
  border-radius: 14px;
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255, 215, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: max-width 0.3s ease, height 0.3s ease;
}

.book-object-wrapper.is-expanded-reader {
  max-width: 1050px;
  height: 94vh;
  max-height: none;
}

.category-modal-wrapper {
  max-width: 920px;
  padding: 20px;
  height: 85vh;
}

.category-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.25);
  padding-bottom: 12px;
  margin-bottom: 12px;
  flex-wrap: nowrap; /* Đảm bảo các thành phần không bị dồn ép rớt dòng dọc */
  gap: 15px;
  flex-shrink: 0;
}

.category-modal-subtitle {
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap; /* Khắc phục lỗi rớt chữ dọc */
  display: block;
}

.category-modal-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.category-modal-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  height: auto !important;
  max-height: none !important;
}

.close-book-btn {
  position: absolute;
  top: 10px; right: 12px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 30;
  transition: 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.close-book-btn:hover { background: #ef4444; }

/* GIAO DIỆN ĐỌC FULL MÀN HÌNH & TÍNH NĂNG MỞ RỘNG 3/4 */
.fullscreen-reader-wrapper {
  max-width: 850px;
  height: 90vh;
  padding: 24px;
}

.reader-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: linear-gradient(145deg, #180a0a 0%, #0d0404 100%);
  border-radius: 10px;
  overflow: hidden;
}

.reader-container.expanded-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 8px;
}

.reader-header {
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 12px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.reader-header.compact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  margin-bottom: 4px;
  background: rgba(255, 215, 0, 0.04);
  border-radius: 8px;
  text-align: left;
  flex-wrap: wrap;
  gap: 6px;
}

.compact-header .reader-author-badge { margin-bottom: 0; font-size: 0.68rem; padding: 2px 6px; }
.compact-header .reader-title { font-size: 0.95rem; margin: 0; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.compact-header .reader-meta-info { font-size: 0.68rem; margin-bottom: 0; }
.compact-header .gold-divider { display: none; }

.reader-author-badge {
  font-size: 0.75rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 4px;
}

.reader-title {
  color: #fff;
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  font-weight: 900;
  line-height: 1.35;
  margin: 4px 0 8px 0;
}

.reader-meta-info {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 8px;
}

.gold-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  margin: 0 auto;
}

.reader-content-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.reader-content-box.expanded-content-box {
  flex: 3;
}

.page-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.page-content-header h4 {
  color: #38bdf8;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 700;
}

.btn-expand-toggle {
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #38bdf8;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-expand-toggle:hover {
  background: #38bdf8;
  color: #0f172a;
}

.book-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) rgba(0,0,0,0.2);
}

.book-scrollable-content::-webkit-scrollbar { width: 5px; }
.book-scrollable-content::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.3); border-radius: 10px; }

.book-paragraph {
  color: #e2e8f0;
  font-size: 0.9rem;
  line-height: 1.8;
  text-align: justify;
  text-indent: 1.2em;
  margin-bottom: 12px;
  word-break: break-word;
  hyphens: auto;
}

.book-footer-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  margin-top: 12px;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}

.btn-page-nav {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-page-nav:hover:not(.disabled) { background: rgba(255, 215, 0, 0.2); color: #ffd700; }
.btn-page-nav.disabled { opacity: 0.4; cursor: not-allowed; }

.page-indicator {
  font-size: 0.8rem;
  color: #ffd700;
  font-weight: 700;
}

.btn-download-page {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-download-page:hover { opacity: 0.9; }

@keyframes bookOpenPop {
  0% { transform: scale(0.9) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-book-open { animation: bookOpenPop 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
</style>
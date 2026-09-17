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

    <!-- Bố cục Tủ Sách Chính -->
    <div class="shelves-container">
      
      <!-- TỦ CHÍNH TRỊ - VĂN HỌC (Cố định kích thước khung tủ, cuộn bên trong) -->
      <div class="book-shelf main-political-shelf">
        <div class="shelf-main-header">
          <div class="shelf-title-group">
            <div class="shelf-icon-wrapper">🏛️</div>
            <div class="shelf-text-wrap">
              <h3>Tủ Sách Chính Trị - Văn Học</h3>
              <span class="shelf-desc">Hệ thống 5 ngăn tủ chuyên đề (Cố định khung, cuộn mượt mà)</span>
            </div>
          </div>
          <div class="shelf-stats">
            <span class="stat-pill">📚 {{ totalLeftDocs }} tài liệu</span>
          </div>
        </div>

        <!-- 5 Ngăn tủ nằm trong khung cố định chiều cao và có thanh cuộn -->
        <div class="drawers-container fixed-shelf-box">
          <div 
            v-for="(cat, index) in leftCategories" 
            :key="cat" 
            class="drawer-item"
            :class="{ 'is-open': isDrawerOpen(cat) }"
          >
            <!-- Thanh tay nắm ngăn tủ (Click để kéo mở/đóng) -->
            <div class="drawer-handle-bar" @click="toggleDrawer(cat)">
              <div class="drawer-left-info">
                <span class="drawer-number">Ngăn 0{{ index + 1 }}</span>
                <h4 class="drawer-title">
                  <span class="bullet-glow"></span> {{ cat }}
                </h4>
                <span class="drawer-count">({{ getDocsByCategory(cat).length }} tài liệu)</span>
              </div>
              <div class="drawer-action-badge">
                <span class="status-text">{{ isDrawerOpen(cat) ? 'Đang mở' : 'Đóng' }}</span>
                <span class="drawer-arrow" :class="{ 'rotated': isDrawerOpen(cat) }">▼</span>
              </div>
            </div>

            <!-- Ngăn kéo mở ra với thanh cuộn ngang chứa sách -->
            <div v-show="isDrawerOpen(cat)" class="drawer-drawer-content">
              <div class="inner-shelf-glow"></div>
              
              <div class="horizontal-scroll-wrapper">
                <div v-if="getDocsByCategory(cat).length === 0" class="no-data-drawer">
                  📭 Ngăn tủ này hiện đang trống hoặc không có kết quả phù hợp.
                </div>

                <div 
                  v-for="doc in getDocsByCategory(cat)" 
                  :key="doc.id" 
                  class="drawer-book-card" 
                  @click="openBookDetail(doc)"
                >
                  <div class="book-spine-accent"></div>
                  <div class="drawer-book-info">
                    <span class="drawer-book-cat">{{ doc.category }}</span>
                    <h5 class="drawer-book-title" :title="doc.title">{{ doc.title }}</h5>
                    <p class="drawer-book-author">✍️ {{ doc.author || 'Đang cập nhật' }}</p>
                  </div>
                  <div class="drawer-book-footer">
                    <button class="btn-read-book" @click.stop="openBookDetail(doc)">
                      📖 Đọc ngay
                    </button>
                    <button class="btn-download-book" @click.stop="handleDownload(doc)" title="Tải xuống">
                      📥
                    </button>
                  </div>
                </div>
              </div>
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
                <span class="doc-badge law-badge">Pháp luật</span>
                <span class="doc-date">📅 {{ formatDate(doc.created_at) }}</span>
              </div>
              <h4 class="doc-title" :title="doc.title">{{ doc.title }}</h4>
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

    <!-- HIỆU ỨNG MỞ SÁCH & ĐỌC CHI TIẾT -->
    <div v-if="selectedDoc" class="book-modal-overlay" @click="closeBookDetail">
      <div class="book-object-wrapper animate-book-open" @click.stop>
        
        <button class="close-book-btn" @click="closeBookDetail">&times;</button>

        <div class="open-book-spread">
          <div class="book-page left-page">
            <div class="page-header-author">
              <span class="author-badge-icon">✒️ Tác Giả:</span>
              <h3 class="book-author-top">{{ selectedDoc.author || 'Đang cập nhật' }}</h3>
            </div>
            
            <div class="book-center-title-box">
              <span class="book-category-tag">{{ selectedDoc.category || 'Tài liệu chuyên khảo' }}</span>
              <h2 class="book-title-center">{{ selectedDoc.title }}</h2>
              <div class="gold-divider"></div>
            </div>

            <div class="page-footer-info">
              <span>📅 Ngày cập nhật: {{ formatDate(selectedDoc.created_at) }}</span>
            </div>
          </div>

          <div class="book-page right-page">
            <div class="page-content-header">
              <h4>📖 Nội Dung Chi Tiết Tác Phẩm</h4>
            </div>

            <div class="book-scrollable-content">
              <p class="book-text-body">
                {{ currentPageContent }}
              </p>
            </div>

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
      
      manualToggles: {},

      rightSort: 'date-desc',
      rightDropdownOpen: false,

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
    currentPageContent() {
      if (!this.selectedDoc) return '';
      const text = this.selectedDoc.description || 'Chưa có bản mô tả chi tiết cho cuốn sách này.';
      const start = (this.currentBookPage - 1) * this.charsPerPage;
      const end = start + this.charsPerPage;
      return text.substring(start, end);
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
    isDrawerOpen(cat) {
      if (this.searchQuery.trim()) {
        const matches = this.getDocsByCategory(cat).length > 0;
        if (matches) return true;
      }
      if (this.manualToggles[cat] !== undefined) {
        return this.manualToggles[cat];
      }
      return cat === this.leftCategories[0];
    },
    toggleDrawer(cat) {
      const currentState = this.isDrawerOpen(cat);
      this.manualToggles = {
        ...this.manualToggles,
        [cat]: !currentState
      };
    },
    setRightSort(val) {
      this.rightSort = val;
      this.rightDropdownOpen = false;
    },
    getDocsByCategory(categoryName) {
      let list = this.docs.filter(d => {
        if (!d.category) return false;
        return d.category.trim().toLowerCase() === categoryName.trim().toLowerCase();
      });
      
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(d => 
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.author && d.author.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q))
        );
      }
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
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
    },
    closeBookDetail() {
      this.selectedDoc = null;
      this.currentBookPage = 1;
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
    }
  }
}
</script>

<style scoped>
.library-page {
  padding: 40px 20px;
  max-width: 1440px;
  margin: 0 auto;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, sans-serif;
  background: radial-gradient(circle at 50% 0%, #2b0b0b 0%, #120303 60%, #080101 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.library-page * {
  box-sizing: border-box;
}

/* Hero Banner */
.library-hero {
  position: relative;
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(139, 0, 0, 0.2) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  height: 120px;
  background: #ffd700;
  filter: blur(90px);
  opacity: 0.18;
  pointer-events: none;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 14px;
}

.section-title {
  font-size: 2.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.section-subtitle {
  color: #cbd5e1;
  font-size: 1rem;
  max-width: 650px;
  margin: 0 auto 25px auto;
}

/* Search Box */
.library-toolbar { display: flex; justify-content: center; }
.search-box-wrapper { position: relative; width: 100%; max-width: 600px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 18px; font-size: 1.1rem; }
.search-input {
  width: 100%;
  padding: 15px 45px 15px 50px;
  border-radius: 50px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  transition: all 0.3s;
}
.search-input:focus { border-color: #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
.clear-search { position: absolute; right: 18px; background: none; border: none; color: #94a3b8; font-size: 1.3rem; cursor: pointer; }

/* Shelves Container */
.shelves-container {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 30px;
}

@media(max-width: 1100px) {
  .shelves-container { grid-template-columns: 1fr; }
}

.book-shelf {
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
}

/* CỐ ĐỊNH CHIỀU CAO KHUNG TỦ SÁCH KHÔNG THAY ĐỔI NỮA */
.fixed-shelf-box {
  height: 540px;
  max-height: 540px;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.4) rgba(0,0,0,0.2);
}

.fixed-shelf-box::-webkit-scrollbar { width: 6px; }
.fixed-shelf-box::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.4); border-radius: 10px; }

.shelf-main-header, .shelf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: 16px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.shelf-title-group { display: flex; align-items: center; gap: 14px; }
.shelf-icon-wrapper {
  width: 46px; height: 46px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 140, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
}
.law-icon { background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.1)); border-color: rgba(34, 197, 94, 0.4); }

.shelf-text-wrap h3 { color: #ffd700; font-size: 1.2rem; font-weight: 800; margin: 0 0 2px 0; }
.shelf-desc { font-size: 0.78rem; color: #94a3b8; }
.stat-pill { background: rgba(255,215,0,0.1); color: #ffd700; padding: 6px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; border: 1px solid rgba(255,215,0,0.25); }

/* --- 5 NGĂN TỦ CHÍNH TRỊ - VĂN HỌC --- */
.drawers-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.drawer-item {
  background: rgba(30, 14, 14, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.drawer-item.is-open {
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.12);
}

.drawer-handle-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: linear-gradient(90deg, rgba(45, 20, 20, 0.9) 0%, rgba(20, 10, 10, 0.9) 100%);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.drawer-handle-bar:hover {
  background: linear-gradient(90deg, rgba(65, 28, 28, 0.95), rgba(35, 15, 15, 0.95));
}

.drawer-left-info { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.drawer-number {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}
.drawer-title {
  color: #38bdf8;
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.bullet-glow { width: 6px; height: 6px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8; }
.drawer-count { font-size: 0.75rem; color: #94a3b8; }

.drawer-action-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fbbf24;
  font-size: 0.8rem;
  font-weight: 600;
}
.drawer-arrow { font-size: 0.7rem; transition: transform 0.3s; }
.drawer-arrow.rotated { transform: rotate(180deg); }

/* Nội dung ngăn kéo */
.drawer-drawer-content {
  position: relative;
  background: linear-gradient(180deg, rgba(20, 8, 8, 0.95) 0%, rgba(10, 4, 4, 0.98) 100%);
  padding: 18px;
  border-top: 1px dashed rgba(255, 215, 0, 0.3);
}

.inner-shelf-glow {
  position: absolute;
  top: 0; left: 0; right: 0; height: 40px;
  background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.25) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
}

/* Thanh cuộn ngang cho danh sách sách trong ngăn */
.horizontal-scroll-wrapper {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.4) rgba(0,0,0,0.2);
}

.horizontal-scroll-wrapper::-webkit-scrollbar { height: 6px; }
.horizontal-scroll-wrapper::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.4); border-radius: 10px; }

.no-data-drawer {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.88rem;
  padding: 15px;
  width: 100%;
  text-align: center;
}

/* Thẻ sách bên trong ngăn kéo */
.drawer-book-card {
  min-width: 220px;
  max-width: 220px;
  background: linear-gradient(145deg, #281212 0%, #160808 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.book-spine-accent {
  position: absolute;
  top: 0; left: 0; bottom: 0; width: 4px;
  background: #3b82f6;
}

.drawer-book-card:hover {
  transform: translateY(-4px);
  border-color: #ffd700;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5), 0 0 15px rgba(255, 215, 0, 0.2);
}

.drawer-book-info { margin-bottom: 12px; }
.drawer-book-cat {
  font-size: 0.68rem;
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.drawer-book-title {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 8px 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em;
  line-height: 1.4;
}
.drawer-book-author { color: #94a3b8; font-size: 0.75rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.drawer-book-footer { display: flex; gap: 8px; }
.btn-read-book {
  flex: 1;
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.4);
  padding: 6px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}
.btn-read-book:hover { background: #3b82f6; color: #fff; }
.btn-download-book {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-download-book:hover { background: #ef4444; color: #fff; }


/* --- TỦ PHÁP LUẬT BÊN PHẢI --- */
.right-list { display: flex; flex-direction: column; gap: 12px; }
.doc-card {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(30, 15, 15, 0.8);
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
  transition: 0.2s;
}
.doc-card:hover { border-color: #ffd700; transform: translateX(2px); }
.doc-info { flex: 1; min-width: 0; padding-left: 8px; }
.doc-top-row { display: flex; gap: 8px; margin-bottom: 4px; }
.law-badge { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; }
.doc-date { font-size: 0.72rem; color: #94a3b8; }
.doc-title { color: #fff; font-size: 0.92rem; font-weight: 700; margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-meta { font-size: 0.75rem; color: #cbd5e1; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-actions { display: flex; gap: 6px; }
.btn-action { padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
.btn-read { background: rgba(59,130,246,0.2); color: #93c5fd; }
.btn-read:hover { background: #3b82f6; color: #fff; }
.btn-download { background: rgba(239,68,68,0.2); color: #fca5a5; }
.btn-download:hover { background: #ef4444; color: #fff; }
.no-data { color: #94a3b8; font-style: italic; text-align: center; padding: 20px; }

/* Custom Dropdown for Sorting */
.sort-box { position: relative; }
.custom-select-trigger {
  background: rgba(30, 15, 15, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}
.dropdown-arrow { font-size: 0.65rem; transition: transform 0.2s; }
.dropdown-arrow.is-open { transform: rotate(180deg); }
.custom-dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
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
  font-size: 0.8rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-option:hover { background: rgba(255, 215, 0, 0.15); color: #ffd700; }
.dropdown-option.active { background: rgba(255, 215, 0, 0.25); color: #ffd700; font-weight: 700; }


/* --- HIỆU ỨNG MỞ SÁCH --- */
.book-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
}

.book-object-wrapper {
  background: linear-gradient(135deg, #200d0d 0%, #0c0404 100%);
  width: 100%;
  max-width: 900px;
  height: 80vh;
  border-radius: 16px;
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(255, 215, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.close-book-btn {
  position: absolute;
  top: 12px; right: 16px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 10;
  transition: 0.2s;
}
.close-book-btn:hover { background: #ef4444; }

.open-book-spread {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  height: 100%;
  gap: 2px;
  background: rgba(255, 215, 0, 0.15);
}

@media(max-width: 768px) {
  .open-book-spread { grid-template-columns: 1fr; }
  .book-object-wrapper { height: 90vh; }
}

.book-page {
  background: linear-gradient(145deg, #1b0e0e 0%, #110606 100%);
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.left-page {
  border-right: 1px solid rgba(255, 215, 0, 0.15);
  text-align: center;
  align-items: center;
}

.page-header-author {
  margin-top: 10px;
}

.author-badge-icon {
  font-size: 0.85rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.book-author-top {
  color: #ffd700;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 6px 0 0 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.book-center-title-box {
  margin: auto 0;
}

.book-category-tag {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.book-title-center {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1.3;
  margin: 16px 0;
}

.gold-divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  margin: 0 auto;
}

.page-footer-info { font-size: 0.8rem; color: #94a3b8; }

.right-page {
  background: linear-gradient(145deg, #150909 0%, #0d0404 100%);
}

.page-content-header h4 {
  color: #38bdf8;
  font-size: 1.05rem;
  margin: 0 0 14px 0;
  font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 8px;
}

.book-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) rgba(0,0,0,0.2);
}

.book-scrollable-content::-webkit-scrollbar { width: 6px; }
.book-scrollable-content::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.3); border-radius: 10px; }

.book-text-body {
  color: #e2e8f0;
  font-size: 0.95rem;
  line-height: 1.8;
  white-space: pre-wrap;
  margin: 0;
}

.book-footer-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  margin-top: 14px;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-page-nav {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 8px;
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
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-download-page:hover { opacity: 0.9; }

@keyframes bookOpenPop {
  0% { transform: scale(0.85) rotateX(10deg); opacity: 0; }
  100% { transform: scale(1) rotateX(0deg); opacity: 1; }
}
.animate-book-open { animation: bookOpenPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
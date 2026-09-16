<template>
  <div class="library-page">
    <!-- Hero Banner cuốn hút với hiệu ứng ánh sáng nền -->
    <div class="library-hero">
      <div class="hero-glow"></div>
      <div class="hero-badge">✨ Kho Tàng Tri Thức Số</div>
      <h2 class="section-title">THƯ VIỆN SỐ TRỰC TUYẾN</h2>
      <p class="section-subtitle">Kết nối tri thức, lan tỏa giá trị, bồi đắp niềm tin và khát vọng cống hiến</p>
      
      <!-- Thanh tìm kiếm thông minh, nổi bật -->
      <div class="library-toolbar">
        <div class="search-box-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm tài liệu, tác giả, chuyên mục pháp luật, chính trị..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">&times;</button>
        </div>
      </div>
    </div>

    <!-- Bố cục 2 Tủ sách đẳng cấp -->
    <div class="shelves-container">
      
      <!-- TỦ BÊN TRÁI: Chính Trị - Văn Học (Đa mảng sách) -->
      <div class="book-shelf">
        <div class="shelf-header">
          <div class="shelf-title-group">
            <div class="shelf-icon-wrapper">📚</div>
            <div class="shelf-text-wrap">
              <h3>Chính Trị - Văn Học</h3>
              <span class="shelf-desc">Đảng, Bác Hồ, Quân đội, Văn hóa</span>
            </div>
          </div>
        </div>

        <div class="sub-categories-container">
          <div v-for="cat in leftCategories" :key="cat" class="sub-category-section">
            <!-- Tiêu đề mảng sách tích hợp sẵn nút sắp xếp riêng -->
            <div class="sub-category-header">
              <h4 class="sub-category-title">
                <span class="bullet-dot"></span> {{ cat }}
              </h4>
              
              <!-- Custom Dropdown Sắp xếp riêng cho từng mảng sách -->
              <div class="sort-box" :ref="el => setSortBoxRef(cat, el)">
                <div class="custom-select-trigger" @click="toggleSubDropdown(cat)">
                  <span>{{ getSubSort(cat) === 'date-desc' ? '⚡ Mới' : '🔤 A-Z' }}</span>
                  <span class="dropdown-arrow" :class="{ 'is-open': subDropdowns[cat] }">▼</span>
                </div>
                <div v-if="subDropdowns[cat]" class="custom-dropdown-menu">
                  <div 
                    class="dropdown-option" 
                    :class="{ active: getSubSort(cat) === 'date-desc' }" 
                    @click="setSubSort(cat, 'date-desc')"
                  >
                    ⚡ Mới cập nhật
                  </div>
                  <div 
                    class="dropdown-option" 
                    :class="{ active: getSubSort(cat) === 'name-asc' }" 
                    @click="setSubSort(cat, 'name-asc')"
                  >
                    🔤 Tên (A-Z)
                  </div>
                </div>
              </div>
            </div>
            
            <div class="doc-list">
              <div v-if="getDocsByCategory(cat).length === 0" class="no-data-small">
                Chưa có tài liệu
              </div>
              
              <div v-for="doc in getDocsByCategory(cat)" :key="doc.id" class="doc-card" @click="openDetail(doc)">
                <div class="doc-card-indicator"></div>
                <div class="doc-info">
                  <div class="doc-top-row">
                    <span class="doc-badge">{{ doc.category }}</span>
                    <span class="doc-date">📅 {{ formatDate(doc.created_at) }}</span>
                  </div>
                  <h4 class="doc-title">{{ doc.title }}</h4>
                  <p class="doc-meta">✍️ {{ doc.author || 'Đang cập nhật' }}</p>
                </div>
                <div class="doc-actions" @click.stop>
                  <button class="btn-action btn-read" @click="openDetail(doc)" title="Đọc tài liệu">📖 Đọc</button>
                  <button class="btn-action btn-download" @click="handleDownload(doc)" title="Tải file">📥 Tải</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TỦ BÊN PHẢI: Pháp Luật -->
      <div class="book-shelf">
        <div class="shelf-header">
          <div class="shelf-title-group">
            <div class="shelf-icon-wrapper law-icon">⚖️</div>
            <div class="shelf-text-wrap">
              <h3>Tủ Sách Pháp Luật</h3>
              <span class="shelf-desc">Văn bản, Luật định & Quy chế</span>
            </div>
          </div>
          
          <!-- Custom Dropdown Sắp xếp Tủ Phải -->
          <div class="sort-box" ref="rightSortBox">
            <div class="custom-select-trigger" @click="rightDropdownOpen = !rightDropdownOpen" :title="rightSort === 'date-desc' ? 'Mới cập nhật' : 'Tên (A-Z)'">
              <span class="sort-text">{{ rightSort === 'date-desc' ? '⚡ Mới cập nhật' : '🔤 Tên (A-Z)' }}</span>
              <span class="sort-icon-only">{{ rightSort === 'date-desc' ? '⚡' : '🔤' }}</span>
              <span class="dropdown-arrow" :class="{ 'is-open': rightDropdownOpen }">▼</span>
            </div>
            <div v-if="rightDropdownOpen" class="custom-dropdown-menu">
              <div 
                class="dropdown-option" 
                :class="{ active: rightSort === 'date-desc' }" 
                @click="setRightSort('date-desc')"
              >
                ⚡ Mới cập nhật
              </div>
              <div 
                class="dropdown-option" 
                :class="{ active: rightSort === 'name-asc' }" 
                @click="setRightSort('name-asc')"
              >
                🔤 Tên (A-Z)
              </div>
            </div>
          </div>
        </div>

        <div class="doc-list right-list">
          <div v-if="filteredRightDocs.length === 0" class="no-data">
            Chưa có tài liệu pháp luật nào...
          </div>
          
          <div v-for="doc in filteredRightDocs" :key="doc.id" class="doc-card law-card" @click="openDetail(doc)">
            <div class="doc-card-indicator law-indicator"></div>
            <div class="doc-info">
              <div class="doc-top-row">
                <span class="doc-badge law-badge">{{ doc.category || 'Pháp luật' }}</span>
                <span class="doc-date">📅 {{ formatDate(doc.created_at) }}</span>
              </div>
              <h4 class="doc-title">{{ doc.title }}</h4>
              <p class="doc-meta">🏛️ {{ doc.author || 'Cơ quan biên soạn' }}</p>
            </div>
            <div class="doc-actions" @click.stop>
              <button class="btn-action btn-read" @click="openDetail(doc)" title="Đọc tài liệu">📖 Đọc</button>
              <button class="btn-action btn-download" @click="handleDownload(doc)" title="Tải file">📥 Tải</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Chi Tiết Tác Phẩm -->
    <div v-if="selectedDoc" class="modal-overlay" @click="closeDetail">
      <div class="modal-content animate-pop" @click.stop>
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="modal-badge-icon">📜</span>
            <h3>Chi Tiết Tài Liệu Số</h3>
          </div>
          <button class="close-btn" @click="closeDetail">&times;</button>
        </div>

        <div class="modal-body">
          <div class="modal-highlight-banner">
            <h2 class="modal-doc-title">{{ selectedDoc.title }}</h2>
          </div>

          <div class="detail-meta-grid">
            <div class="meta-card">
              <span class="meta-label">Chuyên Mục</span>
              <span class="meta-value highlight-text">{{ selectedDoc.category || 'Chung' }}</span>
            </div>
            <div class="meta-card">
              <span class="meta-label">Tác Giả / Biên Soạn</span>
              <span class="meta-value">{{ selectedDoc.author || 'Đang cập nhật' }}</span>
            </div>
            <div class="meta-card">
              <span class="meta-label">Ngày Cập Nhật</span>
              <span class="meta-value">{{ formatDate(selectedDoc.created_at) }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>📖 Nội dung chi tiết & Tiêu chí thực hiện:</h4>
            <div class="text-content-box">
              {{ selectedDoc.description || 'Chưa có mô tả chi tiết hoặc tiêu chí cho tài liệu này.' }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal btn-download-large" @click="handleDownload(selectedDoc)">
            📥 Tải Tài Liệu Về Máy (.txt)
          </button>
          <button class="btn-modal btn-close" @click="closeDetail">Đóng cửa sổ</button>
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
      
      leftSorts: {},
      subDropdowns: {},
      sortBoxRefs: {},

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
    filteredRightDocs() {
      let list = this.docs.filter(d => d.category === 'Sách pháp luật');
      
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(d => 
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.author && d.author.toLowerCase().includes(q)) ||
          (d.category && d.category.toLowerCase().includes(q)) ||
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
    }
  },
  mounted() {
    this.fetchLibraryDocs();
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    setSortBoxRef(cat, el) {
      if (el) this.sortBoxRefs[cat] = el;
    },
    getSubSort(cat) {
      return this.leftSorts[cat] || 'date-desc';
    },
    toggleSubDropdown(cat) {
      const current = !!this.subDropdowns[cat];
      for (let k in this.subDropdowns) {
        this.subDropdowns[k] = false;
      }
      this.subDropdowns[cat] = !current;
    },
    setSubSort(cat, val) {
      this.leftSorts[cat] = val;
      this.subDropdowns[cat] = false;
    },
    handleOutsideClick(e) {
      for (let cat in this.sortBoxRefs) {
        if (this.sortBoxRefs[cat] && !this.sortBoxRefs[cat].contains(e.target)) {
          this.subDropdowns[cat] = false;
        }
      }
      if (this.$refs.rightSortBox && !this.$refs.rightSortBox.contains(e.target)) {
        this.rightDropdownOpen = false;
      }
    },
    setRightSort(val) {
      this.rightSort = val;
      this.rightDropdownOpen = false;
    },
    getDocsByCategory(categoryName) {
      let list = this.docs.filter(d => d.category === categoryName);
      
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(d => 
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.author && d.author.toLowerCase().includes(q)) ||
          (d.category && d.category.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q))
        );
      }

      const sortVal = this.getSubSort(categoryName);
      return list.sort((a, b) => {
        if (sortVal === 'name-asc') {
          return (a.title || '').localeCompare(b.title || '');
        } else {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
    },

    async fetchLibraryDocs() {
      try {
        const { data, error } = await supabase
          .from('library')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        this.docs = data || [];
      } catch (err) {
        console.error('Lỗi khi tải thư viện từ Supabase:', err.message || err);
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return 'Gần đây';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleDateString('vi-VN');
    },
    openDetail(doc) {
      this.selectedDoc = doc;
    },
    closeDetail() {
      this.selectedDoc = null;
    },
    handleDownload(doc) {
      const content = `========================================\n` +
                    `TÊN TÀI LIỆU: ${doc.title}\n` +
                    `CHUYÊN MỤC: ${doc.category || 'N/A'}\n` +
                    `TÁC GIẢ / NGUỒN: ${doc.author || 'N/A'}\n` +
                    `NGÀY CẬP NHẬT: ${this.formatDate(doc.created_at)}\n` +
                    `========================================\n\n` +
                    `NỘI DUNG CHI TIẾT & TIÊU CHÍ:\n${doc.description || 'Không có mô tả'}`;
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-zA-Z0-9À-ỹ]/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
</script>

<style scoped>
.library-page {
  padding: 40px 24px;
  max-width: 1440px;
  margin: 0 auto;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: radial-gradient(circle at 50% 0%, #310808 0%, #170303 60%, #0d0101 100%);
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
  margin-bottom: 45px;
  padding: 40px 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(139, 0, 0, 0.15) 100%);
  border: 1px solid rgba(255, 215, 0, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
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
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.section-subtitle {
  color: #cbd5e1;
  font-size: 1.05rem;
  font-weight: 400;
  max-width: 700px;
  margin: 0 auto 30px auto;
  line-height: 1.5;
}

/* Thanh tìm kiếm */
.library-toolbar {
  display: flex;
  justify-content: center;
}

.search-box-wrapper {
  position: relative;
  width: 100%;
  max-width: 650px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 20px;
  font-size: 1.1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 52px;
  border-radius: 50px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.search-input:focus {
  border-color: #ffd700;
  background: rgba(20, 30, 50, 0.95);
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.25);
}

.clear-search {
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.4rem;
  cursor: pointer;
}

.clear-search:hover {
  color: #ffd700;
}

/* Bố cục 2 Tủ sách */
.shelves-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  text-align: left;
  width: 100%;
}

@media (max-width: 1024px) {
  .shelves-container {
    grid-template-columns: 1fr;
  }
}

.book-shelf {
  background: rgba(24, 12, 12, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 20px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  transition: border-color 0.3s;
  min-width: 0;
  max-height: 75vh;
  overflow-y: auto;
}

.book-shelf::-webkit-scrollbar,
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.book-shelf::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.2);
  border-radius: 10px;
}

/* Header tủ sách */
.shelf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  padding-bottom: 16px;
}

.shelf-title-group {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.shelf-text-wrap {
  min-width: 0;
  flex: 1;
}

.shelf-icon-wrapper {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

.law-icon {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1));
  border-color: rgba(34, 197, 94, 0.3);
}

.shelf-header h3 {
  color: #ffd700;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 2px 0;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  word-break: break-word;
}

.shelf-desc {
  font-size: 0.78rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* Custom Dropdown Styling */
.sort-box {
  position: relative;
  flex-shrink: 0;
}

.custom-select-trigger {
  background: rgba(30, 15, 15, 0.9);
  color: #fbbf24;
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.custom-select-trigger:hover {
  background: rgba(50, 20, 20, 0.95);
  border-color: #ffd700;
}

.sort-text {
  display: inline;
}
.sort-icon-only {
  display: none;
}

.dropdown-arrow {
  font-size: 0.6rem;
  transition: transform 0.2s;
}

.dropdown-arrow.is-open {
  transform: rotate(180deg);
}

.custom-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 160px;
  background: rgba(22, 12, 12, 0.98);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  z-index: 100;
  overflow: hidden;
  animation: dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdownFade {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-option {
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-option:hover {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
}

.dropdown-option.active {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  font-weight: 700;
}

/* Sub-categories */
.sub-categories-container, .right-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sub-category-section {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 14px 16px;
}

/* ĐÃ SỬA: Cho phép flex-wrap để không bị chồng chéo, tràn trên màn hình nhỏ */
.sub-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
  flex-wrap: wrap; 
}

/* ĐÃ SỬA: Cho phép tên mảng sách dài tự xuống dòng khi thiếu chỗ */
.sub-category-title {
  color: #38bdf8;
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.3px;
  min-width: 0;
  white-space: normal;
  flex: 1;
}

.bullet-dot {
  width: 6px;
  height: 6px;
  background: #38bdf8;
  border-radius: 50%;
  box-shadow: 0 0 8px #38bdf8;
  flex-shrink: 0;
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Thẻ tài liệu */
.doc-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(35, 20, 20, 0.8) 0%, rgba(20, 10, 10, 0.9) 100%);
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 12px;
}

.doc-card-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3b82f6;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.law-indicator {
  background: #22c55e;
}

.doc-card:hover {
  background: linear-gradient(135deg, rgba(50, 25, 25, 0.9) 0%, rgba(30, 15, 15, 0.95) 100%);
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.doc-card:hover .doc-card-indicator {
  opacity: 1;
  box-shadow: 0 0 10px currentColor;
}

.doc-info {
  flex: 1;
  min-width: 0;
  padding-left: 8px;
}

.doc-top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.doc-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.3px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.law-badge {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.3);
}

.doc-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.doc-title {
  margin: 0 0 4px 0;
  color: #fff;
  font-size: 1.02rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.doc-card:hover .doc-title {
  color: #ffd700;
}

.doc-meta {
  margin: 0;
  font-size: 0.8rem;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-action {
  padding: 7px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-read {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border-color: rgba(59, 130, 246, 0.4);
}

.btn-read:hover {
  background: #3b82f6;
  color: #fff;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.btn-download {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.4);
}

.btn-download:hover {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}

.no-data, .no-data-small {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
}

/* Modal Xem Chi Tiết */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(145deg, #1e1111 0%, #0d0606 100%);
  width: 100%;
  max-width: 720px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  text-align: left;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.1);
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalPop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 215, 0, 0.05);
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.modal-badge-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.modal-body {
  padding: 26px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-highlight-banner {
  margin-bottom: 20px;
}

.modal-doc-title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.4;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 22px;
}

@media (max-width: 600px) {
  .detail-meta-grid {
    grid-template-columns: 1fr;
  }
}

.meta-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.12);
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.meta-value {
  font-size: 0.9rem;
  color: #f8fafc;
  font-weight: 700;
}

.highlight-text {
  color: #ffd700;
}

.detail-section h4 {
  color: #38bdf8;
  font-size: 1rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.text-content-box {
  background: rgba(10, 5, 5, 0.6);
  padding: 18px;
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 0.95rem;
  line-height: 1.7;
  white-space: pre-wrap;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 18px 24px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  flex-wrap: wrap;
}

.btn-modal {
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-download-large {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
}

.btn-download-large:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(22, 163, 74, 0.5);
}

.btn-close {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

@media (max-width: 768px) {
  .shelf-header {
    flex-wrap: wrap;
  }
  
  .shelf-title-group {
    flex: 1 1 100%;
  }

  .sort-box {
    margin-left: auto;
  }

  .sort-text {
    display: none;
  }

  .sort-icon-only {
    display: inline;
    font-size: 1.1rem;
  }
  
  .custom-select-trigger {
    padding: 6px 10px;
  }
}
</style>
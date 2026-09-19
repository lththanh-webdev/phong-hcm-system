<template>
  <div class="activity-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-glow"></div>
      <div class="hero-badge animate-fade-down">TIỂU ĐOÀN PHÒNG KHÔNG 16</div>
      <h2 class="section-title animate-fade-in">BẢN TIN HOẠT ĐỘNG</h2>
      <p class="section-desc animate-fade-up">Cập nhật hoạt động công tác tư tưởng, phong trào thi đua & chuyển đổi số toàn đơn vị</p>
    </div>

    <!-- Thanh lọc chuyên mục thông minh (Smart Category Filter) -->
    <div class="filter-bar animate-fade-up" v-if="activities.length > 0">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="filter-pill"
        :class="{ active: currentCategory === cat }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Khu vực Carousel Slider tự động chuyển -->
    <div 
      class="carousel-section"
      v-if="filteredActivities.length > 0"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
    >
      <div class="carousel-header-info">
        <span class="slide-counter">Hiển thị: <strong>{{ currentIndex + 1 }} - {{ Math.min(currentIndex + visibleCards, filteredActivities.length) }}</strong> / {{ filteredActivities.length }} bài viết</span>
      </div>

      <div class="carousel-container">
        <button class="slider-btn prev-btn" @click="slidePrev" :disabled="currentIndex === 0" title="Bài trước">‹</button>
        
        <div class="carousel-track-wrapper">
          <div 
            class="carousel-track" 
            :style="{ transform: `translateX(-${currentIndex * cardWidthPercentage}%)` }"
          >
            <div 
              v-for="(item, index) in filteredActivities" 
              :key="item.id || index" 
              class="activity-card"
              :style="{ flex: `0 0 calc(${cardWidthPercentage}% - 16px)` }"
              @click="openDetail(item)"
            >
              <div class="card-image-wrapper">
                <img :src="item.image_url" class="card-img" alt="Activity Image" loading="lazy" />
                <div class="image-overlay"></div>
                <span class="card-badge">{{ item.category }}</span>
                <span v-if="item.is360" class="badge-360">🌐 Ảnh 360°</span>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-text">{{ item.summary }}</p>
                <div class="card-footer">
                  <span class="card-date">🕒 {{ formatDate(item.created_at || item.date) }}</span>
                  <button class="btn-detail">
                    <span>Xem chi tiết</span>
                    <span class="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="slider-btn next-btn" @click="slideNext" :disabled="currentIndex >= maxIndex" title="Bài tiếp theo">›</button>
      </div>

      <!-- Thanh chỉ mục (Dots indicators) -->
      <div class="carousel-dots" v-if="filteredActivities.length > visibleCards">
        <span 
          v-for="(_, dotIndex) in maxIndex + 1" 
          :key="dotIndex" 
          :class="['dot', { active: currentIndex === dotIndex }]"
          @click="currentIndex = dotIndex"
        ></span>
      </div>
    </div>

    <!-- Trạng thái khi chưa có dữ liệu -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <p>Đang tải dữ liệu hoạt động hoặc chưa có bài viết nào trong chuyên mục này...</p>
    </div>

    <!-- 🌟 MODAL XEM CHI TIẾT HOẠT ĐỘNG -->
    <transition name="modal-modern">
      <div v-if="showModal" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-container">
          <button class="close-btn" @click="closeDetail" title="Đóng">✕</button>
          
          <div v-if="selectedItem" class="modal-body">
            <div class="modal-img-wrapper">
              <!-- Khung 360 độ nếu có -->
              <div v-if="selectedItem.is360" id="panorama-viewer" class="panorama-container"></div>
              
              <!-- Ảnh thông thường -->
              <template v-else>
                <img :src="selectedItem.image_url" class="modal-img" alt="Detail Image" />
                <div class="modal-img-gradient"></div>
              </template>
              
              <span class="modal-badge">{{ selectedItem.category }}</span>
            </div>
            
            <div class="modal-info">
              <div class="modal-meta">
                <span>🕒 Đăng ngày: {{ formatDate(selectedItem.created_at || selectedItem.date) }}</span>
                <span>• Đơn vị: Tiểu Đoàn Phòng Không 16</span>
              </div>
              <h2 class="modal-title">{{ selectedItem.title }}</h2>
              <div class="divider"></div>
              <p class="modal-full-text">{{ selectedItem.content || selectedItem.summary }}</p>
              
              <div class="modal-actions">
                <button class="btn-close-action" @click="closeDetail">Đóng thông tin</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '../../services/api';
import 'pannellum';

export default {
  data() {
    return {
      activities: [],
      currentCategory: 'Tất cả',
      showModal: false,
      selectedItem: null,
      currentIndex: 0,
      visibleCards: 3,
      autoSlideTimer: null,
      pannellumViewer: null
    }
  },
  computed: {
    categories() {
      const cats = ['Tất cả', ...new Set(this.activities.map(item => item.category).filter(Boolean))];
      return cats;
    },
    filteredActivities() {
      if (this.currentCategory === 'Tất cả') {
        return this.activities;
      }
      return this.activities.filter(item => item.category === this.currentCategory);
    },
    maxIndex() {
      return Math.max(0, this.filteredActivities.length - this.visibleCards);
    },
    cardWidthPercentage() {
      return 100 / this.visibleCards;
    }
  },
  methods: {
    selectCategory(cat) {
      this.currentCategory = cat;
      this.currentIndex = 0; // Reset về slide đầu khi đổi danh mục
    },
    updateVisibleCards() {
      const width = window.innerWidth;
      if (width <= 640) {
        this.visibleCards = 1; 
      } else if (width <= 1024) {
        this.visibleCards = 2; 
      } else {
        this.visibleCards = 3; 
      }
      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = this.maxIndex;
      }
    },
    slideNext() {
      if (this.currentIndex < this.maxIndex) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    },
    slidePrev() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.maxIndex;
      }
    },
    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideTimer = setInterval(() => {
        this.slideNext();
      }, 5000);
    },
    stopAutoSlide() {
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer);
        this.autoSlideTimer = null;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    openDetail(item) {
      this.stopAutoSlide();
      this.selectedItem = item;
      this.showModal = true;
      document.body.style.overflow = 'hidden';

      if (item.is360) {
        this.$nextTick(() => {
          if (window.pannellum) {
            try {
              this.pannellumViewer = window.pannellum.viewer('panorama-viewer', {
                type: 'equirectangular',
                image: item.image_url,
                autoLoad: true,
                compass: true
              });
            } catch (e) {
              console.error("Lỗi khởi tạo trình xem 360:", e);
            }
          }
        });
      }
    },
    closeDetail() {
      if (this.pannellumViewer && typeof this.pannellumViewer.destroy === 'function') {
        try {
          this.pannellumViewer.destroy();
        } catch (e) { console.error(e); }
        this.pannellumViewer = null;
      }

      this.showModal = false;
      document.body.style.overflow = 'auto';
      this.startAutoSlide();
      setTimeout(() => {
        this.selectedItem = null;
      }, 300);
    }
  },
  async mounted() {
    this.updateVisibleCards();
    window.addEventListener('resize', this.updateVisibleCards);

    try {
      const res = await api.get('/activities');
      if (res.data) {
        this.activities = Array.isArray(res.data) ? res.data : (res.data.data || []);
      }
    } catch (err) {
      console.error('Không thể tải dữ liệu hoạt động:', err);
    }
    
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.updateVisibleCards);
    if (this.pannellumViewer && typeof this.pannellumViewer.destroy === 'function') {
      this.pannellumViewer.destroy();
    }
  }
}
</script>

<style scoped>
.activity-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, sans-serif;
  background: radial-gradient(circle at 50% 0%, #1a0f0f 0%, #0c0404 60%, #050101 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.activity-page *, .activity-page *::before, .activity-page *::after {
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  margin-bottom: 28px;
  padding: 32px 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.06) 0%, rgba(139, 0, 0, 0.2) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 80px;
  background: #ffd700;
  filter: blur(70px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.section-title {
  font-size: clamp(1.5rem, 2.5vw, 2.3rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #cbd5e1;
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  max-width: 650px;
  margin: 0 auto;
}

/* Thanh lọc chuyên mục thông minh (Smart Filter Bar) */
.filter-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.filter-pill {
  background: rgba(30, 12, 12, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #cbd5e1;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-pill:hover {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  border-color: rgba(255, 215, 0, 0.4);
}

.filter-pill.active {
  background: linear-gradient(135deg, #991b1b, #7f1d1d);
  color: #ffd700;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

/* Carousel Section */
.carousel-section {
  position: relative;
  margin-bottom: 20px;
}

.carousel-header-info {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  padding-right: 10px;
}

.slide-counter {
  font-size: 0.8rem;
  color: #94a3b8;
}
.slide-counter strong { color: #ffd700; }

.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
}

.carousel-track-wrapper {
  overflow: hidden;
  width: 100%;
  padding: 5px 0 15px 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

/* Activity Card Styling */
.activity-card {
  margin: 0 8px;
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.activity-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.6);
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #000;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.activity-card:hover .card-img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 1, 1, 0.85));
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #fff;
  padding: 4px 12px;
  font-size: 0.72rem;
  border-radius: 16px;
  font-weight: 700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.badge-360 {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #38bdf8;
  padding: 4px 10px;
  font-size: 0.7rem;
  border-radius: 12px;
  font-weight: 700;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.activity-card:hover .card-title {
  color: #ffd700;
}

.card-text {
  color: #94a3b8;
  font-size: 0.86rem;
  line-height: 1.55;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 215, 0, 0.12);
  padding-top: 12px;
}

.card-date {
  font-size: 0.78rem;
  color: #cbd5e1;
}

.btn-detail {
  background: transparent;
  border: none;
  color: #ffd700;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.3s ease;
}

.btn-detail:hover { gap: 10px; }

/* Slider Buttons */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(22, 10, 10, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #ffd700;
  font-size: 2rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.slider-btn:hover:not(:disabled) {
  background: #991b1b;
  border-color: #ffd700;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.slider-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.prev-btn { left: -22px; }
.next-btn { right: -22px; }

/* Dots Indicator */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: #ffd700;
  width: 22px;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

/* Empty State */
.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 50px 20px;
  background: rgba(22, 10, 10, 0.5);
  border-radius: 16px;
  border: 1px dashed rgba(255, 215, 0, 0.2);
}
.empty-icon { font-size: 2.5rem; margin-bottom: 10px; }

/* Modal Popup Styling */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 16px;
}

.modal-container {
  background: linear-gradient(145deg, #2b0404, #100101);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 20px;
  width: 100%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #ffd700;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
  transform: rotate(90deg);
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.modal-img-wrapper {
  position: relative;
  height: 320px;
  width: 100%;
}

.panorama-container {
  width: 100%;
  height: 320px;
  background-color: #000;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-img-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(16,1,1,0.95));
}

.modal-badge {
  position: absolute;
  bottom: 16px;
  left: 20px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #fff;
  padding: 5px 14px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.modal-info {
  padding: 28px;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.85rem;
  color: #cbd5e1;
  margin-bottom: 10px;
}

.modal-title {
  color: #ffd700;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 14px 0;
  line-height: 1.35;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.4), transparent);
  margin-bottom: 20px;
}

.modal-full-text {
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.75;
  margin-bottom: 28px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-close-action {
  background: linear-gradient(135deg, #781c1c, #4a0f0f);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 10px 24px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.btn-close-action:hover {
  background: linear-gradient(135deg, #992424, #5e1313);
  border-color: #ffd700;
  transform: translateY(-2px);
}

/* Modal Animations */
.modal-modern-enter-active,
.modal-modern-leave-active {
  transition: opacity 0.3s ease;
}

.modal-modern-enter-active .modal-container,
.modal-modern-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.modal-modern-enter-from,
.modal-modern-leave-to {
  opacity: 0;
}

.modal-modern-enter-from .modal-container,
.modal-modern-leave-to .modal-container {
  transform: scale(0.92) translateY(15px);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slider-btn { display: none; } /* Ẩn nút 2 bên trên mobile để vuốt mượt mà hơn */
  .carousel-container { margin: 0; }
}
</style>
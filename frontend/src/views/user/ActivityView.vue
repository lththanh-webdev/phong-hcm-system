<template>
  <div class="activity-page">
    <!-- Tiêu đề trang -->
    <div class="hero-section">
      <div class="hero-badge animate-fade-down">TIỂU ĐOÀN PHÒNG KHÔNG 16 </div>
      <h2 class="section-title animate-fade-in">BẢN TIN HOẠT ĐỘNG</h2>
      <p class="section-desc animate-fade-up">Cập nhật hoạt động công tác tư tưởng, thi đua & chuyển đổi số toàn đơn vị</p>
    </div>

    <!-- Khu vực hiển thị Card dạng thanh trượt (Carousel Slider) tự động chuyển sau 5s -->
    <div 
      class="carousel-container" 
      v-if="activities.length > 0"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
    >
      <button class="slider-btn prev-btn" @click="slidePrev" :disabled="currentIndex === 0">‹</button>
      
      <div class="carousel-track-wrapper">
        <div 
          class="carousel-track" 
          :style="{ transform: `translateX(-${currentIndex * cardWidthPercentage}%)` }"
        >
          <div 
            v-for="(item, index) in activities" 
            v-bind:key="item.id || index" 
            class="activity-card"
            :style="{ flex: `0 0 calc(${cardWidthPercentage}% - 20px)` }"
            @click="openDetail(item)"
          >
            <div class="card-image-wrapper">
              <img :src="item.image_url" class="card-img" alt="Activity Image" />
              <div class="image-overlay"></div>
              <span class="card-badge">{{ item.category }}</span>
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

      <button class="slider-btn next-btn" @click="slideNext" :disabled="currentIndex >= maxIndex">›</button>
    </div>

    <!-- Trạng thái khi chưa có dữ liệu -->
    <div v-else class="empty-state">
      <p>Đang tải dữ liệu hoạt động hoặc chưa có bài viết nào...</p>
    </div>

    <!-- Thanh chỉ mục (Dots indicators) -->
    <div class="carousel-dots" v-if="activities.length > 1">
      <span 
        v-for="(_, dotIndex) in maxIndex + 1" 
        :key="dotIndex" 
        :class="['dot', { active: currentIndex === dotIndex }]"
        @click="currentIndex = dotIndex"
      ></span>
    </div>

    <!-- 🌟 MODAL XEM CHI TIẾT HOẠT ĐỘNG -->
    <transition name="modal-modern">
      <div v-if="showModal" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-container">
          <button class="close-btn" @click="closeDetail">✕</button>
          
          <div v-if="selectedItem" class="modal-body">
            <div class="modal-img-wrapper">
              <!-- Hiển thị khung 360 độ nếu là ảnh 360 -->
              <div v-if="selectedItem.is360" id="panorama-viewer" class="panorama-container"></div>
              
              <!-- Hiển thị ảnh thông thường nếu không phải 360° -->
              <template v-else>
                <img :src="selectedItem.image_url" class="modal-img" alt="Detail Image" />
                <div class="modal-img-gradient"></div>
              </template>
              
              <span class="modal-badge">{{ selectedItem.category }}</span>
            </div>
            
            <div class="modal-info">
              <div class="modal-meta">
                <span>🕒 Đăng ngày: {{ formatDate(selectedItem.created_at || selectedItem.date) }}</span>
                <span>• Đơn vị: Tiểu Đoàn 16</span>
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
import 'pannellum'; // Thêm import thư viện Pannellum

export default {
  data() {
    return {
      activities: [],
      showModal: false,
      selectedItem: null,
      currentIndex: 0,
      visibleCards: 3,
      autoSlideTimer: null
    }
  },
  computed: {
    maxIndex() {
      return Math.max(0, this.activities.length - this.visibleCards);
    },
    cardWidthPercentage() {
      return 100 / this.visibleCards;
    }
  },
  methods: {
    updateVisibleCards() {
      const width = window.innerWidth;
      if (width <= 600) {
        this.visibleCards = 1; 
      } else if (width <= 900) {
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

      // Khởi tạo Pannellum ngay sau khi modal được render xong DOM
      if (item.is360) {
        this.$nextTick(() => {
          if (window.pannellum) {
            window.pannellum.viewer('panorama-viewer', {
              type: 'equirectangular',
              image: item.image_url,
              autoLoad: true,
              compass: true
            });
          }
        });
      }
    },
    closeDetail() {
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
  }
}
</script>

<style scoped>
.activity-page {
  padding: 20px 10px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Khung hiển thị ảnh 360 độ */
.panorama-container {
  width: 100%;
  height: 340px;
  background-color: #000;
}

/* Animations xuất hiện */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-down { animation: fadeDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffd700;
  margin: 0 0 10px 0;
  text-shadow: 0 4px 20px rgba(255, 215, 0, 0.35);
}

.section-desc {
  color: #cbd5e1;
  font-size: 1rem;
  margin: 0;
}

/* Carousel Slider Styling */
.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 40px;
}

.carousel-track-wrapper {
  overflow: hidden;
  width: 100%;
  padding: 10px 0 20px 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

.activity-card {
  margin: 0 10px;
  background: linear-gradient(145deg, rgba(40, 8, 8, 0.85), rgba(15, 2, 2, 0.95));
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  position: relative;
}

.activity-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 45px rgba(255, 215, 0, 0.25);
  border-color: rgba(255, 215, 0, 0.6);
}

/* Nút chuyển trượt Slider Buttons */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  background: rgba(40, 5, 5, 0.85);
  border: 2px solid rgba(255, 215, 0, 0.4);
  color: #ffd700;
  font-size: 2.2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,0,0,0.5);
}

.slider-btn:hover:not(:disabled) {
  background: #991b1b;
  border-color: #ffd700;
  transform: translateY(-60%) scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.slider-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prev-btn { left: -35px; }
.next-btn { right: -35px; }

/* Dots Indicator */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: #ffd700;
  width: 25px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

/* Card Content Styling */
.card-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.activity-card:hover .card-img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 1, 1, 0.85));
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #fff;
  padding: 6px 14px;
  font-size: 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 1.15rem;
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
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 24px;
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
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  padding-top: 16px;
}

.card-date {
  font-size: 0.8rem;
  color: #cbd5e1;
}

.btn-detail {
  background: transparent;
  border: none;
  color: #ffd700;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-detail:hover {
  gap: 12px;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}

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
  padding: 20px;
}

.modal-container {
  background: linear-gradient(145deg, #2b0404, #100101);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 24px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9);
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #ffd700;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
  height: 340px;
  width: 100%;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-img-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 50%, rgba(16,1,1,0.95));
}

.modal-badge {
  position: absolute;
  bottom: 20px;
  left: 24px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.modal-info {
  padding: 35px;
}

.modal-meta {
  display: flex;
  gap: 20px;
  font-size: 0.88rem;
  color: #cbd5e1;
  margin-bottom: 12px;
}

.modal-title {
  color: #ffd700;
  font-size: 1.7rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.35;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.4), transparent);
  margin-bottom: 24px;
}

.modal-full-text {
  color: #e2e8f0;
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 35px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-close-action {
  background: linear-gradient(135deg, #781c1c, #4a0f0f);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 12px 28px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.btn-close-action:hover {
  background: linear-gradient(135deg, #992424, #5e1313);
  border-color: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

/* Modal Smooth Scale Transition */
.modal-modern-enter-active,
.modal-modern-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-modern-enter-active .modal-container,
.modal-modern-leave-active .modal-container {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.modal-modern-enter-from,
.modal-modern-leave-to {
  opacity: 0;
}

.modal-modern-enter-from .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-modern-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 600px) {
  .carousel-container {
    margin: 0 20px;
  }
  .slider-btn {
    width: 40px;
    height: 40px;
    font-size: 1.6rem;
  }
  .prev-btn { left: -20px; }
  .next-btn { right: -20px; }
}
</style>
<template>
  <div class="memorial-container">
    <!-- Hiệu ứng hoa bay khi dâng hoa -->
    <div class="flower-rain-container">
      <span 
        v-for="flower in floatingFlowers" 
        :key="flower.id" 
        class="floating-flower"
        :style="{ left: flower.left + '%', animationDuration: flower.duration + 's', fontSize: flower.size + 'rem' }"
      >
        🌸
      </span>
    </div>

    <!-- Phần phông nền trang trọng với hiệu ứng phông đỏ bay lượn & mở rộng phần trên -->
    <div class="memorial-hero-stage">
      <div class="red-backdrop-banner">
        <!-- Biểu tượng Cờ Đảng và Cờ Tổ quốc phía trên (đứng yên trang nghiêm) -->
        <div class="backdrop-flags-header">
          <div class="flag-symbol party-symbol" title="Cờ Đảng">☭</div>
          <div class="flag-symbol star-symbol" title="Cờ Tổ Quốc">★</div>
        </div>

        <div class="portrait-wrapper">
          <div class="portrait-glow"></div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Ho_Chi_Minh_1946.jpg" 
            alt="Chủ tịch Hồ Chí Minh" 
            class="portrait-img" 
          />
        </div>
        
        <div class="memorial-title-group">
          <h2 class="gold-heading">CHỦ TỊCH HỒ CHÍ MINH</h2>
          <p class="memorial-subtitle">(1890 - 1969) • Lãnh tụ vĩ đại của dân tộc Việt Nam</p>
        </div>
      </div>
    </div>

    <!-- Hộp trưng bày lời dạy / tư tưởng (Phong cách kính mờ hiện đại) -->
    <div class="quote-glass-card">
      <div class="quote-icon-mark">“</div>
      <p class="quote-text">Không có gì quý hơn độc lập, tự do.</p>
      <span class="quote-source">— Lời kêu gọi chống Mỹ cứu nước (17/07/1966)</span>
    </div>

    <!-- Khu vực tương tác (Dâng hoa & Thắp hương) -->
    <div class="action-panel">
      <!-- Nút Dâng Hoa -->
      <button @click="offerFlowers" class="btn-action flower-btn">
        <span class="btn-icon">🌸</span> Dâng Hoa Tưởng Niệm Bác
      </button>

      <!-- Nút Thắp Hương kèm mô hình Cây Hương cháy 60s và khói bay -->
      <button 
        @click="lightIncense" 
        class="btn-action incense-btn" 
        :class="{ lit: isLit, cooling: isCooldown }"
        :disabled="isCooldown"
      >
        <!-- Biểu tượng / Mô hình cây hương cháy -->
        <div class="incense-icon-wrapper">
          <div class="incense-stick-container">
            <div v-if="isCooldown" class="burning-tip"></div>
            <div class="incense-body" :style="{ height: incenseHeightStyle }"></div>
          </div>
        </div>

        <!-- Hiệu ứng làn khói bay lên khi đã thắp -->
        <span v-if="isLit" class="smoke-effect">
          <span class="smoke-particle p1"></span>
          <span class="smoke-particle p2"></span>
        </span>
        {{ buttonText }}
      </button>

      <button @click="openTour360" class="btn-action tour-btn">
        <span class="btn-icon">🌐</span> Không Gian 360° Trực Tuyến
      </button>
    </div>

    <!-- Popup Thông Báo Dâng Hoa Tưởng Niệm Trang Nghiêm -->
    <transition name="fade-popup">
      <div v-if="showFlowerPopup" class="flower-popup-overlay" @click="showFlowerPopup = false">
        <div class="flower-popup-card" @click.stop>
          <div class="popup-icon-star">★</div>
          <h3>Thành Kính Dâng Hoa</h3>
          <p>“Đời đời nhớ ơn Chủ tịch Hồ Chí Minh vĩ đại!<br>Kính chúc anh linh Bác luôn sống mãi trong sự nghiệp cách mạng của dân tộc.”</p>
          <button @click="showFlowerPopup = false" class="popup-close-btn">Xin kính cẩn cúi đầu</button>
        </div>
      </div>
    </transition>

    <!-- Modal hoặc vùng hiển thị 360 Panorama -->
    <div v-if="show360" class="modal-360-overlay" @click.self="closeTour360">
      <div class="modal-360-content">
        <div class="modal-header">
          <h3>Không Gian Phòng Hồ Chí Minh 360°</h3>
          <button @click="closeTour360" class="close-modal">✕</button>
        </div>
        <div ref="viewerContainer" class="viewer-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

// Khởi tạo Supabase client sử dụng biến môi trường Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tributeCount = ref(0);
const isLit = ref(false);
const isCooldown = ref(false);
const cooldownTime = ref(60); // Thời gian chờ 60 giây (1 phút)
let cooldownTimer = null;

const showFlowerPopup = ref(false);
const show360 = ref(false);
const viewerContainer = ref(null);
let viewerInstance = null;

// Quản lý danh sách hiệu ứng hoa bay
const floatingFlowers = ref([]);

const triggerFlowerEffect = () => {
  const flowers = [];
  for (let i = 0; i < 20; i++) {
    flowers.push({
      id: Date.now() + i,
      left: Math.random() * 92 + 4,
      duration: Math.random() * 2 + 2.5,
      size: Math.random() * 1.2 + 1
    });
  }
  floatingFlowers.value = flowers;
  setTimeout(() => {
    floatingFlowers.value = [];
  }, 4500);
};

// Tính toán chiều cao thân cây hương giảm dần từ 100% về 0% trong 60 giây
const incenseHeightStyle = computed(() => {
  if (!isCooldown.value) return '100%';
  const percentage = (cooldownTime.value / 60) * 100;
  return `${percentage}%`;
});

// Hàm lấy tổng số lượt thắp hương từ bảng 'tributes' trên Supabase
const fetchTributesData = async () => {
  try {
    const { count, error } = await supabase
      .from('tributes')
      .select('*', { count: 'exact', head: true })
      .eq('tribute_type', 'incense');

    if (error) throw error;
    tributeCount.value = count || 0;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu thắp hương từ Supabase:", error.message || error);
  }
};

onMounted(() => {
  fetchTributesData();
});

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
  if (viewerInstance) {
    viewerInstance.destroy();
    viewerInstance = null;
  }
});

// Nội dung hiển thị trên nút thắp hương thay đổi theo trạng thái
const buttonText = computed(() => {
  if (isCooldown.value) {
    return `Đang cháy (${cooldownTime.value}s)`;
  }
  if (isLit.value) {
    return `Đã Thắp Hương (${tributeCount.value})`;
  }
  return `Thắp Hương Tưởng Niệm (${tributeCount.value})`;
});

const lightIncense = async () => {
  if (isCooldown.value) return;

  try {
    const { error } = await supabase.from('tributes').insert([
      {
        author_name: 'Khách Tưởng Niệm',
        unit_name: 'Cá nhân',
        tribute_type: 'incense',
        message: 'Thành kính dâng hương tưởng niệm Bác Hồ'
      }
    ]);

    if (error) throw error;
    await fetchTributesData();

    isLit.value = true;
    isCooldown.value = true;
    cooldownTime.value = 60;

    cooldownTimer = setInterval(() => {
      cooldownTime.value--;
      if (cooldownTime.value <= 0) {
        clearInterval(cooldownTimer);
        isCooldown.value = false;
        isLit.value = false;
      }
    }, 1000);
  } catch (error) {
    console.error("Lỗi khi thắp hương lên Supabase: ", error.message || error);
  }
};

const offerFlowers = async () => {
  showFlowerPopup.value = true;
  triggerFlowerEffect();
  try {
    const { error } = await supabase.from('tributes').insert([
      {
        author_name: 'Khách Tưởng Niệm',
        unit_name: 'Cá nhân',
        tribute_type: 'flower',
        message: 'Thành kính dâng hoa tưởng niệm Bác'
      }
    ]);
    if (error) throw error;
  } catch (error) {
    console.error("Lỗi khi dâng hoa lên Supabase: ", error.message || error);
  }
};

const openTour360 = async () => {
  show360.value = true;
  await nextTick();
  
  setTimeout(() => {
    if (viewerContainer.value) {
      if (viewerInstance) {
        viewerInstance.destroy();
        viewerInstance = null;
      }

      viewerInstance = new Viewer({
        container: viewerContainer.value,
        panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
        autoload: true,
        size: { width: '100%', height: '500px' },
      });
    }
  }, 100);
};

const closeTour360 = () => {
  show360.value = false;
  if (viewerInstance) {
    viewerInstance.destroy();
    viewerInstance = null;
  }
};
</script>

<style scoped>
.memorial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

/* Hiệu ứng hoa bay rơi toàn màn hình */
.flower-rain-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 4000;
  overflow: hidden;
}

.floating-flower {
  position: absolute;
  top: -10%;
  animation: fallFlower linear forwards;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

@keyframes fallFlower {
  0% {
    transform: translateY(0) rotate(0deg) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(360deg) scale(1.2);
    opacity: 0;
  }
}

/* Tinh chỉnh mô hình Cây Hương cháy */
.incense-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 22px;
  position: relative;
}

.incense-stick-container {
  position: relative;
  width: 4px;
  height: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.incense-body {
  width: 100%;
  background: linear-gradient(to top, #b45309, #d97706);
  border-radius: 2px;
  transition: height 1s linear;
}

.burning-tip {
  position: absolute;
  top: -4px;
  left: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 8px #ef4444, 0 0 12px #f59e0b;
  animation: sparkGlow 0.8s infinite alternate ease-in-out;
  z-index: 2;
}

@keyframes sparkGlow {
  0% { transform: scale(0.9); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px #ff3333, 0 0 16px #ffcc00; }
}

.memorial-hero-stage {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

/* ĐÃ TĂNG PHẦN TRÊN (PADDING-TOP) CAO HƠN VÀ THOÁNG HƠN */
.red-backdrop-banner {
  position: relative;
  width: 100%;
  padding: 52px 24px 28px 24px; 
  background: linear-gradient(135deg, #5a0202 0%, #991b1b 35%, #7f1d1d 70%, #3b0303 100%);
  background-size: 300% 300%;
  animation: fabricWave 8s ease-in-out infinite alternate;
  border: 1px solid rgba(255, 215, 0, 0.45);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 215, 0, 0.35), inset 0 0 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

@keyframes fabricWave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.red-backdrop-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  background-size: 200% 100%;
  animation: lightSweep 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes lightSweep {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.backdrop-flags-header {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
  z-index: 2;
}

.flag-symbol {
  font-size: 1.9rem;
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.85), 0 2px 4px rgba(0, 0, 0, 0.8);
  animation: glowSymbol 2.5s ease-in-out infinite alternate;
}

@keyframes glowSymbol {
  0% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(255,215,0,0.6)); }
  100% { transform: scale(1.08); filter: drop-shadow(0 0 14px rgba(255,215,0,1)); }
}

.portrait-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #ffd700, #b8860b);
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.65), 0 8px 20px rgba(0,0,0,0.5);
  margin-bottom: 16px;
  z-index: 2;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.gold-heading {
  color: #ffd700;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.85);
  z-index: 2;
  position: relative;
}

.memorial-subtitle {
  color: #f1f5f9;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
  z-index: 2;
  position: relative;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

/* HIỆU CHỈNH HỘP QUOTE XỊN XÒ HƠN */
.quote-glass-card {
  position: relative;
  background: rgba(35, 10, 10, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 18px;
  padding: 24px 36px;
  text-align: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255, 215, 0, 0.2);
  width: 100%;
  max-width: 720px;
}

.quote-icon-mark {
  position: absolute;
  top: -12px;
  left: 28px;
  font-size: 2.5rem;
  color: rgba(255, 215, 0, 0.4);
  font-family: serif;
  line-height: 1;
  pointer-events: none;
}

.quote-text {
  color: #ffd700;
  font-size: 1.3rem;
  font-style: italic;
  font-weight: 500;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

.quote-source {
  color: #cbd5e1;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.action-panel {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-action {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #7f1d1d, #450a0a);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 14px 26px;
  border-radius: 35px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.25);
}

.btn-action:hover:not(:disabled) {
  background: linear-gradient(135deg, #991b1b, #571010);
  border-color: #ffd700;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.4);
}

.incense-btn.lit, .incense-btn.cooling {
  background: linear-gradient(135deg, #064e3b, #022c22);
  color: #4ade80;
  border-color: #4ade80;
  box-shadow: 0 6px 20px rgba(6, 78, 59, 0.4), inset 0 1px 0 rgba(74, 222, 128, 0.25);
}

.incense-btn:disabled {
  opacity: 0.9;
  cursor: not-allowed;
  transform: none !important;
}

.smoke-effect {
  position: absolute;
  top: -10px;
  right: 25px;
  width: 20px;
  height: 30px;
  pointer-events: none;
}

.smoke-particle {
  position: absolute;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  filter: blur(2px);
  animation: riseSmoke 2s infinite ease-in-out;
}

.smoke-particle.p1 {
  width: 6px;
  height: 6px;
  left: 0;
  animation-delay: 0s;
}

.smoke-particle.p2 {
  width: 8px;
  height: 8px;
  left: 8px;
  animation-delay: 0.8s;
}

@keyframes riseSmoke {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-18px) scale(1.4);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-35px) scale(2);
    opacity: 0;
  }
}

.flower-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.flower-popup-card {
  background: linear-gradient(145deg, #450a0a, #1a0202);
  border: 2px solid #ffd700;
  border-radius: 20px;
  padding: 36px 28px;
  width: 90%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.85), inset 0 0 20px rgba(255, 215, 0, 0.15);
  animation: popupScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popupScale {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.popup-icon-star {
  font-size: 2.8rem;
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.85);
  margin-bottom: 10px;
}

.flower-popup-card h3 {
  color: #ffd700;
  font-size: 1.4rem;
  margin: 0 0 14px 0;
}

.flower-popup-card p {
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 24px 0;
  font-style: italic;
}

.popup-close-btn {
  background: linear-gradient(135deg, #ffd700, #b8860b);
  color: #1a0202;
  border: none;
  padding: 12px 28px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 15px rgba(255, 215, 0, 0.35);
}

.popup-close-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #ffea75, #ffd700);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.5);
}

.fade-popup-enter-active, .fade-popup-leave-active {
  transition: opacity 0.3s ease;
}
.fade-popup-enter-from, .fade-popup-leave-to {
  opacity: 0;
}

.modal-360-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
}

.modal-360-content {
  background: #1a0202;
  border: 2px solid #ffd700;
  border-radius: 20px;
  width: 90%;
  max-width: 950px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.9);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2a0505;
  border-bottom: 1px solid rgba(255, 215, 0, 0.25);
  color: #ffd700;
}

.close-modal {
  background: transparent;
  border: none;
  color: #ffd700;
  font-size: 1.3rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-modal:hover {
  transform: scale(1.1);
}

.viewer-container {
  width: 100%;
  height: 500px;
}
</style>
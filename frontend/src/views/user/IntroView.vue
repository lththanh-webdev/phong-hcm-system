<template>
  <div class="intro-page">
    <!-- Tiêu đề trang kết hợp Nút tương tác dâng hoa thông minh -->
    <div class="hero-section">
      <div class="hero-glow"></div>
      <div class="hero-badge animate-fade-down">CỔNG THÔNG TIN ĐƠN VỊ</div>
      <h2 class="section-title animate-fade-in">GIỚI THIỆU PHÒNG HỒ CHÍ MINH SỐ</h2>
      <p class="section-desc animate-fade-up">Không gian văn hóa, tư tưởng & nền tảng chuyển đổi số chính trị Tiểu đoàn Phòng không 16</p>
      

    </div>

    <!-- Nội dung chính dạng lưới thông tin -->
    <div class="intro-grid">
      
      <!-- Thẻ 1: Mục đích & Ý nghĩa -->
      <div class="intro-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">🎯</span>
        </div>
        <h3 class="card-title">Mục Đích &amp; Ý Nghĩa</h3>
        <p class="card-text">
          Phòng Hồ Chí Minh số là thiết chế văn hóa hiện đại ứng dụng công nghệ thông tin trong quân đội, nhằm đổi mới mạnh mẽ hình thức giáo dục chính trị, tư tưởng, truyền thống. Tạo môi trường thuận lợi để cán bộ, chiến sĩ học tập, nghiên cứu tư tưởng, đạo đức, phong cách Hồ Chí Minh mọi lúc, mọi nơi trên mạng nội bộ đơn vị.
        </p>
      </div>

      <!-- Thẻ 2: Chức Năng & Nhiệm Vụ -->
      <div class="intro-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">⚡</span>
        </div>
        <h3 class="card-title">Chức Năng &amp; Nhiệm Vụ</h3>
        <ul class="card-list">
          <li>
            <span class="bullet-dot"></span>
            <div><strong>Lưu trữ số:</strong> Cung cấp kho tư liệu, sách báo, văn kiện Đảng và hình ảnh truyền thống trực tuyến.</div>
          </li>
          <li>
            <span class="bullet-dot"></span>
            <div><strong>Giáo dục chính trị:</strong> Tuyên truyền các ngày lễ lớn, gương điển hình tiên tiến, phong trào thi đua quyết thắng.</div>
          </li>
          <li>
            <span class="bullet-dot"></span>
            <div><strong>Sinh hoạt tư tưởng:</strong> Tổ chức các hoạt động trắc nghiệm tìm hiểu kiến thức, nghe ca khúc cách mạng và giao lưu văn hóa lành mạnh.</div>
          </li>
        </ul>
      </div>

      <!-- Thẻ 3: Truyền Thống Đơn Vị -->
      <div class="intro-card featured-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">⭐</span>
        </div>
        <h3 class="card-title">Truyền Thống Tiểu Đoàn PK 16</h3>
        <p class="card-text highlight-slogan">
          "ĐOÀN KẾT HIỆP ĐỒNG, LẬP CÔNG TẬP THỂ"
        </p>
        <p class="card-text">
          Trải qua quá trình xây dựng, chiến đấu và trưởng thành, Tiểu đoàn Phòng không 16 luôn giữ vững và phát huy truyền thống "Trung thành vô hạn, chủ động sáng tạo, đoàn kết hiệp đồng, quyết chiến quyết thắng", hoàn thành xuất sắc mọi nhiệm vụ huấn luyện, sẵn sàng chiến đấu bảo vệ vững chắc bầu trời Tổ quốc.
        </p>
      </div>

      <!-- Thẻ 4: Định Hướng Chuyển Đổi Số -->
      <div class="intro-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">🚀</span>
        </div>
        <h3 class="card-title">Định Hướng Chuyển Đổi Số</h3>
        <p class="card-text">
          Đẩy mạnh ứng dụng công nghệ số trong công tác Đảng, công tác chính trị; xây dựng môi trường văn hóa quân sự phong phú, lành mạnh, đáp ứng yêu cầu xây dựng đơn vị vững mạnh toàn diện "Mẫu mực, tiêu biểu" trong tình hình mới.
        </p>
      </div>

    </div>

    <!-- 🌟 HỆ THỐNG THÔNG BÁO HIỆN ĐẠI (MODAL) -->
    <transition name="modal-modern">
      <div v-if="showAlert" class="modal-overlay" @click.self="closeAlert">
        <div class="modal-container alert-container">
          <div class="alert-glow"></div>
          <div class="alert-icon-wrapper">
            <span class="alert-star">★</span>
          </div>
          <h3 class="alert-title">{{ alertTitle }}</h3>
          <p class="alert-message">{{ alertMessage }}</p>
          <div class="alert-actions">
            <button class="btn-alert-confirm" @click="closeAlert">Xác nhận</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'IntroView',
  data() {
    return {
      showAlert: false,
      alertTitle: 'Kính cẩn dâng hoa',
      alertMessage: 'Đã dâng hoa thành kính lên Chủ tịch Hồ Chí Minh vĩ đại!'
    }
  },
  methods: {
    handleOfferFlower() {
      this.triggerNotification(
        'Kính Cẩn Dâng Hoa', 
        'Đồng chí đã thành kính dâng hoa tưởng niệm Chủ tịch Hồ Chí Minh. Toàn đơn vị nguyện học tập và làm theo tấm gương đạo đức của Người!'
      );
    },
    
    triggerNotification(title, message) {
      if (title) this.alertTitle = title;
      if (message) this.alertMessage = message;
      this.showAlert = true;
      document.body.style.overflow = 'hidden';
    },

    closeAlert() {
      this.showAlert = false;
      document.body.style.overflow = 'auto';
    }
  }
}
</script>

<style scoped>
.intro-page {
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

.intro-page *, .intro-page *::before, .intro-page *::after {
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  margin-bottom: 40px;
  padding: 36px 20px;
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
  font-size: clamp(1.6rem, 2.5vw, 2.4rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #cbd5e1;
  font-size: clamp(0.88rem, 1.4vw, 1.05rem);
  max-width: 650px;
  margin: 0 auto 20px auto;
}

/* Hero Action Button */
.hero-action-container {
  margin-top: 15px;
}

.btn-hero-offer {
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 11px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-hero-offer:hover {
  background: linear-gradient(135deg, #f43f5e, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  border-color: #fff;
}

.offer-icon {
  font-size: 1.1rem;
}

/* Grid Layout */
.intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.intro-card {
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.intro-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.15);
}

.featured-card {
  border-color: rgba(255, 215, 0, 0.35);
  background: linear-gradient(145deg, rgba(40, 8, 8, 0.9), rgba(18, 2, 2, 0.95));
}

.card-icon-wrapper {
  margin-bottom: 18px;
}

.card-icon {
  font-size: 1.8rem;
  background: rgba(255, 215, 0, 0.1);
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
}

.card-title {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.card-text {
  color: #cbd5e1;
  font-size: 0.93rem;
  line-height: 1.6;
  margin: 0;
}

.highlight-slogan {
  color: #ffd700;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  font-size: 1rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.91rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.bullet-dot {
  width: 6px;
  height: 6px;
  background-color: #ffd700;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
  box-shadow: 0 0 8px #ffd700;
}

.card-list strong {
  color: #f8fafc;
}

/* Modal Styles */
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

.alert-container {
  position: relative;
  background: linear-gradient(145deg, #2b0404, #100101);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  padding: 35px 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9);
  overflow: hidden;
}

.alert-glow {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 50px;
  background: #ffd700;
  filter: blur(40px);
  opacity: 0.25;
  pointer-events: none;
}

.alert-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.35);
}

.alert-star {
  font-size: 2rem;
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.9);
}

.alert-title {
  color: #ffd700;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.alert-message {
  color: #e2e8f0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 25px;
}

.alert-actions {
  width: 100%;
}

.btn-alert-confirm {
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 12px 0;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  width: 100%;
}

.btn-alert-confirm:hover {
  background: linear-gradient(135deg, #f43f5e, #b91c1c);
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

/* Modal Smooth Transitions */
.modal-modern-enter-active,
.modal-modern-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 24px 16px;
  }
}
</style>
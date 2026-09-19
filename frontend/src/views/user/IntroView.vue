<template>
  <div class="intro-page">
    <!-- Tiêu đề trang -->
    <div class="hero-section">
      <div class="hero-badge">CỔNG THÔNG TIN ĐƠN VỊ</div>
      <h2 class="section-title">GIỚI THIỆU PHÒNG HỒ CHÍ MINH SỐ</h2>
      <p class="section-desc">Không gian văn hóa, tư tưởng & nền tảng chuyển đổi số chính trị Tiểu đoàn Phòng không 16</p>
    </div>

    <!-- Nội dung chính dạng lưới thông tin -->
    <div class="intro-grid">
      <!-- Thẻ 1: Mục đích & Ý nghĩa -->
      <div class="intro-card">
        <div class="card-icon">🎯</div>
        <h3 class="card-title">Mục Đích & Ý Nghĩa</h3>
        <p class="card-text">
          Phòng Hồ Chí Minh số là thiết chế văn hóa hiện đại ứng dụng công nghệ thông tin trong quân đội, nhằm đổi mới mạnh mẽ hình thức giáo dục chính trị, tư tưởng, truyền thống. Tạo môi trường thuận lợi để cán bộ, chiến sĩ học tập, nghiên cứu tư tưởng, đạo đức, phong cách Hồ Chí Minh mọi lúc, mọi nơi trên mạng nội bộ đơn vị.
        </p>
      </div>

      <!-- Thẻ 2: Chức Năng & Nhiệm Vụ -->
      <div class="intro-card">
        <div class="card-icon">⚡</div>
        <h3 class="card-title">Chức Năng & Nhiệm Vụ</h3>
        <ul class="card-list">
          <li><strong>Lưu trữ số:</strong> Cung cấp kho tư liệu, sách báo, văn kiện Đảng và hình ảnh truyền thống trực tuyến.</li>
          <li><strong>Giáo dục chính trị:</strong> Tuyên truyền các ngày lễ lớn, gương điển hình tiên tiến, phong trào thi đua quyết thắng.</li>
          <li><strong>Sinh hoạt tư tưởng:</strong> Tổ chức các hoạt động trắc nghiệm tìm hiểu kiến thức, nghe ca khúc cách mạng và giao lưu văn hóa lành mạnh.</li>
        </ul>
      </div>

      <!-- Thẻ 3: Truyền Thống Đơn Vị -->
      <div class="intro-card">
        <div class="card-icon">⭐</div>
        <h3 class="card-title">Truyền Thống Tiểu Đoàn Phòng không 16</h3>
         <p class="card-text highlight-slogan">
        "ĐOÀN KẾT HIỆP ĐỒNG, LẬP CÔNG TẬP THỂ"    
         </p>
        <p class="card-text">
          Trải qua quá trình xây dựng, chiến đấu và trưởng thành, Tiểu đoàn Phòng không 16 luôn giữ vững và phát huy truyền thống "Trung thành vô hạn, chủ động sáng tạo, đoàn kết hiệp đồng, quyết chiến quyết thắng", hoàn thành xuất sắc mọi nhiệm vụ huấn luyện, sẵn sàng chiến đấu bảo vệ vững chắc bầu trời Tổ quốc. 
        </p>
      </div>

      <!-- Thẻ 4: Định Hướng Chuyển Đổi Số -->
      <div class="intro-card">
        <div class="card-icon">🚀</div>
        <h3 class="card-title">Định Hướng Chuyển Đổi Số</h3>
        <p class="card-text">
          Đẩy mạnh ứng dụng công nghệ số trong công tác Đảng, công tác chính trị; xây dựng môi trường văn hóa quân sự phong phú, lành mạnh, đáp ứng yêu cầu xây dựng đơn vị vững mạnh toàn diện "Mẫu mực, tiêu biểu" trong tình hình mới.
        </p>
      </div>
    </div>

 
    <!-- 🌟 HỆ THỐNG THÔNG BÁO HIỆN ĐẠI (Thay thế alert mặc định) -->
    <transition name="modal-modern">
      <div v-if="showAlert" class="modal-overlay" @click.self="closeAlert">
        <div class="modal-container alert-container">
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
      alertMessage: 'Đã dâng hoa thành kính lên Bác!'
    }
  },
  methods: {
    // Hàm gọi thông báo hiện đại thay cho alert() cũ
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
  },
  mounted() {
    // Bạn có thể gọi trực tiếp hàm này khi người dùng click dâng hoa:
    // this.triggerNotification('Thành kính dâng hoa', 'Đã dâng hoa thành kính lên Bác!');
  }
}
</script>

<style scoped>
.intro-page {
  padding: 10px 0;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #ffd700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 15px rgba(255, 215, 0, 0.3);
  letter-spacing: 1px;
}

.section-desc {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin: 0;
}

/* Grid Layout */
.intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.intro-card {
  background: linear-gradient(145deg, rgba(35, 5, 5, 0.85), rgba(18, 2, 2, 0.9));
  border-radius: 16px;
  padding: 28px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
}

.intro-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.15);
}

.card-icon {
  font-size: 2.2rem;
  margin-bottom: 15px;
  background: rgba(255, 215, 0, 0.1);
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.card-title {
  color: #ffd700;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.card-text {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.highlight-slogan {
  color: #ffd700;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.card-list {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  padding-left: 20px;
}

.card-list li {
  margin-bottom: 8px;
}

.card-list strong {
  color: #f8fafc;
}

/* Info Banner */
.info-banner {
  background: linear-gradient(135deg, rgba(92, 6, 6, 0.5), rgba(30, 2, 2, 0.8));
  border: 1px solid rgba(255, 215, 0, 0.35);
  border-radius: 16px;
  padding: 24px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.banner-emblem {
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  background: rgba(0, 0, 0, 0.4);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 215, 0, 0.4);
  flex-shrink: 0;
}

.banner-content h4 {
  color: #ffd700;
  margin: 0 0 5px 0;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.banner-content p {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.9rem;
}

/* 🌟 STYLE CHO MODAL THÔNG BÁO HIỆN ĐẠI */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.alert-container {
  background: linear-gradient(145deg, #2b0404, #100101);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  padding: 35px 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
}

.alert-icon-wrapper {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.alert-star {
  font-size: 1.8rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

.alert-title {
  color: #ffd700;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.alert-message {
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
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
  border-color: #ffd700;
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
  .info-banner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
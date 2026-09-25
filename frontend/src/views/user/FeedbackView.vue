<template>
  <div class="feedback-page">
    <!-- Tiêu đề trang -->
    <div class="hero-section">
      <div class="hero-glow"></div>
      <div class="hero-badge animate-fade-down">HÒM THƯ ĐƠN VỊ</div>
      <h2 class="section-title animate-fade-in">GÓP Ý &amp; PHẢN ÁNH CHÍNH TRỊ</h2>
      <p class="section-desc animate-fade-up">Tiếp thu ý kiến đóng góp xây dựng Phòng Hồ Chí Minh số và các hoạt động toàn Tiểu đoàn</p>
    </div>

    <!-- Nội dung chính dạng lưới 2 cột -->
    <div class="feedback-grid">
      
      <!-- Cột 1: Form gửi góp ý thông minh -->
      <div class="intro-card form-card animate-fade-right">
        <div class="card-header-flex">
          <div class="card-icon">✍️</div>
          <div>
            <h3 class="card-title">Gửi Ý Kiến Đóng Góp</h3>
            <p class="card-subtitle-top">Mọi ý kiến được tổng hợp bảo mật về ban biên tập</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="feedback-form">
          <div class="form-group">
            <label for="senderName">Họ và tên / Quân hàm, chức vụ:</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                id="senderName" 
                v-model="form.name" 
                placeholder="Ví dụ: Trung sĩ Nguyễn Văn A" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="senderUnit">Bộ phận / Đại đội / Trung đội:</label>
            <div class="input-wrapper">
              <span class="input-icon">🏛️</span>
              <input 
                type="text" 
                id="senderUnit" 
                v-model="form.unit" 
                placeholder="Ví dụ: Đại đội 1, Tiểu đoàn PK 16" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="feedbackCategory">Lĩnh vực góp ý:</label>
            <div class="input-wrapper select-wrapper">
              <span class="input-icon">📂</span>
              <select id="feedbackCategory" v-model="form.category" class="custom-select">
                <option value="Chung">Ý kiến chung về Phòng Hồ Chí Minh số</option>
                <option value="ThuVien">Kho tài liệu &amp; Thư viện số</option>
                <option value="TracNghiem">Hệ thống Thi trắc nghiệm</option>
                <option value="HoatDong">Các hoạt động văn hóa, ca khúc</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <div class="label-flex">
              <label for="feedbackContent">Nội dung chi tiết:</label>
              <span class="char-counter" :class="{ warning: form.content.length > 450 }">
                {{ form.content.length }}/500 ký tự
              </span>
            </div>
            <textarea 
              id="feedbackContent" 
              v-model="form.content" 
              rows="4" 
              maxlength="500"
              placeholder="Nhập nội dung đóng góp, đề xuất hoặc phản ánh tại đây..." 
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading-state">
              <span class="spinner"></span> Đang gửi lên hệ thống...
            </span>
            <span v-else>Gửi Góp Ý Ngay 🚀</span>
          </button>
        </form>
      </div>

      <!-- Cột 2: Hướng dẫn & Quy định hòm thư -->
      <div class="info-sidebar animate-fade-left">
        <div class="intro-card info-card-item">
          <div class="card-icon">🛡️</div>
          <h3 class="card-title">Quy Định &amp; Nguyên Tắc</h3>
          <ul class="card-list">
            <li>
              <span class="bullet-dot"></span>
              <div><strong>Tính xây dựng:</strong> Mọi ý kiến đóng góp cần mang tính chất xây dựng tập thể, đoàn kết đơn vị.</div>
            </li>
            <li>
              <span class="bullet-dot"></span>
              <div><strong>Bảo mật thông tin:</strong> Thông tin cá nhân và nội dung phản ánh được bảo mật theo quy định công tác Đảng, công tác chính trị.</div>
            </li>
            <li>
              <span class="bullet-dot"></span>
              <div><strong>Trách nhiệm:</strong> Đề cao tính trung thực, chính xác khi phản ánh các vấn đề liên quan đến hạ tầng số và sinh hoạt.</div>
            </li>
          </ul>
        </div>

        <!-- Banner cam kết cao cấp -->
        <div class="info-banner-mini">
          <div class="banner-emblem-mini">★</div>
          <div class="banner-text-content">
            <h4>TIỂU ĐOÀN PHÒNG KHÔNG 16</h4>
            <p>Lắng nghe, tiếp thu và hành động vì sự phát triển vững mạnh toàn diện của đơn vị.</p>
          </div>
        </div>
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
  name: 'FeedbackView',
  data() {
    return {
      form: {
        name: '',
        unit: '',
        category: 'Chung',
        content: ''
      },
      isSubmitting: false,
      showAlert: false,
      alertTitle: 'Gửi Góp Ý Thành Công',
      alertMessage: 'Cảm ơn ý kiến đóng góp của đồng chí! Hệ thống đã tiếp nhận và chuyển về ban biên tập đơn vị.'
    }
  },
  methods: {
    getApiUrl() {
      const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
      return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
    },

    async handleSubmit() {
      this.isSubmitting = true;
      
      try {
        const response = await fetch(`${this.getApiUrl()}/api/feedbacks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();

        if (response.ok) {
          this.triggerNotification(
            'Gửi Góp Ý Thành Công', 
            `Đồng chí ${this.form.name} đã gửi ý kiến thành công về đơn vị. Xin trân trọng tiếp thu!`
          );
          
          this.form.name = '';
          this.form.unit = '';
          this.form.category = 'Chung';
          this.form.content = '';
        } else {
          this.triggerNotification(
            'Thông Báo', 
            data.message || 'Không thể gửi góp ý, vui lòng thử lại!'
          );
        }
      } catch (err) {
        console.error('Lỗi kết nối API feedback:', err);
        this.triggerNotification(
          'Lỗi Kết Nối', 
          'Không thể kết nối đến máy chủ backend trên Render. Vui lòng kiểm tra lại mạng!'
        );
      } finally {
        this.isSubmitting = false;
      }
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
.feedback-page {
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

.feedback-page *, .feedback-page *::before, .feedback-page *::after {
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  margin-bottom: 36px;
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

/* Grid Layout */
.feedback-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 24px;
  margin-bottom: 30px;
}

.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.15);
}

.card-header-flex {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
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
  flex-shrink: 0;
}

.card-title {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}

.card-subtitle-top {
  color: #94a3b8;
  font-size: 0.82rem;
  margin: 0;
}

/* Form Styles */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
}

.label-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-counter {
  font-size: 0.75rem;
  color: #94a3b8;
}

.char-counter.warning {
  color: #f43f5e;
  font-weight: 700;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 0.95rem;
  pointer-events: none;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: rgba(12, 3, 3, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 10px;
  padding: 12px 14px 12px 42px;
  color: #f8fafc;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group textarea {
  padding-left: 14px; /* Textarea không cần icon trái */
  resize: vertical;
  min-height: 110px;
}

.custom-select {
  appearance: none;
  cursor: pointer;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 16px;
  font-size: 0.75rem;
  color: #ffd700;
  pointer-events: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.25);
  background: rgba(20, 5, 5, 0.95);
}

.custom-select option {
  background: #1b0202;
  color: #f8fafc;
  padding: 10px;
}

.btn-submit {
  margin-top: 6px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 14px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #f43f5e, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  border-color: #fff;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,215,0,0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Card List */
.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
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

/* Mini Banner */
.info-banner-mini {
  background: linear-gradient(135deg, rgba(92, 6, 6, 0.5), rgba(30, 2, 2, 0.8));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.banner-emblem-mini {
  font-size: 1.6rem;
  color: #ffd700;
  background: rgba(0, 0, 0, 0.5);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.4);
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.banner-text-content h4 {
  color: #ffd700;
  margin: 0 0 4px 0;
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.banner-text-content p {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
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

/* Modal Transitions */
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

/* Responsive adjustments */
@media (max-width: 992px) {
  .feedback-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 24px 16px;
  }
  .intro-card {
    padding: 20px;
  }
}
</style>
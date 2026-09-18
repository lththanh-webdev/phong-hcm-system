<template>
  <div class="feedback-page">
    <!-- Tiêu đề trang -->
    <div class="hero-section">
      <div class="hero-badge">HÒM THƯ ĐƠN VỊ</div>
      <h2 class="section-title">GÓP Ý &amp; PHẢN ÁNH CHÍNH TRỊ</h2>
      <p class="section-desc">Tiếp thu ý kiến đóng góp xây dựng Phòng Hồ Chí Minh số và các hoạt động của Tiểu đoàn</p>
    </div>

    <!-- Nội dung chính dạng lưới 2 cột (Form gửi & Thông tin hướng dẫn) -->
    <div class="feedback-grid">
      
      <!-- Cột 1: Form gửi góp ý -->
      <div class="intro-card form-card">
        <div class="card-icon">✍️</div>
        <h3 class="card-title">Gửi Ý Kiến Đóng Góp</h3>
        <p class="card-text form-subtitle">
          Ý kiến của đồng chí sẽ được tổng hợp trực tiếp về ban biên tập để cải tiến chất lượng phục vụ.
        </p>

        <form @submit.prevent="handleSubmit" class="feedback-form">
          <div class="form-group">
            <label for="senderName">Họ và tên / Quân hàm, chức vụ:</label>
            <input 
              type="text" 
              id="senderName" 
              v-model="form.name" 
              placeholder="Ví dụ: Trung sĩ Nguyễn Văn A" 
              required
            />
          </div>

          <div class="form-group">
            <label for="senderUnit">Bộ phận / Đại đội / Trung đội:</label>
            <input 
              type="text" 
              id="senderUnit" 
              v-model="form.unit" 
              placeholder="Ví dụ: Đại đội 1, Tiểu đoàn PK 16" 
              required
            />
          </div>

          <div class="form-group">
            <label for="feedbackCategory">Lĩnh vực góp ý:</label>
            <select id="feedbackCategory" v-model="form.category" class="custom-select">
              <option value="Chung">Ý kiến chung về Phòng Hồ Chí Minh số</option>
              <option value="ThuVien">Kho tài liệu &amp; Thư viện số</option>
              <option value="TracNghiem">Hệ thống Thi trắc nghiệm</option>
              <option value="HoatDong">Các hoạt động văn hóa, ca khúc</option>
            </select>
          </div>

          <div class="form-group">
            <label for="feedbackContent">Nội dung chi tiết:</label>
            <textarea 
              id="feedbackContent" 
              v-model="form.content" 
              rows="4" 
              placeholder="Nhập nội dung đóng góp, đề xuất hoặc phản ánh tại đây..." 
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Đang gửi hệ thống...</span>
            <span v-else>Gửi Góp Ý Ngay 🚀</span>
          </button>
        </form>
      </div>

      <!-- Cột 2: Hướng dẫn & Quy định hòm thư -->
      <div class="info-sidebar">
        <div class="intro-card info-card-item">
          <div class="card-icon">🛡️</div>
          <h3 class="card-title">Quy Định &amp; Nguyên Tắc</h3>
          <ul class="card-list">
            <li><strong>Tính xây dựng:</strong> Mọi ý kiến đóng góp cần mang tính chất xây dựng tập thể, đoàn kết đơn vị.</li>
            <li><strong>Bảo mật thông tin:</strong> Thông tin cá nhân và nội dung phản ánh được bảo mật theo quy định công tác Đảng, công tác chính trị.</li>
            <li><strong>Trách nhiệm:</strong> Đề cao tính trung thực, chính xác khi phản ánh các vấn đề liên quan đến hạ tầng số và sinh hoạt.</li>
          </ul>
        </div>

        <!-- Banner cam kết -->
        <div class="info-banner-mini">
          <div class="banner-emblem-mini">★</div>
          <div>
            <h4>TIỂU ĐOÀN PHÒNG KHÔNG 16</h4>
            <p>Lắng nghe, tiếp thu và hành động vì sự phát triển vững mạnh toàn diện của đơn vị.</p>
          </div>
        </div>
      </div>

    </div>

    <!-- 🌟 HỆ THỐNG THÔNG BÁO HIỆN ĐẠI (Đồng bộ với IntroView) -->
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
    handleSubmit() {
      this.isSubmitting = true;
      
      // Giả lập độ trễ kết nối mạng an toàn (Network request simulation)
      setTimeout(() => {
        this.isSubmitting = false;
        this.triggerNotification(
          'Gửi Góp Ý Thành Công', 
          `Đồng chí ${this.form.name} đã gửi ý kiến thành công về phân hệ "${this.form.category}". Đơn vị xin trân trọng tiếp thu!`
        );
        
        // Reset form sau khi gửi thành công
        this.form.name = '';
        this.form.unit = '';
        this.form.category = 'Chung';
        this.form.content = '';
      }, 700);
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
  padding: 10px 0;
}

/* Hero Section (Đồng bộ tuyệt đối với IntroView) */
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

/* Grid Layout chia 2 cột cho màn hình lớn và tự động dồn cột trên mobile */
.feedback-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  margin-bottom: 40px;
}

.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Kế thừa hoàn toàn kiểu dáng thẻ .intro-card từ IntroView */
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
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.12);
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
  margin: 0 0 8px 0;
}

.card-text {
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.form-subtitle {
  margin-bottom: 20px;
}

/* Form Styles */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: rgba(15, 2, 2, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 8px;
  padding: 11px 14px;
  color: #f8fafc;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.custom-select option {
  background: #1b0202;
  color: #f8fafc;
}

.btn-submit {
  margin-top: 6px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 13px;
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
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Card List cho sidebar */
.card-list {
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  padding-left: 18px;
}

.card-list li {
  margin-bottom: 8px;
}

.card-list strong {
  color: #f8fafc;
}

/* Mini Banner trong sidebar */
.info-banner-mini {
  background: linear-gradient(135deg, rgba(92, 6, 6, 0.4), rgba(30, 2, 2, 0.7));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.banner-emblem-mini {
  font-size: 1.8rem;
  color: #ffd700;
  background: rgba(0, 0, 0, 0.4);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.4);
  flex-shrink: 0;
}

.info-banner-mini h4 {
  color: #ffd700;
  margin: 0 0 3px 0;
  font-size: 0.9rem;
  font-weight: 800;
}

.info-banner-mini p {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.8rem;
}

/* 🌟 STYLE CHO MODAL THÔNG BÁO HIỆN ĐẠI (Đồng bộ 100% với IntroView) */
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
  font-size: 0.95rem;
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

/* Responsive tối ưu cho Mobile & Tablet */
@media (max-width: 900px) {
  .feedback-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.6rem;
  }
  .intro-card {
    padding: 20px;
  }
}
</style>
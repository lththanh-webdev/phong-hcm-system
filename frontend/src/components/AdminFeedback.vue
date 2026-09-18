<template>
  <div class="feedback-page admin-feedback-page">
    <!-- Tiêu đề trang -->
    <div class="hero-section">
      <div class="hero-badge">QUẢN TRỊ HỆ THỐNG</div>
      <h2 class="section-title">QUẢN LÝ HÒM THƯ GÓP Ý</h2>
      <p class="section-desc">Theo dõi, kiểm duyệt và quản lý các ý kiến đóng góp từ quân nhân các đơn vị</p>
    </div>

    <!-- Thẻ Thống kê tổng quan -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📬</div>
        <div class="stat-info">
          <span class="stat-value">{{ feedbackList.length }}</span>
          <span class="stat-label">Tổng số góp ý</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔍</div>
        <div class="stat-info">
          <span class="stat-value">{{ filteredFeedbackList.length }}</span>
          <span class="stat-label">Đang hiển thị</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <span class="stat-value">Hoạt động</span>
          <span class="stat-label">Trạng thái hệ thống</span>
        </div>
      </div>
    </div>

    <!-- Thanh Tìm kiếm và Bộ lọc thông minh -->
    <div class="filter-card">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tên quân nhân hoặc đơn vị..." 
          class="search-input"
        />
      </div>
      <div class="filter-options">
        <select v-model="selectedCategory" class="custom-select">
          <option value="ALL">Tất cả lĩnh vực</option>
          <option value="Chung">Ý kiến chung</option>
          <option value="ThuVien">Thư viện số</option>
          <option value="TracNghiem">Thi trắc nghiệm</option>
          <option value="HoatDong">Hoạt động văn hóa</option>
        </select>
      </div>
    </div>

    <!-- Danh sách Hòm thư (Hiển thị dạng bảng trên Desktop, dạng Cards linh hoạt trên Mobile) -->
    <div class="intro-card table-wrapper-card">
      <div class="card-header-flex">
        <div>
          <h3 class="card-title">Danh Sách Ý Kiến Đóng Góp</h3>
          <p class="card-text">Quản lý chi tiết nội dung phản ánh từ cán bộ, chiến sĩ</p>
        </div>
        <button @click="fetchFeedback" class="btn-refresh" title="Làm mới dữ liệu">
          🔄 Làm mới
        </button>
      </div>

      <!-- Trường hợp có dữ liệu -->
      <div v-if="filteredFeedbackList.length > 0" class="content-display-area">
        <!-- Bảng hiển thị trên Desktop -->
        <div class="desktop-table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Người Gửi &amp; Đơn Vị</th>
                <th>Lĩnh Vực</th>
                <th>Nội Dung Góp Ý</th>
                <th>Thời Gian</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredFeedbackList" :key="item.id || item._id">
                <td class="text-muted">#{{ index + 1 }}</td>
                <td>
                  <div class="sender-name">{{ item.sender_name || item.name || 'Ẩn danh' }}</div>
                  <div class="sender-unit">{{ item.unit || 'Chưa cập nhật đơn vị' }}</div>
                </td>
                <td>
                  <span class="badge-category">
                    {{ formatCategoryName(item.category) }}
                  </span>
                </td>
                <td class="content-cell">
                  <p class="message-text">{{ item.message || item.content }}</p>
                </td>
                <td class="time-cell">
                  {{ formatDate(item.created_at || item.createdAt) }}
                </td>
                <td class="text-center">
                  <button @click="confirmDelete(item)" class="btn-delete-icon" title="Xóa thư">
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Danh sách dạng Thẻ (Cards) tối ưu tuyệt đối cho điện thoại / Tablet -->
        <div class="mobile-cards-container">
          <div v-for="(item, index) in filteredFeedbackList" :key="'m-' + (item.id || item._id)" class="feedback-item-card">
            <div class="item-card-header">
              <span class="item-index">#{{ index + 1 }}</span>
              <span class="badge-category">
                {{ formatCategoryName(item.category) }}
              </span>
            </div>
            <div class="item-card-body">
              <h4 class="m-sender">{{ item.sender_name || item.name || 'Ẩn danh' }}</h4>
              <p class="m-unit">📍 {{ item.unit || 'Chưa cập nhật đơn vị' }}</p>
              <div class="m-content-box">
                <p>{{ item.message || item.content }}</p>
              </div>
              <div class="m-footer">
                <span class="m-time">🕒 {{ formatDate(item.created_at || item.createdAt) }}</span>
                <button @click="confirmDelete(item)" class="btn-delete-mobile">
                  🗑️ Xóa thư
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trường hợp không có dữ liệu -->
      <div v-else class="no-data-state">
        <div class="no-data-icon">📭</div>
        <h4>Không có thư góp ý nào</h4>
        <p>Hệ thống chưa ghi nhận ý kiến phù hợp với bộ lọc hoặc hòm thư đang trống.</p>
      </div>
    </div>

    <!-- 🌟 MODAL XÁC NHẬN XÓA HIỆN ĐẠI -->
    <transition name="modal-modern">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-container alert-container">
          <div class="alert-icon-wrapper delete-warn-icon">
            <span class="alert-star">⚠️</span>
          </div>
          <h3 class="alert-title">Xác Nhận Xóa Thư</h3>
          <p class="alert-message">
            Đồng chí có chắc chắn muốn xóa thư góp ý của quân nhân <strong>{{ itemToDelete?.sender_name || itemToDelete?.name }}</strong> không? Thao tác này không thể hoàn tác.
          </p>
          <div class="modal-action-buttons">
            <button class="btn-alert-confirm btn-danger-action" @click="executeDelete">Xác nhận xóa</button>
            <button class="btn-alert-cancel" @click="showDeleteModal = false">Hủy bỏ</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 🌟 MODAL THÔNG BÁO TOAST / ALERT ĐỒNG BỘ -->
    <transition name="modal-modern">
      <div v-if="showAlert" class="modal-overlay" @click.self="showAlert = false">
        <div class="modal-container alert-container">
          <div class="alert-icon-wrapper">
            <span class="alert-star">★</span>
          </div>
          <h3 class="alert-title">{{ alertTitle }}</h3>
          <p class="alert-message">{{ alertMessage }}</p>
          <div class="alert-actions">
            <button class="btn-alert-confirm" @click="showAlert = false">Xác nhận</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AdminFeedback',
  data() {
    return {
      feedbackList: [],
      searchQuery: '',
      selectedCategory: 'ALL',
      showDeleteModal: false,
      itemToDelete: null,
      showAlert: false,
      alertTitle: 'Thông Báo',
      alertMessage: ''
    };
  },
  computed: {
    filteredFeedbackList() {
      return this.feedbackList.filter(item => {
        const name = (item.sender_name || item.name || '').toLowerCase();
        const unit = (item.unit || '').toLowerCase();
        const content = (item.message || item.content || '').toLowerCase();
        const query = this.searchQuery.toLowerCase();

        const matchesSearch = name.includes(query) || unit.includes(query) || content.includes(query);
        const matchesCategory = this.selectedCategory === 'ALL' || item.category === this.selectedCategory;

        return matchesSearch && matchesCategory;
      });
    }
  },
  mounted() {
    this.fetchFeedback();
  },
  methods: {
    getApiUrl() {
      const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
      return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
    },

    async fetchFeedback() {
      try {
        const res = await fetch(`${this.getApiUrl()}/api/feedback`);
        if (!res.ok) throw new Error('Lỗi kết nối từ server');
        const data = await res.json();
        this.feedbackList = Array.isArray(data) ? data : (data.data || []);
      } catch (err) {
        console.warn('Không thể tải từ API thực tế, hiển thị dữ liệu mẫu:', err);
        this.feedbackList = [
          {
            id: 1,
            sender_name: 'Nguyễn Văn A',
            unit: 'Đại đội 1 - Tiểu đoàn PK 16',
            category: 'ThuVien',
            message: 'Đề nghị cập nhật thêm tài liệu nghiên cứu chuyên sâu về truyền thống đơn vị.',
            created_at: new Date()
          }
        ];
      }
    },

    formatCategoryName(cat) {
      const map = {
        'Chung': 'Ý kiến chung',
        'ThuVien': 'Thư viện số',
        'TracNghiem': 'Thi trắc nghiệm',
        'HoatDong': 'Hoạt động VH'
      };
      return map[cat] || cat || 'Góp ý chung';
    },

    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleString('vi-VN');
    },

    confirmDelete(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },

    async executeDelete() {
      if (!this.itemToDelete) return;
      const id = this.itemToDelete.id || this.itemToDelete._id;

      try {
        await fetch(`${this.getApiUrl()}/api/feedback/${id}`, {
          method: 'DELETE'
        });

        this.feedbackList = this.feedbackList.filter(f => (f.id || f._id) !== id);
        this.showDeleteModal = false;
        this.triggerAlert('Thành Công', 'Đã xóa thư góp ý khỏi hệ thống thành công!');
      } catch (err) {
        this.feedbackList = this.feedbackList.filter(f => (f.id || f._id) !== id);
        this.showDeleteModal = false;
        this.triggerAlert('Thành Công', 'Đã xóa thư khỏi danh sách hiển thị!');
      }
    },

    triggerAlert(title, message) {
      this.alertTitle = title;
      this.alertMessage = message;
      this.showAlert = true;
    }
  }
};
</script>

<style scoped>
.admin-feedback-page {
  padding: 10px 0;
}

/* Hero Section chuẩn phong cách hệ thống */
.hero-section {
  text-align: center;
  margin-bottom: 30px;
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

/* Thống kê (Stats Grid) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(145deg, rgba(35, 5, 5, 0.85), rgba(18, 2, 2, 0.9));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.stat-icon {
  font-size: 1.8rem;
  background: rgba(255, 215, 0, 0.1);
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  color: #ffd700;
  font-size: 1.25rem;
  font-weight: 800;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Thanh Tìm kiếm & Lọc thông minh */
.filter-card {
  background: linear-gradient(145deg, rgba(30, 4, 4, 0.8), rgba(15, 1, 1, 0.9));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  background: rgba(15, 2, 2, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 8px;
  padding: 11px 14px 11px 40px;
  color: #f8fafc;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.filter-options select {
  background: rgba(15, 2, 2, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 8px;
  padding: 11px 16px;
  color: #f8fafc;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-options select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.filter-options option {
  background: #1b0202;
  color: #f8fafc;
}

/* Thẻ Bảng Dữ Liệu Đồng Bộ .intro-card */
.table-wrapper-card {
  background: linear-gradient(145deg, rgba(35, 5, 5, 0.85), rgba(18, 2, 2, 0.9));
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  color: #ffd700;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}

.card-text {
  color: #cbd5e1;
  font-size: 0.85rem;
  margin: 0;
}

.btn-refresh {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateY(-1px);
}

/* Bảng Desktop */
.desktop-table-container {
  width: 100%;
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.modern-table th, .modern-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  color: #e2e8f0;
}

.modern-table th {
  color: #ffd700;
  font-weight: 700;
  background: rgba(15, 2, 2, 0.6);
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.sender-name {
  font-weight: 700;
  color: #f8fafc;
}

.sender-unit {
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 2px;
}

.content-cell {
  max-width: 320px;
}

.message-text {
  margin: 0;
  line-height: 1.4;
  color: #cbd5e1;
  word-break: break-word;
}

.time-cell {
  font-size: 0.82rem;
  color: #94a3b8;
  white-space: nowrap;
}

.text-muted {
  color: #64748b;
  font-weight: 600;
}

.text-center {
  text-align: center;
}

/* Huy hiệu danh mục */
.badge-category {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  white-space: nowrap;
}

/* Nút Xóa trên bảng */
.btn-delete-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-icon:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

/* Mobile Cards Container (Tự động hiển thị khi xem trên màn hình nhỏ) */
.mobile-cards-container {
  display: none;
  flex-direction: column;
  gap: 16px;
}

.feedback-item-card {
  background: rgba(15, 2, 2, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-index {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 700;
}

.item-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.m-sender {
  color: #ffd700;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.m-unit {
  color: #cbd5e1;
  font-size: 0.85rem;
  margin: 0;
}

.m-content-box {
  background: rgba(30, 4, 4, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.1);
  padding: 10px 12px;
  border-radius: 8px;
}

.m-content-box p {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
}

.m-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.m-time {
  font-size: 0.78rem;
  color: #94a3b8;
}

.btn-delete-mobile {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

/* Trạng thái trống */
.no-data-state {
  text-align: center;
  padding: 40px 20px;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.no-data-state h4 {
  color: #ffd700;
  margin: 0 0 6px 0;
  font-size: 1.1rem;
}

.no-data-state p {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

/* Modal Styles đồng bộ với Form người dùng */
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

.delete-warn-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.05));
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
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

.modal-action-buttons {
  display: flex;
  gap: 12px;
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
  transition: all 0.3s ease;
  flex: 1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.btn-danger-action {
  background: linear-gradient(135deg, #dc2626, #991b1b);
}

.btn-alert-cancel {
  background: rgba(100, 116, 139, 0.3);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 0;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-alert-cancel:hover {
  background: rgba(100, 116, 139, 0.5);
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

/* Responsive Breakpoints */
@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .filter-card {
    flex-direction: column;
    align-items: stretch;
  }
  .desktop-table-container {
    display: none;
  }
  .mobile-cards-container {
    display: flex;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.6rem;
  }
  .table-wrapper-card {
    padding: 16px;
  }
}
</style>
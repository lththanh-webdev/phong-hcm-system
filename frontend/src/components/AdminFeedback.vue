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

    <!-- Danh sách Hòm thư -->
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
                  <p class="message-snippet">{{ truncateText(item.message || item.content, 90) }}</p>
                  <button @click="openDetailModal(item)" class="btn-link-detail">Xem chi tiết 🔍</button>
                </td>
                <td class="time-cell">
                  {{ formatDate(item.created_at || item.createdAt) }}
                </td>
                <td class="text-center action-col">
                  <div class="action-btn-group">
                    <button @click="openDetailModal(item)" class="btn-detail-icon" title="Xem chi tiết nội dung">👁️ Xem</button>
                    <button @click="confirmDelete(item)" class="btn-delete-icon" title="Xóa thư">🗑️ Xóa</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Danh sách dạng Thẻ (Cards) cho Mobile -->
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
                <p>{{ truncateText(item.message || item.content, 110) }}</p>
                <button @click="openDetailModal(item)" class="btn-link-detail">Xem đầy đủ nội dung 🔍</button>
              </div>
              <div class="m-footer">
                <span class="m-time">🕒 {{ formatDate(item.created_at || item.createdAt) }}</span>
                <div class="mobile-actions-group">
                  <button @click="openDetailModal(item)" class="btn-detail-mobile">👁️ Xem</button>
                  <button @click="confirmDelete(item)" class="btn-delete-mobile">🗑️ Xóa</button>
                </div>
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

    <!-- 🌟 MODAL XEM CHI TIẾT NỘI DUNG SIÊU XỊN & HIỆN ĐẠI -->
    <transition name="modal-modern">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
        <div class="modal-container detail-container">
          <div class="detail-header-bar">
            <div class="detail-badge-top">★ CHI TIẾT Ý KIẾN ĐÓNG GÓP</div>
            <button @click="showDetailModal = false" class="btn-close-modal">✕</button>
          </div>

          <div class="detail-meta-box">
            <div class="meta-row">
              <span class="meta-label">Người gửi:</span>
              <span class="meta-value highlight-text">{{ activeDetail.sender_name || activeDetail.name || 'Ẩn danh' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Đơn vị:</span>
              <span class="meta-value">{{ activeDetail.unit || 'Chưa cập nhật đơn vị' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Lĩnh vực:</span>
              <span class="badge-category">{{ formatCategoryName(activeDetail.category) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Thời gian gửi:</span>
              <span class="meta-value text-time">{{ formatDate(activeDetail.created_at || activeDetail.createdAt) }}</span>
            </div>
          </div>

          <div class="detail-content-section">
            <h5 class="content-heading">Nội dung chi tiết phản ánh:</h5>
            <div class="scrollable-content-box">
              <p class="full-message-text">{{ activeDetail.message || activeDetail.content }}</p>
            </div>
          </div>

          <div class="detail-modal-footer">
            <button class="btn-alert-confirm" @click="showDetailModal = false">Đóng cửa sổ</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 🌟 MODAL XÁC NHẬN XÓA -->
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

    <!-- 🌟 MODAL THÔNG BÁO TOAST / ALERT -->
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
      showDetailModal: false,
      activeDetail: {},
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
            message: 'Trước đó, sông Bùi đã được đặt ở mức báo động III. Báo điện tử Tiền Phong báo điện tử Tiền Phong 1 Báo điện tử Tiền Phong 1 © Báo điện tử Tiền Phong Đến chiều 17/9, nước chưa vẫn rút bớt tại thôn Đồng Dàu. Người dân tiếp tục theo dõi sát mực nước sông Bùi. Báo điện tử Tiền Phong Đến chiều 17/9, nước chưa vẫn rút bớt tại thôn Đồng Dàu. Người dân tiếp tục theo dõi sát mực nước sông Bùi. © Báo điện tử Tiền Phong Báo điện tử Tiền Phong 1 Báo điện tử Tiền Phong 1 © Báo điện tử Tiền Phong Báo điện tử Tiền Phong Đến chiều 17/9...',
            created_at: new Date()
          }
        ];
      }
    },

    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },

    openDetailModal(item) {
      this.activeDetail = item;
      this.showDetailModal = true;
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

/* Hero Section */
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

/* Thống kê */
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

/* Lọc & Tìm kiếm */
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
}

.filter-options option {
  background: #1b0202;
  color: #f8fafc;
}

/* Thẻ Bảng Dữ Liệu */
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

.message-snippet {
  margin: 0 0 6px 0;
  line-height: 1.4;
  color: #cbd5e1;
  word-break: break-word;
}

/* Nút xem chi tiết dạng link nhỏ gọn trong bảng */
.btn-link-detail {
  background: none;
  border: none;
  color: #60a5fa;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
}

.btn-link-detail:hover {
  color: #93c5fd;
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

.action-btn-group {
  display: flex;
  gap: 6px;
  justify-content: center;
}

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

.btn-detail-icon, .btn-delete-icon {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.btn-detail-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.3);
}

.btn-detail-icon:hover {
  background: rgba(59, 130, 246, 0.3);
}

.btn-delete-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-delete-icon:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* Mobile Cards Container */
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
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.mobile-actions-group {
  display: flex;
  gap: 6px;
}

.btn-detail-mobile, .btn-delete-mobile {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
}

.btn-detail-mobile {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.4);
}

.btn-delete-mobile {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
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

/* 🌟 MODAL XEM CHI TIẾT SIÊU XỊN & HIỆN ĐẠI */
.detail-container {
  background: linear-gradient(145deg, #250404, #0d0101);
  border: 2px solid rgba(255, 215, 0, 0.6);
  border-radius: 20px;
  width: 100%;
  max-width: 650px;
  padding: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 85vh;
}

.detail-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: 12px;
}

.detail-badge-top {
  color: #ffd700;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.btn-close-modal {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-close-modal:hover {
  background: rgba(239, 68, 68, 0.5);
}

.detail-meta-box {
  background: rgba(15, 2, 2, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 12px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.meta-label {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 0.95rem;
  color: #f1f5f9;
  font-weight: 600;
}

.highlight-text {
  color: #ffd700;
}

.text-time {
  color: #38bdf8;
}

.detail-content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.content-heading {
  color: #ffd700;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 700;
}

.scrollable-content-box {
  background: rgba(10, 1, 1, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 12px;
  padding: 18px;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.6);
}

/* Tối ưu typography cho văn bản dài cực đẹp */
.full-message-text {
  margin: 0;
  color: #f8fafc;
  font-size: 1rem;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.scrollable-content-box::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content-box::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 4px;
}

.scrollable-content-box::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.6);
}

.detail-modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding-top: 14px;
}

/* Modal Xóa chung */
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
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.btn-danger-action {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  flex: 1;
}

.btn-alert-cancel {
  background: rgba(100, 116, 139, 0.3);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 0;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
}

/* Modal Transition */
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

/* Responsive */
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
  .detail-meta-box {
    grid-template-columns: 1fr;
  }
}
</style>
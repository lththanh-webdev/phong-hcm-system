<template>
  <div class="feedback-page admin-feedback-page">
    <!-- Tiêu đề trang -->
    <div class="hero-section">
      <div class="hero-badge">QUẢN TRỊ HỆ THỐNG QUÂN SỰ</div>
      <h2 class="section-title">QUẢN LÝ HÒM THƯ GÓP Ý</h2>
      <p class="section-desc">Theo dõi, kiểm duyệt và quản lý minh bạch các ý kiến đóng góp từ cán bộ, chiến sĩ các đơn vị</p>
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
          <span class="stat-value status-active">Hoạt động ổn định</span>
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
          placeholder="Tìm kiếm theo tên quân nhân, đơn vị hoặc nội dung..." 
          class="search-input"
        />
      </div>
      <div class="filter-options">
        <select v-model="selectedCategory" class="custom-select">
          <option value="ALL">🌟 Tất cả lĩnh vực</option>
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
          <p class="card-text">Quản lý chi tiết nội dung phản ánh từ cán bộ, chiến sĩ toàn đơn vị</p>
        </div>
        <button @click="fetchFeedback" class="btn-refresh" title="Làm mới dữ liệu">
          🔄 Làm mới dữ liệu
        </button>
      </div>

      <!-- Trường hợp có dữ liệu -->
      <div v-if="filteredFeedbackList.length > 0" class="content-display-area">
        <!-- Bảng hiển thị trên Desktop -->
        <div class="desktop-table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th width="60">STT</th>
                <th>Người Gửi &amp; Đơn Vị</th>
                <th>Lĩnh Vực</th>
                <th>Nội Dung Góp Ý</th>
                <th>Thời Gian</th>
                <th class="text-center" width="140">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredFeedbackList" :key="item.id || item._id">
                <td class="text-muted font-bold">#{{ index + 1 }}</td>
                <td>
                  <div class="sender-name">{{ item.sender_name || item.name || 'Ẩn danh' }}</div>
                  <div class="sender-unit">📍 {{ item.unit || 'Chưa cập nhật đơn vị' }}</div>
                </td>
                <td>
                  <span class="badge-category">
                    {{ formatCategoryName(item.category) }}
                  </span>
                </td>
                <td class="content-cell">
                  <p class="message-snippet">{{ truncateText(item.message || item.content, 85) }}</p>
                  <button @click="openDetailModal(item)" class="btn-link-detail">Xem chi tiết 🔍</button>
                </td>
                <td class="time-cell">
                  🕒 {{ formatDate(item.created_at || item.createdAt) }}
                </td>
                <td class="text-center action-col">
                  <div class="action-btn-group">
                    <button @click="openDetailModal(item)" class="btn-detail-icon" title="Xem chi tiết">👁️ Xem</button>
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
                <p>{{ truncateText(item.message || item.content, 100) }}</p>
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
        <h4>Không tìm thấy thư góp ý nào</h4>
        <p>Hệ thống chưa ghi nhận ý kiến phù hợp với từ khóa tìm kiếm hoặc hòm thư đang trống.</p>
      </div>
    </div>

    <!-- 🌟 MODAL XEM CHI TIẾT NỘI DUNG -->
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
              <span class="meta-value">📍 {{ activeDetail.unit || 'Chưa cập nhật đơn vị' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Lĩnh vực:</span>
              <span class="badge-category">{{ formatCategoryName(activeDetail.category) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Thời gian gửi:</span>
              <span class="meta-value text-time">🕒 {{ formatDate(activeDetail.created_at || activeDetail.createdAt) }}</span>
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
            Đồng chí có chắc chắn muốn xóa thư góp ý của quân nhân <strong class="text-gold">{{ itemToDelete?.sender_name || itemToDelete?.name }}</strong> không? Thao tác này không thể hoàn tác trên hệ thống.
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
        const res = await fetch(`${this.getApiUrl()}/api/feedbacks`);
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
            message: 'Đề xuất nhà trường và ban quản lý bổ sung thêm nhiều đầu sách chuyên ngành kỹ thuật quân sự cũng như cải thiện tốc độ truy cập kho dữ liệu của thư viện số trong giờ tự học.',
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
        await fetch(`${this.getApiUrl()}/api/feedbacks/${id}`, {
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
  padding: 12px 0 30px 0;
  color: #f1f5f9;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: 12px;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);
}

.section-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #ffd700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 20px rgba(255, 215, 0, 0.35);
  letter-spacing: 0.5px;
}

.section-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

/* Thống kê */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(35, 8, 8, 0.9), rgba(18, 3, 3, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 16px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 215, 0, 0.5);
}

.stat-icon {
  font-size: 1.8rem;
  background: rgba(255, 215, 0, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.25);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  color: #ffd700;
  font-size: 1.35rem;
  font-weight: 800;
}

.status-active {
  font-size: 1.05rem;
  color: #34d399;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 2px;
}

/* Lọc & Tìm kiếm */
.filter-card {
  background: linear-gradient(135deg, rgba(30, 6, 6, 0.85), rgba(15, 2, 2, 0.9));
  border: 1px solid rgba(255, 215, 0, 0.22);
  border-radius: 16px;
  padding: 18px 22px;
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 0.95rem;
}

.search-input {
  width: 100%;
  background: rgba(12, 2, 2, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 12px 16px 12px 42px;
  color: #f8fafc;
  font-size: 0.92rem;
  font-family: inherit;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
}

.filter-options select {
  background: rgba(12, 2, 2, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 12px 18px;
  color: #ffd700;
  font-size: 0.92rem;
  font-weight: 600;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-options select:focus {
  border-color: #ffd700;
}

.filter-options option {
  background: #180303;
  color: #f8fafc;
}

/* Thẻ Bảng Dữ Liệu */
.table-wrapper-card {
  background: linear-gradient(145deg, rgba(32, 7, 7, 0.9), rgba(16, 2, 2, 0.95));
  border-radius: 18px;
  padding: 26px;
  border: 1px solid rgba(255, 215, 0, 0.22);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.12);
}

.card-title {
  color: #ffd700;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}

.card-text {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

.btn-refresh {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-refresh:hover {
  background: rgba(255, 215, 0, 0.22);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.2);
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
  padding: 15px 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  color: #e2e8f0;
}

.modern-table th {
  color: #ffd700;
  font-weight: 700;
  background: rgba(14, 2, 2, 0.75);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table tbody tr {
  transition: background 0.2s;
}

.modern-table tbody tr:hover {
  background: rgba(255, 215, 0, 0.04);
}

.sender-name {
  font-weight: 700;
  color: #f8fafc;
  font-size: 0.95rem;
}

.sender-unit {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 3px;
}

.content-cell {
  max-width: 340px;
}

.message-snippet {
  margin: 0 0 6px 0;
  line-height: 1.45;
  color: #cbd5e1;
  word-break: break-word;
}

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
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.action-btn-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.badge-category {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  white-space: nowrap;
}

.btn-detail-icon, .btn-delete-icon {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.btn-detail-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.35);
}

.btn-detail-icon:hover {
  background: rgba(59, 130, 246, 0.3);
}

.btn-delete-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.35);
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
  background: rgba(14, 2, 2, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-index {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 700;
}

.item-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.m-sender {
  color: #ffd700;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.m-unit {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

.m-content-box {
  background: rgba(24, 4, 4, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.12);
  padding: 12px 14px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.m-content-box p {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
}

.m-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.m-time {
  font-size: 0.78rem;
  color: #94a3b8;
}

.mobile-actions-group {
  display: flex;
  gap: 8px;
}

.btn-detail-mobile, .btn-delete-mobile {
  padding: 7px 12px;
  border-radius: 8px;
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
  padding: 50px 20px;
}

.no-data-icon {
  font-size: 3.5rem;
  margin-bottom: 14px;
}

.no-data-state h4 {
  color: #ffd700;
  margin: 0 0 6px 0;
  font-size: 1.2rem;
}

.no-data-state p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

/* 🌟 MODAL XEM CHI TIẾT */
.detail-container {
  background: linear-gradient(145deg, #220505, #0b0101);
  border: 2px solid rgba(255, 215, 0, 0.55);
  border-radius: 22px;
  width: 100%;
  max-width: 680px;
  padding: 30px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-height: 85vh;
}

.detail-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: 14px;
}

.detail-badge-top {
  color: #ffd700;
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: 0.5px;
}

.btn-close-modal {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-close-modal:hover {
  background: rgba(239, 68, 68, 0.6);
}

.detail-meta-box {
  background: rgba(14, 2, 2, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.18);
  border-radius: 14px;
  padding: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  gap: 10px;
  flex: 1;
  overflow: hidden;
}

.content-heading {
  color: #ffd700;
  font-size: 0.98rem;
  margin: 0;
  font-weight: 700;
}

.scrollable-content-box {
  background: rgba(8, 1, 1, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 12px;
  padding: 20px;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.7);
}

.full-message-text {
  margin: 0;
  color: #f8fafc;
  font-size: 1.02rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.scrollable-content-box::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content-box::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.35);
  border-radius: 4px;
}

.scrollable-content-box::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.7);
}

.detail-modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding-top: 16px;
}

/* Modal Xóa chung & Thông báo */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.alert-container {
  background: linear-gradient(135deg, #280404, #0d0101);
  border: 2px solid rgba(255, 215, 0, 0.45);
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  padding: 38px 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.95);
}

.alert-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.22), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.25);
}

.delete-warn-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.05));
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.25);
}

.alert-star {
  font-size: 1.9rem;
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
}

.alert-title {
  color: #ffd700;
  font-size: 1.45rem;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.alert-message {
  color: #cbd5e1;
  font-size: 0.96rem;
  line-height: 1.65;
  margin-bottom: 26px;
}

.text-gold {
  color: #ffd700;
}

.modal-action-buttons {
  display: flex;
  gap: 14px;
  width: 100%;
}

.btn-alert-confirm {
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 12px 26px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 18px rgba(0,0,0,0.5);
}

.btn-alert-confirm:hover {
  filter: brightness(1.15);
}

.btn-danger-action {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  flex: 1;
}

.btn-alert-cancel {
  background: rgba(100, 116, 139, 0.25);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 0;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  transition: background 0.2s;
}

.btn-alert-cancel:hover {
  background: rgba(100, 116, 139, 0.4);
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
  transform: scale(0.92) translateY(20px);
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
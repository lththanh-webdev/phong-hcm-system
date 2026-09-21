<template>
  <div class="tab-pane-enhanced">
       <!-- Form Nhập Liệu -->
    <form @submit.prevent="submitActivity" class="form-grid-card">
      <div class="form-group">
        <label><span class="label-icon">📝</span> Tên bài viết / Hoạt động <span class="required">*</span></label>
        <input type="text" v-model="activityForm.title" placeholder="Nhập tiêu đề hoạt động rõ ràng..." required />
      </div>

      <div class="form-group">
        <label><span class="label-icon">🏷️</span> Chuyên mục</label>
        <select v-model="activityForm.category">
          <option value="Thi đua">⭐ Thi đua quyết thắng</option>
          <option value="Tuyên truyền">📢 Tuyên truyền</option>
          <option value="Văn hóa">🎨 Văn hóa - Văn nghệ</option>
          <option value="Hội thao">⚡ Hội thao - Thể thao</option>
        </select>
      </div>

      <div class="form-group">
        <label><span class="label-icon">📅</span> Ngày giờ đăng</label>
        <input type="datetime-local" v-model="activityForm.created_at" />
      </div>

      <div class="form-group">
        <label><span class="label-icon">🖼️</span> Hình ảnh minh họa</label>
        <div class="file-upload-wrapper">
          <input type="file" @change="handleFileChange" accept="image/*" id="activity-file" class="file-input" />
          <label for="activity-file" class="file-custom-label">
            <span>{{ activityForm.image ? activityForm.image.name : '📁 Chọn tệp hình ảnh...' }}</span>
            <span class="file-browse-btn">Duyệt tệp</span>
          </label>
        </div>
      </div>

      <div class="form-group full-width">
        <label><span class="label-icon">📌</span> Tóm tắt ngắn <span class="required">*</span></label>
        <input type="text" v-model="activityForm.summary" placeholder="Nhập tóm tắt ngắn gọn thu hút người xem..." required />
      </div>

      <div class="form-group full-width">
        <label><span class="label-icon">📄</span> Nội dung chi tiết</label>
        <textarea v-model="activityForm.content" rows="5" placeholder="Nhập nội dung chi tiết bài viết, kết quả thi đua, hoặc kế hoạch hoạt động..."></textarea>
      </div>

      <div class="form-actions-wrapper">
        <button type="submit" class="btn-primary-action">
          <span>{{ isEditingActivity ? '💾' : '🚀' }}</span>
          <span>{{ isEditingActivity ? 'Cập Nhật Lại Bài Viết' : 'Đăng Bài Lên Hệ Thống' }}</span>
        </button>
      </div>
    </form>

    <!-- Bảng Danh Sách Hoạt Động -->
    <div class="data-table-container">
      <div class="table-header-flex">
        <h4>Danh sách Hoạt động hiện có</h4>
        <span class="count-badge">Tổng số: <strong>{{ activities.length }}</strong> bài viết</span>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tiêu đề bài viết</th>
              <th>Chuyên mục</th>
              <th>Ngày đăng</th>
              <th>Tóm tắt nội dung</th>
              <th class="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in activities" :key="item.id" class="table-row">
              <td>
                <div class="title-cell">
                  <strong>{{ item.title }}</strong>
                </div>
              </td>
              <td>
                <span :class="['category-badge', getCategoryClass(item.category)]">
                  {{ item.category }}
                </span>
              </td>
              <td>
                <span class="date-text">{{ formatDate(item.created_at) }}</span>
              </td>
              <td>
                <span class="summary-text" :title="item.summary">{{ truncate(item.summary, 45) }}</span>
              </td>
              <td class="action-btns text-right">
                <button @click="editActivity(item)" class="btn-edit" title="Chỉnh sửa">
                  <span>✏️</span> Sửa
                </button>
                <button @click="deleteItem('activities', item.id)" class="btn-del" title="Xóa bản ghi">
                  <span>🗑️</span> Xóa
                </button>
              </td>
            </tr>
            <tr v-if="activities.length === 0">
              <td colspan="5" class="no-data">
                <div class="empty-state">
                  <span>📭</span>
                  <p>Chưa có dữ liệu hoạt động hoặc thi đua nào được ghi nhận.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const getApiUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
  return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
};

export default {
  props: ['activities'],
  data() {
    return {
      activityForm: { 
        title: '', 
        category: 'Thi đua', 
        summary: '', 
        content: '', 
        image: null, 
        created_at: '' 
      },
      isEditingActivity: false,
      editActivityId: null
    };
  },
  methods: {
    getAuthHeaders(isMultipart = false) {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (!isMultipart) headers['Content-Type'] = 'application/json';
      return headers;
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleString('vi-VN');
    },
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    getCurrentDateTime() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    },
    getCategoryClass(category) {
      switch(category) {
        case 'Thi đua': return 'cat-thidua';
        case 'Tuyên truyền': return 'cat-tuyentruyen';
        case 'Văn hóa': return 'cat-vanhoa';
        case 'Hội thao': return 'cat-hoithao';
        default: return 'cat-default';
      }
    },
    handleFileChange(e) { 
      if (e.target.files && e.target.files[0]) {
        this.activityForm.image = e.target.files[0]; 
      }
    },
    editActivity(item) {
      this.isEditingActivity = true;
      this.editActivityId = item.id;
      this.activityForm = { 
        title: item.title, 
        category: item.category, 
        summary: item.summary, 
        content: item.content, 
        image: null, 
        created_at: item.created_at ? item.created_at.slice(0, 16) : '' 
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    resetActivityForm() {
      this.isEditingActivity = false;
      this.editActivityId = null;
      this.activityForm = { title: '', category: 'Thi đua', summary: '', content: '', image: null, created_at: '' };
    },
    async submitActivity() {
      try {
        const formData = new FormData();
        formData.append('title', this.activityForm.title);
        formData.append('category', this.activityForm.category);
        formData.append('summary', this.activityForm.summary);
        formData.append('content', this.activityForm.content);
        formData.append('created_at', this.activityForm.created_at || this.getCurrentDateTime());
        if (this.activityForm.image) formData.append('image', this.activityForm.image);

        const baseUrl = getApiUrl();
        const url = this.isEditingActivity ? `${baseUrl}/api/activities/${this.editActivityId}` : `${baseUrl}/api/activities`;
        const method = this.isEditingActivity ? 'PUT' : 'POST';

        const res = await fetch(url, { method, headers: this.getAuthHeaders(true), body: formData });
        if (res.ok) {
          this.$emit('toast', this.isEditingActivity ? 'Cập nhật hoạt động thành công!' : 'Thêm hoạt động thành công!', 'success');
          this.resetActivityForm();
          this.$emit('refresh');
        } else { 
          this.$emit('toast', 'Thực hiện thao tác thất bại!', 'error'); 
        }
      } catch (err) { 
        this.$emit('toast', 'Đã xảy ra lỗi hệ thống!', 'error'); 
      }
    },
    async deleteItem(endpoint, id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi hoạt động này?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/${endpoint}/${id}`, { method: 'DELETE', headers: this.getAuthHeaders() });
        if (res.ok) {
          this.$emit('toast', 'Đã xóa bản ghi thành công!', 'success');
          this.$emit('refresh');
        } else { 
          this.$emit('toast', 'Không thể xóa bản ghi này!', 'error'); 
        }
      } catch (err) { 
        this.$emit('toast', 'Đã xảy ra lỗi hệ thống!', 'error'); 
      }
    }
  }
};
</script>

<style scoped>
.tab-pane-enhanced {
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: fadeInPane 0.3s ease;
}

@keyframes fadeInPane {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Section Header */
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(20, 6, 6, 0.8), rgba(10, 2, 2, 0.9));
  border: 1px solid rgba(255, 215, 0, 0.15);
  padding: 22px 28px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-icon {
  font-size: 2.2rem;
  background: rgba(255, 215, 0, 0.1);
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
}

.section-top h3 {
  margin: 0 0 6px 0;
  font-size: 1.35rem;
  color: #ffd700;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.subtitle {
  margin: 0;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-badge.editing {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.35);
}

.btn-cancel {
  background: rgba(100, 116, 139, 0.2);
  color: #cbd5e1;
  border: 1px solid rgba(100, 116, 139, 0.4);
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s ease;
}

.btn-cancel:hover {
  background: rgba(100, 116, 139, 0.4);
  color: #fff;
  border-color: #94a3b8;
}

/* Form Grid Card */
.form-grid-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  background: rgba(16, 5, 5, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  padding: 30px;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  background: rgba(8, 2, 2, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 13px 18px;
  border-radius: 10px;
  color: #fff;
  outline: none;
  width: 100%;
  font-size: 0.92rem;
  transition: all 0.3s ease;
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15);
  background: rgba(12, 3, 3, 0.95);
}

.form-group select option {
  background: #140606;
  color: #fff;
}

/* Custom File Upload */
.file-upload-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  display: none;
}

.file-custom-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(8, 2, 2, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 8px 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #cbd5e1;
  font-size: 0.9rem;
}

.file-custom-label:hover {
  border-color: rgba(255, 215, 0, 0.4);
}

.file-browse-btn {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.82rem;
  transition: all 0.2s ease;
}

.file-browse-btn:hover {
  background: rgba(255, 215, 0, 0.25);
}

/* Form Actions */
.form-actions-wrapper {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn-primary-action {
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 14px 30px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary-action:hover {
  background: linear-gradient(135deg, #f43f5e, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(225, 29, 72, 0.6);
  border-color: #ffd700;
}

/* Data Table Container */
.data-table-container {
  background: rgba(16, 5, 5, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
}

.table-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.data-table-container h4 {
  margin: 0;
  font-size: 1.15rem;
  color: #ffd700;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.count-badge {
  font-size: 0.82rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.count-badge strong {
  color: #ffd700;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th, 
.data-table td {
  padding: 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.data-table th {
  color: #94a3b8;
  font-weight: 700;
  background: rgba(8, 2, 2, 0.6);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.data-table th:first-child { border-top-left-radius: 10px; }
.data-table th:last-child { border-top-right-radius: 10px; }

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(255, 215, 0, 0.03);
}

.title-cell strong {
  color: #f8fafc;
  font-weight: 600;
}

.date-text {
  color: #94a3b8;
  font-size: 0.85rem;
  white-space: nowrap;
}

.summary-text {
  color: #cbd5e1;
  font-size: 0.88rem;
}

/* Category Badges */
.category-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.cat-thidua {
  background: rgba(225, 29, 72, 0.2);
  color: #fb7185;
  border: 1px solid rgba(225, 29, 72, 0.35);
}

.cat-tuyentruyen {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.cat-vanhoa {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.35);
}

.cat-hoithao {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.cat-default {
  background: #334155;
  color: #fff;
}

/* Action Buttons */
.text-right {
  text-align: right;
}

.action-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-edit, .btn-del {
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.btn-edit {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-edit:hover {
  background: rgba(59, 130, 246, 0.3);
  color: #fff;
  transform: translateY(-1px);
}

.btn-del {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-del:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #fff;
  transform: translateY(-1px);
}

/* Empty State */
.no-data {
  text-align: center;
  padding: 40px !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
}

.empty-state span {
  font-size: 2.5rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.92rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid-card {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  .form-group.full-width,
  .form-actions-wrapper {
    grid-column: span 1;
  }
  .section-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
}
</style>
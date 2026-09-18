<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Quản Lý Hoạt Động & Thi Đua</h3>
        <p class="subtitle">{{ isEditingActivity ? '✏️ Đang chỉnh sửa bài viết' : '➕ Thêm mới bài viết hoạt động' }}</p>
      </div>
      <button v-if="isEditingActivity" @click="resetActivityForm" class="btn-cancel">Hủy sửa</button>
    </div>

    <form @submit.prevent="submitActivity" class="form-grid">
      <div class="form-group">
        <label>Tên bài viết / Hoạt động</label>
        <input type="text" v-model="activityForm.title" placeholder="Nhập tiêu đề hoạt động..." required />
      </div>
      <div class="form-group">
        <label>Chuyên mục</label>
        <select v-model="activityForm.category">
          <option value="Thi đua">Thi đua quyết thắng</option>
          <option value="Tuyên truyền">Tuyên truyền</option>
          <option value="Văn hóa">Văn hóa - Văn nghệ</option>
          <option value="Hội thao">Hội thao - Thể thao</option>
        </select>
      </div>
      <div class="form-group">
        <label>Ngày giờ đăng</label>
        <input type="datetime-local" v-model="activityForm.created_at" />
      </div>
      <div class="form-group">
        <label>Hình ảnh minh họa</label>
        <input type="file" @change="handleFileChange" accept="image/*" />
      </div>
      <div class="form-group full-width">
        <label>Tóm tắt ngắn</label>
        <input type="text" v-model="activityForm.summary" placeholder="Nhập tóm tắt ngắn gọn..." required />
      </div>
      <div class="form-group full-width">
        <label>Nội dung chi tiết</label>
        <textarea v-model="activityForm.content" rows="4" placeholder="Nhập nội dung chi tiết..."></textarea>
      </div>
      <button type="submit" class="btn-primary">{{ isEditingActivity ? '💾 Cập Nhật Bài Viết' : '🚀 Đăng Bài Lên Hệ Thống' }}</button>
    </form>

    <div class="data-table-container">
      <h4>Danh sách Hoạt động hiện có ({{ activities.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Chuyên mục</th>
              <th>Ngày đăng</th>
              <th>Tóm tắt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in activities" :key="item.id">
              <td><strong>{{ item.title }}</strong></td>
              <td><span class="badge">{{ item.category }}</span></td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>{{ truncate(item.summary, 40) }}</td>
              <td class="action-btns">
                <button @click="editActivity(item)" class="btn-edit">✏️ Sửa</button>
                <button @click="deleteItem('activities', item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="activities.length === 0">
              <td colspan="5" class="no-data">Chưa có hoạt động nào.</td>
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
      activityForm: { title: '', category: 'Thi đua', summary: '', content: '', image: null, created_at: '' },
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
    handleFileChange(e) { this.activityForm.image = e.target.files[0]; },
    editActivity(item) {
      this.isEditingActivity = true;
      this.editActivityId = item.id;
      this.activityForm = { 
        title: item.title, category: item.category, summary: item.summary, content: item.content, image: null, 
        created_at: item.created_at ? item.created_at.slice(0, 16) : '' 
      };
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
        } else { this.$emit('toast', 'Thực hiện thao tác thất bại!', 'error'); }
      } catch (err) { this.$emit('toast', 'Đã xảy ra lỗi hệ thống!', 'error'); }
    },
    async deleteItem(endpoint, id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/${endpoint}/${id}`, { method: 'DELETE', headers: this.getAuthHeaders() });
        if (res.ok) {
          this.$emit('toast', 'Đã xóa bản ghi thành công!', 'success');
          this.$emit('refresh');
        } else { this.$emit('toast', 'Không thể xóa bản ghi này!', 'error'); }
      } catch (err) { this.$emit('toast', 'Đã xảy ra lỗi hệ thống!', 'error'); }
    }
  }
};
</script>

<style scoped>
.tab-pane { display: flex; flex-direction: column; gap: 25px; }
.section-top { display: flex; justify-content: space-between; align-items: center; }
.section-top h3 { margin: 0 0 4px 0; font-size: 1.25rem; color: #fff; }
.subtitle { margin: 0; font-size: 0.85rem; color: #94a3b8; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); padding: 25px; border-radius: 14px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full-width { grid-column: span 2; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
.form-group input, .form-group select, .form-group textarea { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 16px; border-radius: 8px; color: #fff; outline: none; width: 100%; }
.btn-primary { grid-column: span 2; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; background: #334155; color: #fff; }
.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }
</style>
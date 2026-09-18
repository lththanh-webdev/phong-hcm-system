<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Quản Lý Sách</h3>
        <p class="subtitle">{{ isEditingLibrary ? '✏️ Đang chỉnh sửa sách' : '➕ Thêm mới đầu sách' }}</p>
      </div>
      <button v-if="isEditingLibrary" @click="resetLibraryForm" class="btn-cancel">Hủy sửa</button>
    </div>

    <form @submit.prevent="submitLibrary" class="form-grid">
      <div class="form-group">
        <label>Tên Sách</label>
        <input type="text" v-model="libraryForm.title" placeholder="Nhập tên sách..." required />
      </div>
      <div class="form-group">
        <label>Tác giả / Cơ quan biên soạn</label>
        <input type="text" v-model="libraryForm.author" placeholder="Nhập tác giả..." />
      </div>
      <div class="form-group">
        <label>Mảng sách</label>
        <select v-model="libraryForm.category" required>
          <option value="Mảng sách về Đảng">1. Mảng sách về Đảng</option>
          <option value="Mảng sách về Bác Hồ">2. Mảng sách về Bác Hồ</option>
          <option value="Mảng sách về Quân đội">3. Mảng sách về Quân đội</option>
          <option value="Sách về văn học">4. Sách về văn học</option>
          <option value="Sách pháp luật">5. Sách pháp luật</option>
          <option value="Các loại sách khác">6. Các loại sách khác</option>
        </select>
      </div>
      <div class="form-group">
        <label>Ngày giờ đăng</label>
        <input type="datetime-local" v-model="libraryForm.created_at" />
      </div>
      <div class="form-group full-width">
        <label>Nội dung chi tiết & Giới thiệu sách</label>
        <textarea v-model="libraryForm.description" rows="5" placeholder="Nhập nội dung chi tiết..." required></textarea>
      </div>
      <button type="submit" class="btn-primary">{{ isEditingLibrary ? '💾 Cập Nhật Sách' : '📚 Lưu Sách Vào Hệ Thống' }}</button>
    </form>

    <div class="data-table-container">
      <h4>Danh sách Sách ({{ library.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Mảng sách</th>
              <th>Tác giả</th>
              <th>Ngày đăng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in library" :key="item.id">
              <td><strong>{{ item.title }}</strong></td>
              <td><span class="badge">{{ item.category }}</span></td>
              <td>{{ item.author || 'N/A' }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td class="action-btns">
                <button @click="editLibrary(item)" class="btn-edit">✏️ Sửa</button>
                <button @click="deleteItem('library', item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="library.length === 0">
              <td colspan="5" class="no-data">Chưa có đầu sách nào.</td>
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
  props: ['library'],
  data() {
    return {
      libraryForm: { title: '', author: '', category: 'Mảng sách về Đảng', description: '', created_at: '' },
      isEditingLibrary: false,
      editLibraryId: null
    };
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleString('vi-VN');
    },
    getCurrentDateTime() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    },
    editLibrary(item) {
      this.isEditingLibrary = true;
      this.editLibraryId = item.id;
      this.libraryForm = { 
        title: item.title, author: item.author, category: item.category, description: item.description,
        created_at: item.created_at ? item.created_at.slice(0, 16) : '' 
      };
    },
    resetLibraryForm() {
      this.isEditingLibrary = false;
      this.editLibraryId = null;
      this.libraryForm = { title: '', author: '', category: 'Mảng sách về Đảng', description: '', created_at: '' };
    },
    async submitLibrary() {
      try {
        const payload = {
          title: this.libraryForm.title, author: this.libraryForm.author, category: this.libraryForm.category,
          description: this.libraryForm.description, created_at: this.libraryForm.created_at || this.getCurrentDateTime()
        };
        const baseUrl = getApiUrl();
        const url = this.isEditingLibrary ? `${baseUrl}/api/library/${this.editLibraryId}` : `${baseUrl}/api/library`;
        const method = this.isEditingLibrary ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: this.getAuthHeaders(), body: JSON.stringify(payload) });
        if (res.ok) {
          this.$emit('toast', this.isEditingLibrary ? 'Cập nhật sách thành công!' : 'Thêm đầu sách thành công!', 'success');
          this.resetLibraryForm();
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
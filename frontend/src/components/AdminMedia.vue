<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Quản Lý Ca Khúc & Điệu Nhảy</h3>
        <p class="subtitle">{{ isEditingMedia ? '✏️ Đang chỉnh sửa Media' : '🎵 Tải lên tệp âm thanh (MP3) hoặc video (MP4)' }}</p>
      </div>
      <button v-if="isEditingMedia" @click="resetMediaForm" class="btn-cancel">Hủy sửa</button>
    </div>

    <form @submit.prevent="submitMedia" class="form-grid">
      <div class="form-group">
        <label>Tên Bài Hát / Điệu Nhảy</label>
        <input type="text" v-model="mediaForm.title" placeholder="Nhập tên..." required />
      </div>
      <div class="form-group">
        <label>Nghệ sĩ / Đơn vị trình bày</label>
        <input type="text" v-model="mediaForm.artist" placeholder="Nhập nghệ sĩ..." />
      </div>
      <div class="form-group">
        <label>Loại nội dung</label>
        <select v-model="mediaForm.media_type">
          <option value="song">Ca khúc cách mạng</option>
          <option value="dance">Điệu nhảy tập thể</option>
        </select>
      </div>
      <div class="form-group">
        <label>Chọn tệp Media mới (Để trống nếu giữ nguyên)</label>
        <input type="file" @change="handleMediaFileChange" accept="audio/*,video/*" :required="!isEditingMedia" />
      </div>
      <button type="submit" class="btn-primary">{{ isEditingMedia ? '💾 Cập Nhật Media' : '🎵 Tải Lên Media' }}</button>
    </form>

    <div class="data-table-container">
      <h4>Danh sách Ca khúc & Điệu nhảy ({{ media.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Loại</th>
              <th>Nghệ sĩ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in media" :key="item.id">
              <td><strong>{{ item.title }}</strong></td>
              <td><span class="badge" :class="item.media_type">{{ item.media_type === 'song' ? 'Ca khúc' : 'Điệu nhảy' }}</span></td>
              <td>{{ item.artist || 'N/A' }}</td>
              <td class="action-btns">
                <button @click="editMedia(item)" class="btn-edit">✏️ Sửa</button>
                <button @click="deleteItem('media', item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="media.length === 0">
              <td colspan="4" class="no-data">Chưa có tệp media nào.</td>
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
  props: ['media'],
  data() {
    return {
      mediaForm: { title: '', artist: '', media_type: 'song', file: null },
      isEditingMedia: false,
      editMediaId: null
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
    handleMediaFileChange(e) { this.mediaForm.file = e.target.files[0]; },
    editMedia(item) {
      this.isEditingMedia = true;
      this.editMediaId = item.id;
      this.mediaForm = { title: item.title, artist: item.artist, media_type: item.media_type || 'song', file: null };
    },
    resetMediaForm() {
      this.isEditingMedia = false;
      this.editMediaId = null;
      this.mediaForm = { title: '', artist: '', media_type: 'song', file: null };
    },
    async submitMedia() {
      try {
        const formData = new FormData();
        formData.append('title', this.mediaForm.title);
        formData.append('artist', this.mediaForm.artist);
        formData.append('media_type', this.mediaForm.media_type);
        if (this.mediaForm.file) formData.append('file', this.mediaForm.file);

        const baseUrl = getApiUrl();
        const url = this.isEditingMedia ? `${baseUrl}/api/media/${this.editMediaId}` : `${baseUrl}/api/media`;
        const method = this.isEditingMedia ? 'PUT' : 'POST';

        const res = await fetch(url, { method, headers: this.getAuthHeaders(true), body: formData });
        if (res.ok) {
          this.$emit('toast', this.isEditingMedia ? 'Cập nhật Media thành công!' : 'Tải lên tệp Media thành công!', 'success');
          this.resetMediaForm();
          this.$emit('refresh');
        } else { this.$emit('toast', 'Thao tác Media thất bại!', 'error'); }
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
.form-group label { font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
.form-group input, .form-group select { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 16px; border-radius: 8px; color: #fff; outline: none; width: 100%; }
.btn-primary { grid-column: span 2; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #fff; }
.badge.song { background: #0ea5e9; }
.badge.dance { background: #ec4899; }
.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }
</style>
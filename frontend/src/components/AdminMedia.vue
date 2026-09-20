<template>
  <div class="tab-pane admin-media-container">
    <!-- Tiêu đề và Nút Hủy Sửa -->
    <div class="section-top">
      <div class="title-wrapper">
        <div class="hero-badge">🎵 KHO TÀNG ÂM NHẠC &amp; VŨ ĐIỆU</div>
        <h3 class="section-title">Quản Lý Ca Khúc &amp; Điệu Nhảy</h3>
        <p class="subtitle">{{ isEditingMedia ? '✏️ Đang chỉnh sửa thông tin Media' : '📥 Tải lên tệp âm thanh (MP3) hoặc video (MP4) mới' }}</p>
      </div>
      <button v-if="isEditingMedia" @click="resetMediaForm" class="btn-cancel">✕ Hủy Chỉnh Sửa</button>
    </div>

    <!-- Thẻ Thống Kê Nhanh -->
    <div class="stats-overview-grid">
      <div class="stat-mini-card">
        <span class="stat-icon">🎧</span>
        <div class="stat-data">
          <span class="stat-number">{{ media.length }}</span>
          <span class="stat-label">Tổng số Media</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <span class="stat-icon">🎶</span>
        <div class="stat-data">
          <span class="stat-number">{{ songCount }}</span>
          <span class="stat-label">Ca khúc cách mạng</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <span class="stat-icon">💃</span>
        <div class="stat-data">
          <span class="stat-number">{{ danceCount }}</span>
          <span class="stat-label">Điệu nhảy tập thể</span>
        </div>
      </div>
    </div>

    <!-- Form Nhập Liệu Nâng Cao -->
    <form @submit.prevent="submitMedia" class="form-grid-modern">
      <div class="form-group">
        <label>Tên Bài Hát / Điệu Nhảy <span class="required">*</span></label>
        <input type="text" v-model="mediaForm.title" placeholder="Nhập tên bài hát hoặc điệu nhảy..." required />
      </div>

      <div class="form-group">
        <label>Nghệ Sĩ / Đơn Vị Trình Bày</label>
        <input type="text" v-model="mediaForm.artist" placeholder="VD: Tốp ca nam nữ, Đoàn văn công..." />
      </div>

      <div class="form-group">
        <label>Loại Nội Dung <span class="required">*</span></label>
        <select v-model="mediaForm.media_type">
          <option value="song">🎵 Ca khúc cách mạng</option>
          <option value="dance">💃 Điệu nhảy tập thể</option>
        </select>
      </div>

      <div class="form-group">
        <label>Chọn Tệp Media {{ isEditingMedia ? '(Để trống nếu giữ nguyên)' : '(*)' }}</label>
        <div class="file-input-wrapper">
          <input type="file" @change="handleMediaFileChange" accept="audio/*,video/*" :required="!isEditingMedia" id="custom-file" />
        </div>
        <span class="file-hint" v-if="mediaForm.file">Đã chọn: {{ mediaForm.file.name }}</span>
      </div>

      <button type="submit" class="btn-primary-glow full-width">
        {{ isEditingMedia ? '💾 Cập Nhật Thông Tin Media' : '🚀 Tải Lên Tệp Media' }}
      </button>
    </form>

    <!-- Bảng Hiển Thị Dữ Liệu -->
    <div class="data-table-container-modern">
      <div class="table-header-flex">
        <div>
          <h4>Danh Sách Media Trong Hệ Thống ({{ filteredMedia.length }})</h4>
          <p class="table-sub-desc">Quản lý, phát và kiểm duyệt nội dung đa phương tiện</p>
        </div>
        <div class="search-wrapper-modern">
          <span class="search-icon-inside">🔍</span>
          <input type="text" v-model="tableSearch" placeholder="Tìm kiếm tên bài hát, nghệ sĩ..." class="table-search-input-modern" />
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table-modern">
          <thead>
            <tr>
              <th>Tên Tác Phẩm</th>
              <th>Thể Loại</th>
              <th>Nghệ Sĩ / Đơn Vị</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredMedia" :key="item.id || item._id">
              <td><strong class="text-title-highlight">{{ item.title }}</strong></td>
              <td>
                <span :class="['badge-modern', item.media_type]">
                  {{ item.media_type === 'song' ? '🎵 Ca khúc' : '💃 Điệu nhảy' }}
                </span>
              </td>
              <td class="text-author-style">{{ item.artist || 'Chưa cập nhật' }}</td>
              <td class="action-btns-modern text-center">
                <button @click="editMedia(item)" class="btn-edit-modern" title="Chỉnh sửa">✏️ Sửa</button>
                <button @click="deleteItem('media', item.id || item._id)" class="btn-del-modern" title="Xóa bản ghi">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="filteredMedia.length === 0">
              <td colspan="4" class="no-data-state">
                <div class="empty-icon">📭</div>
                <p>Chưa có tệp media nào hoặc không tìm thấy kết quả phù hợp.</p>
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
  name: 'AdminMedia',
  props: {
    media: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableSearch: '',
      mediaForm: { title: '', artist: '', media_type: 'song', file: null },
      isEditingMedia: false,
      editMediaId: null
    };
  },
  computed: {
    songCount() {
      return this.media.filter(item => item.media_type === 'song').length;
    },
    danceCount() {
      return this.media.filter(item => item.media_type === 'dance').length;
    },
    filteredMedia() {
      if (!this.tableSearch.trim()) return this.media;
      const q = this.tableSearch.toLowerCase();
      return this.media.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.artist && item.artist.toLowerCase().includes(q))
      );
    }
  },
  methods: {
    getAuthHeaders(isMultipart = false) {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (!isMultipart) headers['Content-Type'] = 'application/json';
      return headers;
    },
    handleMediaFileChange(e) { 
      this.mediaForm.file = e.target.files[0]; 
    },
    editMedia(item) {
      this.isEditingMedia = true;
      this.editMediaId = item.id || item._id;
      this.mediaForm = { 
        title: item.title || '', 
        artist: item.artist || '', 
        media_type: item.media_type || 'song', 
        file: null 
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        } else { 
          const errData = await res.json().catch(() => ({}));
          this.$emit('toast', errData.error || 'Thao tác Media thất bại!', 'error'); 
        }
      } catch (err) { 
        this.$emit('toast', 'Đã xảy ra lỗi hệ thống kết nối máy chủ!', 'error'); 
      }
    },
    async deleteItem(endpoint, id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi media này?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/${endpoint}/${id}`, { method: 'DELETE', headers: this.getAuthHeaders() });
        if (res.ok) {
          this.$emit('toast', 'Đã xóa bản ghi thành công!', 'success');
          this.$emit('refresh');
        } else { 
          this.$emit('toast', 'Không thể xóa bản ghi này!', 'error'); 
        }
      } catch (err) { 
        this.$emit('toast', 'Đã xảy ra lỗi hệ thống kết nối máy chủ!', 'error'); 
      }
    }
  }
};
</script>

<style scoped>
.admin-media-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-bottom: 40px;
}

/* Header Section */
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(30, 6, 6, 0.85), rgba(15, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.25);
  padding: 22px 28px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.section-title {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
}

.subtitle {
  margin: 0;
  font-size: 0.88rem;
  color: #94a3b8;
}

.btn-cancel {
  background: rgba(100, 116, 139, 0.25);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background: rgba(100, 116, 139, 0.4); }

/* Thẻ Thống Kê Mini */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-mini-card {
  background: linear-gradient(135deg, rgba(25, 5, 5, 0.9), rgba(12, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.stat-icon {
  font-size: 1.6rem;
  background: rgba(255, 215, 0, 0.1);
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.25);
}

.stat-data {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffd700;
}

.stat-label {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Form Nhập Liệu Hiện Đại */
.form-grid-modern {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  background: linear-gradient(145deg, rgba(28, 6, 6, 0.9), rgba(14, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.22);
  padding: 28px;
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
}

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
.required { color: #f87171; }

.form-group input, .form-group select {
  background: rgba(10, 2, 2, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.25);
  padding: 11px 14px;
  border-radius: 10px;
  color: #fff;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group input[type="file"] {
  padding: 8px;
  background: rgba(15, 3, 3, 0.8);
  cursor: pointer;
}

.form-group input:focus, .form-group select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
}

.form-group select option {
  background: #180303;
  color: #f8fafc;
}

.file-hint {
  font-size: 0.78rem;
  color: #34d399;
  font-style: italic;
}

/* Nút Submit */
.btn-primary-glow {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #e11d48 0%, #991b1b 100%);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4);
  margin-top: 6px;
}
.btn-primary-glow:hover {
  filter: brightness(1.15);
  box-shadow: 0 6px 25px rgba(255, 215, 0, 0.3);
}

/* Bảng Dữ Liệu */
.data-table-container-modern {
  background: linear-gradient(145deg, rgba(28, 6, 6, 0.9), rgba(14, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.22);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
}

.table-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  padding-bottom: 16px;
}

.table-header-flex h4 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  color: #ffd700;
  font-weight: 800;
}

.table-sub-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.search-wrapper-modern {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon-inside {
  position: absolute;
  left: 14px;
  font-size: 0.9rem;
}

.table-search-input-modern {
  background: rgba(10, 2, 2, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 10px 16px 10px 40px;
  border-radius: 10px;
  color: #fff;
  outline: none;
  font-size: 0.88rem;
  width: 280px;
  transition: all 0.3s;
}
.table-search-input-modern:focus {
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
}

.table-responsive { width: 100%; overflow-x: auto; }
.data-table-modern {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table-modern th, .data-table-modern td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.data-table-modern th {
  color: #ffd700;
  font-weight: 700;
  background: rgba(14, 2, 2, 0.8);
  white-space: nowrap;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table-modern tbody tr {
  transition: background 0.2s;
}
.data-table-modern tbody tr:hover {
  background: rgba(255, 215, 0, 0.04);
}

.text-title-highlight { color: #f8fafc; font-weight: 700; }
.text-author-style { color: #cbd5e1; }

.badge-modern {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
}
.badge-modern.song {
  background: rgba(14, 165, 233, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(14, 165, 233, 0.35);
}
.badge-modern.dance {
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
  border: 1px solid rgba(236, 72, 153, 0.35);
}

/* Action Buttons */
.action-btns-modern { display: flex; gap: 8px; justify-content: center; }
.btn-edit-modern, .btn-del-modern {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s;
}
.btn-edit-modern {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.35);
}
.btn-edit-modern:hover { background: rgba(59, 130, 246, 0.35); }

.btn-del-modern {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.35);
}
.btn-del-modern:hover { background: rgba(239, 68, 68, 0.35); }

/* No Data State */
.no-data-state {
  text-align: center;
  padding: 40px !important;
  color: #94a3b8;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .form-grid-modern { grid-template-columns: 1fr; }
  .stats-overview-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .table-header-flex { flex-direction: column; align-items: stretch; }
  .table-search-input-modern { width: 100%; }
}
</style>
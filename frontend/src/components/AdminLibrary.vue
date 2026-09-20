<template>
  <div class="tab-pane admin-library-container">
    <!-- Tiêu đề và Tổng quan -->
    <div class="section-top">
      <div class="title-wrapper">
        <div class="hero-badge">📚 QUẢN TRỊ KHO TÀNG TRI THỨC</div>
        <h3 class="section-title">Quản Lý Danh Mục Sách Thư Viện</h3>
        <p class="subtitle">{{ isEditingLibrary ? '✏️ Đang chỉnh sửa thông tin sách' : '➕ Thêm mới đầu sách vào hệ thống dữ liệu' }}</p>
      </div>
      <button v-if="isEditingLibrary" @click="resetLibraryForm" class="btn-cancel">✕ Hủy Chỉnh Sửa</button>
    </div>

    <!-- Thẻ Thống kê Nhanh -->
    <div class="stats-overview-grid">
      <div class="stat-mini-card">
        <span class="stat-icon">📖</span>
        <div class="stat-data">
          <span class="stat-number">{{ library.length }}</span>
          <span class="stat-label">Tổng đầu sách</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <span class="stat-icon">🔍</span>
        <div class="stat-data">
          <span class="stat-number">{{ filteredLibrary.length }}</span>
          <span class="stat-label">Đang hiển thị</span>
        </div>
      </div>
    </div>

    <!-- Form Nhập/Sửa Sách Nâng Cao -->
    <form @submit.prevent="submitLibrary" class="form-grid-modern">
      <div class="form-section-title full-width">
        <span>★ Thông Tin Cơ Bản &amp; Phân Loại</span>
      </div>

      <div class="form-group full-width">
        <label>Tên Sách <span class="required">*</span></label>
        <input type="text" v-model="libraryForm.title" placeholder="Nhập đầy đủ tên sách..." required />
      </div>

      <div class="form-group">
        <label>Tác giả / Cơ quan biên soạn</label>
        <input type="text" v-model="libraryForm.author" placeholder="VD: Nhiều tác giả, Quân ủy Trung ương..." />
      </div>

      <div class="form-group">
        <label>Mảng Sách <span class="required">*</span></label>
        <select v-model="libraryForm.category" required>
          <option value="Mảng sách về Đảng">1. Mảng sách về Đảng</option>
          <option value="Mảng sách về Bác Hồ">2. Mảng sách về Bác Hồ</option>
          <option value="Mảng sách về Quân sự">3. Mảng sách về Quân sự</option>
          <option value="Sách về văn học">4. Sách về văn học</option>
          <option value="Sách pháp luật">5. Sách pháp luật</option>
          <option value="Các loại sách khác">6. Các loại sách khác</option>
        </select>
      </div>

      <div class="form-section-title full-width">
        <span>★ Mã Định Danh &amp; Lưu Trữ</span>
      </div>

      <div class="form-group">
        <label>Số Vào Sổ <span class="required">*</span></label>
        <input type="text" v-model="libraryForm.so_vao_so" placeholder="VD: 0001, 0067..." required />
      </div>

      <div class="form-group">
        <label>Môn Loại <span class="required">*</span></label>
        <input type="text" v-model="libraryForm.mon_loai" placeholder="VD: 32, 3KV4, 895.922..." required />
      </div>

      <div class="form-section-title full-width">
        <span>★ Thông Số Xuất Bản &amp; Vật Lý</span>
      </div>

      <div class="form-group">
        <label>Nơi Xuất Bản</label>
        <input type="text" v-model="libraryForm.noi_xuat_ban" placeholder="VD: Nhà xuất bản QĐND, H..." />
      </div>

      <div class="form-group">
        <label>Năm Xuất Bản</label>
        <input type="number" v-model="libraryForm.nam_xuat_ban" placeholder="VD: 2025, 2026..." />
      </div>

      <div class="form-group">
        <label>Khổ Sách</label>
        <input type="text" v-model="libraryForm.kho_sach" placeholder="VD: 13x19, 16x24..." />
      </div>

      <div class="form-group">
        <label>Số Trang</label>
        <input type="number" v-model="libraryForm.so_trang" placeholder="VD: 208, 484..." />
      </div>

      <div class="form-group">
        <label>Giá Tiền</label>
        <input type="text" v-model="libraryForm.gia_tien" placeholder="VD: 37.000đ, 120.000đ..." />
      </div>

      <div class="form-group">
        <label>Ngày Vào Sổ</label>
        <input type="text" v-model="libraryForm.ngay_vao_so" placeholder="VD: 27/03/26..." />
      </div>

      <div class="form-group">
        <label>Ngày Xuất</label>
        <input type="text" v-model="libraryForm.ngay_xuat" placeholder="VD: 24/03/26..." />
      </div>

      <div class="form-group">
        <label>Phụ Chú</label>
        <input type="text" v-model="libraryForm.phu_chu" placeholder="Ghi chú thêm..." />
      </div>

      <div class="form-group full-width">
        <label>Nội dung chi tiết / Giới thiệu sách</label>
        <textarea v-model="libraryForm.description" rows="3" placeholder="Nhập tóm tắt nội dung cốt lõi của sách..."></textarea>
      </div>

      <button type="submit" class="btn-primary-glow full-width">
        {{ isEditingLibrary ? '💾 Cập Nhật Thông Tin Sách' : '📚 Lưu Sách Vào Thư Viện' }}
      </button>
    </form>

    <!-- Bảng Hiển Thị Dữ Liệu Sách -->
    <div class="data-table-container-modern">
      <div class="table-header-flex">
        <div>
          <h4>Danh Sách Đầu Sách Hệ Thống</h4>
          <p class="table-sub-desc">Quản lý và tra cứu toàn bộ tài liệu hiện có</p>
        </div>
        <div class="search-wrapper-modern">
          <span class="search-icon-inside">🔍</span>
          <input type="text" v-model="tableSearch" placeholder="Tìm kiếm nhanh tên, tác giả, số vào sổ..." class="table-search-input-modern" />
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table-modern">
          <thead>
            <tr>
              <th>Số Vào Sổ</th>
              <th>Tên Sách</th>
              <th>Tác Giả</th>
              <th>Mảng Sách</th>
              <th>Môn Loại</th>
              <th>Nơi XB</th>
              <th>Năm</th>
              <th>Khổ</th>
              <th class="text-center">Trang</th>
              <th class="text-right">Giá Tiền</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredLibrary" :key="item.id || item._id">
              <td><span class="code-badge-gold">{{ item.so_vao_so || '-' }}</span></td>
              <td><strong class="text-title-highlight">{{ item.title }}</strong></td>
              <td class="text-author-style">{{ item.author || '-' }}</td>
              <td><span class="badge-category-pill">{{ item.category }}</span></td>
              <td><span class="cat-tag-mono">{{ item.mon_loai || '-' }}</span></td>
              <td class="text-subtle">{{ item.noi_xuat_ban || '-' }}</td>
              <td class="text-subtle">{{ item.nam_xuat_ban || '-' }}</td>
              <td class="text-subtle">{{ item.kho_sach || '-' }}</td>
              <td class="text-center font-mono">{{ item.so_trang || '-' }}</td>
              <td class="text-right font-mono text-price-glow">{{ item.gia_tien || '-' }}</td>
              <td class="action-btns-modern text-center">
                <button @click="editLibrary(item)" class="btn-edit-modern" title="Chỉnh sửa">✏️ Sửa</button>
                <button @click="deleteItem('library', item.id || item._id)" class="btn-del-modern" title="Xóa sách">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="filteredLibrary.length === 0">
              <td colspan="11" class="no-data-state">
                <div class="empty-icon">📭</div>
                <p>Không tìm thấy đầu sách nào phù hợp với từ khóa tra cứu.</p>
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
  name: 'AdminLibrary',
  props: {
    library: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableSearch: '',
      isEditingLibrary: false,
      editLibraryId: null,
      libraryForm: {
        title: '',
        author: '',
        category: 'Mảng sách về Đảng',
        so_vao_so: '',
        mon_loai: '',
        noi_xuat_ban: '',
        nam_xuat_ban: '',
        kho_sach: '',
        so_trang: '',
        gia_tien: '',
        ngay_vao_so: '',
        ngay_xuat: '',
        phu_chu: '',
        description: ''
      }
    };
  },
  computed: {
    filteredLibrary() {
      if (!this.tableSearch.trim()) return this.library;
      const q = this.tableSearch.toLowerCase();
      return this.library.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.so_vao_so && item.so_vao_so.toLowerCase().includes(q)) ||
        (item.mon_loai && item.mon_loai.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return token 
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } 
        : { 'Content-Type': 'application/json' };
    },

    editLibrary(item) {
      this.isEditingLibrary = true;
      this.editLibraryId = item.id || item._id;
      this.libraryForm = {
        title: item.title || '',
        author: item.author || '',
        category: item.category || 'Mảng sách về Đảng',
        so_vao_so: item.so_vao_so || '',
        mon_loai: item.mon_loai || '',
        noi_xuat_ban: item.noi_xuat_ban || '',
        nam_xuat_ban: item.nam_xuat_ban || '',
        kho_sach: item.kho_sach || '',
        so_trang: item.so_trang || '',
        gia_tien: item.gia_tien || '',
        ngay_vao_so: item.ngay_vao_so || '',
        ngay_xuat: item.ngay_xuat || '',
        phu_chu: item.phu_chu || '',
        description: item.description || ''
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    resetLibraryForm() {
      this.isEditingLibrary = false;
      this.editLibraryId = null;
      this.libraryForm = {
        title: '',
        author: '',
        category: 'Mảng sách về Đảng',
        so_vao_so: '',
        mon_loai: '',
        noi_xuat_ban: '',
        nam_xuat_ban: '',
        kho_sach: '',
        so_trang: '',
        gia_tien: '',
        ngay_vao_so: '',
        ngay_xuat: '',
        phu_chu: '',
        description: ''
      };
    },

    async submitLibrary() {
      try {
        const payload = { ...this.libraryForm };
        const baseUrl = getApiUrl();
        const url = this.isEditingLibrary 
          ? `${baseUrl}/api/library/${this.editLibraryId}` 
          : `${baseUrl}/api/library`;
        const method = this.isEditingLibrary ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.$emit('toast', this.isEditingLibrary ? 'Cập nhật thông tin sách thành công!' : 'Thêm sách mới thành công!', 'success');
          this.resetLibraryForm();
          this.$emit('refresh');
        } else {
          const errData = await res.json().catch(() => ({}));
          this.$emit('toast', errData.error || 'Thao tác không thành công!', 'error');
        }
      } catch (err) {
        this.$emit('toast', 'Đã xảy ra lỗi kết nối máy chủ!', 'error');
      }
    },

    async deleteItem(endpoint, id) {
      if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này khỏi thư viện?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/${endpoint}/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          this.$emit('toast', 'Đã xóa cuốn sách thành công!', 'success');
          this.$emit('refresh');
        } else {
          this.$emit('toast', 'Không thể xóa cuốn sách này!', 'error');
        }
      } catch (err) {
        this.$emit('toast', 'Đã xảy ra lỗi kết nối máy chủ!', 'error');
      }
    }
  }
};
</script>

<style scoped>
.admin-library-container {
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
  grid-template-columns: repeat(2, 1fr);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: linear-gradient(145deg, rgba(28, 6, 6, 0.9), rgba(14, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.22);
  padding: 28px;
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
}

.form-section-title {
  grid-column: 1 / -1;
  color: #ffd700;
  font-weight: 700;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  padding-bottom: 8px;
  margin-top: 6px;
}

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: #cbd5e1; }
.required { color: #f87171; }

.form-group input, .form-group select, .form-group textarea {
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

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
}

.form-group select option {
  background: #180303;
  color: #f8fafc;
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
  margin-top: 10px;
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
  font-size: 0.88rem;
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
.text-subtle { color: #94a3b8; }
.code-badge-gold {
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-weight: 700;
}
.badge-category-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.cat-tag-mono {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-family: monospace;
}

.font-mono { font-family: monospace; }
.text-price-glow { color: #34d399; font-weight: 700; }
.text-center { text-align: center; }
.text-right { text-align: right; }

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
  .form-grid-modern { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .form-grid-modern { grid-template-columns: 1fr; }
  .stats-overview-grid { grid-template-columns: 1fr; }
  .table-header-flex { flex-direction: column; align-items: stretch; }
  .table-search-input-modern { width: 100%; }
}
</style>
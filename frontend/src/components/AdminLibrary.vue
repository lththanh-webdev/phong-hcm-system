<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Quản Lý Danh Mục Sách</h3>
        <p class="subtitle">{{ isEditingLibrary ? '✏️ Đang chỉnh sửa thông tin sách' : '➕ Thêm mới đầu sách vào thư viện' }}</p>
      </div>
      <button v-if="isEditingLibrary" @click="resetLibraryForm" class="btn-cancel">✕ Hủy sửa</button>
    </div>

    <!-- Form Nhập/Sửa Sách đầy đủ 10 trường chính + các trường phụ -->
    <form @submit.prevent="submitLibrary" class="form-grid">
      <!-- 1. Tên sách & Tác giả -->
      <div class="form-group full-width">
        <label>Tên Sách (*)</label>
        <input type="text" v-model="libraryForm.title" placeholder="Nhập tên sách..." required />
      </div>

      <div class="form-group">
        <label>Tác giả / Cơ quan biên soạn</label>
        <input type="text" v-model="libraryForm.author" placeholder="VD: Nhiều tác giả, Phan Văn Giang..." />
      </div>

      <div class="form-group">
        <label>Mảng sách (*)</label>
        <select v-model="libraryForm.category" required>
          <option value="Mảng sách về Đảng">1. Mảng sách về Đảng</option>
          <option value="Mảng sách về Bác Hồ">2. Mảng sách về Bác Hồ</option>
          <option value="Mảng sách về Quân sự">3. Mảng sách về Quân sự</option>
          <option value="Sách về văn học">4. Sách về văn học</option>
          <option value="Sách pháp luật">5. Sách pháp luật</option>
          <option value="Các loại sách khác">6. Các loại sách khác</option>
        </select>
      </div>

      <!-- 2. Số vào sổ & Môn loại -->
      <div class="form-group">
        <label>Số Vào Sổ (*)</label>
        <input type="text" v-model="libraryForm.so_vao_so" placeholder="VD: 0001, 0067..." required />
      </div>

      <div class="form-group">
        <label>Môn Loại (*)</label>
        <input type="text" v-model="libraryForm.mon_loai" placeholder="VD: 32, 3KV4, 895.922..." required />
      </div>

      <!-- 3. Nơi xuất bản & Năm xuất bản -->
      <div class="form-group">
        <label>Nơi Xuất Bản</label>
        <input type="text" v-model="libraryForm.noi_xuat_ban" placeholder="VD: H, TP. Hồ Chí Minh, Bắc Ninh..." />
      </div>

      <div class="form-group">
        <label>Năm Xuất Bản</label>
        <input type="number" v-model="libraryForm.nam_xuat_ban" placeholder="VD: 2025, 2026..." />
      </div>

      <!-- 4. Khổ sách, Số trang, Giá tiền -->
      <div class="form-group">
        <label>Khổ Sách</label>
        <input type="text" v-model="libraryForm.kho_sach" placeholder="VD: 13x19, 16x24, 19x27..." />
      </div>

      <div class="form-group">
        <label>Số Trang</label>
        <input type="number" v-model="libraryForm.so_trang" placeholder="VD: 208, 484..." />
      </div>

      <div class="form-group">
        <label>Giá Tiền</label>
        <input type="text" v-model="libraryForm.gia_tien" placeholder="VD: 37.000đ, 120.000đ..." />
      </div>

      <!-- 5. Ngày vào sổ, Ngày xuất, Phụ chú -->
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
        <input type="text" v-model="libraryForm.phu_chu" placeholder="Nhập ghi chú thêm (nếu có)..." />
      </div>

      <!-- 6. Nội dung chi tiết & Giới thiệu sách -->
      <div class="form-group full-width">
        <label>Nội dung chi tiết / Giới thiệu sách</label>
        <textarea v-model="libraryForm.description" rows="3" placeholder="Nhập tóm tắt nội dung sách..."></textarea>
      </div>

      <button type="submit" class="btn-primary full-width">
        {{ isEditingLibrary ? '💾 Cập Nhật Thông Tin Sách' : '📚 Lưu Sách Vào Thư Viện' }}
      </button>
    </form>

    <!-- Bảng hiển thị danh sách sách đầy đủ các trường -->
    <div class="data-table-container">
      <div class="table-header">
        <h4>Danh sách Sách trong hệ thống ({{ library.length }})</h4>
        <input type="text" v-model="tableSearch" placeholder="🔍 Tìm kiếm nhanh..." class="table-search-input" />
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Số vào sổ</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Mảng sách</th>
              <th>Môn loại</th>
              <th>Nơi XB</th>
              <th>Năm XB</th>
              <th>Khổ</th>
              <th class="text-center">Trang</th>
              <th class="text-right">Giá tiền</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredLibrary" :key="item.id">
              <td><span class="code-badge">{{ item.so_vao_so || '-' }}</span></td>
              <td><strong>{{ item.title }}</strong></td>
              <td>{{ item.author || '-' }}</td>
              <td><span class="badge">{{ item.category }}</span></td>
              <td><span class="cat-tag">{{ item.mon_loai || '-' }}</span></td>
              <td>{{ item.noi_xuat_ban || '-' }}</td>
              <td>{{ item.nam_xuat_ban || '-' }}</td>
              <td>{{ item.kho_sach || '-' }}</td>
              <td class="text-center font-mono">{{ item.so_trang || '-' }}</td>
              <td class="text-right font-mono text-price">{{ item.gia_tien || '-' }}</td>
              <td class="action-btns text-center">
                <button @click="editLibrary(item)" class="btn-edit" title="Chỉnh sửa">✏️ Sửa</button>
                <button @click="deleteItem('library', item.id)" class="btn-del" title="Xóa sách">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="filteredLibrary.length === 0">
              <td colspan="11" class="no-data">Chưa có đầu sách nào hoặc không tìm thấy kết quả phù hợp.</td>
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
      this.editLibraryId = item.id;
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

      // Cuộn lên đầu form khi nhấn sửa
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
.tab-pane { display: flex; flex-direction: column; gap: 25px; }
.section-top { display: flex; justify-content: space-between; align-items: center; }
.section-top h3 { margin: 0 0 4px 0; font-size: 1.3rem; color: #fff; }
.subtitle { margin: 0; font-size: 0.85rem; color: #94a3b8; }

/* Grid Form 3 Cột Hiện Đại */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  border-radius: 14px;
  backdrop-filter: blur(10px);
}
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.83rem; font-weight: 600; color: #cbd5e1; }
.form-group input, .form-group select, .form-group textarea {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.9rem;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Nút Bấm */
.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }

/* Bảng Dữ Liệu */
.data-table-container {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 20px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}
.table-header h4 { margin: 0; font-size: 1.1rem; color: #ffd700; }
.table-search-input {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 14px;
  border-radius: 8px;
  color: #fff;
  outline: none;
  font-size: 0.85rem;
  width: 250px;
}

.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
.data-table th, .data-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.6); white-space: nowrap; }

/* Badges */
.code-badge { background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px; font-family: monospace; color: #e2e8f0; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; background: #334155; color: #fff; }
.cat-tag { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; padding: 3px 8px; border-radius: 6px; font-size: 0.78rem; }

/* Formatting */
.font-mono { font-family: monospace; }
.text-price { color: #38bdf8; font-weight: 600; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Action Buttons */
.action-btns { display: flex; gap: 6px; justify-content: center; }
.btn-edit, .btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }

@media (max-width: 1024px) {
  .form-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
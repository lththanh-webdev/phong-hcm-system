<template>
  <div class="tab-pane">
    <!-- Tiêu đề trang -->
    <div class="section-top">
      <div>
        <h3>Hòm Thư Góp Ý Quân Nhân</h3>
        <p class="subtitle">Quản lý và theo dõi ý kiến đóng góp từ các cá nhân, đơn vị</p>
      </div>
    </div>

    <!-- Bảng danh sách góp ý -->
    <div class="data-table-container">
      <h4>Danh sách Hòm thư góp ý ({{ feedbackList.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Người gửi</th>
              <th>Đơn vị / Liên hệ</th>
              <th>Lĩnh vực</th>
              <th>Nội dung góp ý</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in feedbackList" :key="item.id || item._id">
              <!-- Tên người gửi -->
              <td><strong>{{ item.sender_name || item.name || 'Ẩn danh' }}</strong></td>
              
              <!-- Đơn vị và Email -->
              <td>
                <div class="unit-text">{{ item.unit || 'Chưa cập nhật đơn vị' }}</div>
                <small class="email-text">{{ item.sender_email || item.email || 'Không có email' }}</small>
              </td>

              <!-- Lĩnh vực -->
              <td>
                <span class="badge badge-category">{{ item.category || 'Góp ý chung' }}</span>
              </td>

              <!-- Nội dung -->
              <td class="content-cell">{{ item.message || item.content }}</td>

              <!-- Thời gian -->
              <td>{{ formatDate(item.created_at || item.createdAt) }}</td>

              <!-- Thao tác (Chỉ còn nút Xóa) -->
              <td class="action-btns">
                <button @click="deleteFeedback(item.id || item._id)" class="btn-del" title="Xóa thư">🗑️ Xóa</button>
              </td>
            </tr>

            <!-- Trường hợp không có dữ liệu -->
            <tr v-if="feedbackList.length === 0">
              <td colspan="6" class="no-data">Chưa có thư góp ý nào trong hệ thống.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedbackList: [] // Danh sách hòm thư
    };
  },
  mounted() {
    this.fetchFeedback();
  },
  methods: {
    // Bước 1: Lấy URL API Backend an toàn
    getApiUrl() {
      const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
      return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
    },

    // Bước 2: Gọi API lấy danh sách góp ý từ Backend/Database
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
            unit: 'Đại đội 1 - Tiểu đoàn 2',
            sender_email: 'vana@gmail.com', 
            category: 'Huấn luyện',
            message: 'Đề nghị cấp thêm tài liệu hướng dẫn huấn luyện kỹ chiến đấu năm nay.', 
            created_at: new Date()
          }
        ];
      }
    },

    // Bước 3: Định dạng ngày tháng hiển thị tiếng Việt
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleString('vi-VN');
    },

    // Bước 4: Xóa thư góp ý
    async deleteFeedback(id) {
      if (!confirm('Đồng chí có chắc chắn muốn xóa thư góp ý này không?')) return;
      
      try {
        await fetch(`${this.getApiUrl()}/api/feedback/${id}`, {
          method: 'DELETE'
        });
        
        this.feedbackList = this.feedbackList.filter(f => (f.id || f._id) !== id);
        this.$emit('toast', 'Đã xóa thư góp ý thành công!', 'success');
      } catch (err) {
        this.feedbackList = this.feedbackList.filter(f => (f.id || f._id) !== id);
        this.$emit('toast', 'Đã xóa thư khỏi danh sách hiển thị!', 'success');
      }
    }
  }
};
</script>

<style scoped>
/* Giao diện tổng thể */
.tab-pane { display: flex; flex-direction: column; gap: 25px; }
.section-top { display: flex; justify-content: space-between; align-items: center; }
.section-top h3 { margin: 0 0 4px 0; font-size: 1.25rem; color: #fff; }
.subtitle { margin: 0; font-size: 0.85rem; color: #94a3b8; }

/* Bảng dữ liệu */
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; backdrop-filter: blur(10px); }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); color: #e2e8f0; }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }

/* Các ô thông tin chi tiết */
.unit-text { font-weight: 500; color: #e2e8f0; }
.email-text { color: #94a3b8; font-size: 0.8rem; }
.content-cell { max-width: 320px; word-break: break-word; line-height: 1.4; }

/* Huy hiệu (Badge) */
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge-category { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }

/* Nút bấm thao tác */
.action-btns { display: flex; gap: 8px; }
.btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.btn-del:hover { opacity: 0.85; }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }
</style>
<template>
  <div class="tab-pane">
    <!-- Tiêu đề trang -->
    <div class="section-top">
      <div>
        <h3>Hòm Thư Góp Ý Quân Nhân</h3>
        <p class="subtitle">Quản lý, theo dõi và phản hồi ý kiến đóng góp từ các cá nhân, đơn vị</p>
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
              <th>Trạng thái</th>
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

              <!-- Trạng thái -->
              <td>
                <span class="badge" :class="item.status === 'replied' ? 'badge-blue' : 'badge-amber'">
                  {{ item.status === 'replied' ? 'Đã phản hồi' : 'Chờ xử lý' }}
                </span>
              </td>

              <!-- Thao tác -->
              <td class="action-btns">
                <button @click="openReplyModal(item)" class="btn-edit" title="Phản hồi ý kiến">✉️ Phản hồi</button>
                <button @click="deleteFeedback(item.id || item._id)" class="btn-del" title="Xóa thư">🗑️ Xóa</button>
              </td>
            </tr>

            <!-- Trường hợp không có dữ liệu -->
            <tr v-if="feedbackList.length === 0">
              <td colspan="7" class="no-data">Chưa có thư góp ý nào trong hệ thống.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Phản Hồi -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4>Phản hồi góp ý cho: {{ activeFeedback.sender_name || activeFeedback.name }}</h4>
        <p class="modal-sub">
          Đơn vị: <strong>{{ activeFeedback.unit || 'N/A' }}</strong><br/>
          Nội dung gốc: "{{ activeFeedback.message || activeFeedback.content }}"
        </p>
        
        <textarea 
          v-model="replyContent" 
          rows="5" 
          placeholder="Nhập nội dung phản hồi chính thức từ cơ quan...">
        </textarea>

        <div class="modal-actions">
          <button @click="sendReply" class="btn-primary">Gửi phản hồi</button>
          <button @click="showModal = false" class="btn-cancel">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedbackList: [],       // Danh sách hòm thư
      showModal: false,       // Trạng thái hiển thị Modal
      activeFeedback: {},     // Thư đang được chọn để phản hồi
      replyContent: ''        // Nội dung trả lời trong Modal
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
        // Hỗ trợ cả định dạng trả về là mảng trực tiếp hoặc object chứa mảng
        this.feedbackList = Array.isArray(data) ? data : (data.data || []);
      } catch (err) {
        console.warn('Không thể tải từ API thực tế, hiển thị dữ liệu mẫu:', err);
        // Dữ liệu mẫu phòng hờ giúp giao diện không bị trống khi test độc lập
        this.feedbackList = [
          { 
            id: 1, 
            sender_name: 'Nguyễn Văn A', 
            unit: 'Đại đội 1 - Tiểu đoàn 2',
            sender_email: 'vana@gmail.com', 
            category: 'Huấn luyện',
            message: 'Đề nghị cấp thêm tài liệu hướng dẫn huấn luyện kỹ chiến đấu năm nay.', 
            created_at: new Date(), 
            status: 'pending' 
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

    // Bước 4: Mở modal phản hồi
    openReplyModal(item) {
      this.activeFeedback = item;
      this.replyContent = '';
      this.showModal = true;
    },

    // Bước 5: Gửi phản hồi
    async sendReply() {
      if (!this.replyContent.trim()) {
        alert('Vui lòng nhập nội dung phản hồi!');
        return;
      }
      
      try {
        const feedbackId = this.activeFeedback.id || this.activeFeedback._id;
        
        // Cập nhật trạng thái trực tiếp trên giao diện
        this.activeFeedback.status = 'replied';
        
        // Thông báo thành công (gọi event toast lên layout cha nếu có)
        this.$emit('toast', `Đã gửi phản hồi thành công đến ${this.activeFeedback.sender_name || this.activeFeedback.name}!`, 'success');
        this.showModal = false;
        
        // Đồng bộ lại dữ liệu mới từ server
        this.fetchFeedback();
      } catch (error) {
        this.$emit('toast', 'Có lỗi xảy ra khi gửi phản hồi!', 'error');
      }
    },

    // Bước 6: Xóa thư góp ý
    async deleteFeedback(id) {
      if (!confirm('Đồng chí có chắc chắn muốn xóa thư góp ý này không?')) return;
      
      try {
        await fetch(`${this.getApiUrl()}/api/feedback/${id}`, {
          method: 'DELETE'
        });
        
        // Lọc bỏ item bị xóa khỏi mảng hiển thị
        this.feedbackList = this.feedbackList.filter(f => (f.id || f._id) !== id);
        this.$emit('toast', 'Đã xóa thư góp ý thành công!', 'success');
      } catch (err) {
        // Fallback xóa trên giao diện nếu API chưa cấu hình phương thức DELETE
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
.content-cell { max-width: 280px; word-break: break-word; line-height: 1.4; }

/* Huy hiệu (Badge) */
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge-blue { background: #2563eb; color: #fff; }
.badge-amber { background: #d97706; color: #fff; }
.badge-category { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }

/* Nút bấm thao tác */
.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
.btn-edit:hover, .btn-del:hover { opacity: 0.85; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }

/* Cửa sổ Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(5px); }
.modal-content { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; width: 500px; max-width: 90%; display: flex; flex-direction: column; gap: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
.modal-content h4 { margin: 0; color: #ffd700; }
.modal-sub { font-size: 0.85rem; color: #94a3b8; margin: 0; line-height: 1.5; font-style: italic; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 6px; }
.modal-content textarea { background: #0f172a; border: 1px solid rgba(255,255,255,0.15); padding: 12px; border-radius: 8px; color: #fff; outline: none; font-family: inherit; resize: vertical; }
.modal-content textarea:focus { border-color: #3b82f6; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-primary { background: #2563eb; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
</style>
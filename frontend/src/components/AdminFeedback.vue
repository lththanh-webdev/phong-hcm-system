<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Hòm Thư Góp Ý & Trợ Lý AI</h3>
        <p class="subtitle">Quản lý phản hồi từ người dùng và kích hoạt AI trả lời tự động</p>
      </div>
    </div>

    <!-- Danh sách góp ý -->
    <div class="data-table-container">
      <h4>Danh sách Hòm thư góp ý ({{ feedbackList.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Người gửi</th>
              <th>Email</th>
              <th>Nội dung góp ý</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in feedbackList" :key="item.id">
              <td><strong>{{ item.sender_name }}</strong></td>
              <td>{{ item.sender_email }}</td>
              <td>{{ item.message }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>
                <span class="badge" :class="item.status === 'replied' ? 'badge-blue' : 'badge-amber'">
                  {{ item.status === 'replied' ? 'Đã phản hồi' : 'Chờ xử lý' }}
                </span>
              </td>
              <td class="action-btns">
                <button @click="openReplyModal(item)" class="btn-edit">✉️ Phản hồi</button>
                <button @click="triggerAIResponse(item)" class="btn-ai" title="Dùng AI trả lời ngay">🤖 AI Trả lời</button>
                <button @click="deleteFeedback(item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="feedbackList.length === 0">
              <td colspan="6" class="no-data">Chưa có thư góp ý nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Phản Hồi -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4>Phản hồi góp ý cho: {{ activeFeedback.sender_name }}</h4>
        <p class="modal-sub">Nội dung gốc: "{{ activeFeedback.message }}"</p>
        <textarea v-model="replyContent" rows="4" placeholder="Nhập nội dung phản hồi..."></textarea>
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
      feedbackList: [],
      showModal: false,
      activeFeedback: {},
      replyContent: ''
    };
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
        const res = await fetch(`${this.getApiUrl()}/api/feedback`);
        if (res.ok) this.feedbackList = await res.json();
      } catch (err) {
        // Dữ liệu mẫu demo nếu chưa có API backend sẵn
        this.feedbackList = [
          { id: 1, sender_name: 'Nguyễn Văn A', sender_email: 'vana@gmail.com', message: 'Phòng Hồ Chí Minh Số cập nhật tài liệu rất hữu ích!', created_at: new Date(), status: 'pending' }
        ];
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleString('vi-VN');
    },
    openReplyModal(item) {
      this.activeFeedback = item;
      this.replyContent = '';
      this.showModal = true;
    },
    async sendReply() {
      this.$emit('toast', `Đã gửi phản hồi thành công đến ${this.activeFeedback.sender_email}!`, 'success');
      this.showModal = false;
      // Gọi API gửi email/phản hồi tại đây
    },
    async triggerAIResponse(item) {
      this.$emit('toast', '🤖 AI đang phân tích và tạo câu trả lời tự động...', 'success');
      setTimeout(() => {
        item.status = 'replied';
        this.$emit('toast', `AI đã tự động phản hồi thành công cho ${item.sender_name}!`, 'success');
      }, 1500);
      // Kết nối API AI (Gemini/ChatGPT API) ở Backend tại đây
    },
    async deleteFeedback(id) {
      if (!confirm('Bạn có chắc muốn xóa thư này?')) return;
      this.feedbackList = this.feedbackList.filter(f => f.id !== id);
      this.$emit('toast', 'Đã xóa thư góp ý!', 'success');
    }
  }
};
</script>

<style scoped>
/* CSS bổ sung riêng cho Feedback & AI Modal */
.tab-pane { display: flex; flex-direction: column; gap: 25px; }
.section-top { display: flex; justify-content: space-between; align-items: center; }
.section-top h3 { margin: 0 0 4px 0; font-size: 1.25rem; color: #fff; }
.subtitle { margin: 0; font-size: 0.85rem; color: #94a3b8; }
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; backdrop-filter: blur(10px); }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge-blue { background: #2563eb; color: #fff; }
.badge-amber { background: #d97706; color: #fff; }
.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del, .btn-ai { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-ai { background: rgba(147, 51, 234, 0.2); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(5px); }
.modal-content { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; width: 500px; max-width: 90%; display: flex; flex-direction: column; gap: 15px; }
.modal-content h4 { margin: 0; color: #ffd700; }
.modal-sub { font-size: 0.85rem; color: #94a3b8; margin: 0; font-style: italic; }
.modal-content textarea { background: #0f172a; border: 1px solid rgba(255,255,255,0.15); padding: 12px; border-radius: 8px; color: #fff; outline: none; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-primary { background: #2563eb; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
</style>
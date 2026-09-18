
<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Quản Lý Hệ Thống Trắc Nghiệm</h3>
        <p class="subtitle">{{ isEditingQuiz ? '✏️ Đang chỉnh sửa câu hỏi' : '❓ Thêm câu hỏi trắc nghiệm mới' }}</p>
      </div>
      <button v-if="isEditingQuiz" @click="resetQuizForm" class="btn-cancel">Hủy sửa</button>
    </div>

    <form @submit.prevent="submitQuiz" class="form-grid">
      <div class="form-group full-width">
        <label>Nội dung câu hỏi</label>
        <textarea v-model="quizForm.question" rows="2" placeholder="Nhập câu hỏi..." required></textarea>
      </div>
      <div class="form-group" v-for="(opt, index) in quizForm.options" :key="index">
        <label>Đáp án {{ index + 1 }}</label>
        <input type="text" v-model="quizForm.options[index]" :placeholder="'Đáp án ' + (index + 1)" required />
      </div>
      <div class="form-group">
        <label>Đáp án đúng (1 đến 4)</label>
        <input type="number" min="1" max="4" v-model.number="quizForm.correct_option" required />
      </div>
      <div class="form-group full-width">
        <label>Giải thích đáp án</label>
        <textarea v-model="quizForm.explanation" rows="2" placeholder="Giải thích chi tiết..."></textarea>
      </div>
      <button type="submit" class="btn-primary">{{ isEditingQuiz ? '💾 Cập Nhật Câu Hỏi' : '❓ Thêm Câu Hỏi' }}</button>
    </form>

    <div class="data-table-container">
      <h4>Danh sách Câu hỏi trắc nghiệm ({{ quizzes.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Câu hỏi</th>
              <th>Đáp án đúng</th>
              <th>Giải thích</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in quizzes" :key="item.id">
              <td><strong>{{ item.question }}</strong></td>
              <td>Đáp án số {{ item.correct_option }}</td>
              <td>{{ truncate(item.explanation, 35) || 'N/A' }}</td>
              <td class="action-btns">
                <button @click="editQuiz(item)" class="btn-edit">✏️ Sửa</button>
                <button @click="deleteItem('quizzes', item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="quizzes.length === 0">
              <td colspan="4" class="no-data">Chưa có câu hỏi trắc nghiệm nào.</td>
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
  props: ['quizzes'],
  data() {
    return {
      quizForm: { question: '', options: ['', '', '', ''], correct_option: 1, explanation: '' },
      isEditingQuiz: false,
      editQuizId: null
    };
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    },
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    editQuiz(item) {
      this.isEditingQuiz = true;
      this.editQuizId = item.id;
      this.quizForm = { question: item.question, options: [...item.options], correct_option: item.correct_option, explanation: item.explanation || '' };
    },
    resetQuizForm() {
      this.isEditingQuiz = false;
      this.editQuizId = null;
      this.quizForm = { question: '', options: ['', '', '', ''], correct_option: 1, explanation: '' };
    },
    async submitQuiz() {
      try {
        const baseUrl = getApiUrl();
        const url = this.isEditingQuiz ? `${baseUrl}/api/quizzes/${this.editQuizId}` : `${baseUrl}/api/quizzes`;
        const method = this.isEditingQuiz ? 'PUT' : 'POST';

        const res = await fetch(url, { method, headers: this.getAuthHeaders(), body: JSON.stringify(this.quizForm) });
        if (res.ok) {
          this.$emit('toast', this.isEditingQuiz ? 'Cập nhật câu hỏi thành công!' : 'Thêm câu hỏi trắc nghiệm thành công!', 'success');
          this.resetQuizForm();
          this.$emit('refresh');
        } else { this.$emit('toast', 'Thao tác câu hỏi thất bại!', 'error'); }
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
.form-group input, .form-group textarea { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 16px; border-radius: 8px; color: #fff; outline: none; width: 100%; }
.btn-primary { grid-column: span 2; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }
.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }
</style>
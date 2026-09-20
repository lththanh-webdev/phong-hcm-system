<template>
  <div class="tab-pane admin-quiz-container">
    <!-- Tiêu đề và Nút Hủy Sửa -->
    <div class="section-top">
      <div class="title-wrapper">
        <div class="hero-badge">❓ NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM</div>
        <h3 class="section-title">Quản Lý Hệ Thống Trắc Nghiệm</h3>
        <p class="subtitle">{{ isEditingQuiz ? '✏️ Đang chỉnh sửa câu hỏi trắc nghiệm' : '✍️ Thêm mới câu hỏi và đáp án vào ngân hàng đề' }}</p>
      </div>
      <button v-if="isEditingQuiz" @click="resetQuizForm" class="btn-cancel">✕ Hủy Chỉnh Sửa</button>
    </div>

    <!-- Thẻ Thống Kê Tổng Quan -->
    <div class="stats-overview-grid">
      <div class="stat-mini-card">
        <span class="stat-icon">📚</span>
        <div class="stat-data">
          <span class="stat-number">{{ quizzes.length }}</span>
          <span class="stat-label">Tổng số câu hỏi</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <span class="stat-icon">🎯</span>
        <div class="stat-data">
          <span class="stat-number">4</span>
          <span class="stat-label">Mức độ lựa chọn đáp án</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <span class="stat-icon">💡</span>
        <div class="stat-data">
          <span class="stat-number">{{ explainedCount }}</span>
          <span class="stat-label">Câu có giải thích chi tiết</span>
        </div>
      </div>
    </div>

    <!-- Form Nhập Liệu Trắc Nghiệm Hiện Đại -->
    <form @submit.prevent="submitQuiz" class="form-grid-modern">
      <div class="form-group full-width">
        <label>Nội Dung Câu Hỏi <span class="required">*</span></label>
        <textarea v-model="quizForm.question" rows="3" placeholder="Nhập nội dung câu hỏi trắc nghiệm rõ ràng..." required></textarea>
      </div>

      <!-- Các lựa chọn đáp án -->
      <div class="form-group" v-for="(opt, index) in quizForm.options" :key="index">
        <label>Đáp Án {{ index + 1 }} <span class="required">*</span></label>
        <div class="input-with-badge">
          <span class="option-tag" :class="{ 'correct-tag': quizForm.correct_option === (index + 1) }">ĐA {{ index + 1 }}</span>
          <input type="text" v-model="quizForm.options[index]" :placeholder="'Nhập nội dung đáp án ' + (index + 1) + '...'" required />
        </div>
      </div>

      <div class="form-group">
        <label>Đáp Án Đúng <span class="required">*</span></label>
        <select v-model.number="quizForm.correct_option" class="select-correct-modern" required>
          <option :value="1">🌟 Đáp án số 1</option>
          <option :value="2">🌟 Đáp án số 2</option>
          <option :value="3">🌟 Đáp án số 3</option>
          <option :value="4">🌟 Đáp án số 4</option>
        </select>
        <span class="form-hint">Chọn số thứ tự đáp án chính xác cho câu hỏi này</span>
      </div>

      <div class="form-group full-width">
        <label>Giải Thích Chi Tiết Đáp Án</label>
        <textarea v-model="quizForm.explanation" rows="2" placeholder="Nhập giải thích ngắn gọn, súc tích giúp người học hiểu rõ hơn..."></textarea>
      </div>

      <button type="submit" class="btn-primary-glow full-width">
        {{ isEditingQuiz ? '💾 Cập Nhật Câu Hỏi Trắc Nghiệm' : '🚀 Thêm Câu Hỏi Vào Ngân Hàng' }}
      </button>
    </form>

    <!-- Bảng Danh Sách Trắc Nghiệm -->
    <div class="data-table-container-modern">
      <div class="table-header-flex">
        <div>
          <h4>Danh Sách Câu Hỏi Trắc Nghiệm ({{ filteredQuizzes.length }})</h4>
          <p class="table-sub-desc">Quản lý, chỉnh sửa và kiểm tra các câu hỏi hệ thống</p>
        </div>
        <div class="search-wrapper-modern">
          <span class="search-icon-inside">🔍</span>
          <input type="text" v-model="tableSearch" placeholder="Tìm kiếm nội dung câu hỏi..." class="table-search-input-modern" />
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table-modern">
          <thead>
            <tr>
              <th style="width: 40%;">Nội Dung Câu Hỏi</th>
              <th>Đáp Án Đúng</th>
              <th>Giải Thích</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredQuizzes" :key="item.id || item._id">
              <td>
                <strong class="text-title-highlight">{{ item.question }}</strong>
                <div class="options-mini-preview">
                  <span v-for="(opt, idx) in item.options" :key="idx" :class="['mini-opt-badge', { 'is-correct': item.correct_option === (idx + 1) }]">
                    {{ idx + 1 }}. {{ truncate(opt, 20) }}
                  </span>
                </div>
              </td>
              <td>
                <span class="badge-modern correct-answer-badge">
                  ✨ Đáp án {{ item.correct_option }}
                </span>
              </td>
              <td class="text-author-style">{{ truncate(item.explanation, 40) || 'Chưa có giải thích' }}</td>
              <td class="action-btns-modern text-center">
                <button @click="editQuiz(item)" class="btn-edit-modern" title="Chỉnh sửa câu hỏi">✏️ Sửa</button>
                <button @click="deleteItem('quizzes', item.id || item._id)" class="btn-del-modern" title="Xóa câu hỏi">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="filteredQuizzes.length === 0">
              <td colspan="4" class="no-data-state">
                <div class="empty-icon">📭</div>
                <p>Chưa có câu hỏi trắc nghiệm nào hoặc không tìm thấy kết quả phù hợp.</p>
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
  name: 'AdminQuiz',
  props: {
    quizzes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableSearch: '',
      quizForm: { 
        question: '', 
        options: ['', '', '', ''], 
        correct_option: 1, 
        explanation: '' 
      },
      isEditingQuiz: false,
      editQuizId: null
    };
  },
  computed: {
    explainedCount() {
      return this.quizzes.filter(item => item.explanation && item.explanation.trim().length > 0).length;
    },
    filteredQuizzes() {
      if (!this.tableSearch.trim()) return this.quizzes;
      const q = this.tableSearch.toLowerCase();
      return this.quizzes.filter(item => 
        item.question && item.question.toLowerCase().includes(q)
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
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    editQuiz(item) {
      this.isEditingQuiz = true;
      this.editQuizId = item.id || item._id;
      this.quizForm = { 
        question: item.question || '', 
        options: item.options ? [...item.options] : ['', '', '', ''], 
        correct_option: item.correct_option || 1, 
        explanation: item.explanation || '' 
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    resetQuizForm() {
      this.isEditingQuiz = false;
      this.editQuizId = null;
      this.quizForm = { 
        question: '', 
        options: ['', '', '', ''], 
        correct_option: 1, 
        explanation: '' 
      };
    },
    async submitQuiz() {
      try {
        const baseUrl = getApiUrl();
        const url = this.isEditingQuiz ? `${baseUrl}/api/quizzes/${this.editQuizId}` : `${baseUrl}/api/quizzes`;
        const method = this.isEditingQuiz ? 'PUT' : 'POST';

        const res = await fetch(url, { 
          method, 
          headers: this.getAuthHeaders(), 
          body: JSON.stringify(this.quizForm) 
        });
        
        if (res.ok) {
          this.$emit('toast', this.isEditingQuiz ? 'Cập nhật câu hỏi thành công!' : 'Thêm câu hỏi trắc nghiệm thành công!', 'success');
          this.resetQuizForm();
          this.$emit('refresh');
        } else { 
          const errData = await res.json().catch(() => ({}));
          this.$emit('toast', errData.error || 'Thao tác câu hỏi thất bại!', 'error'); 
        }
      } catch (err) { 
        this.$emit('toast', 'Đã xảy ra lỗi hệ thống kết nối máy chủ!', 'error'); 
      }
    },
    async deleteItem(endpoint, id) {
      if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi trắc nghiệm này?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/${endpoint}/${id}`, { 
          method: 'DELETE', 
          headers: this.getAuthHeaders() 
        });
        if (res.ok) {
          this.$emit('toast', 'Đã xóa câu hỏi thành công!', 'success');
          this.$emit('refresh');
        } else { 
          this.$emit('toast', 'Không thể xóa câu hỏi này!', 'error'); 
        }
      } catch (err) { 
        this.$emit('toast', 'Đã xảy ra lỗi hệ thống kết nối máy chủ!', 'error'); 
      }
    }
  }
};
</script>

<style scoped>
.admin-quiz-container {
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

.form-group input, .form-group textarea, .form-group select {
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

.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
}

.form-group select option {
  background: #180303;
  color: #f8fafc;
}

.input-with-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-tag {
  background: rgba(100, 116, 139, 0.25);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.option-tag.correct-tag {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.4);
}

.form-hint {
  font-size: 0.78rem;
  color: #94a3b8;
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
  vertical-align: top;
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

.text-title-highlight { color: #f8fafc; font-weight: 700; display: block; margin-bottom: 6px; }
.text-author-style { color: #cbd5e1; }

.options-mini-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.mini-opt-badge {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.mini-opt-badge.is-correct {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.35);
  color: #4ade80;
  font-weight: 600;
}

.correct-answer-badge {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.badge-modern {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
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
  white-space: nowrap;
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
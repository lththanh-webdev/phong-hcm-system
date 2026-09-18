<template>
  <div class="tab-pane">
    <div class="section-top">
      <div>
        <h3>Quản Lý Mượn & Trả Sách</h3>
        <p class="subtitle">Theo dõi tình trạng mượn sách, phê duyệt và xác nhận hoàn trả</p>
      </div>
    </div>

    <!-- Bảng danh sách mượn trả -->
    <div class="data-table-container">
      <h4>Danh sách phiếu mượn ({{ borrowList.length }})</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Người mượn</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in borrowList" :key="item.id">
              <td><strong>{{ item.user_name }}</strong></td>
              <td>{{ item.book_title }}</td>
              <td>{{ item.borrow_date }}</td>
              <td>{{ item.due_date }}</td>
              <td>
                <span class="badge" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </td>
              <td class="action-btns">
                <button v-if="item.status === 'pending'" @click="approveBorrow(item)" class="btn-edit">✅ Duyệt</button>
                <button v-if="item.status === 'borrowed'" @click="returnBook(item)" class="btn-ai">🔄 Xác nhận trả</button>
                <button @click="deleteBorrow(item.id)" class="btn-del">🗑️ Xóa</button>
              </td>
            </tr>
            <tr v-if="borrowList.length === 0">
              <td colspan="6" class="no-data">Chưa có yêu cầu mượn sách nào.</td>
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
      borrowList: [
        { id: 1, user_name: 'Thượng Sĩ Trần Văn B', book_title: 'Mảng sách về Đảng', borrow_date: '10/09/2026', due_date: '25/09/2026', status: 'borrowed' },
        { id: 2, user_name: 'Trung Sĩ Lê Văn C', book_title: 'Sách về Bác Hồ', borrow_date: '16/09/2026', due_date: '30/09/2026', status: 'pending' }
      ]
    };
  },
  methods: {
    getStatusClass(status) {
      if (status === 'borrowed') return 'badge-sky';
      if (status === 'returned') return 'badge-blue';
      return 'badge-amber';
    },
    getStatusText(status) {
      if (status === 'borrowed') return 'Đang mượn';
      if (status === 'returned') return 'Đã trả';
      return 'Chờ duyệt';
    },
    approveBorrow(item) {
      item.status = 'borrowed';
      this.$emit('toast', `Đã duyệt phiếu mượn cho ${item.user_name}!`, 'success');
    },
    returnBook(item) {
      item.status = 'returned';
      this.$emit('toast', `Đã xác nhận nhận lại sách từ ${item.user_name}!`, 'success');
    },
    deleteBorrow(id) {
      if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;
      this.borrowList = this.borrowList.filter(b => b.id !== id);
      this.$emit('toast', 'Đã xóa phiếu mượn!', 'success');
    }
  }
};
</script>

<style scoped>
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
.badge-sky { background: #0284c7; color: #fff; }
.badge-amber { background: #d97706; color: #fff; }
.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del, .btn-ai { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-ai { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }
</style>
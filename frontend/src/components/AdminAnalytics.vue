<template>
  <div class="tab-pane dashboard-stats-container">
   

    <!-- Lưới Thẻ Thống Kê Tổng Quan (6 Thẻ) -->
    <div class="stats-cards-grid-modern">
      <div class="stat-card-modern">
        <div class="stat-icon-box bg-blue">🎯</div>
        <div class="stat-info">
          <span class="stat-label">Tổng Hoạt Động</span>
          <h3 class="stat-value">{{ activities.length }}</h3>
        </div>
      </div>
      
      <div class="stat-card-modern">
        <div class="stat-icon-box bg-sky">📚</div>
        <div class="stat-info">
          <span class="stat-label">Quản Lý Sách</span>
          <h3 class="stat-value">{{ library.length }}</h3>
        </div>
      </div>

      <div class="stat-card-modern">
        <div class="stat-icon-box bg-purple">🎶</div>
        <div class="stat-info">
          <span class="stat-label">Ca Khúc & Điệu Nhảy</span>
          <h3 class="stat-value">{{ media.length }}</h3>
        </div>
      </div>

      <div class="stat-card-modern">
        <div class="stat-icon-box bg-amber">❓</div>
        <div class="stat-info">
          <span class="stat-label">Câu Hỏi Trắc Nghiệm</span>
          <h3 class="stat-value">{{ quizzes.length }}</h3>
        </div>
      </div>

      <div class="stat-card-modern">
        <div class="stat-icon-box bg-emerald">📖</div>
        <div class="stat-info">
          <span class="stat-label">Mượn Trả (Đang mượn / Tổng)</span>
          <h3 class="stat-value">{{ currentlyBorrowedBooks }} / {{ books.length || borrowings.length }}</h3>
        </div>
      </div>

      <div class="stat-card-modern">
        <div class="stat-icon-box bg-rose">💬</div>
        <div class="stat-info">
          <span class="stat-label">Ý Kiến Góp Ý</span>
          <h3 class="stat-value">{{ feedbacks.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Bảng Thống Kê Theo Tháng Mở Rộng -->
    <div class="data-table-container-modern">
      <div class="table-header-flex">
        <div>
          <h4>📅 Thống Kê Chi Tiết Dữ Liệu Theo Tháng</h4>
          <p class="table-sub-desc">Tổng hợp tự động sự biến động dữ liệu qua các mốc thời gian</p>
        </div>
        <div class="table-legend">
          <span class="legend-dot"></span> Đang hiển thị theo thời gian mới nhất
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table-modern">
          <thead>
            <tr>
              <th>Tháng / Năm</th>
              <th class="text-center">Hoạt Động</th>
              <th class="text-center">Sách</th>
              <th class="text-center">Ca Khúc/Nhảy</th>
              <th class="text-center">Trắc Nghiệm</th>
              <th class="text-center">Mượn Trả</th>
              <th class="text-center">Góp Ý</th>
              <th class="text-center highlight-col">Tổng Số Lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in monthlyStatistics" :key="stat.month">
              <td>
                <div class="month-pill">
                  <span>📅</span> <strong>Tháng {{ stat.month }}</strong>
                </div>
              </td>
              <td class="text-center"><span class="badge-modern badge-blue">{{ stat.activities }}</span></td>
              <td class="text-center"><span class="badge-modern badge-sky">{{ stat.library }}</span></td>
              <td class="text-center"><span class="badge-modern badge-purple">{{ stat.media }}</span></td>
              <td class="text-center"><span class="badge-modern badge-amber">{{ stat.quizzes }}</span></td>
              <td class="text-center"><span class="badge-modern badge-emerald">{{ stat.borrowings }}</span></td>
              <td class="text-center"><span class="badge-modern badge-rose">{{ stat.feedbacks }}</span></td>
              <td class="text-center highlight-col">
                <strong class="total-number-glow">
                  {{ stat.activities + stat.library + stat.media + stat.quizzes + stat.borrowings + stat.feedbacks }}
                </strong>
              </td>
            </tr>
            <tr v-if="monthlyStatistics.length === 0">
              <td colspan="8" class="no-data-state">
                <div class="empty-icon">📭</div>
                <p>Chưa có dữ liệu thống kê theo thời gian hoặc thiếu mốc thời gian tạo (created_at).</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboardStats',
  props: {
    activities: { type: Array, default: () => [] },
    library: { type: Array, default: () => [] },
    media: { type: Array, default: () => [] },
    quizzes: { type: Array, default: () => [] },
    borrowings: { type: Array, default: () => [] },
    feedbacks: { type: Array, default: () => [] },
    books: { type: Array, default: () => [] } // Bổ sung prop nhận dữ liệu từ bảng books
  },
  computed: {
    // Tính số lượng sách đang được mượn từ bảng books (dựa vào trạng thái status hoặc cờ đánh dấu)
    currentlyBorrowedBooks() {
      if (!this.books || this.books.length === 0) return this.borrowings.length;
      return this.books.filter(item => 
        item.status === 'borrowed' || 
        item.is_borrowed === true || 
        item.status === 'Đang mượn'
      ).length;
    },
    monthlyStatistics() {
      const statsMap = {};
      
      const addItem = (item, type) => {
        const dateVal = item.created_at || item.createdAt || item.date;
        if (!dateVal) return;
        const date = new Date(dateVal);
        if (isNaN(date)) return;
        
        const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        if (!statsMap[monthKey]) {
          statsMap[monthKey] = { 
            month: monthKey, 
            activities: 0, 
            library: 0, 
            media: 0, 
            quizzes: 0, 
            borrowings: 0, 
            feedbacks: 0, 
            sortKey: date.getFullYear() * 100 + date.getMonth() 
          };
        }
        statsMap[monthKey][type]++;
      };

      if (this.activities) this.activities.forEach(item => addItem(item, 'activities'));
      if (this.library) this.library.forEach(item => addItem(item, 'library'));
      if (this.media) this.media.forEach(item => addItem(item, 'media'));
      if (this.quizzes) this.quizzes.forEach(item => addItem(item, 'quizzes'));
      if (this.borrowings) this.borrowings.forEach(item => addItem(item, 'borrowings'));
      if (this.feedbacks) this.feedbacks.forEach(item => addItem(item, 'feedbacks'));
      if (this.books) this.books.forEach(item => addItem(item, 'borrowings'));

      return Object.values(statsMap).sort((a, b) => b.sortKey - a.sortKey);
    }
  }
};
</script>

<style scoped>
.dashboard-stats-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-bottom: 40px;
}

/* Banner Tiêu Đề */
.section-top-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(30, 6, 6, 0.85), rgba(15, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.25);
  padding: 22px 28px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  flex-wrap: wrap;
  gap: 16px;
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

.btn-refresh-glow {
  background: linear-gradient(135deg, #e11d48 0%, #991b1b 100%);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}
.btn-refresh-glow:hover {
  filter: brightness(1.15);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

/* Lưới Thẻ Thống Kê 6 Món */
.stats-cards-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card-modern {
  background: linear-gradient(135deg, rgba(28, 6, 6, 0.9), rgba(14, 2, 2, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.stat-card-modern:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 215, 0, 0.5);
}

.stat-icon-box {
  font-size: 1.6rem;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Màu sắc nền icon */
.bg-blue { background: rgba(37, 99, 235, 0.2); border-color: rgba(37, 99, 235, 0.4); }
.bg-sky { background: rgba(2, 132, 199, 0.2); border-color: rgba(2, 132, 199, 0.4); }
.bg-purple { background: rgba(147, 51, 234, 0.2); border-color: rgba(147, 51, 234, 0.4); }
.bg-amber { background: rgba(217, 119, 6, 0.2); border-color: rgba(217, 119, 6, 0.4); }
.bg-emerald { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); }
.bg-rose { background: rgba(244, 63, 94, 0.2); border-color: rgba(244, 63, 94, 0.4); }

.stat-info { display: flex; flex-direction: column; }
.stat-label { font-size: 0.78rem; color: #94a3b8; margin-bottom: 2px; font-weight: 600; }
.stat-value { font-size: 1.4rem; margin: 0; color: #fff; font-weight: 800; }

/* Bảng Thống Kê Hiện Đại */
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

.table-legend {
  font-size: 0.8rem;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e;
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
  vertical-align: middle;
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

.month-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 6px 12px;
  border-radius: 10px;
  color: #ffd700;
  font-weight: 600;
}

/* Badges */
.badge-modern {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
  min-width: 36px;
}

.badge-blue { background: rgba(37, 99, 235, 0.25); color: #60a5fa; border: 1px solid rgba(37, 99, 235, 0.4); }
.badge-sky { background: rgba(2, 132, 199, 0.25); color: #38bdf8; border: 1px solid rgba(2, 132, 199, 0.4); }
.badge-purple { background: rgba(147, 51, 234, 0.25); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.4); }
.badge-amber { background: rgba(217, 119, 6, 0.25); color: #fbbf24; border: 1px solid rgba(217, 119, 6, 0.4); }
.badge-emerald { background: rgba(16, 185, 129, 0.25); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-rose { background: rgba(244, 63, 94, 0.25); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); }

.highlight-col {
  background: rgba(255, 215, 0, 0.03);
}

.total-number-glow {
  color: #ffd700;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

/* Trạng thái trống */
.no-data-state {
  text-align: center;
  padding: 40px !important;
  color: #94a3b8;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .section-top-banner { flex-direction: column; align-items: stretch; }
  .stats-cards-grid-modern { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .stats-cards-grid-modern { grid-template-columns: 1fr; }
}
</style>
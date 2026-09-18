<template>
  <div class="tab-pane">
    <div class="stats-cards-grid">
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <span>Tổng Hoạt Động</span>
          <h3>{{ activities.length }}</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <span>Quản Lý Sách</span>
          <h3>{{ library.length }}</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎶</div>
        <div class="stat-info">
          <span>Ca Khúc & Điệu Nhảy</span>
          <h3>{{ media.length }}</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">❓</div>
        <div class="stat-info">
          <span>Câu Hỏi Trắc Nghiệm</span>
          <h3>{{ quizzes.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Bảng Thống Kê Theo Tháng -->
    <div class="data-table-container">
      <div class="table-header-flex">
        <h4>📅 Thống Kê Hoạt Động & Dữ Liệu Theo Tháng</h4>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Hoạt Động</th>
              <th>Quản Lý Sách</th>
              <th>Ca Khúc & Điệu Nhảy</th>
              <th>Câu Hỏi Trắc Nghiệm</th>
              <th>Tổng Số Lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in monthlyStatistics" :key="stat.month">
              <td><strong>Tháng {{ stat.month }}</strong></td>
              <td><span class="badge badge-blue">{{ stat.activities }}</span></td>
              <td><span class="badge badge-sky">{{ stat.library }}</span></td>
              <td><span class="badge badge-purple">{{ stat.media }}</span></td>
              <td><span class="badge badge-amber">{{ stat.quizzes }}</span></td>
              <td><strong>{{ stat.activities + stat.library + stat.media + stat.quizzes }}</strong></td>
            </tr>
            <tr v-if="monthlyStatistics.length === 0">
              <td colspan="6" class="no-data">Chưa có dữ liệu thống kê theo tháng.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['activities', 'library', 'media', 'quizzes'],
  computed: {
    monthlyStatistics() {
      const statsMap = {};
      const addItem = (item, type) => {
        if (!item.created_at) return;
        const date = new Date(item.created_at);
        if (isNaN(date)) return;
        const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        if (!statsMap[monthKey]) {
          statsMap[monthKey] = { month: monthKey, activities: 0, library: 0, media: 0, quizzes: 0, sortKey: date.getFullYear() * 100 + date.getMonth() };
        }
        statsMap[monthKey][type]++;
      };

      if (this.activities) this.activities.forEach(item => addItem(item, 'activities'));
      if (this.library) this.library.forEach(item => addItem(item, 'library'));
      if (this.media) this.media.forEach(item => addItem(item, 'media'));
      if (this.quizzes) this.quizzes.forEach(item => addItem(item, 'quizzes'));

      return Object.values(statsMap).sort((a, b) => b.sortKey - a.sortKey);
    }
  }
};
</script>

<style scoped>
.tab-pane { display: flex; flex-direction: column; gap: 25px; }
.stats-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.stat-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 16px; backdrop-filter: blur(10px); }
.stat-icon { font-size: 2.2rem; background: rgba(255, 215, 0, 0.1); padding: 12px; border-radius: 12px; }
.stat-info span { font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 4px; }
.stat-info h3 { font-size: 1.5rem; margin: 0; color: #fff; }
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; backdrop-filter: blur(10px); }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #fff; }
.badge-blue { background: #2563eb; }
.badge-sky { background: #0284c7; }
.badge-purple { background: #9333ea; }
.badge-amber { background: #d97706; }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }
</style>
<template>
  <div class="admin-manage-container">
    <!-- Header Tiêu đề Trang Quản Trị -->
    <div class="admin-hero-banner">
      <div class="hero-glow-effect"></div>
      <div class="badge-tag">⚡ HỆ THỐNG QUẢN TRỊ TẬP TRUNG</div>
      <h2 class="admin-title">QUẢN LÝ & ĐIỀU HÀNH VTHC</h2>
      <p class="admin-subtitle">Cập nhật, kiểm duyệt và quản lý dữ liệu thông minh trên mọi thiết bị</p>
    </div>

    <!-- Thanh Menu Tabs Chuyển đổi nhanh (Tối ưu vuốt ngang trên điện thoại) -->
    <div class="admin-tabs-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.name }}</span>
      </button>
    </div>

    <!-- NỘI DUNG TỪNG TAB -->
    <div class="admin-tab-content-wrapper">

      <!-- TAB 1: THỐNG KÊ TỔNG HỢP -->
      <div v-if="currentTab === 'overview'" class="tab-pane animate-fade">
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in statsList" :key="stat.title">
            <div class="stat-icon-wrap" :style="{ background: stat.bg }">{{ stat.icon }}</div>
            <div class="stat-info">
              <span class="stat-label">{{ stat.title }}</span>
              <h3 class="stat-value">{{ stat.value }}</h3>
            </div>
            <div class="stat-trend">Active 🟢</div>
          </div>
        </div>

        <div class="chart-summary-box">
          <h4 class="box-title">📊 Báo cáo Hoạt động & Dữ liệu Hệ thống</h4>
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Tháng / Kỳ</th>
                  <th>Hoạt Động</th>
                  <th>Quản Lý Sách</th>
                  <th>Ca Khúc</th>
                  <th>Trắc Nghiệm</th>
                  <th>Tổng Số</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fw-bold text-gold">Tháng 09/2026</td>
                  <td><span class="badge-count bg-blue">4</span></td>
                  <td><span class="badge-count bg-green">11</span></td>
                  <td><span class="badge-count bg-purple">1</span></td>
                  <td><span class="badge-count bg-orange">1</span></td>
                  <td class="fw-bold text-white">17</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: QUẢN LÝ HOẠT ĐỘNG -->
      <div v-if="currentTab === 'activities'" class="tab-pane animate-fade">
        <div class="form-card-modern">
          <div class="form-header">
            <h3>📝 Thêm Mới Bài Viết Hoạt Động</h3>
            <span class="form-hint">Nhập thông tin chi tiết bên dưới</span>
          </div>
          
          <div class="form-grid">
            <div class="input-group">
              <label>Tên bài viết / Hoạt động</label>
              <input type="text" v-model="activityForm.title" placeholder="Nhập tiêu đề hoạt động..." />
            </div>
            <div class="input-group">
              <label>Chuyên mục</label>
              <select v-model="activityForm.category">
                <option value="Hội thao">Hội thao & Huấn luyện</option>
                <option value="Chính trị">Sinh hoạt chính trị</option>
                <option value="Văn nghệ">Văn hóa - Văn nghệ</option>
              </select>
            </div>
            <div class="input-group full-width">
              <label>Tóm tắt ngắn gọn</label>
              <textarea v-model="activityForm.summary" rows="2" placeholder="Nhập tóm tắt nổi bật..."></textarea>
            </div>
            <div class="input-group full-width">
              <label>Nội dung chi tiết</label>
              <textarea v-model="activityForm.content" rows="4" placeholder="Nhập nội dung chi tiết bài viết..."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-primary-glow" @click="saveActivity">🚀 Đăng Bài Lên Hệ Thống</button>
          </div>
        </div>
      </div>

      <!-- TAB 3: QUẢN LÝ SÁCH -->
      <div v-if="currentTab === 'books'" class="tab-pane animate-fade">
        <div class="form-card-modern">
          <div class="form-header">
            <h3>📚 Thêm Đầu Sách Mới Vào Thư Viện</h3>
          </div>
          <div class="form-grid">
            <div class="input-group">
              <label>Tên Sách</label>
              <input type="text" v-model="bookForm.title" placeholder="Nhập tên sách..." />
            </div>
            <div class="input-group">
              <label>Tác giả / Cơ quan biên soạn</label>
              <input type="text" v-model="bookForm.author" placeholder="Nhập tên tác giả..." />
            </div>
            <div class="input-group">
              <label>Mảng sách</label>
              <select v-model="bookForm.category">
                <option value="Sách pháp luật">Sách pháp luật</option>
                <option value="Mảng sách về Đảng">Mảng sách về Đảng</option>
                <option value="Mảng sách về Bác Hồ">Mảng sách về Bác Hồ</option>
                <option value="Mảng sách về Quân đội">Mảng sách về Quân đội</option>
                <option value="Sách về văn học">Sách về văn học</option>
              </select>
            </div>
            <div class="input-group full-width">
              <label>Giới thiệu / Nội dung sách</label>
              <textarea v-model="bookForm.description" rows="3" placeholder="Nhập mô tả sách..."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-primary-glow" @click="saveBook">📥 Lưu Sách Vào Hệ Thống</button>
          </div>
        </div>
      </div>

      <!-- TAB 4: CA KHÚC & ĐIỆU NHẢY -->
      <div v-if="currentTab === 'music'" class="tab-pane animate-fade">
        <div class="form-card-modern">
          <div class="form-header">
            <h3>🎵 Quản Lý Ca Khúc & Điệu Nhảy Quân Sự</h3>
          </div>
          <div class="form-grid">
            <div class="input-group">
              <label>Tên Bài Hát / Điệu Nhảy</label>
              <input type="text" placeholder="Nhập tên..." />
            </div>
            <div class="input-group">
              <label>Nghệ sĩ / Đơn vị trình bày</label>
              <input type="text" placeholder="Nhập nghệ sĩ..." />
            </div>
            <div class="input-group">
              <label>Loại nội dung</label>
              <select>
                <option>Ca khúc cách mạng</option>
                <option>Điệu nhảy dân vũ</option>
                <option>Nhạc cụ quân sự</option>
              </select>
            </div>
            <div class="input-group">
              <label>Tệp Media (MP3 / MP4)</label>
              <input type="file" class="file-input-custom" />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-primary-glow">☁️ Tải Lên Media</button>
          </div>
        </div>
      </div>

      <!-- TAB 5: CÂU HỎI TRẮC NGHIỆM -->
      <div v-if="currentTab === 'quiz'" class="tab-pane animate-fade">
        <div class="form-card-modern">
          <div class="form-header">
            <h3>❓ Quản Lý Hệ Thống Trắc Nghiệm</h3>
          </div>
          <div class="form-grid">
            <div class="input-group full-width">
              <label>Nội dung câu hỏi</label>
              <textarea rows="2" placeholder="Nhập câu hỏi trắc nghiệm..."></textarea>
            </div>
            <div class="input-group"><label>Đáp án A</label><input type="text" placeholder="Đáp án 1"></div>
            <div class="input-group"><label>Đáp án B</label><input type="text" placeholder="Đáp án 2"></div>
            <div class="input-group"><label>Đáp án C</label><input type="text" placeholder="Đáp án 3"></div>
            <div class="input-group"><label>Đáp án D</label><input type="text" placeholder="Đáp án 4"></div>
            <div class="input-group">
              <label>Đáp án đúng (1 - 4)</label>
              <input type="number" min="1" max="4" placeholder="Ví dụ: 1">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-primary-glow">➕ Thêm Câu Hỏi Mới</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'overview',
      tabs: [
        { id: 'overview', name: 'Thống kê tổng hợp', icon: '📊' },
        { id: 'activities', name: 'Hoạt động & Phong trào', icon: '🎯' },
        { id: 'books', name: 'Quản lý sách', icon: '📚' },
        { id: 'music', name: 'Ca khúc & Điệu nhảy', icon: '🎵' },
        { id: 'quiz', name: 'Câu hỏi trắc nghiệm', icon: '❓' }
      ],
      statsList: [
        { title: 'Tổng hoạt động', value: '4', icon: '🎯', bg: 'rgba(59, 130, 246, 0.2)' },
        { title: 'Quản lý sách', value: '11', icon: '📚', bg: 'rgba(34, 197, 94, 0.2)' },
        { title: 'Ca khúc & Điệu nhảy', value: '1', icon: '🎵', bg: 'rgba(168, 85, 247, 0.2)' },
        { title: 'Câu hỏi trắc nghiệm', value: '1', icon: '❓', bg: 'rgba(249, 115, 22, 0.2)' }
      ],
      activityForm: { title: '', category: 'Hội thao', summary: '', content: '' },
      bookForm: { title: '', author: '', category: 'Sách pháp luật', description: '' }
    }
  },
  methods: {
    saveActivity() {
      alert('Đã đăng bài viết hoạt động thành công!');
    },
    saveBook() {
      alert('Đã lưu sách vào hệ thống thành công!');
    }
  }
}
</script>

<style scoped>
/* TRANG QUẢN TRỊ HIỆN ĐẠI FULL-WIDTH */
.admin-manage-container {
  width: 100%;
  padding: 30px;
  color: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
  box-sizing: border-box;
}

@media(max-width: 768px) {
  .admin-manage-container { padding: 15px; }
}

/* Hero Banner */
.admin-hero-banner {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(139, 0, 0, 0.25) 100%);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
  overflow: hidden;
}

.hero-glow-effect {
  position: absolute;
  top: -40px; left: 50%;
  transform: translateX(-50%);
  width: 300px; height: 100px;
  background: #ffd700;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
}

.badge-tag {
  display: inline-block;
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.admin-title {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

.admin-subtitle { color: #cbd5e1; font-size: 0.92rem; margin: 0; }

/* Tabs Navigation (Hỗ trợ cuộn mượt trên mobile) */
.admin-tabs-nav {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 25px;
  scrollbar-width: none;
}
.admin-tabs-nav::-webkit-scrollbar { display: none; }

.tab-btn {
  background: rgba(20, 10, 10, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #cbd5e1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border-color: rgba(255, 215, 0, 0.4);
}

.tab-btn.active {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  color: #fff;
  border-color: #ffd700;
  box-shadow: 0 5px 20px rgba(185, 28, 28, 0.4);
}

/* Thẻ Thống kê (Stats Grid) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(145deg, rgba(25, 12, 12, 0.9), rgba(12, 5, 5, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.18);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  transition: transform 0.3s;
}
.stat-card:hover { transform: translateY(-3px); border-color: #ffd700; }

.stat-icon-wrap {
  width: 50px; height: 50px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}

.stat-info { flex: 1; }
.stat-label { font-size: 0.78rem; color: #94a3b8; display: block; margin-bottom: 4px; }
.stat-value { font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0; }
.stat-trend { font-size: 0.72rem; color: #4ade80; font-weight: 700; }

/* Bảng dữ liệu hiện đại */
.chart-summary-box {
  background: rgba(20, 10, 10, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  padding: 20px;
}
.box-title { color: #ffd700; font-size: 1.1rem; margin-top: 0; margin-bottom: 16px; font-weight: 700; }

.table-responsive { width: 100%; overflow-x: auto; }
.modern-table { width: 100%; border-collapse: collapse; text-align: left; }
.modern-table th { background: rgba(255, 215, 0, 0.1); color: #ffd700; padding: 12px 16px; font-size: 0.85rem; font-weight: 700; }
.modern-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.88rem; color: #e2e8f0; }

.badge-count {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}
.bg-blue { background: #3b82f6; }
.bg-green { background: #10b981; }
.bg-purple { background: #8b5cf6; }
.bg-orange { background: #f97316; }

/* Form Card Hiện Đại */
.form-card-modern {
  background: linear-gradient(145deg, rgba(22, 10, 10, 0.9), rgba(10, 4, 4, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
}

.form-header { margin-bottom: 24px; border-bottom: 1px solid rgba(255, 215, 0, 0.15); padding-bottom: 12px; }
.form-header h3 { color: #ffd700; font-size: 1.25rem; font-weight: 800; margin: 0 0 4px 0; }
.form-hint { font-size: 0.8rem; color: #94a3b8; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media(max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group.full-width { grid-column: span 2; }
@media(max-width: 768px) { .input-group.full-width { grid-column: span 1; } }

.input-group label { font-size: 0.85rem; color: #cbd5e1; font-weight: 600; }
.input-group input, .input-group select, .input-group textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #fff;
  font-size: 0.92rem;
  outline: none;
  transition: all 0.3s;
}

.input-group input:focus, .input-group select:focus, .input-group textarea:focus {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.25);
}

.file-input-custom { padding: 8px !important; background: rgba(255,255,255,0.05) !important; cursor: pointer; }

.form-actions { margin-top: 25px; display: flex; justify-content: flex-end; }
.btn-primary-glow {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff;
  border: 1px solid #ffd700;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(217, 119, 6, 0.4);
  transition: 0.3s;
}
.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 215, 0, 0.35);
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

/* Hiệu ứng chuyển tab mượt mà */
.animate-fade {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fw-bold { font-weight: 700; }
.text-gold { color: #ffd700; }
.text-white { color: #fff; }
</style>
<template>
  <div class="admin-layout">
    <!-- Lớp phủ mờ khi mở menu trên điện thoại -->
    <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false"></div>

    <!-- Hệ thống Toast Thông Báo Nổi -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Sidebar Hiện Đại -->
    <aside class="admin-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header">
        <div class="sidebar-brand-icon">⭐</div>
        <h3>QUẢN TRỊ VTHC</h3>
        <p>Phòng Hồ Chí Minh Số</p>
      </div>
      
      <nav class="sidebar-menu">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="switchTab(tab.id)"
          :class="{ active: currentTab === tab.id }"
        >
          <span class="icon">{{ tab.icon }}</span> 
          <span class="label">{{ tab.name }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="avatar">🛡️</div>
          <div class="info">
            <strong>Quản trị viên</strong>
            <span>Hệ thống trực tuyến</span>
          </div>
        </div>
        <button @click="handleLogout" class="btn-logout">🚪 Đăng Xuất</button>
      </div>
    </aside>

    <!-- Khu Vực Nội Dung Chính -->
    <main class="admin-main">
      <header class="main-header">
        <div class="header-title-box">
          <button class="mobile-toggle-btn" @click="toggleSidebar">☰</button>
          <div>
            <h2>{{ currentTitle }}</h2>
            <p class="date-time">Hệ thống quản lý dữ liệu tập trung - Phòng Hồ Chí Minh Số</p>
          </div>
        </div>
        <div class="header-stats-badge">
          <span>🟢 Trạng thái: <strong>Hoạt động ổn định</strong></span>
        </div>
      </header>

      <div class="main-content-wrapper">
        
        <!-- ================= TAB 0: THỐNG KÊ & TỔNG HỢP HÀNG THÁNG ================= -->
        <div v-if="currentTab === 'analytics'" class="tab-pane">
          <div class="stats-cards-grid">
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-info">
                <span>Tổng Hoạt Động</span>
                <h3>{{ activitiesList.length }}</h3>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-info">
                <span>Quản Lý Sách</span>
                <h3>{{ libraryList.length }}</h3>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎶</div>
              <div class="stat-info">
                <span>Ca Khúc & Điệu Nhảy</span>
                <h3>{{ mediaList.length }}</h3>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❓</div>
              <div class="stat-info">
                <span>Câu Hỏi Trắc Nghiệm</span>
                <h3>{{ quizList.length }}</h3>
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

        <!-- ================= TAB 1: QUẢN LÝ HOẠT ĐỘNG ================= -->
        <div v-if="currentTab === 'activities'" class="tab-pane">
          <div class="section-top">
            <div>
              <h3>Quản Lý Hoạt Động & Thi Đua</h3>
              <p class="subtitle">{{ isEditingActivity ? '✏️ Đang chỉnh sửa bài viết' : '➕ Thêm mới bài viết hoạt động' }}</p>
            </div>
            <button v-if="isEditingActivity" @click="resetActivityForm" class="btn-cancel">Hủy sửa</button>
          </div>

          <form @submit.prevent="submitActivity" class="form-grid">
            <div class="form-group">
              <label>Tên bài viết / Hoạt động</label>
              <input type="text" v-model="activityForm.title" placeholder="Nhập tiêu đề hoạt động..." required />
            </div>
            <div class="form-group">
              <label>Chuyên mục</label>
              <select v-model="activityForm.category">
                <option value="Thi đua">Thi đua quyết thắng</option>
                <option value="Tuyên truyền">Tuyên truyền</option>
                <option value="Văn hóa">Văn hóa - Văn nghệ</option>
                <option value="Hội thao">Hội thao - Thể thao</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ngày giờ đăng (Để trống sẽ lấy thời gian hiện tại)</label>
              <input type="datetime-local" v-model="activityForm.created_at" />
            </div>
            <div class="form-group">
              <label>Hình ảnh minh họa</label>
              <input type="file" @change="handleFileChange" accept="image/*" />
            </div>
            <div class="form-group full-width">
              <label>Tóm tắt ngắn</label>
              <input type="text" v-model="activityForm.summary" placeholder="Nhập tóm tắt ngắn gọn..." required />
            </div>
            <div class="form-group full-width">
              <label>Nội dung chi tiết</label>
              <textarea v-model="activityForm.content" rows="4" placeholder="Nhập nội dung chi tiết..."></textarea>
            </div>
            <button type="submit" class="btn-primary">{{ isEditingActivity ? '💾 Cập Nhật Bài Viết' : '🚀 Đăng Bài Lên Hệ Thống' }}</button>
          </form>

          <div class="data-table-container">
            <h4>Danh sách Hoạt động hiện có ({{ activitiesList.length }})</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Chuyên mục</th>
                    <th>Ngày đăng</th>
                    <th>Tóm tắt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in activitiesList" :key="item.id">
                    <td><strong>{{ item.title }}</strong></td>
                    <td><span class="badge">{{ item.category }}</span></td>
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td>{{ truncate(item.summary, 40) }}</td>
                    <td class="action-btns">
                      <button @click="editActivity(item)" class="btn-edit">✏️ Sửa</button>
                      <button @click="deleteItem('activities', item.id)" class="btn-del">🗑️ Xóa</button>
                    </td>
                  </tr>
                  <tr v-if="activitiesList.length === 0">
                    <td colspan="5" class="no-data">Chưa có hoạt động nào.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= TAB 2: QUẢN LÝ SÁCH ================= -->
        <div v-if="currentTab === 'library'" class="tab-pane">
          <div class="section-top">
            <div>
              <h3>Quản Lý Sách</h3>
              <p class="subtitle">{{ isEditingLibrary ? '✏️ Đang chỉnh sửa sách' : '➕ Thêm mới đầu sách' }}</p>
            </div>
            <button v-if="isEditingLibrary" @click="resetLibraryForm" class="btn-cancel">Hủy sửa</button>
          </div>

          <form @submit.prevent="submitLibrary" class="form-grid">
            <div class="form-group">
              <label>Tên Sách</label>
              <input type="text" v-model="libraryForm.title" placeholder="Nhập tên sách..." required />
            </div>
            <div class="form-group">
              <label>Tác giả / Cơ quan biên soạn</label>
              <input type="text" v-model="libraryForm.author" placeholder="Nhập tác giả..." />
            </div>
            <div class="form-group">
              <label>Mảng sách</label>
              <select v-model="libraryForm.category" required>
                <option value="Mảng sách về Đảng">1. Mảng sách về Đảng</option>
                <option value="Mảng sách về Bác Hồ">2. Mảng sách về Bác Hồ</option>
                <option value="Mảng sách về Quân đội">3. Mảng sách về Quân đội</option>
                <option value="Sách về văn học">4. Sách về văn học</option>
                <option value="Sách pháp luật">5. Sách pháp luật</option>
                <option value="Các loại sách khác">6. Các loại sách khác</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ngày giờ đăng</label>
              <input type="datetime-local" v-model="libraryForm.created_at" />
            </div>
            <div class="form-group full-width">
              <label>Nội dung chi tiết & Giới thiệu sách</label>
              <textarea v-model="libraryForm.description" rows="5" placeholder="Nhập nội dung chi tiết..." required></textarea>
            </div>
            <button type="submit" class="btn-primary">{{ isEditingLibrary ? '💾 Cập Nhật Sách' : '📚 Lưu Sách Vào Hệ Thống' }}</button>
          </form>

          <div class="data-table-container">
            <h4>Danh sách Sách ({{ libraryList.length }})</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>Mảng sách</th>
                    <th>Tác giả</th>
                    <th>Ngày đăng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in libraryList" :key="item.id">
                    <td><strong>{{ item.title }}</strong></td>
                    <td><span class="badge">{{ item.category }}</span></td>
                    <td>{{ item.author || 'N/A' }}</td>
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td class="action-btns">
                      <button @click="editLibrary(item)" class="btn-edit">✏️ Sửa</button>
                      <button @click="deleteItem('library', item.id)" class="btn-del">🗑️ Xóa</button>
                    </td>
                  </tr>
                  <tr v-if="libraryList.length === 0">
                    <td colspan="5" class="no-data">Chưa có đầu sách nào.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= TAB 3: QUẢN LÝ MEDIA (MP3/MP4) ================= -->
        <div v-if="currentTab === 'media'" class="tab-pane">
          <div class="section-top">
            <div>
              <h3>Quản Lý Ca Khúc & Điệu Nhảy</h3>
              <p class="subtitle">{{ isEditingMedia ? '✏️ Đang chỉnh sửa Media' : '🎵 Tải lên tệp âm thanh (MP3) hoặc video (MP4)' }}</p>
            </div>
            <button v-if="isEditingMedia" @click="resetMediaForm" class="btn-cancel">Hủy sửa</button>
          </div>

          <form @submit.prevent="submitMedia" class="form-grid">
            <div class="form-group">
              <label>Tên Bài Hát / Điệu Nhảy</label>
              <input type="text" v-model="mediaForm.title" placeholder="Nhập tên..." required />
            </div>
            <div class="form-group">
              <label>Nghệ sĩ / Đơn vị trình bày</label>
              <input type="text" v-model="mediaForm.artist" placeholder="Nhập nghệ sĩ..." />
            </div>
            <div class="form-group">
              <label>Loại nội dung</label>
              <select v-model="mediaForm.media_type">
                <option value="song">Ca khúc cách mạng</option>
                <option value="dance">Điệu nhảy tập thể</option>
              </select>
            </div>
            <div class="form-group">
              <label>Chọn tệp Media mới (Để trống nếu giữ nguyên khi sửa)</label>
              <input type="file" @change="handleMediaFileChange" accept="audio/*,video/*" :required="!isEditingMedia" />
            </div>
            <button type="submit" class="btn-primary">{{ isEditingMedia ? '💾 Cập Nhật Media' : '🎵 Tải Lên Media' }}</button>
          </form>

          <div class="data-table-container">
            <h4>Danh sách Ca khúc & Điệu nhảy ({{ mediaList.length }})</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Nghệ sĩ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in mediaList" :key="item.id">
                    <td><strong>{{ item.title }}</strong></td>
                    <td><span class="badge" :class="item.media_type">{{ item.media_type === 'song' ? 'Ca khúc' : 'Điệu nhảy' }}</span></td>
                    <td>{{ item.artist || 'N/A' }}</td>
                    <td class="action-btns">
                      <button @click="editMedia(item)" class="btn-edit">✏️ Sửa</button>
                      <button @click="deleteItem('media', item.id)" class="btn-del">🗑️ Xóa</button>
                    </td>
                  </tr>
                  <tr v-if="mediaList.length === 0">
                    <td colspan="4" class="no-data">Chưa có tệp media nào.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= TAB 4: QUẢN LÝ TRẮC NGHIỆM ================= -->
        <div v-if="currentTab === 'quiz'" class="tab-pane">
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
            <h4>Danh sách Câu hỏi trắc nghiệm ({{ quizList.length }})</h4>
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
                  <tr v-for="item in quizList" :key="item.id">
                    <td><strong>{{ item.question }}</strong></td>
                    <td>Đáp án số {{ item.correct_option }}</td>
                    <td>{{ truncate(item.explanation, 35) || 'N/A' }}</td>
                    <td class="action-btns">
                      <button @click="editQuiz(item)" class="btn-edit">✏️ Sửa</button>
                      <button @click="deleteItem('quizzes', item.id)" class="btn-del">🗑️ Xóa</button>
                    </td>
                  </tr>
                  <tr v-if="quizList.length === 0">
                    <td colspan="4" class="no-data">Chưa có câu hỏi trắc nghiệm nào.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
const getApiUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
  return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
};

export default {
  data() {
    return {
      currentTab: 'analytics',
      isMobileMenuOpen: false,
      tabs: [
        { id: 'analytics', name: 'Thống kê Tổng hợp', icon: '📊' },
        { id: 'activities', name: 'Hoạt Động & Phong Trào', icon: '🎯' },
        { id: 'library', name: 'Quản lý sách', icon: '📚' },
        { id: 'media', name: 'Ca Khúc & Điệu Nhảy', icon: '🎶' },
        { id: 'quiz', name: 'Câu Hỏi Trắc Nghiệm', icon: '❓' }
      ],
      activitiesList: [],
      libraryList: [],
      mediaList: [],
      quizList: [],

      activityForm: { title: '', category: 'Thi đua', summary: '', content: '', image: null, created_at: '' },
      isEditingActivity: false,
      editActivityId: null,

      libraryForm: { title: '', author: '', category: 'Mảng sách về Đảng', description: '', created_at: '' },
      isEditingLibrary: false,
      editLibraryId: null,

      mediaForm: { title: '', artist: '', media_type: 'song', file: null },
      isEditingMedia: false,
      editMediaId: null,

      quizForm: { question: '', options: ['', '', '', ''], correct_option: 1, explanation: '' },
      isEditingQuiz: false,
      editQuizId: null,

      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      toastTimeout: null
    };
  },
  computed: {
    currentTitle() {
      const active = this.tabs.find(t => t.id === this.currentTab);
      return active ? active.name : 'Quản Trị Hệ Thống';
    },
    monthlyStatistics() {
      const statsMap = {};

      const addItem = (item, type) => {
        if (!item.created_at) return;
        const date = new Date(item.created_at);
        if (isNaN(date)) return;
        const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        if (!statsMap[monthKey]) {
          statsMap[monthKey] = { 
            month: monthKey, 
            activities: 0, 
            library: 0, 
            media: 0, 
            quizzes: 0, 
            sortKey: date.getFullYear() * 100 + date.getMonth() 
          };
        }
        statsMap[monthKey][type]++;
      };

      this.activitiesList.forEach(item => addItem(item, 'activities'));
      this.libraryList.forEach(item => addItem(item, 'library'));
      if (this.mediaList) this.mediaList.forEach(item => addItem(item, 'media'));
      if (this.quizList) this.quizList.forEach(item => addItem(item, 'quizzes'));

      return Object.values(statsMap).sort((a, b) => b.sortKey - a.sortKey);
    }
  },
  mounted() {
    this.fetchAllData();
  },
  methods: {
    toggleSidebar() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    showToast(message, type = 'success') {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toast = { show: true, message, type };
      this.toastTimeout = setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    getAuthHeaders(isMultipart = false) {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
      }
      return headers;
    },
    switchTab(tabId) {
      this.currentTab = tabId;
      this.isMobileMenuOpen = false;
      this.fetchAllData();
    },
    async fetchAllData() {
      try {
        const baseUrl = getApiUrl();
        const headers = this.getAuthHeaders();
        const [actRes, libRes, medRes, quizRes] = await Promise.all([
          fetch(`${baseUrl}/api/activities`, { headers }),
          fetch(`${baseUrl}/api/library`, { headers }),
          fetch(`${baseUrl}/api/media`, { headers }),
          fetch(`${baseUrl}/api/quizzes`, { headers })
        ]);
        if (actRes.ok) this.activitiesList = await actRes.json();
        if (libRes.ok) this.libraryList = await libRes.json();
        if (medRes.ok) this.mediaList = await medRes.json();
        if (quizRes.ok) this.quizList = await quizRes.json();
      } catch (err) {
        console.error('Lỗi tải dữ liệu admin:', err);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleString('vi-VN');
    },
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    // --- Activities CRUD ---
    handleFileChange(e) { this.activityForm.image = e.target.files[0]; },
    editActivity(item) {
      this.isEditingActivity = true;
      this.editActivityId = item.id;
      this.activityForm = { 
        title: item.title, 
        category: item.category, 
        summary: item.summary, 
        content: item.content, 
        image: null, 
        created_at: item.created_at ? item.created_at.slice(0, 16) : '' 
      };
    },
    resetActivityForm() {
      this.isEditingActivity = false;
      this.editActivityId = null;
      this.activityForm = { title: '', category: 'Thi đua', summary: '', content: '', image: null, created_at: '' };
    },
    async submitActivity() {
      try {
        const formData = new FormData();
        formData.append('title', this.activityForm.title);
        formData.append('category', this.activityForm.category);
        formData.append('summary', this.activityForm.summary);
        formData.append('content', this.activityForm.content);
        formData.append('created_at', this.activityForm.created_at || this.getCurrentDateTime());
        if (this.activityForm.image) formData.append('image', this.activityForm.image);

        const baseUrl = getApiUrl();
        const url = this.isEditingActivity ? `${baseUrl}/api/activities/${this.editActivityId}` : `${baseUrl}/api/activities`;
        const method = this.isEditingActivity ? 'PUT' : 'POST';

        const res = await fetch(url, { method, headers: this.getAuthHeaders(true), body: formData });
        if (res.ok) {
          this.showToast(this.isEditingActivity ? 'Cập nhật hoạt động thành công!' : 'Thêm hoạt động thành công!', 'success');
          this.resetActivityForm();
          this.fetchAllData();
        } else { 
          this.showToast('Thực hiện thao tác thất bại!', 'error'); 
        }
      } catch (err) { 
        console.error(err); 
        this.showToast('Đã xảy ra lỗi hệ thống!', 'error');
      }
    },

    // --- Library CRUD ---
    editLibrary(item) {
      this.isEditingLibrary = true;
      this.editLibraryId = item.id;
      this.libraryForm = { 
        title: item.title, 
        author: item.author, 
        category: item.category, 
        description: item.description,
        created_at: item.created_at ? item.created_at.slice(0, 16) : '' 
      };
    },
    resetLibraryForm() {
      this.isEditingLibrary = false;
      this.editLibraryId = null;
      this.libraryForm = { title: '', author: '', category: 'Mảng sách về Đảng', description: '', created_at: '' };
    },
    async submitLibrary() {
      try {
        const payload = {
          title: this.libraryForm.title,
          author: this.libraryForm.author,
          category: this.libraryForm.category,
          description: this.libraryForm.description,
          created_at: this.libraryForm.created_at || this.getCurrentDateTime()
        };
        const baseUrl = getApiUrl();
        const url = this.isEditingLibrary ? `${baseUrl}/api/library/${this.editLibraryId}` : `${baseUrl}/api/library`;
        const method = this.isEditingLibrary ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: this.getAuthHeaders(false),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          this.showToast(this.isEditingLibrary ? 'Cập nhật sách thành công!' : 'Thêm đầu sách thành công!', 'success');
          this.resetLibraryForm();
          this.fetchAllData();
        } else { 
          this.showToast('Thực hiện thao tác thất bại!', 'error'); 
        }
      } catch (err) { 
        console.error(err); 
        this.showToast('Đã xảy ra lỗi hệ thống!', 'error');
      }
    },

    // --- Media CRUD ---
    handleMediaFileChange(e) { this.mediaForm.file = e.target.files[0]; },
    editMedia(item) {
      this.isEditingMedia = true;
      this.editMediaId = item.id;
      this.mediaForm = {
        title: item.title,
        artist: item.artist,
        media_type: item.media_type || 'song',
        file: null
      };
    },
    resetMediaForm() {
      this.isEditingMedia = false;
      this.editMediaId = null;
      this.mediaForm = { title: '', artist: '', media_type: 'song', file: null };
    },
    async submitMedia() {
      try {
        const formData = new FormData();
        formData.append('title', this.mediaForm.title);
        formData.append('artist', this.mediaForm.artist);
        formData.append('media_type', this.mediaForm.media_type);
        if (this.mediaForm.file) formData.append('file', this.mediaForm.file);

        const baseUrl = getApiUrl();
        const url = this.isEditingMedia ? `${baseUrl}/api/media/${this.editMediaId}` : `${baseUrl}/api/media`;
        const method = this.isEditingMedia ? 'PUT' : 'POST';

        const res = await fetch(url, { method, headers: this.getAuthHeaders(true), body: formData });
        if (res.ok) {
          this.showToast(this.isEditingMedia ? 'Cập nhật Media thành công!' : 'Tải lên tệp Media thành công!', 'success');
          this.resetMediaForm();
          this.fetchAllData();
        } else { 
          this.showToast('Thao tác Media thất bại!', 'error'); 
        }
      } catch (err) { 
        console.error(err); 
        this.showToast('Đã xảy ra lỗi hệ thống!', 'error');
      }
    },

    // --- Quiz CRUD ---
    editQuiz(item) {
      this.isEditingQuiz = true;
      this.editQuizId = item.id;
      this.quizForm = {
        question: item.question,
        options: [...item.options],
        correct_option: item.correct_option,
        explanation: item.explanation || ''
      };
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

        const res = await fetch(url, {
          method,
          headers: this.getAuthHeaders(false),
          body: JSON.stringify(this.quizForm)
        });
        if (res.ok) {
          this.showToast(this.isEditingQuiz ? 'Cập nhật câu hỏi thành công!' : 'Thêm câu hỏi trắc nghiệm thành công!', 'success');
          this.resetQuizForm();
          this.fetchAllData();
        } else { 
          this.showToast('Thao tác câu hỏi thất bại!', 'error'); 
        }
      } catch (err) { 
        console.error(err); 
        this.showToast('Đã xảy ra lỗi hệ thống!', 'error');
      }
    },

    // --- Delete Generic ---
    async deleteItem(endpoint, id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/${endpoint}/${id}`, { method: 'DELETE', headers: this.getAuthHeaders() });
        if (res.ok) {
          this.showToast('Đã xóa bản ghi thành công!', 'success');
          this.fetchAllData();
        } else { 
          this.showToast('Không thể xóa bản ghi này!', 'error'); 
        }
      } catch (err) { 
        console.error(err); 
        this.showToast('Đã xảy ra lỗi hệ thống!', 'error');
      }
    },

    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('loginDate');
      this.$router.push('/admin/login');
    }
  }
};
</script>

<style scoped>
/* Reset & Layout cơ bản */
.admin-layout { 
  display: flex; 
  min-height: 100vh; 
  background-color: #0b132b; 
  color: #edf2f4; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  position: relative; 
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
}

/* Toast Notifications */
.toast-notification {
  position: fixed;
  top: 25px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
}
.toast-notification.success { background: rgba(22, 163, 74, 0.95); color: #fff; }
.toast-notification.error { background: rgba(220, 38, 38, 0.95); color: #fff; }
.toast-icon { font-size: 1.2rem; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(-20px) scale(0.95); }

/* Sidebar */
.admin-sidebar { 
  width: 280px; 
  background-color: rgba(15, 23, 42, 0.98); 
  border-right: 1px solid rgba(255, 215, 0, 0.15); 
  display: flex; 
  flex-direction: column; 
  z-index: 1000;
  transition: transform 0.3s ease;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 900;
  backdrop-filter: blur(4px);
}
.sidebar-header { padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sidebar-brand-icon { font-size: 2.2rem; margin-bottom: 8px; }
.sidebar-header h3 { font-size: 1.1rem; color: #ffd700; margin: 0 0 4px 0; letter-spacing: 1px; }
.sidebar-header p { font-size: 0.75rem; color: #8d99ae; margin: 0; }
.sidebar-menu { flex: 1; padding: 20px 0; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
.sidebar-menu button { width: 100%; padding: 14px 24px; background: none; border: none; color: #94a3b8; text-align: left; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease; font-weight: 600; }
.sidebar-menu button:hover, .sidebar-menu button.active { background-color: rgba(37, 99, 235, 0.2); color: #fff; border-left: 4px solid #ffd700; }
.sidebar-menu button .icon { font-size: 1.2rem; }
.sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(11, 19, 43, 0.5); }
.admin-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.admin-profile .avatar { font-size: 1.8rem; background: rgba(255,215,0,0.1); padding: 8px; border-radius: 10px; }
.admin-profile .info strong { display: block; font-size: 0.9rem; color: #fff; }
.admin-profile .info span { font-size: 0.75rem; color: #38bdf8; }
.btn-logout { width: 100%; padding: 10px; background-color: #da251d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-logout:hover { background-color: #b91c1c; }

/* Main layout */
.admin-main { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  overflow-y: auto; 
  width: 100%; 
  min-width: 0; 
  margin-left: 280px; 
}
.main-header { 
  height: 75px; 
  background: rgba(15, 23, 42, 0.85); 
  backdrop-filter: blur(10px); 
  border-bottom: 1px solid rgba(255, 215, 0, 0.15); 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 0 35px; 
  position: sticky; 
  top: 0; 
  z-index: 50; 
  gap: 15px; 
}
.header-title-box { display: flex; align-items: center; gap: 12px; min-width: 0; }
.mobile-toggle-btn {
  display: none;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #ffd700;
  font-size: 1.5rem;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.main-header h2 { font-size: 1.35rem; color: #ffd700; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.date-time { font-size: 0.75rem; color: #8d99ae; margin: 2px 0 0 0; }
.header-stats-badge { font-size: 0.85rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 20px; color: #34d399; white-space: nowrap; }

/* Main Content Wrapper & Sections */
.main-content-wrapper { padding: 30px; width: 100%; max-width: 1400px; margin: 0 auto; }
.tab-pane { display: flex; flex-direction: column; gap: 25px; }
.section-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
.section-top h3 { margin: 0 0 4px 0; font-size: 1.25rem; color: #fff; }
.subtitle { margin: 0; font-size: 0.85rem; color: #94a3b8; }

/* Stats Cards Grid */
.stats-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.stat-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 16px; backdrop-filter: blur(10px); transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-3px); border-color: rgba(255, 215, 0, 0.3); }
.stat-icon { font-size: 2.2rem; background: rgba(255, 215, 0, 0.1); padding: 12px; border-radius: 12px; }
.stat-info span { font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 4px; }
.stat-info h3 { font-size: 1.5rem; margin: 0; color: #fff; }

/* Forms Styling */
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); padding: 25px; border-radius: 14px; backdrop-filter: blur(10px); }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full-width { grid-column: span 2; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
.form-group input, .form-group select, .form-group textarea { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 16px; border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none; transition: border-color 0.2s; width: 100%; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #ffd700; }
.btn-primary { grid-column: span 2; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.9; }
.btn-cancel { background: #64748b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-cancel:hover { background: #475569; }

/* Data Tables */
.data-table-container { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; backdrop-filter: blur(10px); }
.data-table-container h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: #ffd700; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; min-width: 600px; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.data-table th { color: #94a3b8; font-weight: 600; background: rgba(15, 23, 42, 0.4); }
.data-table tbody tr:hover { background: rgba(255, 255, 255, 0.02); }
.no-data { text-align: center; color: #8d99ae; padding: 25px !important; }

/* Badges & Action Buttons */
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; background: #334155; color: #fff; }
.badge-blue { background: #2563eb; }
.badge-sky { background: #0284c7; }
.badge-purple { background: #9333ea; }
.badge-amber { background: #d97706; }
.badge.song { background: #0ea5e9; }
.badge.dance { background: #ec4899; }

.action-btns { display: flex; gap: 8px; }
.btn-edit, .btn-del { padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.btn-edit:hover, .btn-del:hover { opacity: 0.8; }

/* Responsive Media Queries cho Mobile & Tablet */
@media (max-width: 992px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }
  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
  }
  .admin-main {
    margin-left: 0;
  }
  .mobile-toggle-btn {
    display: block;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.full-width {
    grid-column: span 1;
  }
  .btn-primary {
    grid-column: span 1;
  }
  .main-header {
    padding: 0 20px;
  }
  .main-content-wrapper {
    padding: 15px;
  }
}
</style>
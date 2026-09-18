<template>
  <div class="admin-layout">
    <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false"></div>

    <!-- Toast Thông Báo -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Sidebar -->
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

    <!-- Main Content -->
    <main class="admin-main">
      <header class="main-header">
        <div class="header-title-box">
          <button class="mobile-toggle-btn" @click="toggleSidebar">☰</button>
          <div>
            <h2>{{ currentTitle }}</h2>
            <p class="date-time">Hệ thống quản lý dữ liệu tập trung - Phòng Hồ Chí Minh Số</p>
          </div>
        </div>
      </header>

      <div class="main-content-wrapper">
        <component 
          :is="currentComponent" 
          :activities="activitiesList"
          :library="libraryList"
          :media="mediaList"
          :quizzes="quizList"
          @refresh="fetchAllData"
          @toast="showToast"
        />
      </div>
    </main>
  </div>
</template>

<script>
import AdminAnalytics from '@/components/AdminAnalytics.vue';
import AdminActivities from '@/components/AdminActivities.vue';
import AdminLibrary from '@/components/AdminLibrary.vue';
import AdminMedia from '@/components/AdminMedia.vue';
import AdminQuiz from '@/components/AdminQuiz.vue';
import AdminFeedback from '@/components/AdminFeedback.vue';
import AdminBookBorrow from '@/components/AdminBookBorrow.vue';

const getApiUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
  return rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
};

export default {
  components: {
    AdminAnalytics,
    AdminActivities,
    AdminLibrary,
    AdminMedia,
    AdminQuiz,
    AdminFeedback,
    AdminBookBorrow
  },
  data() {
    return {
      currentTab: 'analytics',
      isMobileMenuOpen: false,
      tabs: [
        { id: 'analytics', name: 'Thống kê Tổng hợp', icon: '📊' },
        { id: 'activities', name: 'Hoạt Động & Phong Trào', icon: '🎯' },
        { id: 'library', name: 'Quản lý sách', icon: '📚' },
        { id: 'media', name: 'Ca Khúc & Điệu Nhảy', icon: '🎶' },
        { id: 'quiz', name: 'Câu Hỏi Trắc Nghiệm', icon: '❓' },
        { id: 'feedback', name: 'Hòm Thư Góp Ý & AI', icon: '💬' },
        { id: 'borrow', name: 'Quản Lý Mượn/Trả Sách', icon: '📖' }
      ],
      activitiesList: [],
      libraryList: [],
      mediaList: [],
      quizList: [],
      toast: { show: false, message: '', type: 'success' },
      toastTimeout: null
    };
  },
  computed: {
    currentTitle() {
      const active = this.tabs.find(t => t.id === this.currentTab);
      return active ? active.name : 'Quản Trị Hệ Thống';
    },
    currentComponent() {
      const map = {
        analytics: 'AdminAnalytics',
        activities: 'AdminActivities',
        library: 'AdminLibrary',
        media: 'AdminMedia',
        quiz: 'AdminQuiz',
        feedback: 'AdminFeedback',
        borrow: 'AdminBookBorrow'
      };
      return map[this.currentTab] || 'AdminAnalytics';
    }
  },
  mounted() {
    this.fetchAllData();
  },
  methods: {
    toggleSidebar() { this.isMobileMenuOpen = !this.isMobileMenuOpen; },
    showToast(message, type = 'success') {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toast = { show: true, message, type };
      this.toastTimeout = setTimeout(() => { this.toast.show = false; }, 3000);
    },
    getAuthHeaders(isMultipart = false) {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (!isMultipart) headers['Content-Type'] = 'application/json';
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
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
      this.$router.push('/admin/login');
    }
  }
};
</script>

<style scoped>
/* Giữ nguyên các định dạng CSS layout, sidebar, toast như cũ của bạn */
.admin-layout { display: flex; min-height: 100vh; background-color: #0b132b; color: #edf2f4; font-family: 'Segoe UI', sans-serif; position: relative; box-sizing: border-box; }
*, *:before, *:after { box-sizing: border-box; }
.toast-notification { position: fixed; top: 25px; right: 30px; z-index: 9999; display: flex; align-items: center; gap: 12px; padding: 14px 22px; border-radius: 12px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15); }
.toast-notification.success { background: rgba(22, 163, 74, 0.95); color: #fff; }
.toast-notification.error { background: rgba(220, 38, 38, 0.95); color: #fff; }
.admin-sidebar { width: 280px; background-color: rgba(15, 23, 42, 0.98); border-right: 1px solid rgba(255, 215, 0, 0.15); display: flex; flex-direction: column; z-index: 1000; position: fixed; top: 0; bottom: 0; left: 0; }
.sidebar-header { padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sidebar-brand-icon { font-size: 2.2rem; margin-bottom: 8px; }
.sidebar-header h3 { font-size: 1.1rem; color: #ffd700; margin: 0 0 4px 0; }
.sidebar-header p { font-size: 0.75rem; color: #8d99ae; margin: 0; }
.sidebar-menu { flex: 1; padding: 20px 0; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
.sidebar-menu button { width: 100%; padding: 14px 24px; background: none; border: none; color: #94a3b8; text-align: left; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 14px; font-weight: 600; transition: 0.2s; }
.sidebar-menu button:hover, .sidebar-menu button.active { background-color: rgba(37, 99, 235, 0.2); color: #fff; border-left: 4px solid #ffd700; }
.sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
.admin-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.admin-profile .avatar { font-size: 1.8rem; background: rgba(255,215,0,0.1); padding: 8px; border-radius: 10px; }
.admin-profile .info strong { display: block; font-size: 0.9rem; color: #fff; }
.admin-profile .info span { font-size: 0.75rem; color: #38bdf8; }
.btn-logout { width: 100%; padding: 10px; background-color: #da251d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
.admin-main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; width: 100%; margin-left: 280px; }
.main-header { height: 75px; background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid rgba(255, 215, 0, 0.15); display: flex; align-items: center; justify-content: space-between; padding: 0 35px; position: sticky; top: 0; z-index: 50; }
.header-title-box { display: flex; align-items: center; gap: 12px; }
.mobile-toggle-btn { display: none; background: rgba(255,255,255,0.1); border: none; color: #ffd700; font-size: 1.5rem; padding: 6px 10px; border-radius: 8px; cursor: pointer; }
.main-header h2 { font-size: 1.35rem; color: #ffd700; margin: 0; }
.date-time { font-size: 0.75rem; color: #8d99ae; margin: 2px 0 0 0; }
.main-content-wrapper { padding: 30px; width: 100%; max-width: 1400px; margin: 0 auto; }
@media (max-width: 992px) {
  .admin-sidebar { transform: translateX(-100%); transition: 0.3s; }
  .admin-sidebar.mobile-open { transform: translateX(0); }
  .admin-main { margin-left: 0; }
  .mobile-toggle-btn { display: block; }
}
</style>
<template>
  <div class="admin-layout">
    <!-- Overlay cho mobile menu -->
    <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false"></div>

    <!-- Toast Thông Báo Hiện Đại -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <span class="toast-icon-wrapper">
          <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        </span>
        <div class="toast-content">
          <span class="toast-title">{{ toast.type === 'success' ? 'Thành công' : 'Lỗi hệ thống' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </div>
    </transition>

    <!-- Sidebar Quản Trị -->
    <aside class="admin-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header">
        <div class="sidebar-brand-glow"></div>
        <div class="sidebar-brand-icon">★</div>
        <h3>QUẢN TRỊ VTHC</h3>
        <p>Phòng Hồ Chí Minh Số</p>
      </div>
      
      <nav class="sidebar-menu">
        <div class="menu-category-label">ĐIỀU HÀNH CHÍNH</div>
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="switchTab(tab.id)"
          :class="{ active: currentTab === tab.id }"
        >
          <span class="icon">{{ tab.icon }}</span> 
          <span class="label">{{ tab.name }}</span>
          <span v-if="currentTab === tab.id" class="active-indicator"></span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="avatar-wrapper">
            <div class="avatar">🛡️</div>
            <span class="online-status-dot"></span>
          </div>
          <div class="info">
            <strong>Quản trị viên</strong>
            <span>Hệ thống trực tuyến</span>
          </div>
        </div>
        <button @click="handleLogout" class="btn-logout">
          <span>🚪</span> Đăng Xuất
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main">
      <header class="main-header">
        <div class="header-title-box">
          <button class="mobile-toggle-btn" @click="toggleSidebar" aria-label="Toggle Menu">☰</button>
          <div>
            <h2>{{ currentTitle }}</h2>
            <p class="date-time">Hệ thống quản lý dữ liệu tập trung - Tiểu đoàn Phòng không 16</p>
          </div>
        </div>
        <div class="header-right-actions">
          <div class="system-badge">
            <span class="pulse-dot"></span> Đang hoạt động
          </div>
        </div>
      </header>

      <div class="main-content-wrapper">
        <transition name="fade-slide" mode="out-in">
          <component 
            :is="currentComponent" 
            :activities="activitiesList"
            :library="libraryList"
            :media="mediaList"
            :quizzes="quizList"
            @refresh="fetchAllData"
            @toast="showToast"
          />
        </transition>
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
    toggleSidebar() { 
      this.isMobileMenuOpen = !this.isMobileMenuOpen; 
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
    },
    showToast(message, type = 'success') {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toast = { show: true, message, type };
      this.toastTimeout = setTimeout(() => { this.toast.show = false; }, 3500);
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
      document.body.style.overflow = 'auto';
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at 50% 0%, #1a0f0f 0%, #0c0404 60%, #050101 100%);
  color: #f1f5f9;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
  box-sizing: border-box;
}

*, *:before, *:after { 
  box-sizing: border-box; 
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 999;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 25px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-radius: 14px;
  font-weight: 500;
  font-size: 0.92rem;
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.15);
  max-width: 400px;
}

.toast-notification.success { 
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.95), rgba(15, 118, 45, 0.95)); 
  color: #fff; 
  border-color: rgba(34, 197, 94, 0.4);
}

.toast-notification.error { 
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(153, 27, 27, 0.95)); 
  color: #fff; 
  border-color: rgba(239, 68, 68, 0.4);
}

.toast-icon-wrapper {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.toast-message {
  font-size: 0.9rem;
}

.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Sidebar Styles */
.admin-sidebar {
  width: 290px;
  background: rgba(14, 4, 4, 0.95);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 215, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-header {
  position: relative;
  padding: 28px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  overflow: hidden;
}

.sidebar-brand-glow {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background: #ffd700;
  filter: blur(35px);
  opacity: 0.2;
  pointer-events: none;
}

.sidebar-brand-icon {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 6px;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
}

.sidebar-header h3 {
  font-size: 1.15rem;
  color: #ffd700;
  margin: 0 0 4px 0;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.sidebar-header p {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.3px;
}

/* Sidebar Menu */
.sidebar-menu {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}
.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.2);
  border-radius: 4px;
}

.menu-category-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1px;
  padding: 0 12px 8px 12px;
}

.sidebar-menu button {
  position: relative;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #94a3b8;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.sidebar-menu button .icon {
  font-size: 1.15rem;
  width: 24px;
  display: flex;
  justify-content: center;
}

.sidebar-menu button:hover {
  background-color: rgba(255, 215, 0, 0.06);
  color: #f8fafc;
}

.sidebar-menu button.active {
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.25), rgba(153, 27, 27, 0.35));
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.active-indicator {
  position: absolute;
  right: 12px;
  width: 6px;
  height: 6px;
  background-color: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 8px #ffd700;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 18px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(8, 2, 2, 0.5);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding: 6px;
}

.avatar-wrapper {
  position: relative;
}

.admin-profile .avatar {
  font-size: 1.6rem;
  background: rgba(255, 215, 0, 0.1);
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.online-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #22c55e;
  border: 2px solid #0e0404;
  border-radius: 50%;
}

.admin-profile .info strong { 
  display: block; 
  font-size: 0.88rem; 
  color: #fff; 
}

.admin-profile .info span { 
  font-size: 0.72rem; 
  color: #38bdf8; 
}

.btn-logout {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: white;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 9px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.btn-logout:hover {
  background: linear-gradient(135deg, #f43f5e, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(225, 29, 72, 0.4);
  border-color: #ffd700;
}

/* Main Area */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  margin-left: 290px;
}

.main-header {
  height: 75px;
  background: rgba(14, 4, 4, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 35px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-title-box { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
}

.mobile-toggle-btn { 
  display: none; 
  background: rgba(255, 215, 0, 0.1); 
  border: 1px solid rgba(255, 215, 0, 0.3); 
  color: #ffd700; 
  font-size: 1.3rem; 
  padding: 6px 10px; 
  border-radius: 8px; 
  cursor: pointer; 
}

.main-header h2 { 
  font-size: 1.3rem; 
  color: #ffd700; 
  margin: 0; 
  font-weight: 800;
}

.date-time { 
  font-size: 0.74rem; 
  color: #94a3b8; 
  margin: 2px 0 0 0; 
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.system-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #4ade80;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.main-content-wrapper { 
  padding: 30px; 
  width: 100%; 
  max-width: 1440px; 
  margin: 0 auto; 
}

/* Component transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive design */
@media (max-width: 992px) {
  .admin-sidebar { 
    transform: translateX(-100%); 
  }
  .admin-sidebar.mobile-open { 
    transform: translateX(0); 
  }
  .admin-main { 
    margin-left: 0; 
  }
  .mobile-toggle-btn { 
    display: block; 
  }
  .main-header {
    padding: 0 20px;
  }
  .main-content-wrapper {
    padding: 20px 16px;
  }
}
</style>
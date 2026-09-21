<template>
  <div class="admin-layout">
    <!-- 🌌 Hiệu ứng ánh sáng nền động siêu xịn -->
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>

    <!-- Họa tiết lưới công nghệ chìm -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0"></div>

    <!-- Overlay cho mobile menu -->
    <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="toggleSidebar"></div>

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

    <!-- Sidebar Quản Trị (Glassmorphism Cao Cấp) -->
    <aside class="admin-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header">
        <div class="sidebar-brand-glow"></div>
        <div class="sidebar-brand-icon-box">
          <div class="absolute inset-0 bg-white/10 rounded-2xl animate-ping opacity-25"></div>
          <span class="sidebar-brand-icon">⭐</span>
        </div>
        <h3 class="animate-text-shine">QUẢN TRỊ VTHC</h3>
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
          <span>🚪</span> <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main">
      <header class="main-header">
        <div class="header-title-box">
          <button class="mobile-toggle-btn" @click="toggleSidebar" aria-label="Toggle Menu">☰</button>
          <div>
            <h2 class="animate-text-shine">{{ currentTitle }}</h2>
            <p class="date-time">Hệ thống quản lý dữ liệu tập trung - Tiểu đoàn Phòng không 16</p>
          </div>
        </div>
        
        <div class="header-right-actions">
          <div class="system-badge">
            <span class="pulse-dot"></span>
            <span>Bảo mật 256-bit</span>
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
            :books="booksList"
            :feedbacks="feedbacksList"
            :borrowings="borrowingsList"
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
  name: 'AdminLayout',
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
      booksList: [],
      feedbacksList: [],
      borrowingsList: [],
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
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
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
      document.body.style.overflow = '';
      this.fetchAllData();
    },
    async fetchAllData() {
      try {
        const baseUrl = getApiUrl();
        const headers = this.getAuthHeaders();
        
        const [actRes, libRes, medRes, quizRes, bookRes, feedbackRes, borrowRes] = await Promise.all([
          fetch(`${baseUrl}/api/activities`, { headers }).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/api/library`, { headers }).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/api/media`, { headers }).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/api/quizzes`, { headers }).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/api/books`, { headers }).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/api/feedbacks`, { headers }).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/api/borrowings`, { headers }).catch(() => ({ ok: false }))
        ]);

        if (actRes.ok) this.activitiesList = await actRes.json();
        if (libRes.ok) this.libraryList = await libRes.json();
        if (medRes.ok) this.mediaList = await medRes.json();
        if (quizRes.ok) this.quizList = await quizRes.json();

        if (bookRes.ok) {
          const data = await bookRes.json();
          this.booksList = Array.isArray(data) ? data : (data.data || []);
        }
        if (feedbackRes.ok) {
          const data = await feedbackRes.json();
          this.feedbacksList = Array.isArray(data) ? data : (data.data || []);
        }
        if (borrowRes.ok) {
          const data = await borrowRes.json();
          this.borrowingsList = Array.isArray(data) ? data : (data.data || []);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu admin:', err);
      }
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
      document.body.style.overflow = '';
      this.$router.push('/admin/login');
    }
  }
};
</script>

<style scoped>
/* Hiệu ứng chữ sáng chạy từ trái qua phải (Text Shimmer / Ánh nắng lướt) */
@keyframes textShine {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.animate-text-shine {
  background: linear-gradient(
    90deg, 
    #fcd34d 0%, 
    #ffffff 40%, 
    #f59e0b 60%, 
    #fcd34d 100%
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  animation: textShine 5s linear infinite;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #030712;
  color: #f1f5f9;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
  user-select: none;
}

*, *:before, *:after { 
  box-sizing: border-box; 
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1050;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Toast Notification (Glassmorphism) */
.toast-notification {
  position: fixed;
  top: 25px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-radius: 1.25rem;
  font-weight: 500;
  font-size: 0.92rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  max-width: 400px;
}

.toast-notification.success { 
  background: rgba(6, 78, 59, 0.85); 
  color: #a7f3d0; 
  border-color: rgba(52, 211, 153, 0.4);
}

.toast-notification.error { 
  background: rgba(127, 29, 29, 0.85); 
  color: #fecaca; 
  border-color: rgba(248, 113, 113, 0.4);
}

.toast-icon-wrapper {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.15);
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
}

.toast-message {
  font-size: 0.88rem;
  color: #e2e8f0;
}

.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Sidebar Styles (Glassmorphism Cao Cấp) */
.admin-sidebar {
  width: 290px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(24px);
  border-right: 1px solid rgba(51, 65, 85, 0.8);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1100;
  box-shadow: 10px 0 40px rgba(0,0,0,0.8);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-header {
  position: relative;
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  overflow: hidden;
}

.sidebar-brand-glow {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 50px;
  background: #f59e0b;
  filter: blur(40px);
  opacity: 0.25;
  pointer-events: none;
}

.sidebar-brand-icon-box {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
  border-radius: 14px;
  margin: 0 auto 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.4);
  border: 1px solid rgba(248, 113, 113, 0.4);
  position: relative;
}

.sidebar-brand-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.sidebar-header h3 {
  font-size: 1.15rem;
  margin: 0 0 4px 0;
  font-weight: 900;
  letter-spacing: 0.8px;
}

.sidebar-header p {
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Sidebar Menu */
.sidebar-menu {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}
.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.2);
  border-radius: 4px;
}

.menu-category-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1.2px;
  padding: 0 12px 6px 12px;
}

.sidebar-menu button {
  position: relative;
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  text-align: left;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  border-radius: 14px;
  transition: all 0.25s ease;
}

.sidebar-menu button .icon {
  font-size: 1.1rem;
  width: 24px;
  display: flex;
  justify-content: center;
}

.sidebar-menu button:hover {
  background-color: rgba(255, 255, 255, 0.04);
  color: #f8fafc;
  border-color: rgba(255, 255, 255, 0.08);
}

.sidebar-menu button.active {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(245, 158, 11, 0.15));
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.active-indicator {
  position: absolute;
  right: 14px;
  width: 6px;
  height: 6px;
  background-color: #fcd34d;
  border-radius: 50%;
  box-shadow: 0 0 10px #fcd34d;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(3, 7, 18, 0.5);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 6px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(51, 65, 85, 0.4);
}

.avatar-wrapper {
  position: relative;
}

.admin-profile .avatar {
  font-size: 1.3rem;
  background: rgba(245, 158, 11, 0.1);
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.online-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  background-color: #10b981;
  border: 2px solid #030712;
  border-radius: 50%;
}

.admin-profile .info strong { 
  display: block; 
  font-size: 0.84rem; 
  color: #fff; 
}

.admin-profile .info span { 
  font-size: 0.7rem; 
  color: #38bdf8; 
  font-weight: 500;
}

.btn-logout {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: white;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.btn-logout:hover {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
  border-color: #fcd34d;
}

/* Main Area Layout */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 290px;
  transition: margin 0.35s ease;
  position: relative;
  z-index: 10;
}

.main-header {
  height: 75px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(51, 65, 85, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 35px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-title-box { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  min-width: 0;
}

.mobile-toggle-btn { 
  display: none; 
  background: rgba(245, 158, 11, 0.1); 
  border: 1px solid rgba(245, 158, 11, 0.3); 
  color: #fcd34d; 
  font-size: 1.2rem; 
  padding: 8px 12px; 
  border-radius: 10px; 
  cursor: pointer;
  flex-shrink: 0;
}

.main-header h2 { 
  font-size: 1.25rem; 
  margin: 0; 
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}

.date-time { 
  font-size: 0.73rem; 
  color: #94a3b8; 
  margin: 3px 0 0 0; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.system-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 600;
  color: #34d399;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.main-content-wrapper { 
  padding: 28px; 
  width: 100%; 
  max-width: 1450px; 
  margin: 0 auto; 
}

/* Component transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive design chuẩn chỉnh */
@media (max-width: 1024px) {
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
    padding: 20px 14px;
  }
}
</style>
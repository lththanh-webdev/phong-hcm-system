<template>
  <div class="admin-layout">
    <!-- Overlay cho mobile menu với z-index chuẩn xác -->
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
        
        // Gọi đồng thời tất cả các API cần thiết, dùng catch phòng hờ lỗi từng request riêng lẻ
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at 50% 0%, #1a0f0f 0%, #0c0404 60%, #050101 100%);
  color: #f1f5f9;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

*, *:before, *:after { 
  box-sizing: border-box; 
}

/* Mobile Overlay với z-index an toàn */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1050;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  width: 280px;
  background: rgba(14, 4, 4, 0.96);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 215, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1100;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-header {
  position: relative;
  padding: 24px 20px;
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
  font-size: 1.8rem;
  color: #ffd700;
  margin-bottom: 4px;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
}

.sidebar-header h3 {
  font-size: 1.1rem;
  color: #ffd700;
  margin: 0 0 2px 0;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.sidebar-header p {
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.3px;
}

/* Sidebar Menu */
.sidebar-menu {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1px;
  padding: 0 12px 6px 12px;
}

.sidebar-menu button {
  position: relative;
  width: 100%;
  padding: 11px 14px;
  background: transparent;
  border: none;
  color: #94a3b8;
  text-align: left;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.sidebar-menu button .icon {
  font-size: 1.1rem;
  width: 22px;
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
  padding: 16px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(8, 2, 2, 0.5);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 4px;
}

.avatar-wrapper {
  position: relative;
}

.admin-profile .avatar {
  font-size: 1.4rem;
  background: rgba(255, 215, 0, 0.1);
  width: 38px;
  height: 38px;
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
  width: 9px;
  height: 9px;
  background-color: #22c55e;
  border: 2px solid #0e0404;
  border-radius: 50%;
}

.admin-profile .info strong { 
  display: block; 
  font-size: 0.85rem; 
  color: #fff; 
}

.admin-profile .info span { 
  font-size: 0.7rem; 
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
  font-size: 0.85rem;
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

/* Main Area Layout Fixes */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 280px;
  transition: margin 0.35s ease;
}

.main-header {
  height: 70px;
  background: rgba(14, 4, 4, 0.9);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-title-box { 
  display: flex; 
  align-items: center; 
  gap: 14px; 
  min-width: 0;
}

.mobile-toggle-btn { 
  display: none; 
  background: rgba(255, 215, 0, 0.1); 
  border: 1px solid rgba(255, 215, 0, 0.3); 
  color: #ffd700; 
  font-size: 1.2rem; 
  padding: 6px 10px; 
  border-radius: 8px; 
  cursor: pointer;
  flex-shrink: 0;
}

.main-header h2 { 
  font-size: 1.2rem; 
  color: #ffd700; 
  margin: 0; 
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-time { 
  font-size: 0.72rem; 
  color: #94a3b8; 
  margin: 2px 0 0 0; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  gap: 6px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4ade80;
}

.pulse-dot {
  width: 7px;
  height: 7px;
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
  padding: 24px; 
  width: 100%; 
  max-width: 1400px; 
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

/* Responsive design chuẩn chỉnh cho mobile & tablet */
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
    padding: 0 16px;
  }
  .main-content-wrapper {
    padding: 16px 12px;
  }
}
</style>
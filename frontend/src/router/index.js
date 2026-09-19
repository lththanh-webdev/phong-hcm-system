import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { 
    path: '/', 
    redirect: '/tuong-niem' // Mặc định chuyển hướng về Tường Niệm khi truy cập trang
  },
  
  // ==========================
  // KHU VỰC TRANG USER (CÔNG KHAI)
  // ==========================
  { 
    path: '/tuong-niem', 
    name: 'Memorial', 
    component: () => import('../views/user/MemorialView.vue') 
  },
  { 
    path: '/gioi-thieu', 
    name: 'Introduction', 
    component: () => import('../views/user/IntroView.vue') 
  },
  { 
    path: '/hoat-dong', 
    name: 'Activities', 
    component: () => import('../views/user/ActivityView.vue') 
  },
  { 
    path: '/thu-vien', 
    name: 'Library', 
    component: () => import('../views/user/LibraryView.vue') 
  },
  { 
    path: '/media', 
    name: 'Media', 
    component: () => import('../views/user/MediaView.vue') 
  },
  { 
    path: '/trac-nghiem', 
    name: 'Quiz', 
    component: () => import('../views/user/QuizView.vue') 
  },
  { 
    path: '/gop-y',
    name: 'Feedback',
    component: () => import('../views/user/FeedbackView.vue')
  },

  // ==========================
  // KHU VỰC ADMIN (QUẢN TRỊ)
  // ==========================
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginView.vue') 
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/ManageActivities.vue') // Hoặc file chứa Layout tổng Admin của bạn
  },
  {
    path: '/admin/:pathMatch(.*)*',
    redirect: '/admin'
  },

  // ==========================
  // XỬ LÝ TRANG 404 (Luôn đặt ở cuối cùng)
  // ==========================
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/tuong-niem' 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ==========================
// NAVIGATION GUARDS (BẢO MẬT & PHÂN QUYỀN)
// ==========================

// 🛡️ Kiểm tra bảo mật và tự động reset phiên đăng nhập mỗi ngày mới
router.beforeEach((to, from, next) => {
  const loginDate = localStorage.getItem('loginDate');
  const today = new Date().toDateString();

  if (loginDate && loginDate !== today) {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('loginDate');
  }

  if (to.path.startsWith('/admin') && to.path !== '/admin/login' && !localStorage.getItem('token')) {
    next('/admin/login');
  } else {
    next();
  }
});

// 📊 Tự động ghi nhận lượt truy cập phục vụ tab Thống kê Admin (Chống trùng lặp /api/api)
router.afterEach((to) => {
  try {
    const rawUrl = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';
    const API_URL = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;

    fetch(`${API_URL}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: to.path })
    }).catch(err => console.error('Lỗi ghi nhận lượt truy cập:', err));
  } catch (err) {
    console.error('Lỗi khởi tạo gọi API thống kê:', err);
  }
});

export default router;
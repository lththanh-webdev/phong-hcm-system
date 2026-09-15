import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  { 
    path: '/', 
    redirect: '/tuong-niem' // Đổi mặc định vào Tường Niệm khi truy cập trang
  },
  
  // Các trang User
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

  // Khu vực Admin
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginView.vue') 
  },
  {
    path: '/admin/hoat-dong',
    name: 'AdminActivities',
    component: () => import('../views/admin/ManageActivities.vue') 
  },
  {
    path: '/admin',
    redirect: '/admin/hoat-dong'
  },

  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/tuong-niem' 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🛡️ Kiểm tra bảo mật, phân quyền và tự động reset phiên đăng nhập mỗi ngày mới
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

// Tự động ghi nhận lượt truy cập phục vụ tab Thống kê Admin
router.afterEach((to) => {
  const API_URL = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com';
  fetch(`${API_URL}/api/visitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: to.path })
  }).catch(err => console.error('Lỗi ghi nhận lượt truy cập:', err));
});

export default router;
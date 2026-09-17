<template>
  <div id="app" class="app-layout">
    <header class="navbar-header">
      <div class="header-container">
        <div class="brand-section">
          <img src="https://media.loveitopcdn.com/3807/logo-quan-doi-nhan-dan-viet-nam-2.png" alt="Quân Đội Nhân Dân Việt Nam" class="brand-logo">
          <div class="brand-titles">
            <span class="brand-top-sub">QUÂN ĐỘI NHÂN DÂN VIỆT NAM • TIỂU ĐOÀN PK 16</span>
            <h1 class="brand-main-title">PHÒNG HỒ CHÍ MINH SỐ</h1>
            <p class="brand-slogan">"Thiết chế văn hóa số - Không gian giáo dục chính trị"</p>
          </div>
        </div>

        <div class="header-widgets desktop-widgets">
          <div class="network-badge">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vietnam-Animated.gif" 
              alt="Cờ Việt Nam" 
              class="flag-icon-dynamic"
              @error="(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'; }"
            />
            <span>SƯ ĐOÀN 9 ANH HÙNG</span>
          </div>
          <div class="datetime-badge">
            <span class="status-dot"></span>
            <span class="date-text">{{ currentDate }}</span>
            <span class="separator">|</span>
            <span class="time-text">{{ currentTime }}</span>
          </div>
        </div>

        <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Menu">
          <span :class="['hamburger-bar', { 'open': isMobileMenuOpen }]"></span>
        </button>
      </div>

      <div class="mobile-widgets-bar">
        <div class="network-badge">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vietnam-Animated.gif" 
            alt="Cờ" 
            class="flag-icon-dynamic"
            @error="(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'; }"
          />
          <span>SƯ ĐOÀN 9 ANH HÙNG</span>
        </div>
        <div class="datetime-badge">
          <span class="status-dot"></span>
          <span>{{ currentDate }} - {{ currentTime }}</span>
        </div>
      </div>

      <nav :class="['nav-bar', { 'mobile-open': isMobileMenuOpen }]">
        <div class="nav-links-container" @click="isMobileMenuOpen = false">
          <router-link to="/tuong-niem" class="nav-item">Tường Niệm</router-link>
          <router-link to="/gioi-thieu" class="nav-item">Giới Thiệu</router-link>
          <router-link to="/hoat-dong" class="nav-item">Hoạt Động</router-link>
          <router-link to="/thu-vien" class="nav-item">Thư Viện Số</router-link>
          <router-link to="/media" class="nav-item">Ca Khúc & Điệu Nhảy</router-link>
          <router-link to="/trac-nghiem" class="nav-item">Thi Trắc Nghiệm</router-link>
        </div>
      </nav>
    </header>

    <main class="main-body">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="footer-glow-line"></div>
      <div class="footer-content">
        <div class="footer-emblem-mini">★</div>
        <h3 class="footer-title">PHÒNG HỒ CHÍ MINH SỐ - TIỂU ĐOÀN PHÒNG KHÔNG 16</h3>
        <p class="footer-copyright">Bản quyền thuộc về cán bộ chính trị • Thiếu tá Tạ Quang Giáp ctvp/d</p>
        <p class="footer-sub">Phục vụ công tác giáo dục chính trị, tuyên truyền văn hóa nội bộ đơn vị Quân đội.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentDate = ref('');
const currentTime = ref('');
const isMobileMenuOpen = ref(false);
let timer = null;

const updateDateTime = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString('vi-VN');
  currentTime.value = now.toLocaleTimeString('vi-VN', { hour12: false });
};

onMounted(() => {
  updateDateTime();
  timer = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style>
:root {
  --military-red: #5c0606;
  --military-dark: #150101;
  --gold-primary: #ffd700;
  --text-light: #f8fafc;
}

body {
  margin: 0;
  padding: 0;
  background-color: #1a0202;
  color: var(--text-light);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #4a0808 0%, #150101 80%);
}

/* Header Navbar */
.navbar-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(180deg, #3d0505 0%, #220101 100%);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.brand-titles {
  display: flex;
  flex-direction: column;
}

.brand-top-sub {
  font-size: 0.55rem;
  font-weight: 700;
  color: #ffcc00;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.brand-main-title {
  margin: 2px 0;
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--text-light);
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.brand-slogan {
  margin: 0;
  font-size: 0.68rem;
  color: #d1d5db;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Header Widgets */
.header-widgets {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.datetime-badge {
  background: rgba(15, 2, 2, 0.75);
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gold-primary);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
}

@keyframes blinkDot {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px #22c55e; }
  50% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px #22c55e; }
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: #22c55e;
  border-radius: 50%;
  animation: blinkDot 1.4s ease-in-out infinite;
}

.separator {
  color: rgba(255, 255, 255, 0.3);
}

.network-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #f1f5f9;
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.flag-icon-dynamic {
  width: 20px;
  height: 13px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
}

/* Mobile Widgets Bar */
.mobile-widgets-bar {
  display: none;
  background: rgba(15, 2, 2, 0.95);
  padding: 5px 12px;
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.mobile-widgets-bar .network-badge,
.mobile-widgets-bar .datetime-badge {
  font-size: 0.65rem;
  padding: 3px 8px;
  white-space: nowrap;
}

/* Nút Hamburger 3 gạch */
.mobile-menu-btn {
  display: none;
  background: none;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.hamburger-bar {
  position: relative;
  width: 20px;
  height: 2px;
  background-color: var(--gold-primary);
  display: inline-block;
  transition: all 0.3s ease;
}

.hamburger-bar::before,
.hamburger-bar::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background-color: var(--gold-primary);
  left: 0;
  transition: all 0.3s ease;
}

.hamburger-bar::before { top: -6px; }
.hamburger-bar::after { top: 6px; }

.hamburger-bar.open {
  background-color: transparent;
}
.hamburger-bar.open::before {
  transform: rotate(45deg);
  top: 0;
}
.hamburger-bar.open::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Navigation Bar */
.nav-bar {
  background: rgba(18, 2, 2, 0.95);
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  padding: 0 16px;
}

.nav-links-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.nav-item {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 10px 16px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.nav-item:hover {
  color: var(--gold-primary);
  background: rgba(255, 215, 0, 0.05);
}

.nav-item.router-link-active {
  color: var(--gold-primary);
  background: linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(185, 28, 28, 0.25) 100%);
  border-bottom: 3px solid var(--gold-primary);
  font-weight: 700;
}

/* Main Body */
.main-body {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 12px;
  box-sizing: border-box;
}

/* Footer */
.app-footer {
  position: relative;
  background: linear-gradient(180deg, #180202 0%, #0d0101 100%);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding: 24px 16px;
  text-align: center;
}

.footer-glow-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.footer-emblem-mini {
  color: var(--gold-primary);
  font-size: 1.1rem;
}

.footer-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--gold-primary);
}

.footer-copyright {
  margin: 2px 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #e2e8f0;
}

.footer-sub {
  margin: 0;
  font-size: 0.72rem;
  color: #9ca3af;
  font-style: italic;
}

/* Responsive cho màn hình Điện thoại (< 768px) */
@media (max-width: 768px) {
  .desktop-widgets {
    display: none;
  }
  
  .mobile-widgets-bar {
    display: flex;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .brand-logo {
    width: 42px;
    height: 42px;
  }

  .brand-main-title {
    font-size: 0.95rem;
  }

  .brand-top-sub {
    font-size: 0.5rem;
  }

  .brand-slogan {
    display: none;
  }

  .nav-bar {
    max-height: 0;
    overflow: hidden;
    padding: 0;
    transition: max-height 0.3s ease-in-out;
  }

  .nav-bar.mobile-open {
    max-height: 350px;
    padding: 8px 0;
  }

  .nav-links-container {
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
  }

  .nav-item {
    padding: 10px 16px;
    font-size: 0.85rem;
    border-bottom: none;
    border-left: 3px solid transparent;
  }

  .nav-item.router-link-active {
    border-bottom: none;
    border-left: 3px solid var(--gold-primary);
  }
}
</style>
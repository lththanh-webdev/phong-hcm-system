<template>
  <div id="app" class="app-layout">
    <header class="navbar-header">
      <div class="header-container">
        <div class="brand-section">
          <img
            src="https://media.loveitopcdn.com/3807/logo-quan-doi-nhan-dan-viet-nam-2.png"
            alt="Quân Đội Nhân Dân Việt Nam"
            class="brand-logo"
          />
          <div class="brand-titles">
            <span class="brand-top-sub">
              QUÂN ĐỘI NHÂN DÂN VIỆT NAM • TIỂU ĐOÀN PK 16
            </span>
            <h1 class="brand-main-title">
              PHÒNG HỒ CHÍ MINH SỐ
            </h1>
            <p class="brand-slogan">
              "Thiết chế văn hóa số - Không gian giáo dục chính trị"
            </p>
          </div>
        </div>

        <div class="header-widgets desktop-widgets">
          <div class="network-badge">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vietnam-Animated.gif"
              alt="Cờ Việt Nam"
              class="flag-icon-dynamic"
              @error="handleFlagError"
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

        <button
          class="mobile-menu-btn"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Mở menu"
          :aria-expanded="isMobileMenuOpen"
        >
          <span :class="['hamburger-bar', { open: isMobileMenuOpen }]"></span>
        </button>
      </div>

      <div class="mobile-widgets-bar">
        <div class="network-badge">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vietnam-Animated.gif"
            alt="Cờ Việt Nam"
            class="flag-icon-dynamic"
            @error="handleFlagError"
          />
          <span>SƯ ĐOÀN 9 ANH HÙNG</span>
        </div>

        <div class="datetime-badge">
          <span class="status-dot"></span>
          <span>{{ currentDate }} - {{ currentTime }}</span>
        </div>
      </div>

      <nav :class="['nav-bar', { 'mobile-open': isMobileMenuOpen }]">
        <div class="nav-links-container" @click="closeMobileMenu">
          <router-link to="/tuong-niem" class="nav-item">Tường Niệm</router-link>
          <router-link to="/gioi-thieu" class="nav-item">Giới Thiệu</router-link>
          <router-link to="/hoat-dong" class="nav-item">Hoạt Động</router-link>
          <router-link to="/thu-vien" class="nav-item">Thư Viện Số</router-link>
          <router-link to="/media" class="nav-item">Ca Khúc & Điệu Nhảy</router-link>
          <router-link to="/trac-nghiem" class="nav-item">Thi Trắc Nghiệm</router-link>
          <router-link to="/gop-y" class="nav-item">Hòm Thư Góp Ý</router-link>
          <router-link to="/admin" class="nav-item admin-link">🔐 Quản Trị</router-link>
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
        <h3 class="footer-title">
          PHÒNG HỒ CHÍ MINH SỐ - TIỂU ĐOÀN PHÒNG KHÔNG 16
        </h3>
        <p class="footer-copyright">
          Bản quyền thuộc về cán bộ chính trị • Thiếu tá Tạ Quang Giáp ctvp/d
        </p>
        <p class="footer-sub">
          Phục vụ công tác giáo dục chính trị, tuyên truyền văn hóa nội bộ đơn vị Quân đội.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDate = ref('')
const currentTime = ref('')
const isMobileMenuOpen = ref(false)
let timer = null

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('vi-VN')
  currentTime.value = now.toLocaleTimeString('vi-VN', { hour12: false })
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleFlagError = (event) => {
  event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style>
/* Reset Layout & Global Background */
html, body, #app {
  width: 100%;
  min-width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  background: #150101 !important;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  background: #150101 !important;
  color: #f8fafc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
}

#app {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --military-red: #5c0606;
  --military-red-dark: #150101;
  --military-red-light: #7f0a0a;
  --gold-primary: #ffd700;
  --gold-light: #ffea70;
  --text-light: #f8fafc;
  --text-gray: #d1d5db;
}

.app-layout {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #4a0808 0%, #250303 45%, #150101 80%);
}

/* Header & Navigation Styles */
.navbar-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: linear-gradient(180deg, #3d0505 0%, #220101 100%);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6);
}

.header-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-logo {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  object-fit: contain;
}

.brand-titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-top-sub {
  font-size: 0.58rem;
  font-weight: 700;
  color: #ffcc00;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.brand-main-title {
  margin: 2px 0;
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-light);
  letter-spacing: 1px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.brand-slogan {
  margin: 0;
  font-size: 0.68rem;
  color: #d1d5db;
  font-style: italic;
}

.header-widgets {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.network-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #f1f5f9;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 9px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  white-space: nowrap;
}

.flag-icon-dynamic {
  width: 20px;
  height: 13px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
}

.datetime-badge {
  background: rgba(15, 2, 2, 0.75);
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 5px 11px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gold-primary);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
}

.separator {
  color: rgba(255, 255, 255, 0.3);
}

@keyframes blinkDot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 10px #22c55e;
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
    box-shadow: 0 0 2px #22c55e;
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  background-color: #22c55e;
  border-radius: 50%;
  animation: blinkDot 1.4s ease-in-out infinite;
}

/* Nav Menu Styles */
.nav-bar {
  width: 100%;
  background: rgba(18, 2, 2, 0.95);
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  padding: 0;
}

.nav-links-container {
  width: 100%;
  margin: 0;
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.nav-item {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 11px 16px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.nav-item.admin-link {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.08);
  border-radius: 4px;
  margin-left: 10px;
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

/* Main Body & Footer */
.main-body {
  flex: 1;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 20px 24px;
  box-sizing: border-box;
}

.app-footer {
  position: relative;
  width: 100%;
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
  width: 100%;
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

/* Mobile Controls */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 7px 9px;
  border-radius: 6px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.hamburger-bar {
  position: relative;
  width: 20px;
  height: 2px;
  background: var(--gold-primary);
  display: inline-block;
  transition: all 0.3s ease;
}

.hamburger-bar::before,
.hamburger-bar::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--gold-primary);
  left: 0;
  transition: all 0.3s ease;
}

.hamburger-bar::before {
  top: -6px;
}

.hamburger-bar::after {
  top: 6px;
}

.hamburger-bar.open {
  background: transparent;
}

.hamburger-bar.open::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger-bar.open::after {
  transform: rotate(-45deg);
  top: 0;
}

.mobile-widgets-bar {
  display: none;
  width: 100%;
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

/* Responsive Media Queries */
@media (max-width: 1000px) {
  .header-container {
    padding: 10px 16px;
  }
  .nav-links-container {
    padding: 0 16px;
  }
  .main-body {
    padding: 18px 16px;
  }
  .nav-item {
    padding: 10px 10px;
    font-size: 0.78rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 9px 12px;
  }
  .brand-logo {
    width: 42px;
    height: 42px;
  }
  .brand-main-title {
    font-size: 0.95rem;
    letter-spacing: 0.6px;
  }
  .brand-top-sub {
    font-size: 0.5rem;
    letter-spacing: 0.3px;
  }
  .brand-slogan {
    display: none;
  }
  .desktop-widgets {
    display: none;
  }
  .mobile-widgets-bar {
    display: flex;
  }
  .mobile-menu-btn {
    display: flex;
  }
  .nav-bar {
    max-height: 0;
    overflow: hidden;
    padding: 0;
    transition: max-height 0.3s ease-in-out;
  }
  .nav-bar.mobile-open {
    max-height: 600px;
    padding: 8px 0;
  }
  .nav-links-container {
    width: 100%;
    padding: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
  }
  .nav-item {
    padding: 11px 16px;
    font-size: 0.85rem;
    border-bottom: none;
    border-left: 3px solid transparent;
  }
  .nav-item.admin-link {
    margin-left: 0;
    border-radius: 0;
  }
  .nav-item.router-link-active {
    border-bottom: none;
    border-left: 3px solid var(--gold-primary);
  }
  .main-body {
    width: 100%;
    padding: 15px 10px;
  }
  .app-footer {
    padding: 20px 12px;
  }
  .footer-title {
    font-size: 0.78rem;
  }
  .footer-copyright {
    font-size: 0.7rem;
  }
  .footer-sub {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .brand-main-title {
    font-size: 0.82rem;
  }
  .brand-top-sub {
    font-size: 0.43rem;
  }
  .mobile-widgets-bar {
    padding: 4px 7px;
  }
  .mobile-widgets-bar .network-badge,
  .mobile-widgets-bar .datetime-badge {
    font-size: 0.55rem;
  }
  .flag-icon-dynamic {
    width: 18px;
    height: 12px;
  }
}

@media (min-width: 1600px) {
  .header-container {
    padding-left: 35px;
    padding-right: 35px;
  }
  .nav-links-container {
    padding-left: 35px;
    padding-right: 35px;
  }
  .main-body {
    padding-left: 35px;
    padding-right: 35px;
  }
}
</style>
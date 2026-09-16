<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030712] px-4 overflow-hidden font-sans select-none">
    
    <!-- 🌌 Hiệu ứng ánh sáng nền động siêu xịn -->
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>

    <!-- Họa tiết lưới công nghệ chìm -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

    <!-- Khung chính đăng nhập (Glassmorphism cao cấp) -->
    <div class="max-w-md w-full bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative z-10 group transition-all duration-500 hover:border-amber-500/50">
      
      <!-- Viền sáng ảo bao quanh khung -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-amber-500 to-indigo-500 rounded-[2.5rem] opacity-30 group-hover:opacity-75 transition-opacity duration-500 -z-10 blur-sm"></div>

      <!-- Header tiêu đề -->
      <div class="text-center mb-8 relative">
        <div class="w-20 h-20 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-red-900/60 mb-4 border border-red-400/40 relative group-hover:scale-110 transition-transform duration-300">
          <div class="absolute inset-0 bg-white/10 rounded-2xl animate-ping opacity-25"></div>
          <span class="text-4xl filter drop-shadow-md">⭐</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 uppercase tracking-wider drop-shadow">
          Cổng Quản Trị VTHC
        </h2>
        <div class="inline-flex items-center gap-2 mt-2 px-3.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-inner">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <p class="text-[11px] text-slate-300 font-bold tracking-wider uppercase">Phòng Hồ Chí Minh Số - Tiểu Đoàn</p>
        </div>
      </div>

      <!-- Form đăng nhập -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <!-- Ô Tài khoản -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Tài khoản quản trị</label>
          <div class="relative group/input">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-amber-400 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            <input 
              v-model="credentials.username" 
              type="text" 
              required 
              autocomplete="username"
              class="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all shadow-inner"
              placeholder="Nhập tên đăng nhập..."
            />
          </div>
        </div>

        <!-- Ô Mật khẩu -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Mật khẩu bảo mật</label>
          <div class="relative group/input">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-amber-400 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </span>
            <input 
              v-model="credentials.password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              autocomplete="current-password"
              class="w-full pl-12 pr-12 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all shadow-inner"
              placeholder="••••••••••••"
            />
            <!-- Nút bật/tắt ẩn mật khẩu -->
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              tabindex="-1"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            </button>
          </div>
        </div>

        <!-- Thông báo lỗi -->
        <transition name="fade">
          <div v-if="errorMsg" class="p-3.5 bg-red-950/90 border border-red-500/60 rounded-2xl text-red-300 text-xs text-center font-medium flex items-center justify-center gap-2 shadow-lg">
            <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span>{{ errorMsg }}</span>
          </div>
        </transition>

        <!-- Nút Đăng Nhập Siêu Cấp -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-4 bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-[0.98] font-bold text-white rounded-2xl transition-all duration-300 shadow-xl shadow-red-900/60 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border border-red-400/40 relative overflow-hidden group/btn"
        >
          <!-- Hiệu ứng quét sáng chéo -->
          <div class="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-20deg] -translate-x-full group-hover/btn:translate-x-[350%] transition-transform duration-1000 ease-out"></div>

          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="tracking-wider text-sm sm:text-base">{{ loading ? 'Đang xác thực bảo mật...' : 'Đăng Nhập Hệ Thống' }}</span>
        </button>
      </form>

      <!-- Footer trạng thái bảo mật -->
      <div class="mt-8 pt-5 border-t border-slate-800/80 text-center flex items-center justify-center gap-2">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        <p class="text-[11px] text-slate-400 font-medium tracking-wide">Hệ thống quản lý nội bộ bảo mật cao 256-bit</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();
const credentials = ref({ username: '', password: '' });
const errorMsg = ref('');
const loading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await api.post('/auth/login', credentials.value);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      localStorage.setItem('loginDate', new Date().toDateString()); 
      router.push('/admin/hoat-dong');
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
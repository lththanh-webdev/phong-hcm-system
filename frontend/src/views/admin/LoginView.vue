<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 relative overflow-hidden">
    <!-- Hiệu ứng ánh sáng nền trang trí -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/80 shadow-2xl shadow-black/60 relative z-10">
      
      <!-- Header tiêu đề -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-900/40 mb-4 border border-red-500/30">
          <span class="text-3xl">⭐</span>
        </div>
        <h2 class="text-2xl font-black text-amber-400 uppercase tracking-wider drop-shadow">Cổng Quản Trị VTHC</h2>
        <p class="text-xs text-slate-400 mt-1 font-medium tracking-wide">Phòng Hồ Chí Minh Số - Tiểu Đoàn</p>
      </div>

      <!-- Form đăng nhập -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <!-- Ô Tài khoản -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tài khoản quản trị</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            <input 
              v-model="credentials.username" 
              type="text" 
              required 
              class="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              placeholder="Nhập tên đăng nhập..."
            />
          </div>
        </div>

        <!-- Ô Mật khẩu -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mật khẩu</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </span>
            <input 
              v-model="credentials.password" 
              type="password" 
              required 
              class="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <!-- Thông báo lỗi -->
        <transition name="fade">
          <div v-if="errorMsg" class="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-400 text-xs text-center font-medium">
            {{ errorMsg }}
          </div>
        </transition>

        <!-- Nút Đăng Nhập -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-[0.98] font-bold text-white rounded-xl transition-all shadow-lg shadow-red-900/50 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed border border-red-500/40"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống' }}</span>
        </button>
      </form>

      <!-- Footer nhỏ bên dưới form -->
      <div class="mt-6 text-center">
        <p class="text-[11px] text-slate-500">Hệ thống quản lý nội bộ bảo mật cao</p>
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
const loading = ref(false); // Thêm biến loading để tối ưu UI

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
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
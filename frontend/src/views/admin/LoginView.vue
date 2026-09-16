<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4 overflow-hidden font-sans">
    <!-- Hiệu ứng ánh sáng nền -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700 shadow-2xl relative z-10">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-900/50 mb-3 border border-red-500/30">
          <span class="text-3xl">⭐</span>
        </div>
        <h2 class="text-2xl font-black text-amber-400 uppercase tracking-wider">Cổng Quản Trị VTHC</h2>
        <p class="text-xs text-slate-400 mt-1">Phòng Hồ Chí Minh Số - Tiểu Đoàn</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Tài khoản</label>
          <input 
            v-model="credentials.username" 
            type="text" 
            required 
            class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
            placeholder="Nhập tên đăng nhập..."
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Mật khẩu</label>
          <input 
            v-model="credentials.password" 
            type="password" 
            required 
            class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
            placeholder="••••••••••••"
          />
        </div>

        <div v-if="errorMsg" class="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs text-center font-medium">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-bold text-white rounded-xl transition-all shadow-lg shadow-red-900/50 cursor-pointer disabled:opacity-50"
        >
          {{ loading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống' }}
        </button>
      </form>
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

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await api.post('/auth/login', credentials.value);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      router.push('/admin/hoat-dong');
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Đăng nhập thất bại!';
  } finally {
    loading.value = false;
  }
};
</script>
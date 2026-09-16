<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
    <div class="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-army-gold uppercase">Cổng Quản Trị VTHC</h2>
        <p class="text-xs text-slate-400 mt-1">Phòng Hồ Chí Minh Số - Tiểu Đoàn</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Tài khoản</label>
          <input 
            v-model="credentials.username" 
            type="text" 
            required 
            class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-army-gold"
            placeholder="Nhập username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Mật khẩu</label>
          <input 
            v-model="credentials.password" 
            type="password" 
            required 
            class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-army-gold"
            placeholder="••••••••"
          />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>

        <button 
          type="submit" 
          class="w-full py-3 bg-army-red hover:bg-red-700 font-bold text-white rounded-lg transition-all shadow-lg cursor-pointer"
        >
          Đăng Nhập Hệ Thống
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

const handleLogin = async () => {
  try {
    const res = await api.post('/auth/login', credentials.value);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      localStorage.setItem('loginDate', new Date().toDateString()); // 📌 Lưu mốc ngày hiện tại để tự động reset phiên đăng nhập khi sang ngày mới
      router.push('/admin/hoat-dong');
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Đăng nhập thất bại!';
  }
};
</script>
<template>
  <nav class="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50 px-4 py-3">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-3">
        <span class="text-2xl">⭐</span>
        <div>
          <h1 class="font-bold text-army-gold text-base uppercase leading-none">Phòng Hồ Chí Minh Số</h1>
          <span class="text-[10px] text-slate-400">Tiểu Đoàn Đột Phá Số</span>
        </div>
      </router-link>

      <!-- Menu Navigation -->
      <div class="flex gap-1 md:gap-4 text-xs font-semibold">
        <router-link to="/hoat-dong" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" active-class="bg-army-red text-white">Hoạt Động</router-link>
        <router-link to="/thu-vien" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" active-class="bg-army-red text-white">Thư Viện Số</router-link>
        <router-link to="/media" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" active-class="bg-army-red text-white">Ca Khúc & Điệu Nhảy</router-link>
        <router-link to="/tuong-niem" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" active-class="bg-army-red text-white">Tưởng Niệm</router-link>
        <router-link to="/trac-nghiem" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" active-class="bg-army-red text-white">Thi Trắc Nghiệm</router-link>
      </div>
    </div>
  </nav>
</template>
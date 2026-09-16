<template>
  <div class="media-page">
    <h2 class="section-title">🎶 CA KHÚC CÁCH MẠNG & ĐIỆU NHẢY TẬP THỂ</h2>
    
    <!-- Bộ lọc tab: Tất cả / Ca khúc / Điệu nhảy -->
    <div class="filter-tabs">
      <button :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">Tất cả</button>
      <button :class="{ active: currentFilter === 'song' }" @click="currentFilter = 'song'">🎵 Ca khúc cách mạng</button>
      <button :class="{ active: currentFilter === 'dance' }" @click="currentFilter = 'dance'">💃 Điệu nhảy tập thể</button>
    </div>

    <div class="media-grid">
      <div v-if="filteredMedia.length === 0" class="no-data">
        Chưa có nội dung media nào được đăng tải...
      </div>

      <div v-for="item in filteredMedia" :key="item.id" class="media-card">
        <div class="media-header-info">
          <span class="badge" :class="item.media_type">
            {{ item.media_type === 'song' ? '🎵 Ca khúc' : '💃 Điệu nhảy' }}
          </span>
          <h3>{{ item.title }}</h3>
          <p class="artist">Trình bày / Sáng tác: <strong>{{ item.artist || 'Đang cập nhật' }}</strong></p>
        </div>

        <!-- Trình phát Audio nếu là bài hát -->
        <div v-if="item.media_type === 'song'" class="player-container">
          <audio controls class="audio-player">
            <source :src="getMediaUrl(item.file_url)" type="audio/mpeg">
            Trình duyệt của bạn không hỗ trợ phát âm thanh.
          </audio>
        </div>

        <!-- Trình phát Video nếu là điệu nhảy -->
        <div v-else-if="item.media_type === 'dance'" class="player-container">
          <video controls class="video-player">
            <source :src="getMediaUrl(item.file_url)" type="video/mp4">
            Trình duyệt của bạn không hỗ trợ phát video.
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

// Khởi tạo Supabase client sử dụng biến môi trường Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default {
  data() {
    return {
      mediaList: [],
      currentFilter: 'all'
    };
  },
  computed: {
    filteredMedia() {
      if (this.currentFilter === 'all') return this.mediaList;
      return this.mediaList.filter(m => m.media_type === this.currentFilter);
    }
  },
  mounted() {
    this.fetchMedia();
  },
  methods: {
    // Lấy danh sách media từ bảng 'media' trên Supabase
    async fetchMedia() {
      try {
        const { data, error } = await supabase
          .from('media')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        this.mediaList = data || [];
      } catch (err) {
        console.error('Lỗi khi tải danh sách media từ Supabase:', err.message || err);
      }
    },

    // Hàm xử lý đường dẫn file (hỗ trợ cả URL đầy đủ hoặc lấy từ Supabase Storage bucket tên 'media-storage')
    getMediaUrl(fileUrl) {
      if (!fileUrl) return '';
      // Nếu file_url đã là URL tuyệt đối (http:// hoặc https://) thì dùng luôn
      if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
        return fileUrl;
      }
      // Nếu lưu dạng đường dẫn tương đối trong Supabase Storage Bucket (Ví dụ: 'songs/bai_hat_1.mp3')
      const { data } = supabase.storage.from('media-storage').getPublicUrl(fileUrl);
      return data.publicUrl;
    }
  }
};
</script>

<style scoped>
.media-page { max-width: 900px; margin: 0 auto; padding: 30px 20px; text-align: center; }
.section-title { font-size: 2rem; color: #ffd700; margin-bottom: 20px; }

.filter-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; }
.filter-tabs button { background: rgba(30, 41, 59, 0.8); border: 1px solid #475569; color: #cbd5e1; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.filter-tabs button.active, .filter-tabs button:hover { background: #2563eb; color: #fff; border-color: #3b82f6; }

.media-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.media-card { background: rgba(28, 37, 65, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.media-header-info { margin-bottom: 15px; }
.badge { display: inline-block; font-size: 0.75rem; padding: 3px 10px; border-radius: 4px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; }
.badge.song { background: #16a34a; color: #fff; }
.badge.dance { background: #9333ea; color: #fff; }
.media-card h3 { margin: 0 0 5px 0; color: #fff; font-size: 1.2rem; }
.artist { margin: 0; font-size: 0.9rem; color: #94a3b8; }
.artist strong { color: #e2e8f0; }

.player-container { margin-top: 10px; width: 100%; }
.audio-player { width: 100%; height: 40px; }
.video-player { width: 100%; max-height: 350px; border-radius: 8px; background: #000; }

.no-data { color: #94a3b8; font-style: italic; padding: 40px; }
</style>
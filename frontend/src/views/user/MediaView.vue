<template>
  <div class="media-page">
    <!-- Hero Banner & Thanh Tìm Kiếm -->
    <div class="media-hero">
      <div class="hero-glow"></div>
      <div class="hero-badge">🎶 Âm Vang & Chuyển Động</div>
      <h2 class="section-title">CA KHÚC CÁCH MẠNG & ĐIỆU NHẢY TẬP THỂ</h2>
      <p class="section-subtitle">Không gian lưu trữ âm thanh và video trực quan, sống động và truyền cảm hứng</p>
      
      <!-- Toolbar: Tìm kiếm & Bộ lọc -->
      <div class="media-toolbar">
        <div class="search-box-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm tên bài hát, điệu nhảy, tác giả..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">&times;</button>
        </div>

        <!-- Bộ lọc tab -->
        <div class="filter-tabs">
          <button :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">
            ✨ Tất cả <span class="count-badge">{{ mediaList.length }}</span>
          </button>
          <button :class="{ active: currentFilter === 'song' }" @click="currentFilter = 'song'">
            🎵 Ca khúc <span class="count-badge">{{ countSongs }}</span>
          </button>
          <button :class="{ active: currentFilter === 'dance' }" @click="currentFilter = 'dance'">
            💃 Điệu nhảy <span class="count-badge">{{ countDances }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lưới hiển thị Media -->
    <div class="media-grid-container">
      <div v-if="filteredMedia.length === 0" class="no-data-card">
        <div class="no-data-icon">📭</div>
        <p>Không tìm thấy nội dung media phù hợp với yêu cầu của bạn...</p>
      </div>

      <div v-for="item in filteredMedia" :key="item.id" class="media-card animate-card-fade">
        <div class="media-card-glow"></div>
        
        <div class="media-card-header">
          <div class="badge-wrapper">
            <span class="badge" :class="item.media_type">
              {{ item.media_type === 'song' ? '🎵 Ca khúc cách mạng' : '💃 Điệu nhảy tập thể' }}
            </span>
          </div>
          <span class="media-date" v-if="item.created_at">📅 {{ formatDate(item.created_at) }}</span>
        </div>

        <div class="media-info-body">
          <h3 class="media-title" :title="item.title">{{ item.title }}</h3>
          <p class="artist-text">
            <span class="artist-icon">✍️</span> 
            <span>Trình bày / Sáng tác: <strong>{{ item.artist || 'Đang cập nhật' }}</strong></span>
          </p>
        </div>

        <!-- Trình phát Audio nếu là bài hát -->
        <div v-if="item.media_type === 'song'" class="player-wrapper audio-wrapper">
          <div class="player-icon-indicator">🎧</div>
          <audio controls class="custom-audio-player">
            <source :src="getMediaUrl(item.file_url)" type="audio/mpeg">
            Trình duyệt của bạn không hỗ trợ phát âm thanh.
          </audio>
        </div>

        <!-- Trình phát Video nếu là điệu nhảy -->
        <div v-else-if="item.media_type === 'dance'" class="player-wrapper video-wrapper">
          <div class="video-container-inner">
            <video controls class="custom-video-player" preload="metadata">
              <source :src="getMediaUrl(item.file_url)" type="video/mp4">
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default {
  data() {
    return {
      mediaList: [],
      currentFilter: 'all',
      searchQuery: ''
    };
  },
  computed: {
    countSongs() {
      return this.mediaList.filter(m => m.media_type === 'song').length;
    },
    countDances() {
      return this.mediaList.filter(m => m.media_type === 'dance').length;
    },
    filteredMedia() {
      let list = this.mediaList;
      
      // Lọc theo tab loại media
      if (this.currentFilter !== 'all') {
        list = list.filter(m => m.media_type === this.currentFilter);
      }

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(m => 
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.artist && m.artist.toLowerCase().includes(q))
        );
      }

      return list;
    }
  },
  mounted() {
    this.fetchMedia();
  },
  methods: {
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

    getMediaUrl(fileUrl) {
      if (!fileUrl) return '';
      if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
        return fileUrl;
      }
      const { data } = supabase.storage.from('media-storage').getPublicUrl(fileUrl);
      return data.publicUrl;
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleDateString('vi-VN');
    }
  }
};
</script>

<style scoped>
.media-page {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 16px;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, sans-serif;
  background: radial-gradient(circle at 50% 0%, #1a0f0f 0%, #0c0404 60%, #050101 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.media-page *, .media-page *::before, .media-page *::after {
  box-sizing: border-box;
}

/* Hero Banner */
.media-hero {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.06) 0%, rgba(139, 0, 0, 0.18) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 80px;
  background: #ffd700;
  filter: blur(70px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.section-title {
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #cbd5e1;
  font-size: clamp(0.82rem, 1.4vw, 0.95rem);
  max-width: 600px;
  margin: 0 auto 20px auto;
}

/* Toolbar & Tìm kiếm */
.media-toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.search-box-wrapper {
  position: relative;
  width: 100%;
  max-width: 520px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 42px;
  border-radius: 50px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(15, 23, 42, 0.85);
  color: #fff;
  font-size: 0.88rem;
  outline: none;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.25);
}

.clear-search {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
}

/* Bộ lọc Tab */
.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tabs button {
  background: rgba(30, 15, 15, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #cbd5e1;
  padding: 7px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.82rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.count-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
}

.filter-tabs button.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border-color: #60a5fa;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.filter-tabs button:hover:not(.active) {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border-color: rgba(255, 215, 0, 0.4);
}

/* Lưới Media Grid (Responsive 2 cột trên desktop, 1 cột trên mobile) */
.media-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  width: 100%;
}

@media(max-width: 600px) {
  .media-grid-container {
    grid-template-columns: 1fr;
  }
}

/* Thẻ Media Card */
.media-card {
  position: relative;
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.media-card:hover {
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.12);
}

.media-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.badge {
  display: inline-block;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.song {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
  border: 1px solid rgba(22, 163, 74, 0.4);
}

.badge.dance {
  background: rgba(147, 51, 234, 0.2);
  color: #c084fc;
  border: 1px solid rgba(147, 51, 234, 0.4);
}

.media-date {
  font-size: 0.72rem;
  color: #94a3b8;
}

.media-info-body {
  margin-bottom: 16px;
  text-align: left;
}

.media-title {
  margin: 0 0 6px 0;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.artist-text {
  margin: 0;
  font-size: 0.82rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.artist-text strong {
  color: #e2e8f0;
}

/* Khung phát nhạc/video được tinh chỉnh đẹp mắt */
.player-wrapper {
  margin-top: auto;
  background: rgba(10, 5, 5, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px 12px;
}

.audio-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-icon-indicator {
  font-size: 1.1rem;
  background: rgba(255, 215, 0, 0.1);
  padding: 6px;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.custom-audio-player {
  width: 100%;
  height: 36px;
  filter: invert(90%) hue-rotate(180deg); /* Giúp trình phát native tối màu hợp giao diện */
}

.video-container-inner {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  max-height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-video-player {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  display: block;
}

/* Trạng thái không có dữ liệu */
.no-data-card {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 20px;
  background: rgba(20, 10, 10, 0.6);
  border: 1px dashed rgba(255, 215, 0, 0.2);
  border-radius: 14px;
  color: #94a3b8;
}

.no-data-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-card-fade {
  animation: cardFadeIn 0.3s ease forwards;
}
</style>
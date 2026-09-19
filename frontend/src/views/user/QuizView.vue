<template>
  <div class="quiz-page">
    <!-- Hero Banner -->
    <div class="quiz-hero">
      <div class="hero-glow"></div>
      <div class="hero-badge">📜 Thử Thách Tri Thức</div>
      <h2 class="section-title">THI TRẮC NGHIỆM TÌM HIỂU TRUYỀN THỐNG</h2>
      <p class="section-subtitle">Khám phá và kiểm tra kiến thức lịch sử qua hệ thống câu hỏi tương tác trực quan</p>
    </div>

    <!-- Trạng thái Đang tải / Trống -->
    <div v-if="loading" class="quiz-status-card">
      <div class="spinner"></div>
      <p>Đang tải hệ thống câu hỏi từ cơ sở dữ liệu...</p>
    </div>
    
    <div v-else-if="questions.length === 0" class="quiz-status-card">
      <div class="no-data-icon">📭</div>
      <p>Chưa có câu hỏi trắc nghiệm nào được cập nhật từ hệ thống.</p>
    </div>

    <!-- Khu vực làm bài trắc nghiệm thông minh -->
    <div v-else class="quiz-main-layout">
      
      <!-- Bảng điều hướng nhanh các câu hỏi (Sidebar trái trên desktop, thu gọn trên mobile) -->
      <div class="quiz-sidebar-panel">
        <div class="sidebar-title">🧭 Danh sách câu hỏi</div>
        <div class="question-nav-grid">
          <button 
            v-for="(q, idx) in questions" 
            :key="q.id"
            class="nav-dot-btn"
            :class="{ 
              active: currentIndex === idx, 
              answered: userAnswers[q.id] !== undefined 
            }"
            @click="jumpToQuestion(idx)"
            :title="`Câu ${idx + 1}: ${userAnswers[q.id] !== undefined ? 'Đã trả lời' : 'Chưa trả lời'}`"
          >
            {{ idx + 1 }}
          </button>
        </div>
        <div class="sidebar-legend">
          <span class="legend-item"><i class="dot answered-dot"></i> Đã chọn</span>
          <span class="legend-item"><i class="dot current-dot"></i> Đang xem</span>
        </div>
      </div>

      <!-- Thẻ câu hỏi chính -->
      <div class="quiz-content-wrapper">
        <transition name="fade-slide" mode="out-in">
          <div v-if="!isSubmitted" :key="currentIndex" class="quiz-card">
            
            <div class="quiz-top-meta">
              <span class="current-q-badge">Câu hỏi {{ currentIndex + 1 }} / {{ questions.length }}</span>
              <span class="answered-counter">Đã hoàn thành: <strong>{{ Object.keys(userAnswers).length }}</strong>/{{ questions.length }}</span>
            </div>

            <div class="quiz-progress-bar">
              <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"></div>
            </div>
            
            <h3 class="question-text">{{ currentQuestion.question }}</h3>

            <div class="options-grid">
              <button 
                v-for="(opt, optIdx) in currentQuestion.options" 
                :key="optIdx"
                class="opt-btn"
                :class="{ selected: userAnswers[currentQuestion.id] === (optIdx + 1) }"
                @click="selectOption(currentQuestion.id, optIdx + 1)"
              >
                <span class="opt-label">{{ String.fromCharCode(65 + optIdx) }}</span> 
                <span class="opt-text">{{ opt }}</span>
                <span class="opt-check-icon" v-if="userAnswers[currentQuestion.id] === (optIdx + 1)">✓</span>
              </button>
            </div>

            <div class="quiz-nav-actions">
              <button class="btn-secondary" :disabled="currentIndex === 0" @click="prevQuestion">
                ⬅️ Câu trước
              </button>
              
              <button v-if="currentIndex < questions.length - 1" class="btn-primary" @click="nextQuestion">
                Câu tiếp theo ➡️
              </button>
              <button v-else class="btn-submit-action" @click="submitQuiz">
                🚀 Nộp Bài Thi Ngay
              </button>
            </div>
          </div>
        </transition>

        <!-- Màn hình kết quả bài thi xịn xò -->
        <transition name="fade-popup">
          <div v-if="isSubmitted" class="result-card">
            <div class="result-header-icon">🏆</div>
            <h3>KẾT QUẢ BÀI THI TRẮC NGHIỆM</h3>
            
            <div class="score-display-box">
              <div class="score-number-wrapper">
                <span class="score-val">{{ score }}</span>
                <span class="score-total">/ {{ questions.length }}</span>
              </div>
              <p class="score-encouragement">{{ getScoreMessage(score, questions.length) }}</p>
            </div>

            <div class="review-section-title">📖 Xem lại chi tiết đáp án & giải thích</div>
            <div class="review-list">
              <div 
                v-for="(q, idx) in questions" 
                :key="q.id" 
                class="review-item" 
                :class="isCorrect(q) ? 'correct' : 'incorrect'"
              >
                <div class="review-q-header">
                  <span class="review-q-num">Câu {{ idx + 1 }}</span>
                  <span class="review-status-badge" :class="isCorrect(q) ? 'badge-correct' : 'badge-incorrect'">
                    {{ isCorrect(q) ? '✔️ Chính xác' : '❌ Chưa chính xác' }}
                  </span>
                </div>
                
                <p class="review-q-title">{{ q.question }}</p>
                
                <div class="review-answers-box">
                  <p class="user-choice">
                    Lựa chọn của bạn: 
                    <strong :class="isCorrect(q) ? 'text-green' : 'text-red'">
                      {{ userAnswers[q.id] ? String.fromCharCode(64 + userAnswers[q.id]) + '. ' + q.options[userAnswers[q.id] - 1] : 'Chưa chọn' }}
                    </strong>
                  </p>
                  <p v-if="!isCorrect(q)" class="correct-choice">
                    Đáp án chuẩn: <strong class="text-green">{{ String.fromCharCode(64 + q.correct_option) }}. {{ q.options[q.correct_option - 1] }}</strong>
                  </p>
                </div>

                <div v-if="q.explanation" class="explanation-box">
                  💡 <strong>Giải thích:</strong> {{ q.explanation }}
                </div>
              </div>
            </div>

            <button class="btn-restart" @click="restartQuiz">🔄 Làm Lại Bài Thi Mới</button>
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const questions = ref([]);
const currentIndex = ref(0);
const userAnswers = ref({});
const isSubmitted = ref(false);
const score = ref(0);
const loading = ref(true);

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value] || {};
});

const fetchQuizzes = async () => {
  try {
    const { data, error } = await supabase
      .from('quiz')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    questions.value = data || [];
  } catch (err) {
    console.error('Lỗi khi tải câu hỏi từ Supabase:', err.message || err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchQuizzes();
});

const selectOption = (questionId, optionNumber) => {
  userAnswers.value[questionId] = optionNumber;
};

const jumpToQuestion = (index) => {
  currentIndex.value = index;
};

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const submitQuiz = () => {
  let correctCount = 0;
  questions.value.forEach(q => {
    if (userAnswers.value[q.id] === q.correct_option) {
      correctCount++;
    }
  });
  score.value = correctCount;
  isSubmitted.value = true;
};

const isCorrect = (q) => {
  return userAnswers.value[q.id] === q.correct_option;
};

const restartQuiz = () => {
  userAnswers.value = {};
  currentIndex.value = 0;
  isSubmitted.value = false;
  score.value = 0;
};

const getScoreMessage = (sc, total) => {
  const ratio = sc / total;
  if (ratio === 1) return '🌟 Tuyệt vời! Bạn đã hoàn thành xuất sắc bài thi với điểm số tuyệt đối.';
  if (ratio >= 0.8) return '🎉 Rất tốt! Bạn hiểu rất sâu sắc về truyền thống lịch sử hào hùng.';
  if (ratio >= 0.5) return '👍 Khá tốt! Bạn có thể xem lại một số nội dung ôn tập để hoàn thiện hơn nữa.';
  return '📚 Cố gắng lên nhé! Hãy đọc thêm tư liệu lịch sử truyền thống và thử sức lại.';
};
</script>

<style scoped>
.quiz-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, sans-serif;
  background: radial-gradient(circle at 50% 0%, #1a0f0f 0%, #0c0404 60%, #050101 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.quiz-page *, .quiz-page *::before, .quiz-page *::after {
  box-sizing: border-box;
}

/* Hero Banner */
.quiz-hero {
  position: relative;
  text-align: center;
  margin-bottom: 24px;
  padding: 28px 20px;
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
  margin-bottom: 8px;
}

.section-title {
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.section-subtitle {
  color: #cbd5e1;
  font-size: clamp(0.82rem, 1.4vw, 0.95rem);
  max-width: 600px;
  margin: 0 auto;
}

/* Trạng thái tải */
.quiz-status-card {
  background: rgba(22, 10, 10, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  padding: 50px 20px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid rgba(255, 215, 0, 0.2);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-data-icon { font-size: 2.5rem; margin-bottom: -5px; }

/* Bố cục chính Grid: Sidebar điều hướng câu hỏi + Thẻ câu hỏi */
.quiz-main-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  align-items: start;
}

@media(max-width: 900px) {
  .quiz-main-layout {
    grid-template-columns: 1fr;
  }
}

/* Sidebar Điều Hướng Nhanh */
.quiz-sidebar-panel {
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.sidebar-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  padding-bottom: 8px;
}

.question-nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.nav-dot-btn {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-dot-btn:hover {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  color: #ffd700;
}

.nav-dot-btn.active {
  border-color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}

.nav-dot-btn.answered {
  background: rgba(22, 163, 74, 0.25);
  border-color: rgba(22, 163, 74, 0.5);
  color: #4ade80;
}

.sidebar-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #94a3b8;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 10px;
}

.legend-item { display: flex; align-items: center; gap: 4px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.answered-dot { background: #4ade80; }
.current-dot { background: #38bdf8; }

/* Thẻ Câu Hỏi & Kết Quả */
.quiz-content-wrapper { width: 100%; min-width: 0; }

.quiz-card, .result-card {
  background: rgba(22, 10, 10, 0.88);
  backdrop-filter: blur(16px);
  padding: 28px;
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  text-align: left;
}

.quiz-top-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.current-q-badge {
  color: #38bdf8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.answered-counter { color: #94a3b8; }
.answered-counter strong { color: #ffd700; }

.quiz-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.4s ease;
}

.question-text {
  color: #fff;
  margin-bottom: 20px;
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.6;
  font-weight: 700;
}

/* Lưới Tùy Chọn Đáp Án */
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.opt-btn {
  background: rgba(30, 15, 15, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.92rem;
  text-align: left;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.opt-btn:hover {
  background: rgba(255, 215, 0, 0.08);
  border-color: rgba(255, 215, 0, 0.4);
  color: #fff;
  transform: translateX(3px);
}

.opt-btn.selected {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(29, 78, 216, 0.3));
  border-color: #60a5fa;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.3);
}

.opt-label {
  font-weight: 800;
  color: #ffd700;
  font-size: 1rem;
  background: rgba(255, 215, 0, 0.1);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 215, 0, 0.25);
}

.opt-text { flex: 1; line-height: 1.4; }
.opt-check-icon { color: #4ade80; font-weight: bold; font-size: 1.1rem; }

/* Thanh Điều Hướng Dưới */
.quiz-nav-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  padding-top: 16px;
}

.btn-secondary, .btn-primary {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.btn-secondary:hover:not(:disabled) { background: rgba(255, 255, 255, 0.15); color: #fff; }
.btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }

.btn-submit-action {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
}

.btn-submit-action:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* Màn Hình Kết Quả */
.result-header-icon {
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 6px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.result-card h3 {
  color: #ffd700;
  text-align: center;
  margin-bottom: 16px;
  font-size: 1.3rem;
  font-weight: 800;
}

.score-display-box {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.score-number-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.score-val {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffd700;
  line-height: 1;
}

.score-total {
  font-size: 1.3rem;
  color: #94a3b8;
  font-weight: 700;
}

.score-encouragement {
  font-size: 0.88rem;
  color: #38bdf8;
  margin-top: 8px;
  font-style: italic;
}

.review-section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) rgba(0,0,0,0.2);
}

.review-item {
  background: rgba(15, 23, 42, 0.75);
  padding: 14px;
  border-radius: 10px;
  border-left: 4px solid #64748b;
  font-size: 0.88rem;
}

.review-item.correct { border-left-color: #16a34a; }
.review-item.incorrect { border-left-color: #ef4444; }

.review-q-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.review-q-num {
  font-weight: 700;
  color: #ffd700;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.review-status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-correct { background: rgba(22, 163, 74, 0.2); color: #4ade80; }
.badge-incorrect { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.review-q-title { color: #fff; font-weight: 600; margin: 0 0 8px 0; }
.review-answers-box { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px; }
.review-answers-box p { margin: 0; color: #cbd5e1; font-size: 0.84rem; }

.text-green { color: #4ade80 !important; font-weight: 600; }
.text-red { color: #f87171 !important; font-weight: 600; }

.explanation-box {
  background: rgba(56, 189, 248, 0.08);
  border-left: 3px solid #38bdf8;
  padding: 8px 10px;
  border-radius: 6px;
  color: #38bdf8;
  font-size: 0.82rem;
  margin-top: 8px;
  font-style: italic;
}

.btn-restart {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  font-size: 0.95rem;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.btn-restart:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* Hiệu ứng chuyển động Vue */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(15px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-15px); }

.fade-popup-enter-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.fade-popup-enter-from { opacity: 0; transform: scale(0.95); }
</style>
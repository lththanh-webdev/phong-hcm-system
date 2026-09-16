<template>
  <div class="quiz-page">
    <h2 class="section-title">THI TRẮC NGHIỆM TÌM HIỂU TRUYỀN THỐNG</h2>

    <div v-if="loading" class="quiz-status">
      <div class="spinner"></div>
      <p>Đang tải hệ thống câu hỏi từ cơ sở dữ liệu...</p>
    </div>
    
    <div v-else-if="questions.length === 0" class="quiz-status">
      <p>Chưa có câu hỏi trắc nghiệm nào được cập nhật từ hệ thống.</p>
    </div>

    <!-- Khu vực làm bài trắc nghiệm -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="!isSubmitted && questions.length > 0" :key="currentIndex" class="quiz-card">
        <div class="quiz-progress-bar">
          <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"></div>
        </div>
        
        <div class="quiz-progress">
          <span>Câu hỏi {{ currentIndex + 1 }} / {{ questions.length }}</span>
          <span class="answered-count">Đã trả lời: {{ Object.keys(userAnswers).length }}/{{ questions.length }}</span>
        </div>
        
        <h3>{{ currentQuestion.question }}</h3>

        <div class="options-grid">
          <button 
            v-for="(opt, optIdx) in currentQuestion.options" 
            :key="optIdx"
            class="opt-btn"
            :class="{ selected: userAnswers[currentQuestion.id] === (optIdx + 1) }"
            @click="selectOption(currentQuestion.id, optIdx + 1)"
          >
            <span class="opt-label">{{ String.fromCharCode(65 + optIdx) }}.</span> 
            <span class="opt-text">{{ opt }}</span>
          </button>
        </div>

        <div class="quiz-nav">
          <button class="btn-secondary" :disabled="currentIndex === 0" @click="prevQuestion">
            ⬅️ Câu trước
          </button>
          <button v-if="currentIndex < questions.length - 1" class="btn-primary" @click="nextQuestion">
            Câu tiếp theo ➡️
          </button>
          <button v-else class="btn-submit-action" @click="submitQuiz">
            🚀 Nộp Bài Thi
          </button>
        </div>
      </div>
    </transition>

    <!-- Màn hình kết quả bài thi -->
    <transition name="fade-popup">
      <div v-if="isSubmitted" class="result-card">
        <div class="result-header-icon">🏆</div>
        <h3>KẾT QUẢ BÀI THI TRẮC NGHIỆM</h3>
        
        <div class="score-display">
          Tổng số câu đúng: <strong>{{ score }} / {{ questions.length }}</strong>
          <p class="score-encouragement">{{ getScoreMessage(score, questions.length) }}</p>
        </div>

        <div class="review-list">
          <div 
            v-for="(q, idx) in questions" 
            :key="q.id" 
            class="review-item" 
            :class="isCorrect(q) ? 'correct' : 'incorrect'"
          >
            <p><strong>Câu {{ idx + 1 }}:</strong> {{ q.question }}</p>
            <p>
              Lựa chọn của bạn: 
              <strong :class="isCorrect(q) ? 'text-green' : 'text-red'">
                {{ userAnswers[q.id] ? String.fromCharCode(64 + userAnswers[q.id]) + '. ' + q.options[userAnswers[q.id] - 1] : 'Chưa chọn' }}
              </strong>
            </p>
            <p v-if="!isCorrect(q)">
              Đáp án chuẩn: <strong class="text-green">{{ String.fromCharCode(64 + q.correct_option) }}. {{ q.options[q.correct_option - 1] }}</strong>
            </p>
            <p v-if="q.explanation" class="explanation">
              💡 <em>Giải thích: {{ q.explanation }}</em>
            </p>
          </div>
        </div>

        <button class="btn-restart" @click="restartQuiz">🔄 Làm Lại Bài Thi</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client sử dụng biến môi trường Vite
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

// Hàm lấy câu hỏi trực tiếp từ bảng 'quiz' (đồng bộ với Admin) trên Supabase
const fetchQuizzes = async () => {
  try {
    const { data, error } = await supabase
      .from('quiz') // Đã sửa từ 'quizzes' thành 'quiz' để khớp với bảng của Admin
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
  if (ratio === 1) return '🌟 Tuyệt vời! Bạn hoàn thành xuất sắc bài thi.';
  if (ratio >= 0.8) return '🎉 Rất tốt! Bạn hiểu rất rõ về truyền thống lịch sử.';
  if (ratio >= 0.5) return '👍 Khá tốt! Bạn có thể xem lại một số nội dung để hoàn thiện hơn.';
  return '📚 Cố gắng lên nhé! Hãy đọc thêm tài liệu lịch sử và thử lại.';
};
</script>

<style scoped>
.quiz-page {
  max-width: 850px;
  margin: 0 auto;
  padding: 30px 20px;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 25px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

.quiz-status {
  color: #94a3b8;
  font-style: italic;
  font-size: 1.1rem;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
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

.quiz-card, .result-card {
  background: rgba(28, 37, 65, 0.85);
  margin: 0 auto;
  padding: 35px;
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  text-align: left;
  backdrop-filter: blur(10px);
}

.quiz-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 16px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.4s ease;
}

.quiz-progress {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #38bdf8;
  font-weight: bold;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.answered-count {
  color: #cbd5e1;
}

.quiz-card h3 {
  color: #fff;
  margin-bottom: 25px;
  font-size: 1.2rem;
  line-height: 1.6;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 30px;
}

.opt-btn {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.opt-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  transform: translateX(4px);
}

.opt-btn.selected {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: #60a5fa;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
}

.opt-label {
  font-weight: bold;
  color: #ffd700;
  font-size: 1.05rem;
}

.quiz-nav {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.btn-secondary {
  background: #475569;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: #334155;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-submit-action {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.btn-submit-action:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.result-header-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.result-card h3 {
  color: #ffd700;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.score-display {
  font-size: 1.2rem;
  color: #e2e8f0;
  margin-bottom: 25px;
  text-align: center;
}

.score-display strong {
  color: #ffd700;
  font-size: 1.4rem;
}

.score-encouragement {
  font-size: 0.95rem;
  color: #38bdf8;
  margin-top: 6px;
  font-style: italic;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 48vh;
  overflow-y: auto;
  margin-bottom: 25px;
  padding-right: 8px;
}

/* Tùy chỉnh thanh cuộn đẹp mắt */
.review-list::-webkit-scrollbar {
  width: 6px;
}
.review-list::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
}
.review-list::-webkit-scrollbar-thumb {
  background: rgba(255,215,0,0.3);
  border-radius: 3px;
}

.review-item {
  background: rgba(15, 23, 42, 0.7);
  padding: 16px;
  border-radius: 10px;
  border-left: 5px solid #64748b;
  font-size: 0.95rem;
}

.review-item.correct {
  border-left-color: #16a34a;
}

.review-item.incorrect {
  border-left-color: #ef4444;
}

.review-item p {
  margin: 6px 0;
  color: #e2e8f0;
}

.text-green {
  color: #4ade80 !important;
}

.text-red {
  color: #f87171 !important;
}

.explanation {
  color: #38bdf8 !important;
  font-style: italic;
  margin-top: 10px !important;
  background: rgba(56, 189, 248, 0.08);
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #38bdf8;
}

.btn-restart {
  background: linear-gradient(135deg, #da251d, #b91c1c);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1.05rem;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(218, 37, 29, 0.4);
}

.btn-restart:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* Hiệu ứng chuyển động Vue Transition */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-popup-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-popup-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
</style>
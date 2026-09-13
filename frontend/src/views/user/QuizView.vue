<template>
  <div class="quiz-page">
    <h2 class="section-title">THI TRẮC NGHIỆM TÌM HIỂU TRUYỀN THỐNG</h2>

    <div v-if="loading" class="quiz-status">Đang tải hệ thống câu hỏi...</div>
    <div v-else-if="questions.length === 0" class="quiz-status">Chưa có câu hỏi trắc nghiệm nào được cập nhật từ quản trị viên.</div>

    <div v-else-if="!isSubmitted" class="quiz-card">
      <div class="quiz-progress">
        <span>Câu hỏi {{ currentIndex + 1 }} / {{ questions.length }}</span>
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
          <span class="opt-label">{{ String.fromCharCode(65 + optIdx) }}.</span> {{ opt }}
        </button>
      </div>

      <div class="quiz-nav">
        <button class="btn-secondary" :disabled="currentIndex === 0" @click="prevQuestion">⬅️ Câu trước</button>
        <button v-if="currentIndex < questions.length - 1" class="btn-primary" @click="nextQuestion">Câu tiếp theo ➡️</button>
        <button v-else class="btn-submit-action" @click="submitQuiz">🚀 Nộp Bài Thi</button>
      </div>
    </div>

    <!-- Màn hình kết quả bài thi -->
    <div v-else class="result-card">
      <h3>🎉 KẾT QUẢ BÀI THI TRẮC NGHIỆM</h3>
      <div class="score-display">
        Tổng số câu đúng: <strong>{{ score }} / {{ questions.length }}</strong>
      </div>

      <div class="review-list">
        <div v-for="(q, idx) in questions" :key="q.id" class="review-item" :class="isCorrect(q) ? 'correct' : 'incorrect'">
          <p><strong>Câu {{ idx + 1 }}:</strong> {{ q.question }}</p>
          <p>Lựa chọn của bạn: <strong>{{ userAnswers[q.id] ? String.fromCharCode(64 + userAnswers[q.id]) : 'Chưa chọn' }}</strong></p>
          <p>Đáp án chuẩn: <strong>{{ String.fromCharCode(64 + q.correct_option) }}</strong></p>
          <p v-if="q.explanation" class="explanation">💡 <em>Giải thích: {{ q.explanation }}</em></p>
        </div>
      </div>

      <button class="btn-submit" @click="restartQuiz">🔄 Làm Lại Bài Thi</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      currentIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      score: 0,
      loading: true
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || {};
    }
  },
  mounted() {
    this.fetchQuizzes();
  },
  methods: {
    async fetchQuizzes() {
      try {
        const res = await fetch('http://localhost:5002/api/quizzes');
        if (res.ok) {
          this.questions = await res.json();
        }
      } catch (err) {
        console.error('Lỗi khi tải câu hỏi:', err);
      } finally {
        this.loading = false;
      }
    },
    selectOption(questionId, optionNumber) {
      this.userAnswers[questionId] = optionNumber;
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
      }
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    submitQuiz() {
      let correctCount = 0;
      this.questions.forEach(q => {
        if (this.userAnswers[q.id] === q.correct_option) {
          correctCount++;
        }
      });
      this.score = correctCount;
      this.isSubmitted = true;
    },
    isCorrect(q) {
      return this.userAnswers[q.id] === q.correct_option;
    },
    restartQuiz() {
      this.userAnswers = {};
      this.currentIndex = 0;
      this.isSubmitted = false;
      this.score = 0;
    }
  }
};
</script>

<style scoped>
.quiz-page { max-width: 850px; margin: 0 auto; padding: 30px 20px; text-align: center; }
.section-title { font-size: 2rem; color: #ffd700; margin-bottom: 25px; }
.quiz-status { color: #94a3b8; font-style: italic; font-size: 1.1rem; padding: 40px; }

.quiz-card, .result-card { background: rgba(28, 37, 65, 0.85); margin: 0 auto; padding: 35px; border-radius: 16px; border: 1px solid rgba(255,215,0,0.25); box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: left; }
.quiz-progress { font-size: 0.85rem; color: #38bdf8; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
.quiz-card h3 { color: #fff; margin-bottom: 25px; font-size: 1.25rem; line-height: 1.6; }

.options-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 30px; }
.opt-btn { background: rgba(255,255,255,0.04); color: #fff; border: 1px solid rgba(255,255,255,0.15); padding: 15px 20px; border-radius: 10px; cursor: pointer; font-size: 1rem; text-align: left; transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
.opt-btn:hover { background: rgba(59, 130, 246, 0.2); border-color: #3b82f6; }
.opt-btn.selected { background: #2563eb; border-color: #3b82f6; font-weight: bold; box-shadow: 0 0 12px rgba(37, 99, 235, 0.6); }
.opt-label { font-weight: bold; color: #ffd700; font-size: 1.05rem; }

.quiz-nav { display: flex; justify-content: space-between; gap: 15px; margin-top: 20px; }
.btn-secondary { background: #475569; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
.btn-secondary:hover:not(:disabled) { background: #334155; }
.btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-primary { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
.btn-primary:hover { background: #1d4ed8; }

.btn-submit-action { background: #16a34a; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
.btn-submit-action:hover { background: #15803d; }

.score-display { font-size: 1.3rem; color: #ffd700; margin-bottom: 25px; text-align: center; }
.review-list { display: flex; flex-direction: column; gap: 15px; max-height: 50vh; overflow-y: auto; margin-bottom: 25px; padding-right: 8px; }
.review-item { background: rgba(15, 23, 42, 0.7); padding: 16px; border-radius: 10px; border-left: 5px solid #64748b; font-size: 0.95rem; }
.review-item.correct { border-left-color: #16a34a; }
.review-item.incorrect { border-left-color: #ef4444; }
.review-item p { margin: 6px 0; color: #e2e8f0; }
.explanation { color: #38bdf8 !important; font-style: italic; margin-top: 10px !important; background: rgba(56, 189, 248, 0.08); padding: 8px 12px; border-radius: 6px; }

.btn-submit { background: #da251d; color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; font-size: 1.05rem; transition: background 0.2s; }
.btn-submit:hover { background: #b91c1c; }
</style>
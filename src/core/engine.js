// src/core/engine.js
import { questions } from '../data/questions.js';
import { optionWeights } from './constants.js'; 
import { addWeightsToScore, getFinalScores } from './score.js';

export class QuizEngine {
    constructor(questions) {
        this.currentIndex = 0;
        this.userAnswers = [];
        this.questions = questions;
    }

    preloadNextImage(nextIndex) {
        const nextQuestion = this.questions[nextIndex];
        // 检查下一题是否存在，且是否配置了 image 字段
        if (nextQuestion && nextQuestion.image) {
            const img = new Image();
            img.src = nextQuestion.image; // 赋值 src 即可触发浏览器自动下载并缓存
            console.log(`[Preload] 已预加载下一题图片: ${nextQuestion.image}`);
        }
    }

    getCurrentQuestion() {
        if (this.isFinished()) return null;
        return questions[this.currentIndex];
    }

    isFinished() {
        return this.currentIndex >= questions.length;
    }

    getProgress() {
        return {
            current: this.currentIndex + 1,
            total: questions.length
        };
    }

    submitAnswer(selectedOption) {
        this.userAnswers.push(selectedOption.letter);
        
        // 1. Calculate Score
        const weightsToApply = optionWeights[selectedOption.id];
        if (weightsToApply) {
            addWeightsToScore(weightsToApply);
        }

        // 2. Determine Next Question
        if (selectedOption.nextId) {
            const targetIndex = questions.findIndex(q => q.id === selectedOption.nextId);
            this.currentIndex = targetIndex !== -1 ? targetIndex : this.currentIndex + 1;
        } else {
            this.currentIndex++;
        }
    }

    handleAnswer(selectedChoice) {
        // 1. 阻止重复点击（结合 CSS 的 .disabled 类）
        const optionsWrapper = document.querySelector('.options-wrapper');
        if (optionsWrapper) optionsWrapper.classList.add('disabled');

        // 2. 计算分数和下一题的 Index
        // ... 你的逻辑 ...
        const nextIdx = this.currentIndex + 1; // 或根据你的跳题逻辑计算得出

        // 3. 触发下一题图片预加载
        if (nextIdx < this.questions.length) {
            this.preloadNextImage(nextIdx);
        }

        // 4. 延迟一点执行切题，让过渡动画播完
        setTimeout(() => {
            this.currentIndex = nextIdx;
            this.renderCurrentQuestion(); // 渲染下一题
            
            // 恢复点击
            if (optionsWrapper) optionsWrapper.classList.remove('disabled');
        }, 300); // 300ms 对应你 CSS 里的 transition 时间
    }
    
    getResults() {
        return getFinalScores();
    }
}
// js/app.js
import { initBGM } from '../utils/bgm.js';
import { saveUserResult } from './analytics.js';
import { dimensionLabels } from './constants.js';
import { QuizEngine } from './engine.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { QuestionCard } from '../components/QuestionCard.js';
import { questions } from '../data/questions.js';
import { addWeightsToScore, getFinalScores } from './score.js'; // 注意你的文件名现在是 score.js
import { optionWeights } from './constants.js'; // 假设你的权重逻辑放在了 engine.js 里，请根据实际情况修改

// Initialization
initBGM();
const engine = new QuizEngine();
const progressBar = new ProgressBar('progress-text');
const questionCard = new QuestionCard({
    textId: 'question-text',
    imageId: 'image-section',
    optionsId: 'options-wrapper',
    cardBodyId: 'card-body'
});

// Main Render Loop
function renderCurrentState() {
    if (engine.isFinished()) {
        showResults();
        return;
    }

    const currentQuestion = engine.getCurrentQuestion();
    const progress = engine.getProgress();

    progressBar.update(progress.current, progress.total);
    questionCard.render(currentQuestion, handleAnswer);
}

// Controller Actions
function handleAnswer(selectedOption) {
    engine.submitAnswer(selectedOption);
    questionCard.animateTransition(() => {
        renderCurrentState();
    });
}

function showResults() {
    // 1. 隐藏答题卡和进度条
    if (questionCard) questionCard.hide();
    if (progressBar) progressBar.hide();
    const footerHint = document.querySelector('.footer-hint');
    if (footerHint) footerHint.style.display = 'none';

    // 2. 获取最终得分
    const finalScores = engine.getResults();
    console.log("最终得分：", finalScores);

    // 3. 显示结果页容器并强制置顶
    const resultPage = document.getElementById('result-page');
    if (resultPage) resultPage.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. 设定结果配图 (注意路径要对上你的新结构)
    const resultImage = document.getElementById('result-image');
    if (resultImage) resultImage.src = 'src/assets/result.png';

    // 5. 渲染双向柱状图 (结合你导入的 dimensionLabels)
    const statsContainer = document.getElementById('result-stats');
    if (statsContainer) {
        statsContainer.innerHTML = ''; // 清空容器
        const MAX_SCORE = 10; // 理论最大分差，防爆框用

        for (let dim in finalScores) {
            if (!dimensionLabels[dim]) continue; 
            
            const score = finalScores[dim];
            const labels = dimensionLabels[dim];
            const isPositive = score >= 0;
            
            let percentage = (Math.abs(score) / MAX_SCORE) * 50;
            if (percentage > 50) percentage = 50; 

            // 构建 HTML 骨架 (宽度先设为 0%)
            const rowHtml = `
                <div class="stat-row-container">
                    <div class="stat-labels">
                        <span class="stat-label-neg">${labels[0]}</span>
                        <span class="stat-name">${dim} <span style="font-size:10px; color:gray;">(${score})</span></span>
                        <span class="stat-label-pos">${labels[1]}</span>
                    </div>
                    <div class="stat-track">
                        <div class="stat-midline"></div>
                        <div class="stat-fill ${isPositive ? 'positive' : 'negative'}" style="width: 0%;"></div>
                    </div>
                </div>
            `;
            statsContainer.insertAdjacentHTML('beforeend', rowHtml);
        }

        // 6. 触发进度条生长动画
        setTimeout(() => {
            const fills = statsContainer.querySelectorAll('.stat-fill');
            let i = 0;
            for (let dim in finalScores) {
                if (!dimensionLabels[dim]) continue;
                const score = finalScores[dim];
                let percentage = (Math.abs(score) / MAX_SCORE) * 50;
                if (percentage > 50) percentage = 50;
                
                if (fills[i]) fills[i].style.width = `${percentage}%`;
                i++;
            }
        }, 100);
    }

    // 7. 发送数据到 Firebase 分析后台
    saveUserResult(finalScores, "Test Result"); 
}

// Keyboard Bindings
document.addEventListener('keydown', (event) => {
    if (engine.isFinished()) return;

    const key = event.key.toUpperCase();
    const currentQuestion = engine.getCurrentQuestion();
    const index = currentQuestion.options.findIndex(opt => opt.letter === key);
    
    if (index !== -1) {
        const buttons = document.querySelectorAll('.option-btn');
        if (buttons[index]) {
            buttons[index].style.backgroundColor = "rgba(250, 122, 180, 0.2)";
            buttons[index].style.borderColor = "var(--theme-pink)";
            setTimeout(() => {
                handleAnswer(currentQuestion.options[index]);
            }, 150);
        }
    }
});

// Start App
renderCurrentState();
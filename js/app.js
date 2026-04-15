import { questions } from './data.js';
import { optionWeights } from './weights.js'; 
import { addWeightsToScore, getFinalScores } from './score.js';
import { initBGM } from './bgm.js';

let currentIndex = 0;
let userAnswers = [];

initBGM();

const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const optionsWrapper = document.getElementById('options-wrapper');
const cardBody = document.getElementById('card-body');
const dimensionLabels = {
    "弹性": ["弹性不足", "试试你弹性"],
    "串商": ["假bm", "怕干.skill"],
    "理智": ["疯人院", "985高才生"],
    "攻击性": ["狠狠嘶咬", "区"],
    "逆反": ["退票", "不如再区一点"],
    "锐气": ["遮遮掩掩", "大大方方"],
    "本命執着": ["心肝", "发卖彩笔"],
    "决策风格": ["未开发", "使用大脑"],
    "游戏依赖度": ["现充", "五舟批"],
    "不可说": ["未成年", "bm"],
    "面具人格": ["瞻前顾后", "敢说不懦"],
    "服从性": ["我cnmdls", "dls爸爸"]
};

function renderQuestion(index) {
    if (index >= questions.length) {
        // --- 测试结束，进入结算页 ---
        const finalScores = getFinalScores();
        console.log("最终得分：", finalScores);
        
        // 1. 隐藏答题卡
        document.getElementById('question-text').style.display = 'none';
        document.getElementById('options-wrapper').style.display = 'none';
        document.getElementById('progress-text').style.display = 'none';
        if(document.getElementById('image-section')) document.getElementById('image-section').style.display = 'none';
        document.querySelector('.footer-hint').style.display = 'none';

        // 2. 显示结果页容器
        document.getElementById('result-page').style.display = 'block';

        // 3. 渲染双向柱状图
        const statsContainer = document.getElementById('result-stats');
        statsContainer.innerHTML = ''; // 清空容器

        // 设定一个理论最大分差，用于计算百分比 (假设单项最高累积10分，可根据你实际题量微调)
        const MAX_SCORE = 20; 

        // 遍历分数对象并生成 HTML
        for (let dim in finalScores) {
            if (!dimensionLabels[dim]) continue; // 略过未定义的维度
            
            const score = finalScores[dim];
            const labels = dimensionLabels[dim];
            const isPositive = score >= 0;
            
            // 计算进度条长度 (0% 到 50%)
            let percentage = (Math.abs(score) / MAX_SCORE) * 50;
            if (percentage > 50) percentage = 50; // 封顶防爆框

            // 构建每一行的 HTML
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
            
            // 插入 HTML
            statsContainer.insertAdjacentHTML('beforeend', rowHtml);
        }

        // 4. 触发进度条生长动画 (加一点点延迟让浏览器渲染完成)
        setTimeout(() => {
            const fills = statsContainer.querySelectorAll('.stat-fill');
            let i = 0;
            for (let dim in finalScores) {
                if (!dimensionLabels[dim]) continue;
                const score = finalScores[dim];
                let percentage = (Math.abs(score) / MAX_SCORE) * 50;
                if (percentage > 50) percentage = 50;
                
                fills[i].style.width = `${percentage}%`;
                i++;
            }
        }, 100);

        return;
    }

    const q = questions[index];
    document.getElementById('progress-text').innerText = `${index + 1} / ${questions.length}`;
    
    // 1. 純粹顯示題目文字
    document.getElementById('question-text').innerText = q.text;

    // 2. 處理右側圖片的顯示與隱藏
    const imageSection = document.getElementById('image-section');
    if (q.image) {
        imageSection.innerHTML = `<img src="${q.image}" alt="題目配圖">`;
        imageSection.style.display = 'flex';
    } else {
        imageSection.innerHTML = '';
        imageSection.style.display = 'none';
    }

    // 3. 生成選項按鈕 (就是這裡！千萬不能漏掉)
    const optionsWrapper = document.getElementById('options-wrapper');
    optionsWrapper.innerHTML = ''; // 先清空上一題的按鈕

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        // 把字母和選項文字放進按鈕裡
        btn.innerHTML = `<span class="option-letter">${opt.letter}</span> ${opt.text}`;
        
        // 綁定點擊事件
        btn.onclick = () => handleAnswer(opt);
        optionsWrapper.appendChild(btn); // 把按鈕塞進網頁
    });
}

// 處理答題與計分
function handleAnswer(selectedOption) {
    userAnswers.push(selectedOption.letter);
    
    // 處理權重計分 
    const weightsToApply = optionWeights[selectedOption.id];
    if (weightsToApply) {
        addWeightsToScore(weightsToApply);
    }

    // 執行過渡動畫
    cardBody.classList.add('fade-out');

    setTimeout(() => {
        // 跳題
        
        if (selectedOption.nextId) {
            const targetIndex = questions.findIndex(q => q.id === selectedOption.nextId);
            
            if (targetIndex !== -1) {
                currentIndex = targetIndex;
            } else {
                currentIndex++;
            }
        } else {
            currentIndex++;
        }

        renderQuestion(currentIndex);
        
        cardBody.classList.remove('fade-out');
        cardBody.classList.add('fade-in');
        setTimeout(() => {
            cardBody.classList.remove('fade-in');
        }, 300);
    }, 300);
}

// 快捷鍵綁定
document.addEventListener('keydown', (event) => {
    if (currentIndex >= questions.length) return;

    const key = event.key.toUpperCase();
    const currentOptions = questions[currentIndex].options;
    const isValidKey = currentOptions.some(opt => opt.letter === key);
    
    if (isValidKey) {
        const buttons = optionsWrapper.querySelectorAll('.option-btn');
        const index = currentOptions.findIndex(opt => opt.letter === key);
        
        if (buttons[index]) {
            buttons[index].style.backgroundColor = "rgba(250, 122, 180, 0.2)";
            buttons[index].style.borderColor = "var(--theme-pink)";
            setTimeout(() => {
                // ⚠️ 注意：這裡要傳入完整的對象 currentOptions[index]，這樣才能讀到 weights
                handleAnswer(currentOptions[index]);
            }, 150);
        }
    }
});

renderQuestion(currentIndex);
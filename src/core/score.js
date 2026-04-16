// js/scoreManager.js

// 1. 初始化用戶分數狀態
export const userScores = {
    "弹性": 0, "串商": 0, "理智": 0, "攻击性": 0, 
    "逆反": 0, "锐气": 0, "本命執着": 0, "决策风格": 0, 
    "游戏依赖度": 0, "不可说": 0, "面具人格": 0, "服从性": 0
};

// 2. 更新分數的函數
export function addWeightsToScore(weights) {
    if (!weights) return; // 如果這個選項沒有配置權重，就跳過
    
    for (let dimension in weights) {
        // 確保這個維度是存在於我們的計分板中的
        if (userScores[dimension] !== undefined) {
            userScores[dimension] += weights[dimension];
        }
    }
}

// 3. 獲取最終成績 (為之後生成雷達圖做準備)
export function getFinalScores() {
    return userScores;
}
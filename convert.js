const fs = require('fs');

// 讀取你的 CSV 檔案
const csvData = fs.readFileSync('data.csv', 'utf-8');
const lines = csvData.trim().split('\n');

// 提取第一行作為表頭 (忽略第一個格子的 ID)
const headers = lines[0].split(',').map(h => h.trim());

const optionWeights = {};

// 從第二行開始遍歷每一行數據
for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const id = values[0].trim(); // 獲取選項 ID (比如 1a)
    
    if (!id) continue; // 忽略空行
    
    optionWeights[id] = {};
    
    // 遍歷該行的每一個數值
    for (let j = 1; j < values.length; j++) {
        const val = values[j].trim();
        // 如果這個格子有數字，才加進權重裡
        if (val !== '') {
            optionWeights[id][headers[j]] = parseInt(val, 10);
        }
    }
}

// 將結果格式化並寫入 weights.js
const output = `// 自動生成的權重配置\nexport const optionWeights = ${JSON.stringify(optionWeights, null, 4)};`;

fs.writeFileSync('weights.js', output, 'utf-8');
console.log('已生成 weights.js');
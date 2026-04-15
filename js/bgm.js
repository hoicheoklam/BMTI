// js/bgm.js

export function initBGM() {
    const bgm = document.getElementById('bgm');
    const bgmBtn = document.getElementById('bgm-btn');
    
    // 防呆：如果網頁上沒找到音樂標籤或按鈕，就直接退出，避免報錯
    if (!bgm || !bgmBtn) return;

    let isPlaying = false;

    // 1. 手動點擊按鈕切換音樂
    bgmBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgm.pause();
            bgmBtn.innerText = '🔇 BGM: OFF';
        } else {
            bgm.play();
            bgmBtn.innerText = '🎵 BGM: ON';
        }
        isPlaying = !isPlaying;
    });

    // 2. 破局小技巧：用戶首次點擊螢幕任何地方時，嘗試自動播放
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            bgm.play().then(() => {
                isPlaying = true;
                bgmBtn.innerText = '🎵 BGM: ON';
            }).catch((error) => {
                // 瀏覽器攔截自動播放時的靜默處理
                console.log("需要用戶主動交互才能播放音樂");
            });
        }
    }, { once: true }); // 這行保證這個全局點擊監聽只會觸發一次，不浪費效能
}
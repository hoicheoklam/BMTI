// js/bgm.js

export function initBGM() {
    const bgm = document.getElementById('bgm');
    const bgmBtn = document.getElementById('bgm-btn');
    
    if (!bgm || !bgmBtn) return;

    let isPlaying = false;

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

    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            bgm.play().then(() => {
                isPlaying = true;
                bgmBtn.innerText = '🎵 BGM: ON';
            }).catch((error) => {

                console.log("需要用戶主動交互才能播放音樂");
            });
        }
    }, { once: true }); // 這行保證這個全局點擊監聽只會觸發一次，不浪費效能
}
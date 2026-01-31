function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    
    seconds = Math.floor(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');

    if (h > 0) {
        return `${h}:${mStr}:${sStr}`;
    } else {
        return `${mStr}:${sStr}`;
    }
}

// 主逻辑函数
function initRealTimeDisplay() {
    // 1. 查找原本的时间显示容器
    const timeLabel = document.querySelector('.bpx-player-ctrl-time-label') || 
                      document.querySelector('.bilibili-player-video-time'); 
    
    const video = document.querySelector('video');
    
    if (!video || !timeLabel) return;
    if (document.querySelector('.bili-real-time-display')) return;

    // 寻找时间组件的最外层容器
    const timeContainer = timeLabel.closest('.bpx-player-ctrl-time') || timeLabel.parentElement;

    // 2. 创建用于显示实际时长的容器
    const realTimeSpan = document.createElement('div');
    realTimeSpan.className = 'bili-real-time-display';
    realTimeSpan.title = "当前倍速下的实际数据";

    if (timeContainer && timeContainer.parentNode) {
        timeContainer.parentNode.insertBefore(realTimeSpan, timeContainer.nextSibling);
    } else {
        timeLabel.parentElement.appendChild(realTimeSpan);
    }

    // 3. 更新时间的函数
    function updateRealTime() {
        if (!video) return;

        const rate = video.playbackRate;
        const current = video.currentTime;
        const duration = video.duration;

        // 倍速为1时隐藏
        if (rate === 1) {
            realTimeSpan.style.display = 'none';
        } else {
            realTimeSpan.style.display = 'inline-flex';
        }

        const realCurrent = current / rate;
        const realDuration = duration / rate;
        
        // 计算实际剩余时长
        const remaining = duration - current;
        const realRemaining = remaining / rate;

        realTimeSpan.innerHTML = `
            <div class="bili-rt-row-main">${formatTime(realCurrent)} / ${formatTime(realDuration)}</div>
            <div class="bili-rt-row-sub">还剩 ${formatTime(realRemaining)}</div>
        `;
    }
    video.addEventListener('timeupdate', updateRealTime);
    video.addEventListener('ratechange', updateRealTime);
    video.addEventListener('loadedmetadata', updateRealTime);
    // 初始化执行一次
    updateRealTime();
}

// 启动检测器
const observerInterval = setInterval(() => {
    initRealTimeDisplay();
    
    const existingDisplay = document.querySelector('.bili-real-time-display');
    const video = document.querySelector('video');
    
    if (video && !existingDisplay) {
        initRealTimeDisplay();
    }
}, 1000);
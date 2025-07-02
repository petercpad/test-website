// 全局變數
let charts = {};
let currentTab = 'overview';
let aiChatOpen = false;
let aiPinned = false;

// 模擬數據
const mockData = {
    competitors: ['品牌A', '品牌B', '品牌C', '品牌D', '品牌E'],
    marketShare: [42, 28, 15, 10, 5],
    radarData: {
        labels: ['市場佔有率', '技術創新', '品牌聲量', '價格競爭力', '客戶滿意度', '通路覆蓋'],
        datasets: [
            {
                label: '我們',
                data: [85, 90, 75, 70, 88, 82],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                pointBackgroundColor: '#667eea'
            },
            {
                label: '主要競爭者',
                data: [70, 85, 80, 85, 75, 78],
                borderColor: '#f56565',
                backgroundColor: 'rgba(245, 101, 101, 0.2)',
                pointBackgroundColor: '#f56565'
            }
        ]
    },
    trendData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
            {
                label: '市佔率',
                data: [40, 41, 39, 42, 43, 42],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            },
            {
                label: '品牌聲量',
                data: [75, 78, 82, 85, 87, 88],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                tension: 0.4
            },
            {
                label: '平均價格',
                data: [128, 125, 122, 125, 124, 125],
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 137, 54, 0.1)',
                tension: 0.4
            }
        ]
    },
    sentimentData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
            {
                label: '正面評價',
                data: [65, 68, 72, 75, 78, 80],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.2)',
                tension: 0.4
            },
            {
                label: '負面評價',
                data: [25, 22, 18, 15, 12, 10],
                borderColor: '#f56565',
                backgroundColor: 'rgba(245, 101, 101, 0.2)',
                tension: 0.4
            },
            {
                label: '中性評價',
                data: [10, 10, 10, 10, 10, 10],
                borderColor: '#a0aec0',
                backgroundColor: 'rgba(160, 174, 192, 0.2)',
                tension: 0.4
            }
        ]
    },
    priceData: {
        brands: ['品牌A', '品牌B', '品牌C', '品牌D'],
        online: [120, 115, 130, 110],
        offline: [125, 118, 135, 115]
    },
    channelData: {
        labels: ['線上電商', '實體門市', '經銷商', '直營店', '其他'],
        data: [45, 25, 15, 10, 5]
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeCharts();
    initializeAI();
    initializeInteractions();
    generateHeatmaps();
    generateWordCloud();
});

// 分頁切換功能
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 移除所有活動狀態
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加活動狀態
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            currentTab = targetTab;
            
            // 重新渲染圖表（解決隱藏時尺寸問題）
            setTimeout(() => {
                Object.values(charts).forEach(chart => {
                    if (chart && chart.resize) {
                        chart.resize();
                    }
                });
            }, 100);
        });
    });
}

// 初始化所有圖表
function initializeCharts() {
    initializeRadarChart();
    initializeTrendChart();
    initializeMarketShareCharts();
    initializePriceCharts();
    initializeSentimentChart();
    initializeChannelCharts();
    initializeBrandVoiceChart();
    initializeShippingChart();
}

// 雷達圖
function initializeRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: mockData.radarData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// 趨勢圖
function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    charts.trend = new Chart(ctx, {
        type: 'line',
        data: mockData.trendData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 市場份額圖表
function initializeMarketShareCharts() {
    // 圓餅圖
    const pieCtx = document.getElementById('marketSharePie');
    if (pieCtx) {
        charts.marketPie = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: mockData.competitors,
                datasets: [{
                    data: mockData.marketShare,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // 長條圖
    const barCtx = document.getElementById('marketShareBar');
    if (barCtx) {
        charts.marketBar = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: mockData.competitors,
                datasets: [{
                    label: '市佔率 (%)',
                    data: mockData.marketShare,
                    backgroundColor: '#667eea',
                    borderColor: '#5a67d8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50
                    }
                }
            }
        });
    }

    // 市場趨勢圖
    const trendCtx = document.getElementById('marketTrendChart');
    if (trendCtx) {
        charts.marketTrend = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: mockData.competitors.map((competitor, index) => ({
                    label: competitor,
                    data: [
                        mockData.marketShare[index] - 2,
                        mockData.marketShare[index] - 1,
                        mockData.marketShare[index],
                        mockData.marketShare[index] + 1
                    ],
                    borderColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][index],
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][index] + '20',
                    tension: 0.4
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// 價格圖表
function initializePriceCharts() {
    // 價格分布箱形圖（模擬）
    const boxCtx = document.getElementById('priceBoxplot');
    if (boxCtx) {
        charts.priceBox = new Chart(boxCtx, {
            type: 'bar',
            data: {
                labels: mockData.priceData.brands,
                datasets: [
                    {
                        label: 'Q1 (25%)',
                        data: [110, 105, 120, 100],
                        backgroundColor: '#ff6b6b'
                    },
                    {
                        label: 'Q2 中位數 (50%)',
                        data: [120, 115, 130, 110],
                        backgroundColor: '#4ecdc4'
                    },
                    {
                        label: 'Q3 (75%)',
                        data: [130, 125, 140, 120],
                        backgroundColor: '#45b7d1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        stacked: false
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 歷史價格趨勢
    const historyCtx = document.getElementById('priceHistoryChart');
    if (historyCtx) {
        charts.priceHistory = new Chart(historyCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: mockData.priceData.brands.map((brand, index) => ({
                    label: brand,
                    data: [
                        mockData.priceData.online[index] + Math.random() * 10 - 5,
                        mockData.priceData.online[index] + Math.random() * 10 - 5,
                        mockData.priceData.online[index] + Math.random() * 10 - 5,
                        mockData.priceData.online[index] + Math.random() * 10 - 5,
                        mockData.priceData.online[index] + Math.random() * 10 - 5,
                        mockData.priceData.online[index]
                    ],
                    borderColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c'][index],
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c'][index] + '20',
                    tension: 0.4
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

// 情緒分析圖表
function initializeSentimentChart() {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;

    charts.sentiment = new Chart(ctx, {
        type: 'line',
        data: mockData.sentimentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 品牌聲量圖表
function initializeBrandVoiceChart() {
    const ctx = document.getElementById('brandVoiceChart');
    if (!ctx) return;

    charts.brandVoice = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mockData.competitors,
            datasets: [{
                label: '聲量指數',
                data: [85, 72, 68, 45, 32],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// 通路圖表
function initializeChannelCharts() {
    // 通路分布圓餅圖
    const ctx = document.getElementById('channelDistributionChart');
    if (ctx) {
        charts.channel = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: mockData.channelData.labels,
                datasets: [{
                    data: mockData.channelData.data,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// 出貨週期圖表
function initializeShippingChart() {
    const ctx = document.getElementById('shippingCycleChart');
    if (!ctx) return;

    charts.shipping = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            datasets: [{
                label: '平均出貨天數',
                data: [4.5, 4.2, 3.8, 4.0, 4.3, 5.1, 4.8],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 3,
                    max: 6
                }
            }
        }
    });
}

// 生成熱圖
function generateHeatmaps() {
    // 地理分布熱圖
    const geoHeatmap = document.getElementById('geoHeatmap');
    if (geoHeatmap) {
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            const intensity = Math.random();
            cell.style.backgroundColor = `rgba(102, 126, 234, ${intensity})`;
            cell.title = `區域 ${i + 1}: ${(intensity * 100).toFixed(1)}% 市佔率`;
            geoHeatmap.appendChild(cell);
        }
    }

    // 地區通路熱圖
    const regionalMap = document.getElementById('regionalChannelMap');
    if (regionalMap) {
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'region-cell';
            const density = Math.random();
            cell.style.backgroundColor = `rgba(118, 75, 162, ${density})`;
            cell.title = `區域 ${i + 1}: 通路密度 ${(density * 100).toFixed(1)}%`;
            regionalMap.appendChild(cell);
        }
    }
}

// 生成文字雲
function generateWordCloud() {
    const wordCloud = document.getElementById('wordCloud');
    if (!wordCloud) return;

    const words = [
        { text: '品質', weight: 0.9 },
        { text: '價格', weight: 0.8 },
        { text: '服務', weight: 0.7 },
        { text: '創新', weight: 0.6 },
        { text: '便利', weight: 0.5 },
        { text: '可靠', weight: 0.4 },
        { text: '快速', weight: 0.3 },
        { text: '專業', weight: 0.2 }
    ];

    words.forEach(word => {
        const span = document.createElement('span');
        span.className = 'word-item';
        span.textContent = word.text;
        span.style.fontSize = `${0.8 + word.weight * 0.8}rem`;
        span.style.opacity = 0.6 + word.weight * 0.4;
        wordCloud.appendChild(span);
    });
}

// AI 聊天功能
function initializeAI() {
    const aiBubble = document.getElementById('aiBubble');
    const aiChatPanel = document.getElementById('aiChatPanel');
    const aiMinimize = document.getElementById('aiMinimize');
    const aiPin = document.getElementById('aiPin');
    const aiSend = document.getElementById('aiSend');
    const aiInput = document.getElementById('aiInput');

    // 氣泡點擊
    aiBubble.addEventListener('click', () => {
        toggleAIChat();
    });

    // 最小化
    aiMinimize.addEventListener('click', () => {
        toggleAIChat();
    });

    // 固定/取消固定
    aiPin.addEventListener('click', () => {
        toggleAIPin();
    });

    // 發送消息
    aiSend.addEventListener('click', () => {
        sendAIMessage();
    });

    // 回車發送
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
}

function toggleAIChat() {
    const aiChatPanel = document.getElementById('aiChatPanel');
    aiChatOpen = !aiChatOpen;
    
    if (aiChatOpen) {
        aiChatPanel.classList.add('active');
    } else {
        aiChatPanel.classList.remove('active');
    }
}

function toggleAIPin() {
    const aiChatPanel = document.getElementById('aiChatPanel');
    const aiPin = document.getElementById('aiPin');
    
    aiPinned = !aiPinned;
    
    if (aiPinned) {
        aiChatPanel.classList.add('pinned');
        aiPin.innerHTML = '<i class="fas fa-thumbtack"></i>';
        aiPin.style.transform = 'rotate(45deg)';
    } else {
        aiChatPanel.classList.remove('pinned');
        aiPin.innerHTML = '<i class="fas fa-thumbtack"></i>';
        aiPin.style.transform = 'rotate(0deg)';
    }
}

function sendAIMessage() {
    const aiInput = document.getElementById('aiInput');
    const aiChatContent = document.getElementById('aiChatContent');
    const message = aiInput.value.trim();
    
    if (!message) return;

    // 添加用戶消息
    addAIMessage(message, true);
    
    // 清空輸入框
    aiInput.value = '';
    
    // 模擬AI回應
    setTimeout(() => {
        const response = generateAIResponse(message);
        addAIMessage(response, false);
    }, 1000);
}

function addAIMessage(message, isUser = false) {
    const aiChatContent = document.getElementById('aiChatContent');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${isUser ? 'user-message' : ''}`;
    
    messageDiv.innerHTML = `
        <div class="ai-avatar">
            <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
        </div>
        <div class="ai-text">
            <p>${message}</p>
            ${!isUser ? '<small style="opacity: 0.7; font-size: 0.8rem;">根據當前儀表板數據分析</small>' : ''}
        </div>
    `;
    
    aiChatContent.appendChild(messageDiv);
    aiChatContent.scrollTop = aiChatContent.scrollHeight;
}

function generateAIResponse(message) {
    const responses = {
        '市佔': '根據總覽頁面數據，我們目前市佔率為42% ± 3.1%，相比上月成長2.3%。主要競爭者市佔率分別為：品牌B (28%)、品牌C (15%)、品牌D (10%)、品牌E (5%)。',
        '價格': '根據價格策略分析，我們的平均價格為$125 ± $8，線上通路價格略低於實體通路。建議關注品牌B的價格策略，其變異係數較低，價格穩定性較佳。',
        '聲量': '品牌聲量方面，我們目前聲量指數為87.5% ± 2.8%，呈現上升趨勢(+5.1%)。正面評價持續增長，目前達80%，負面評價降至10%。',
        '通路': '通路分析顯示線上電商佔45%，實體門市25%。通路集中度指數HHI=3,500，存在過度集中風險，建議多元化通路策略。',
        '趨勢': '綜合趨勢分析顯示，市佔率穩定成長，品牌聲量持續提升，價格策略相對穩定。建議持續關注競爭者動態，特別是品牌B的技術創新能力。'
    };
    
    for (const [key, response] of Object.entries(responses)) {
        if (message.includes(key)) {
            return response;
        }
    }
    
    return '感謝您的提問！我可以幫您分析儀表板中的各項數據，包括市佔率、價格策略、品牌聲量、通路分布等。請告訴我您想了解哪個方面的詳細資訊？';
}

// 互動功能
function initializeInteractions() {
    // 權重控制
    const weightControls = ['marketWeight', 'techWeight', 'brandWeight'];
    weightControls.forEach(id => {
        const slider = document.getElementById(id);
        const valueSpan = document.getElementById(id + 'Value');
        
        if (slider && valueSpan) {
            slider.addEventListener('input', (e) => {
                valueSpan.textContent = e.target.value + '%';
                updateRadarChart();
            });
        }
    });

    // 圖表模式切換
    const toggleButtons = document.querySelectorAll('.btn-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const parent = e.target.closest('.chart-controls');
            parent.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // 這裡可以添加圖表模式切換邏輯
        });
    });

    // 移動平均線和趨勢線切換
    const showMovingAvg = document.getElementById('showMovingAvg');
    const showTrendLine = document.getElementById('showTrendLine');
    
    if (showMovingAvg) {
        showMovingAvg.addEventListener('change', updateMarketTrendChart);
    }
    
    if (showTrendLine) {
        showTrendLine.addEventListener('change', updateMarketTrendChart);
    }
}

function updateRadarChart() {
    // 這裡可以根據權重重新計算雷達圖數據
    if (charts.radar) {
        charts.radar.update();
    }
}

function updateMarketTrendChart() {
    // 這裡可以添加移動平均線和趨勢線的邏輯
    if (charts.marketTrend) {
        charts.marketTrend.update();
    }
}

// 響應式處理
window.addEventListener('resize', () => {
    Object.values(charts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
});

// 工具函數
function formatNumber(num, decimals = 1) {
    return num.toFixed(decimals);
}

function generateRandomData(length, min = 0, max = 100) {
    return Array.from({ length }, () => Math.random() * (max - min) + min);
}

// 導出功能（可選）
function exportChart(chartId) {
    const chart = charts[chartId];
    if (chart) {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `${chartId}_chart.png`;
        link.href = url;
        link.click();
    }
}


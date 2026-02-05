// Session Configuration
const SESSIONS = {
    ASIA: {
        id: "asia",
        name: "TOKYO SESSION",
        rangeText: "05:30 - 14:30",
        icon: "🌅",
        theme: "asia-theme",
        pairs: [
            { name: "USD/JPY", strategy: "Range Mean Reversion", icon: "fa-yen-sign" },
            { name: "AUD/JPY", strategy: "Scalping Range", icon: "fa-chart-line" },
            { name: "AUD/USD", strategy: "Safe Haven Flows", icon: "fa-dollar-sign" }
        ]
    },
    LONDON: {
        id: "london",
        name: "LONDON SESSION",
        rangeText: "12:30 - 21:30",
        icon: "⚡",
        theme: "london-theme",
        pairs: [
            { name: "GBP/USD", strategy: "Breakout Trading", icon: "fa-sterling-sign" },
            { name: "EUR/USD", strategy: "Trend Continuation", icon: "fa-euro-sign" },
            { name: "GBP/JPY", strategy: "Momentum Scalp", icon: "fa-chart-bar" }
        ]
    },
    NY: {
        id: "ny",
        name: "NEW YORK SESSION",
        rangeText: "18:30 - 01:30",
        icon: "🏙️",
        theme: "ny-theme",
        pairs: [
            { name: "XAU/USD", strategy: "Volatility / News", icon: "fa-coins" },
            { name: "USD/CAD", strategy: "Oil Correlation", icon: "fa-dollar-sign" },
            { name: "EUR/USD", strategy: "Reversal Setup", icon: "fa-euro-sign" }
        ]
    },
    CLOSED: {
        id: "closed",
        name: "MARKET CLOSED",
        rangeText: "OFF HOURS",
        icon: "🌙",
        theme: "closed-theme",
        pairs: [
            { name: "BTC/USD", strategy: "Crypto Scalp", icon: "fa-bitcoin" },
            { name: "ETH/USD", strategy: "Accumulation", icon: "fa-layer-group" },
            { name: "SOL/USD", strategy: "Range Trade", icon: "fa-bolt" }
        ]
    }
};

function updateApp() {
    const now = new Date();
    
    // 1. Time Update (IST)
    const options = { timeZone: "Asia/Kolkata", hour12: false, hour: '2-digit', minute: '2-digit' };
    const timeString = now.toLocaleTimeString("en-US", options);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    document.getElementById("ist-time").innerText = `${hours}:${minutes < 10 ? '0'+minutes : minutes}`;
    document.getElementById("ist-seconds").innerText = now.getSeconds() < 10 ? '0'+now.getSeconds() : now.getSeconds();
    
    const dateOptions = { timeZone: "Asia/Kolkata", weekday: 'long', month: 'short', day: 'numeric' };
    document.getElementById("date-display").innerText = now.toLocaleDateString("en-US", dateOptions);

    // 2. Determine Active Session
    let currentMinutes = (hours * 60) + minutes;
    let activeSession = SESSIONS.CLOSED;

    // Logic: Asia (05:30-12:30), London (12:30-18:30), NY (18:30-01:30)
    // Overlaps are handled by priority in the `else if` chain
    if (currentMinutes >= 330 && currentMinutes < 750) {
        activeSession = SESSIONS.ASIA;
    } else if (currentMinutes >= 750 && currentMinutes < 1110) {
        activeSession = SESSIONS.LONDON;
    } else if (currentMinutes >= 1110 || currentMinutes < 90) {
        activeSession = SESSIONS.NY;
    }

    renderSession(activeSession);
}

function renderSession(session) {
    // A. Apply Theme
    document.body.className = session.theme;

    // B. Update Floating Pill
    document.getElementById("session-name").innerText = session.name;
    document.getElementById("session-time").innerText = session.rangeText;
    document.getElementById("session-icon").innerText = session.icon;

    // C. Update Prime Asset (The 1st pair in the list)
    const primeAsset = session.pairs[0];
    document.getElementById("prime-pair").innerText = primeAsset.name;
    document.getElementById("prime-strategy").innerText = primeAsset.strategy;
    
    // Update Prime Icon
    const iconContainer = document.getElementById("prime-icon");
    iconContainer.innerHTML = `<i class="fa-solid ${primeAsset.icon}"></i>`;

    // D. Update "Other Pairs" List (Skip the 1st one since it's in the Prime Card)
    const listContainer = document.getElementById("pair-list");
    const otherPairs = session.pairs.slice(1);

    const listHtml = otherPairs.map(pair => `
        <div class="pair-item">
            <div class="pair-left">
                <h3>${pair.name}</h3>
            </div>
            <div class="pair-right">
                <span class="pair-strategy">${pair.strategy}</span>
            </div>
        </div>
    `).join('');

    if (listContainer.innerHTML !== listHtml) {
        listContainer.innerHTML = listHtml;
    }
}

// Initialize
updateApp();
setInterval(updateApp, 1000);

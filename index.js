const express = require('express');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

let sock;

// 🛡️ VERCEL SHIELD: Prevents background crashes on Vercel
const isVercel = process.env.VERCEL || false;

async function startSavage() {
    // Skip heavy engine if running on Vercel to prevent 500 errors
    if (isVercel) return;

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"] 
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startSavage();
        } else if (connection === 'open') {
            console.log('⛓️ SΛVΛGΞ-TECH: SYSTEM ONLINE');
            try {
                const user = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const credsData = fs.readFileSync(path.join(__dirname, 'auth_info_baileys', 'creds.json'));
                const sessionId = Buffer.from(credsData).toString('base64');
                await sock.sendMessage(user, { text: `*⛓️ SΛVΛGΞ-TECH SESSION ID ⛓️*\n_Your session is successfully established._` });
                await sock.sendMessage(user, { text: `SΛVΛGΞ-TECH;;;${sessionId}` });
            } catch (e) {
                console.log('❌ Error sending Session ID:', e);
            }
        }
    });
}

// 🌐 THE SMART UI ROUTE
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ TECH | PAIRING</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; outline: none; }
        body { 
            background: #0a000f;
            background-image: linear-gradient(rgba(10, 0, 15, 0.8), rgba(20, 0, 30, 0.8)), 
            url('https://i.ibb.co/Wpvd9P3T/0c64540aa36ae656a909f116f1b3851a.webp');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #d88eff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 100vh; padding: 20px; transition: 0.5s ease;
        }

        /* Vercel Quantum Theme */
        .vercel-theme { filter: hue-rotate(180deg) brightness(0.9); }
        .vercel-theme .system-title { color: #00f2ff; text-shadow: 0 0 20px #00f2ff; }

        .header { margin-bottom: 25px; text-align: center; }
        .system-title { color: #d88eff; font-size: 36px; font-weight: 900; letter-spacing: 6px; text-shadow: 0 0 20px #9b00ff; text-transform: uppercase; }
        
        .typing-container { font-family: monospace; font-size: 16px; color: #FF1493; margin-bottom: 15px; min-height: 20px; }

        .pair-card {
            background: rgba(15, 0, 25, 0.85); border: 1px solid rgba(160, 32, 240, 0.4);
            border-radius: 24px; width: 100%; max-width: 420px; padding: 40px 30px;
            backdrop-filter: blur(15px); box-shadow: 0 10px 50px rgba(0,0,0,0.9); text-align: center;
        }

        input { background: rgba(0, 0, 0, 0.6); border: 2px solid rgba(160, 32, 240, 0.5); color: #fff; padding: 18px; width: 100%; border-radius: 12px; font-size: 18px; text-align: center; margin-bottom: 20px; }
        button { background: linear-gradient(135deg, #A020F0 0%, #FF1493 100%); color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; text-transform: uppercase; }

        .steps-box { margin-top: 25px; padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.1); }
        .step-item { font-size: 12px; margin-bottom: 8px; color: #bbb; display: flex; }
        .step-item b { color: #d88eff; margin-right: 5px; }

        .savage-footer { margin-top: 40px; text-align: center; }
        .meryl-text { font-size: 16px; font-weight: bold; color: #fff; text-shadow: 0 0 10px #d88eff; }
        .dev-link { color: #FF1493; text-decoration: none; font-size: 12px; display: block; margin-top: 10px; }
    </style>
</head>
<body id="main-body">
    <div class="header">
        <div id="main-title" class="system-title">SΛVΛGΞ TECH</div>
        <div class="typing-container"><span id="type-text"></span><span>|</span></div>
    </div>

    <div class="pair-card">
        <input type="text" id="number" placeholder="254798841125" maxlength="15">
        <button onclick="getCode()" id="genBtn">⚡ INITIALIZE PAIRING</button>
        <div id="code-display" style="display:none; margin-top: 20px;" onclick="copyCode()">
            <div id="result" style="font-size: 32px; font-weight: 900; color: #FF1493;"></div>
            <p style="font-size: 10px; opacity: 0.6;">📑 CLICK TO COPY</p>
        </div>
        <div class="steps-box">
            <p style="font-size: 11px; color: #FF1493; margin-bottom: 10px; font-weight: 800;">DEPLOYMENT PROTOCOL:</p>
            <div class="step-item"><b>01.</b> Input Number with Country Code.</div>
            <div class="step-item"><b>02.</b> Generate code and check WhatsApp.</div>
            <div class="step-item"><b>03.</b> Tap 'Link Device' on your phone.</div>
            <div class="step-item"><b>04.</b> Enter the 8-digit code shown here.</div>
        </div>
    </div>

    <footer class="savage-footer">
        <div class="meryl-text">Inspired by Meryl</div>
        <div style="font-size: 9px; color: rgba(255,255,255,0.3); letter-spacing: 2px;">© 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.</div>
        <a href="https://wa.me/254798841125" class="dev-link">Having problems pairing? Contact Developer</a>
    </footer>

    <script>
        const phrases = ["you connect...", "the system forgets...", "this session exists...", "then it doesn’t...", "connect...", "use it...", "lose it..."];
        let pIdx = 0, cIdx = 0, isDel = false;
        
        function type() {
            const current = phrases[pIdx];
            document.getElementById('type-text').textContent = isDel ? current.substring(0, cIdx--) : current.substring(0, cIdx++);
            if (!isDel && cIdx > current.length) { isDel = true; setTimeout(type, 2000); }
            else if (isDel && cIdx < 0) { isDel = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(type, 500); }
            else { setTimeout(type, isDel ? 50 : 100); }
        }

        window.onload = function() {
            type();
            if (window.location.hostname.includes('vercel.app')) {
                document.getElementById('main-body').classList.add('vercel-theme');
                document.getElementById('main-title').innerText = "SΛVΛGΞ QUANTUM";
            }
        }

        async function getCode() {
            let num = document.getElementById('number').value.replace(/[^0-9]/g, '');
            const btn = document.getElementById('genBtn');
            if(num.length < 8) return alert("Enter full number!");
            btn.innerText = "ESTABLISHING...";
            btn.disabled = true;
            try {
                const res = await fetch('/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    document.getElementById('code-display').style.display = "block";
                    document.getElementById('result').innerText = data.code;
                    btn.innerText = "SUCCESS";
                }
            } catch (e) { alert("Pairing Error. Try again."); }
            btn.disabled = false;
        }

        function copyCode() {
            navigator.clipboard.writeText(document.getElementById('result').innerText);
            alert("SΛVΛGΞ CODE COPIED!");
        }
    </script>
</body>
</html>
    `);
});

// ⚡ BACKEND LOGIC
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    num = num.replace(/[^0-9]/g, '');
    try {
        if (!sock) await startSavage();
        const code = await sock.requestPairingCode(num);
        res.status(200).json({ code: code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Pairing failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
    if (!isVercel) startSavage(); // Only start bot if NOT on Vercel
});

module.exports = app;

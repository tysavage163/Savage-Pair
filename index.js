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

async function startSavage() {
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
        }
    });
}

// 🌐 THE FULL UI ROUTE (Your exact code)
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
            background-image: 
                linear-gradient(rgba(10, 0, 15, 0.9), rgba(20, 0, 30, 0.85)), 
                url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            color: #d88eff; 
            font-family: 'Segoe UI', Roboto, sans-serif;
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center;
            min-height: 100vh; 
            padding: 20px;
        }

        .header { margin-bottom: 25px; text-align: center; }
        .system-title { 
            color: #d88eff; 
            font-size: 36px; 
            font-weight: 900; 
            letter-spacing: 6px; 
            text-shadow: 0 0 20px #9b00ff;
            text-transform: uppercase;
        }
        
        .pair-card {
            background: rgba(15, 0, 25, 0.85);
            border: 1px solid rgba(160, 32, 240, 0.4);
            border-radius: 24px;
            width: 100%;
            max-width: 420px;
            padding: 40px 30px;
            backdrop-filter: blur(15px);
            box-shadow: 0 10px 50px rgba(0,0,0,0.9), 0 0 20px rgba(155, 0, 255, 0.1);
            text-align: center;
        }

        .input-container { display: flex; margin-bottom: 25px; }

        input { 
            background: rgba(0, 0, 0, 0.6); 
            border: 2px solid rgba(160, 32, 240, 0.5); 
            color: #fff; 
            padding: 18px; 
            width: 100%;
            border-radius: 12px;
            font-size: 18px;
            text-align: center; 
            transition: 0.3s;
            letter-spacing: 1px;
        }
        input:focus { border-color: #FF1493; box-shadow: 0 0 15px rgba(255, 20, 147, 0.3); }

        button { 
            background: linear-gradient(135deg, #A020F0 0%, #FF1493 100%); 
            color: #fff; 
            border: none; 
            padding: 18px; 
            border-radius: 12px;
            font-weight: 800; 
            font-size: 14px;
            letter-spacing: 3px;
            cursor: pointer; 
            width: 100%;
            transition: 0.4s;
            text-transform: uppercase;
        }
        button:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(160, 32, 240, 0.5); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }

        .dev-contact {
            margin-top: 15px;
            display: block;
            text-decoration: none;
            font-size: 12px;
            color: rgba(216, 142, 255, 0.7);
        }

        #code-display {
            margin-top: 30px;
            padding: 20px;
            border-radius: 15px;
            background: rgba(255, 20, 147, 0.05);
            border: 1px dashed #FF1493;
            display: none;
            animation: fadeIn 0.5s ease;
        }
        #result { font-size: 34px; color: #FF1493; font-weight: 900; letter-spacing: 8px; text-shadow: 0 0 15px #FF1493; }
        
        .info-box { 
            margin-top: 30px; 
            text-align: left; 
            font-size: 11px; 
            color: rgba(255,255,255,0.5); 
            line-height: 1.8;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 15px;
        }
        .info-box span { color: #FF1493; font-weight: bold; }

        .savage-footer { margin-top: 50px; text-align: center; }
        .meryl-text { font-size: 16px; font-weight: bold; color: #fff; text-shadow: 0 0 10px #d88eff; letter-spacing: 2px; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>

    <audio id="bgMusic" loop>
        <source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4">
    </audio>

    <div class="header">
        <div class="system-title">SΛVΛGΞ TECH</div>
        <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=14&pause=1000&color=FF1493&center=true&vCenter=true&width=300&lines=CORE+SYSTEM+ACTIVE;ESTABLISHING+SESSION...;SΛVΛGΞ+v2.1.0" />
    </div>

    <div class="pair-card">
        <div class="input-container">
            <input type="text" id="number" placeholder="254798841125" maxlength="15">
        </div>

        <button onclick="getCode()" id="genBtn">⚡ GENER∆TE P∆IR CODE</button>
        
        <a href="https://wa.me/254798841125" class="dev-contact">
            Having trouble pairing? <b>Contact the Developer</b>
        </a>

        <div id="code-display" onclick="copyCode()">
            <div id="result"></div>
            <div style="font-size: 10px; color: #fff; opacity: 0.5; margin-top: 10px;">📑 CLICK TO COPY SESSION CODE</div>
        </div>

        <div class="info-box">
            🌍 REGION: <span>Global Support</span><br>
            ⏱️ EXPIRY: <span>60 Seconds</span><br>
            🔑 DEVICE: <span>Link with phone number</span>
        </div>
    </div>

    <footer class="savage-footer">
        <div class="meryl-text">Inspired by Meryl</div>
        <div style="font-size: 9px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 3px;">© 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.</div>
    </footer>

    <script>
        async function getCode() {
            let numInput = document.getElementById('number').value.replace(/[^0-9]/g, '');
            const resDiv = document.getElementById('result');
            const display = document.getElementById('code-display');
            const btn = document.getElementById('genBtn');
            const music = document.getElementById('bgMusic');
            
            if(!numInput || numInput.length < 8) return alert("Enter full number!");

            music.play().catch(() => {});
            btn.innerText = "ESTABLISHING...";
            btn.disabled = true;
            
            try {
                const response = await fetch('/code?number=' + encodeURIComponent(numInput));
                const data = await response.json();
                
                if(data.code) {
                    display.style.display = "block";
                    resDiv.innerText = data.code;
                    btn.innerText = "ACCESS GRANTED";
                    btn.disabled = false;
                } else {
                    alert("WhatsApp Busy. Try again.");
                    btn.innerText = "⚡ GENER∆TE P∆IR CODE";
                    btn.disabled = false;
                }
            } catch (e) { 
                alert("Connection Error. Please refresh."); 
                btn.innerText = "⚡ GENER∆TE P∆IR CODE";
                btn.disabled = false;
            }
        }

        function copyCode() {
            const code = document.getElementById('result').innerText;
            navigator.clipboard.writeText(code);
            alert("SΛVΛGΞ CODE COPIED: " + code);
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
        res.status(500).json({ error: "Pairing failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
    startSavage();
});

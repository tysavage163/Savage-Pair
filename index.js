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
const cors = require("cors");

const app = express();
app.use(cors()); // Prevents the "Offline" error on Vercel
const PORT = process.env.PORT || 10000;

let sock;

async function startSavage() {
    try {
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
                
                // 📡 AUTOMATED SESSION DISPATCH TO DM
                try {
                    const user = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    const credsFile = path.join(__dirname, 'auth_info_baileys', 'creds.json');
                    if (fs.existsSync(credsFile)) {
                        const credsData = fs.readFileSync(credsFile);
                        const sessionId = Buffer.from(credsData).toString('base64');
                        
                        await sock.sendMessage(user, { 
                            text: `*⛓️ SΛVΛGΞ-TECH SESSION ID ⛓️*\n\nSΛVΛGΞ-TECH;;;${sessionId}\n\n_Keep this safe!_` 
                        });
                        console.log('✅ Session ID sent to owner.');
                    }
                } catch (dmErr) {
                    console.error("DM Delivery Failed:", dmErr);
                }
            }
        });
    } catch (err) {
        console.error("Bot Engine Error:", err);
    }
}

// 🌐 THE FULL UI ROUTE
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ TECH | PAIRING</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #0a000f;
            background-image: linear-gradient(rgba(10, 0, 15, 0.75), rgba(20, 0, 30, 0.75)), 
            url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #d88eff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 100vh; padding: 20px;
        }
        .pair-card {
            background: rgba(15, 0, 25, 0.85); border: 2px solid #FF1493; border-radius: 24px;
            width: 100%; max-width: 420px; padding: 40px 30px; backdrop-filter: blur(15px);
            box-shadow: 0 0 30px rgba(255, 20, 147, 0.4); text-align: center;
        }
        .system-title { font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #FF1493; text-shadow: 0 0 15px #FF1493; margin-bottom: 20px; }
        input { background: rgba(0,0,0,0.6); border: 2px solid #FF1493; color: #fff; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; }
        button { background: linear-gradient(135deg, #A020F0 0%, #FF1493 100%); color: #fff; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: 0.3s; }
        button:hover { transform: scale(1.02); box-shadow: 0 0 15px #A020F0; }
        #result { margin-top: 25px; font-size: 35px; font-weight: 900; color: #fff; text-shadow: 0 0 20px #FF1493; letter-spacing: 8px; }
    </style>
</head>
<body>
    <audio id="bgMusic" loop autoplay><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4"></audio>
    <div class="pair-card">
        <h1 class="system-title">SΛVΛGΞ TECH</h1>
        <input type="text" id="number" placeholder="254798841125">
        <button onclick="getCode()" id="genBtn">⚡ GENER∆TE CODE</button>
        <div id="result"></div>
        <p style="margin-top: 20px; font-size: 11px; color: #fff; opacity: 0.5; letter-spacing: 1px;">Inspired by Meryl | © 2026</p>
    </div>
    <script>
        async function getCode() {
            const num = document.getElementById('number').value;
            const btn = document.getElementById('genBtn');
            const res = document.getElementById('result');
            const music = document.getElementById('bgMusic');
            if(!num) return alert("Enter number!");
            
            music.play().catch(() => {}); // Play music on button click
            btn.innerText = "ESTABLISHING...";
            
            try {
                const response = await fetch('/code?number=' + num);
                const data = await response.json();
                if(data.code) {
                    res.innerText = data.code;
                    btn.innerText = "⚡ SUCCESS";
                } else {
                    res.innerText = "BUSY";
                    btn.innerText = "⚡ RETRY";
                }
            } catch (e) { 
                res.innerText = "OFFLINE"; 
                btn.innerText = "⚡ RETRY"; 
            }
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
    console.log('Server live on port ' + PORT);
    startSavage();
});

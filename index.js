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
app.use(cors()); 
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
                try {
                    const user = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    const credsFile = path.join(__dirname, 'auth_info_baileys', 'creds.json');
                    if (fs.existsSync(credsFile)) {
                        const credsData = fs.readFileSync(credsFile);
                        const sessionId = Buffer.from(credsData).toString('base64');
                        
                        // Triple message delivery
                        await sock.sendMessage(user, { text: `⛓️ *SΛVΛGΞ-TECH SESSION ID* ⛓️` });
                        await sock.sendMessage(user, { text: `SΛVΛGΞ-TECH;;;${sessionId}` });
                        await sock.sendMessage(user, { text: `*SECURITY NOTICE:*\n_Please keep this session safely. Do not share this ID with anyone._` });
                    }
                } catch (e) { console.error(e); }
            }
        });
    } catch (err) { console.error(err); }
}

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ TECH | PAIRING</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #0a000f;
            background-image: linear-gradient(rgba(10, 0, 15, 0.8), rgba(10, 0, 15, 0.8)), 
            url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #d88eff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 100vh; padding: 20px;
        }
        .pair-card {
            background: rgba(15, 0, 25, 0.9); border: 2px solid #FF1493; border-radius: 24px;
            width: 100%; max-width: 420px; padding: 40px 30px; backdrop-filter: blur(15px);
            box-shadow: 0 0 30px rgba(255, 20, 147, 0.4); text-align: center;
        }
        .system-title { font-size: 35px; font-weight: 900; letter-spacing: 5px; color: #FF1493; text-shadow: 0 0 15px #FF1493; }
        
        /* ⌨️ Animated Typing CSS */
        .typing { color: #ff0055; font-family: monospace; height: 25px; margin-bottom: 25px; font-weight: bold; text-transform: lowercase; }
        
        input { background: rgba(0,0,0,0.6); border: 2px solid #301934; color: #fff; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; }
        button { background: linear-gradient(135deg, #A020F0 0%, #FF1493 100%); color: #fff; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        
        .protocol-box { background: rgba(0,0,0,0.4); border-radius: 12px; padding: 20px; margin-top: 25px; text-align: left; border: 1px solid rgba(255, 20, 147, 0.2); }
        .protocol-title { color: #FF1493; font-size: 12px; font-weight: 900; margin-bottom: 10px; text-transform: uppercase; }
        .step { font-size: 13px; margin-bottom: 5px; color: #fff; }
        .step b { color: #FF1493; margin-right: 5px; }

        #res-box { margin-top: 25px; display: none; }
        #copy-btn { background: rgba(255, 20, 147, 0.1); border: 1px dashed #FF1493; color: #fff; padding: 20px; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 10px; cursor: pointer; width: 100%; }
        
        .footer { margin-top: 30px; font-size: 14px; font-weight: bold; color: #fff; }
        .copyright { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 5px; text-transform: uppercase; }
        .support-link { color: #FF1493; font-size: 11px; text-decoration: none; display: block; margin-top: 15px; font-weight: bold; }
    </style>
</head>
<body>
    <audio id="bgMusic" loop autoplay><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4"></audio>
    <div class="pair-card">
        <h1 class="system-title">SΛVΛGΞ TECH</h1>
        <div class="typing" id="type-text"></div>
        
        <input type="text" id="number" placeholder="254798841125">
        <button onclick="getCode()" id="genBtn">⚡ GENER∆TE CODE</button>
        
        <div id="res-box">
            <button id="copy-btn" onclick="copy()">--------</button>
            <p style="font-size: 10px; color: #FF1493; margin-top: 8px;" id="h">TAP CODE TO COPY</p>
        </div>

        <div class="protocol-box">
            <div class="protocol-title">Deployment Protocol:</div>
            <div class="step"><b>01.</b> Input Number with Country Code.</div>
            <div class="step"><b>02.</b> Generate code and check WhatsApp.</div>
            <div class="step"><b>03.</b> Tap 'Link Device' on your phone.</div>
            <div class="step"><b>04.</b> Enter the 8-digit code shown here.</div>
        </div>
        
        <div class="footer">Inspired by Meryl</div>
        <div class="copyright">© 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.</div>
        <a href="https://wa.me/254798841125" class="support-link">Having problems pairing? Contact Developer</a>
    </div>

    <script>
        // 🖋️ Typewriter Script with Erasing
        const phrases = [
            "not everyone gets access....",
            "this session is temporary....",
            "nothing here is permanent...",
            "system sees everything.....",
            "don’t mess this up......",
            "stay still....."
        ];
        let pIdx = 0, charIdx = 0, isDeleting = false;
        
        function typeEffect() {
            const current = phrases[pIdx];
            const display = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
            document.getElementById('type-text').innerHTML = display + (isDeleting ? "" : "|");
            
            let speed = isDeleting ? 50 : 120;
            if (!isDeleting && charIdx > current.length) { 
                speed = 2000; // Wait at end of phrase
                isDeleting = true; 
            } else if (isDeleting && charIdx < 0) { 
                isDeleting = false; 
                charIdx = 0; 
                pIdx = (pIdx + 1) % phrases.length; 
                speed = 500; // Short pause before next phrase
            }
            setTimeout(typeEffect, speed);
        }
        typeEffect();

        async function getCode() {
            const num = document.getElementById('number').value;
            const btn = document.getElementById('genBtn');
            if(!num) return alert("Enter number!");
            document.getElementById('bgMusic').play().catch(() => {});
            btn.innerText = "ESTABLISHING...";
            try {
                const response = await fetch('/code?number=' + num);
                const data = await response.json();
                if(data.code) {
                    document.getElementById('copy-btn').innerText = data.code;
                    document.getElementById('res-box').style.display = 'block';
                    btn.innerText = "SUCCESS";
                }
            } catch (e) { btn.innerText = "⚡ RETRY"; }
        }

        function copy() {
            navigator.clipboard.writeText(document.getElementById('copy-btn').innerText);
            document.getElementById('h').innerText = "✅ COPIED TO SYSTEM";
            setTimeout(() => { document.getElementById('h').innerText = "TAP CODE TO COPY"; }, 2000);
        }
    </script>
</body>
</html>
    `);
});

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    num = num.replace(/[^0-9]/g, '');
    try {
        if (!sock) await startSavage();
        const code = await sock.requestPairingCode(num);
        res.status(200).json({ code: code });
    } catch (err) { res.status(500).json({ error: "Pairing failed" }); }
});

app.listen(PORT, () => { console.log('Server live'); startSavage(); });

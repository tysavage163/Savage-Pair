const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const pino = require("pino");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- REAL WHATSAPP PAIRING LOGIC ---
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    num = num.replace(/[^0-9]/g, '');

    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    
    const client = makeWASocket({
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    if (!client.authState.creds.registered) {
        await delay(1500);
        try {
            // THIS COMMAND TRIGGERS THE ACTUAL WHATSAPP NOTIFICATION
            const code = await client.requestPairingCode(num);
            res.json({ code: code });
        } catch (e) {
            res.status(500).json({ error: "Pairing failed" });
        }
    }
    client.ev.on('creds.update', saveCreds);
});

// --- FRONTEND UI (RED THEME + MUSIC + TYPING) ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ-CORE | OPERATIONAL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #000 url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png') center/cover fixed;
            color: #fff; font-family: 'Segoe UI', sans-serif;
            display: flex; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { 
            background: rgba(0, 0, 0, 0.9); border: 1.5px solid #ff0055; border-radius: 24px; 
            padding: 35px; text-align: center; width: 90%; max-width: 400px;
            box-shadow: 0 0 30px rgba(255, 0, 85, 0.4);
        }
        #t { color: #ff0055; font-family: monospace; height: 20px; margin-bottom: 20px; font-weight: bold; font-size: 14px; }
        input { 
            background: rgba(0,0,0,0.6); border: 2px solid #ff0055; color: #ff0055; 
            padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 15px; 
            text-align: center; font-size: 18px; font-weight: bold; outline: none;
            text-shadow: 0 0 10px #ff0055;
        }
        .btn { background: #ff0055; color: #fff; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; }
        #res-box { 
            margin-top: 20px; border: 2px dashed #ff0055; color: #ff0055; 
            padding: 20px; font-size: 28px; font-weight: 900; display: none; border-radius: 10px; cursor: pointer;
        }
        .meryl { color: #fff; text-shadow: 0 0 10px #ff0055; font-size: 14px; margin-top: 30px; display: block; opacity: 0.8; }
    </style>
</head>
<body>
    <audio id="m" loop src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/music.mp3"></audio>
    <div class="container">
        <div class="card">
            <h1 style="color:#ff0055; letter-spacing:3px; margin-bottom:10px;">SΛVΛGΞ-CORE</h1>
            <div id="t"></div>
            <input type="text" id="n" placeholder="2547XXXXXXXX">
            <button class="btn" id="gb" onclick="pair()">⚡ GENERATE PAIRING CODE</button>
            <div id="res-box" onclick="copy()"></div>
        </div>
        <span class="meryl">Inspired by Meryl</span>
    </div>

    <script>
        // --- Typing & Erasing Logic ---
        const phrases = ["ESTABLISHING CONNECTION...", "BYPASSING FIREWALL...", "CORE OPERATIONAL."];
        let p=0, c=0, d=false;
        function type() {
            const cur = phrases[p];
            document.getElementById('t').innerText = d ? cur.substring(0, c--) : cur.substring(0, c++);
            let s = d ? 50 : 100;
            if(!d && c > cur.length) { d=true; s=2000; }
            else if(d && c < 0) { d=false; c=0; p=(p+1)%phrases.length; s=500; }
            setTimeout(type, s);
        }
        type();

        // --- Music Fix: Plays on first tap ---
        window.onclick = () => { 
            const a = document.getElementById('m'); 
            if(a.paused) { a.play(); a.volume = 0.5; }
        };

        async function pair() {
            const num = document.getElementById('n').value;
            const btn = document.getElementById('gb');
            const box = document.getElementById('res-box');
            if(!num) return alert("Enter Number!");
            
            btn.innerText = "LINKING WHATSAPP...";
            try {
                const res = await fetch('/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    box.innerText = data.code;
                    box.style.display = 'block';
                    btn.innerText = "SUCCESS";
                }
            } catch (e) {
                btn.innerText = "⚡ RETRY";
                alert("Connection Failed. Check Render Logs.");
            }
        }
        function copy() {
            navigator.clipboard.writeText(document.getElementById('res-box').innerText);
            alert("Code Copied!");
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => console.log("Engine Running"));

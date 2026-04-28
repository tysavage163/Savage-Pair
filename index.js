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

// 🌐 ROUTE 1: THE BEAUTIFUL UI
app.get('/', (req, res) => {
    // Paste your full <!DOCTYPE html> code here inside the backticks
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SΛVΛGΞ TECH | PAIRING</title>
            <style>
                /* ... (Your CSS from the previous prompt goes here) ... */
                body { background: #0a000f; color: #d88eff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
                .pair-card { background: rgba(15, 0, 25, 0.85); border: 1px solid #A020F0; border-radius: 24px; padding: 40px; width: 90%; max-width: 400px; box-shadow: 0 0 20px #A020F0; }
                input { background: #000; border: 2px solid #A020F0; color: #fff; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; }
                button { background: linear-gradient(135deg, #A020F0, #FF1493); color: #fff; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: bold; cursor: pointer; letter-spacing: 2px; }
                #result { margin-top: 25px; font-size: 32px; color: #FF1493; font-weight: 900; letter-spacing: 5px; text-shadow: 0 0 10px #FF1493; }
            </style>
        </head>
        <body>
            <div class="pair-card">
                <h1 style="letter-spacing: 5px;">SΛVΛGΞ TECH</h1>
                <p style="font-size: 10px; color: #FF1493; margin-bottom: 20px;">CORE SYSTEM ACTIVE</p>
                <input type="text" id="number" placeholder="254798841125">
                <button onclick="getCode()" id="genBtn">⚡ GENER∆TE P∆IR CODE</button>
                <div id="result"></div>
            </div>
            <script>
                async function getCode() {
                    const num = document.getElementById('number').value.replace(/[^0-9]/g, '');
                    const resDiv = document.getElementById('result');
                    const btn = document.getElementById('genBtn');
                    if(!num) return alert("Enter number!");
                    btn.innerText = "ESTABLISHING...";
                    try {
                        const response = await fetch('/code?number=' + num);
                        const data = await response.json();
                        if(data.code) {
                            resDiv.innerText = data.code;
                            btn.innerText = "ACCESS GRANTED";
                        } else {
                            alert("Try again in 5 seconds.");
                            btn.innerText = "⚡ GENER∆TE P∆IR CODE";
                        }
                    } catch (e) { alert("Server error. Refresh."); }
                }
            </script>
        </body>
        </html>
    `);
});

// ⚡ ROUTE 2: THE BACKEND LOGIC (Returns JSON for the UI)
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    
    num = num.replace(/[^0-9]/g, '');

    try {
        if (!sock) await startSavage();
        const code = await sock.requestPairingCode(num);
        // Return JSON so the HTML script can display it
        res.status(200).json({ code: code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Pairing failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
    startSavage();
});

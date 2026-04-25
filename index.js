const express = require('express');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));

// --- THE CORE PAIRING ROUTE ---
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    
    // Clean and Format Number (Auto-fix for 254)
    num = num.replace(/[^0-9]/g, '');
    if (num.startsWith('0')) {
        num = '254' + num.slice(1);
    } else if (!num.startsWith('254')) {
        num = '254' + num;
    }

    const tempDir = path.join(__dirname, 'tmp', `session_${num}_${Date.now()}`);
    if (!fs.existsSync(path.join(__dirname, 'tmp'))) fs.mkdirSync(path.join(__dirname, 'tmp'));

    const { state, saveCreds } = await useMultiFileAuthState(tempDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        },
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        // FRESH IDENTITY: Windows Chrome is most trusted for popups
        browser: ["Windows", "Chrome", "122.0.6261.112"],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000
    });

    try {
        // Wait for Koyeb network to stabilize
        await delay(8000); 

        if (!sock.authState.creds.registered) {
            let code = await sock.requestPairingCode(num);
            
            // Re-attempt if first signal was silent
            if (!code) {
                await delay(3000);
                code = await sock.requestPairingCode(num);
            }

            const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
            res.json({ code: formattedCode });
        }
    } catch (err) {
        console.error("Pairing Error:", err);
        res.status(500).json({ error: "WhatsApp Server busy. Try again." });
    } finally {
        // Cleanup temp files after 2 minutes to save space
        setTimeout(() => {
            try {
                if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (e) {}
        }, 120000);
    }
});

// --- UI STYLING FOR THE FOOTER ---
// If you use a public/index.html, make sure to add this CSS/HTML there too.
const footerHTML = `
<style>
    .savage-footer {
        position: fixed;
        bottom: 20px;
        width: 100%;
        text-align: center;
        font-family: 'Arial', sans-serif;
    }
    .glow-text {
        font-size: 1.1rem;
        font-weight: bold;
        color: #fff;
        animation: glow-pulse 2.5s infinite ease-in-out;
    }
    .rights-text {
        font-size: 0.7rem;
        color: #777;
        margin-top: 5px;
        letter-spacing: 1px;
    }
    @keyframes glow-pulse {
        0%, 100% { text-shadow: 0 0 5px #fff; opacity: 0.5; }
        50% { text-shadow: 0 0 20px #00d4ff, 0 0 30px #00d4ff; opacity: 1; }
    }
</style>
<footer class="savage-footer">
    <div class="glow-text">Inspired by Meryl</div>
    <div class="rights-text">© 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.</div>
</footer>
`;

app.listen(PORT, () => {
    console.log(`🚀 SΛVΛGΞ-PAIR REBOOTED ON PORT ${PORT}`);
    console.log(`🔗 FOOTER: Inspired by Meryl (Active)`);
});

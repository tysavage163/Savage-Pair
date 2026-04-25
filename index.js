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
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    
    num = num.replace(/[^0-9]/g, '');

    const tempDir = `/tmp/session_${num}_${Date.now()}`;
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
        // Optimized Browser String to bypass silent blocks
        browser: ["SΛVΛGΞ-TECH", "Chrome", "110.0.5481.178"],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 15000,
        generateHighQualityLink: true
    });

    // Handle potential connection closures during pairing
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) console.log("Re-establishing pairing socket...");
        }
    });

    try {
        // STEP 1: Wait for Socket Stability
        await delay(5000); 

        // STEP 2: Request Pairing Code
        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode(num);
            const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
            
            // Send code to frontend
            res.json({ code: formattedCode });
        }

    } catch (err) {
        console.error("Critical Pairing Error:", err);
        res.status(500).json({ error: "Server busy. Refresh your WhatsApp and try again." });
    } finally {
        // Auto-cleanup stale sessions
        setTimeout(() => {
            if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        }, 120000);
    }
});

app.listen(PORT, () => console.log(`🚀 SΛVΛGΞ-PAIR REINFORCED ON PORT ${PORT}`));

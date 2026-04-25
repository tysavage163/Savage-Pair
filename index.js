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
    
    // Clean number: ensure it starts with 254 and has no symbols
    num = num.replace(/[^0-9]/g, '');
    if (!num.startsWith('254') && num.startsWith('0')) {
        num = '254' + num.slice(1);
    }

    // Unique temp directory to prevent session overlap
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
        // FRESH IDENTITY: Mimicking a common Windows Chrome setup to bypass blocks
        browser: ["Windows", "Chrome", "122.0.6261.112"],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000
    });

    try {
        // STEP 1: Longer delay to allow Render's network to fully handshake with WhatsApp
        await delay(8000); 

        // STEP 2: Request Code with Double-Try logic
        if (!sock.authState.creds.registered) {
            let code = await sock.requestPairingCode(num);
            
            // If the first request is "silent," try one more time before responding
            if (!code) {
                await delay(2000);
                code = await sock.requestPairingCode(num);
            }

            const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
            res.json({ code: formattedCode });
        }

    } catch (err) {
        console.error("Pairing Error:", err);
        res.status(500).json({ error: "WhatsApp is currently throttling requests. Try again in 1 minute." });
    } finally {
        // Cleanup temp files after 2 minutes
        setTimeout(() => {
            try {
                if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (e) {}
        }, 120000);
    }
});

app.listen(PORT, () => console.log(`🚀 SΛVΛGΞ-PAIR REBOOTED ON PORT ${PORT}`));

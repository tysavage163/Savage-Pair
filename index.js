const express = require('express');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    
    // Clean number: remove +, spaces, and dashes
    num = num.replace(/[^0-9]/g, '');

    // 1. CREATE UNIQUE TEMP DIRECTORY
    // Using /tmp for Render compatibility and preventing cross-session bugs
    const tempDir = `/tmp/session_${num}_${Date.now()}`;
    const { state, saveCreds } = await useMultiFileAuthState(tempDir);
    const { version } = await fetchLatestBaileysVersion();

    // 2. CONFIGURE HIGH-PRIORITY SOCKET
    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        },
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        // "Chrome" browser identity is less likely to be ghosted by WhatsApp
        browser: ["Chrome (Linux)", "Chrome", "110.0.5481.178"],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0
    });

    try {
        // 3. THE HANDSHAKE DELAY
        // Giving the socket 3 seconds to stabilize before requesting the code
        await delay(3000);

        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode(num);
            
            // Format code for display (e.g., ABCD-1234)
            const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
            
            res.json({ code: formattedCode });
        } else {
            res.json({ error: "Device already registered. Log out first." });
        }

    } catch (err) {
        console.error("Pairing Error:", err);
        res.status(500).json({ error: "WhatsApp servers timed out. Refresh and retry." });
    } finally {
        // Cleanup: Remove the temp folder after 2 minutes to keep Render clean
        setTimeout(() => {
            try {
                if (fs.existsSync(tempDir)) {
                    fs.rmSync(tempDir, { recursive: true, force: true });
                }
            } catch (e) { /* silent fail */ }
        }, 120000);
    }
});

app.listen(PORT, () => console.log(`🚀 SΛVΛGΞ-PAIR ACTIVE ON PORT ${PORT}`));

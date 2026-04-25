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
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static('public'));

app.get('/', (req, res) => { res.status(200).send('SΛVΛGΞ-PAIR SYSTEM ACTIVE'); });

// Main function to initialize the connection
async function startSavage() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        },
        printQRInTerminal: true, // <--- THIS ENABLES THE QR IN TERMUX
        logger: pino({ level: "fatal" }),
        browser: ["SΛVΛGΞ-TECH", "Safari", "1.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log("Scan the QR code above to link.");
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startSavage();
        } else if (connection === 'open') {
            console.log('Successfully connected to WhatsApp!');
        }
    });

    // Keeping the /code route for pairing method too
    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "Number required" });
        num = num.replace(/[^0-9]/g, '');
        try {
            const code = await sock.requestPairingCode(num);
            res.status(200).json({ code: code });
        } catch {
            res.status(500).json({ error: "Pairing failed" });
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
    startSavage();
});

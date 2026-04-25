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
// Render uses 10000 by default
const PORT = process.env.PORT || 10000;

app.use(express.static('public'));

/**
 * HOME ROUTE
 * Crucial for Render Health Checks. 
 * This prevents the "Exited with status 1" or "Timed out" errors.
 */
app.get('/', (req, res) => {
    res.status(200).send('SΛVΛGΞ-PAIR SYSTEM ACTIVE');
});

/**
 * PAIRING CODE ROUTE
 * Example: /code?number=254712345678
 */
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    
    // Clean and format the number
    num = num.replace(/[^0-9]/g, '');
    if (num.startsWith('0')) {
        num = '254' + num.slice(1);
    } else if (!num.startsWith('254') && num.length < 12) {
        num = '254' + num;
    }

    // Temporary folder for this specific session
    const tempDir = path.join(__dirname, 'tmp', `session_${num}_${Date.now()}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }),
            browser: ["Ubuntu", "Chrome",

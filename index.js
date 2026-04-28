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

// Keep track of the socket globally so the route can access it
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
        printQRInTerminal: false, // Disabled for cloud to save resources
        logger: pino({ level: "fatal" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"] // Standard browser string for better pairing
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

// ===== THE PAIRING ROUTE =====
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).send('<h1>Error: Number required (?number=254...)</h1>');
    
    num = num.replace(/[^0-9]/g, '');

    try {
        // Ensure socket is initialized
        if (!sock) await startSavage();
        
        // Request the code from WhatsApp
        const code = await sock.requestPairingCode(num);
        
        // Send a clean, readable response for your mobile browser
        res.send(`
            <body style="background: #000; color: #0ff; font-family: courier; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                <div style="border: 2px solid #0ff; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 0 20px #0ff;">
                    <h1 style="margin-top: 0;">⛓️ SΛVΛGΞ-PAIR ⛓️</h1>
                    <p style="color: #fff;">Enter this code into WhatsApp:</p>
                    <div style="font-size: 50px; font-weight: bold; letter-spacing: 8px; color: #fff; margin: 20px 0;">
                        ${code.toUpperCase()}
                    </div>
                    <p style="font-size: 12px; color: #555;">Architect: Spencer</p>
                </div>
            </body>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>System Busy. Refresh and try again.</h1>');
    }
});

app.get('/', (req, res) => { res.status(200).send('SΛVΛGΞ-PAIR SYSTEM ACTIVE'); });

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
    startSavage(); // Start the socket connection immediately on boot
});

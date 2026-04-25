const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static('public'));

app.get('/', (req, res) => { res.status(200).send('SΛVΛGΞ-PAIR SYSTEM ACTIVE'); });

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });
    num = num.replace(/[^0-9]/g, '');
    if (num.startsWith('0')) { num = '254' + num.slice(1); }
    else if (!num.startsWith('254') && num.length < 12) { num = '254' + num; }

    const tempDir = path.join(__dirname, 'tmp', `session_${num}_${Date.now()}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({
            version,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }),
            browser: ["Ubuntu", "Chrome", "20.0.04"]
        });

        if (!sock.authState.creds.registered) {
            await delay(2000);
            const code = await sock.requestPairingCode(num);
            if (!res.headersSent) res.status(200).json({ code: code });
        }

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason !== DisconnectReason.loggedOut) {
                    setTimeout(() => { try { fs.removeSync(tempDir); } catch (e) {} }, 10000);
                }
            }
        });
    } catch (err) {
        if (!res.headersSent) res.status(500).json({ error: "Internal Error" });
    }
});

app.listen(PORT, () => { console.log(`SΛVΛGΞ-PAIR LIVE ON PORT ${PORT}`); });

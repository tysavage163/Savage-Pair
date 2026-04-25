const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.status(400).json({ error: "Number required" });

    const { state } = await useMultiFileAuthState('./temp_session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    try {
        await delay(2000);
        num = num.replace(/[^0-9]/g, '');
        const code = await sock.requestPairingCode(num);
        res.json({ code: code });
    } catch (err) {
        res.status(500).json({ error: "System Busy. Try again." });
    }
});

app.listen(PORT, () => console.log(`SΛVΛGΞ-PAIR ACTIVE`));

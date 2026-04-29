const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ TECH | QUANTUM</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #000;
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
            url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #fff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { 
            background: rgba(0,0,0,0.8); padding: 40px 30px; border-radius: 24px; border: 1.5px solid #00f2ff; 
            text-align: center; backdrop-filter: blur(15px); max-width: 420px; width: 95%;
            box-shadow: 0 0 30px rgba(0, 242, 255, 0.2);
        }
        .logo { font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #00f2ff; text-shadow: 0 0 15px #00f2ff; margin-bottom: 5px; }
        
        /* ⌨️ Red Typing Animation */
        .typing { color: #ff0000; font-family: monospace; height: 25px; margin-bottom: 20px; font-size: 14px; font-weight: bold; }

        /* 📱 Purplish Input Text */
        input { background: rgba(0,0,0,0.6); border: 2px solid #00f2ff; color: #bc13fe; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; font-weight: bold; }
        
        button.main-btn { background: #00f2ff; color: #000; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: 0.3s; margin-bottom: 25px; }
        button.main-btn:hover { background: #fff; color: #000; box-shadow: 0 0 20px #00f2ff; }

        /* ✨ Glowing Meryl Credits - The pulsing pink glow you requested */
        .meryl-glow { 
            color: #fff; 
            font-weight: bold; 
            display: inline-block;
            text-shadow: 0 0 10px #ff0055, 0 0 20px #ff0055; 
            animation: pulse 2s infinite; 
        }
        @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); text-shadow: 0 0 15px #ff0055, 0 0 30px #ff0055; }
            100% { opacity: 0.7; transform: scale(1); }
        }

        /* Portal Switch Buttons */
        .portal-switch { display: flex; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px; }
        .nav-btn { flex: 1; padding: 12px; border-radius: 10px; text-decoration: none; font-size: 11px; font-weight: bold; color: #fff; display: flex; align-items: center; justify-content: center; gap: 5px; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
        .active-cyan { background: rgba(0, 242, 255, 0.2); border-color: #00f2ff; color: #00f2ff; }
        .nav-btn:hover:not(.active-cyan) { background: rgba(255, 0, 85, 0.1); border-color: #ff0055; }

        .footer { margin-top: 25px; font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="card">
        <h1 class="logo">SΛVΛGΞ-QUANTUM</h1>
        <div class="typing" id="t"></div>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px dashed #00f2ff; height: 180px; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: #00f2ff; margin-bottom: 25px; font-weight: bold; letter-spacing: 2px;">
            [ QR SYSTEM READY ]
        </div>

        <div class="portal-switch">
            <a href="https://spencers-quantam-core.onrender.com" class="nav-btn">🔗 PAIR CODE</a>
            <a href="#" class="nav-btn active-cyan">🔳 QR SCAN</a>
        </div>

        <div class="footer">
            <span class="meryl-glow">Inspired by Meryl</span><br>
            © 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.
        </div>
    </div>

    <script>
        const phrases = ["not everyone gets access", "entering the quantum realm...", "establishing secure handshake...", "core systems stabilized..."];
        let pIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const current = phrases[pIdx];
            const display = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
            document.getElementById('t').innerText = display + (isDeleting ? "" : "|");
            let speed = isDeleting ? 40 : 100;
            if (!isDeleting && charIdx > current.length) { speed = 2000; isDeleting = true; }
            else if (isDeleting && charIdx < 0) { isDeleting = false; charIdx = 0; pIdx = (pIdx + 1) % phrases.length; speed = 500; }
            setTimeout(type, speed);
        }
        type();
    </script>
</body>
</html>
    `);
});

module.exports = app;

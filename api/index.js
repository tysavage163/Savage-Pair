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
    <title>SΛVΛGΞ TECH | CORE</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #000;
            /* Lightened overlay for background clarity */
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
            url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #fff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { 
            background: rgba(0,0,0,0.8); padding: 40px 30px; border-radius: 24px; border: 1.5px solid #ff0055; 
            text-align: center; backdrop-filter: blur(15px); max-width: 420px; width: 95%;
            box-shadow: 0 0 30px rgba(255, 0, 85, 0.3);
        }
        .logo { font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #ff0055; text-shadow: 0 0 15px #ff0055; margin-bottom: 5px; }
        
        /* ⌨️ Red Typing Animation */
        .typing { color: #ff0000; font-family: monospace; height: 25px; margin-bottom: 20px; font-size: 14px; font-weight: bold; }

        /* 📱 Purplish Input Text */
        input { background: rgba(0,0,0,0.6); border: 2px solid #ff0055; color: #bc13fe; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; font-weight: bold; }
        
        button.main-btn { background: #ff0055; color: #fff; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: 0.3s; margin-bottom: 25px; }
        button.main-btn:hover { background: #fff; color: #ff0055; box-shadow: 0 0 20px #ff0055; }

        /* ✨ Glowing Meryl Credits */
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
        .active { background: rgba(255, 0, 85, 0.2); border-color: #ff0055; color: #ff0055; }
        .nav-btn:hover:not(.active) { background: rgba(0, 242, 255, 0.1); border-color: #00f2ff; }

        .footer { margin-top: 25px; font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="card">
        <h1 class="logo">SΛVΛGΞ-TECH</h1>
        <div class="typing" id="t"></div>
        
        <input type="text" id="n" placeholder="254798841125">
        <button onclick="f()" id="b" class="main-btn">⚡ GENER∆TE CODE</button>
        
        <div id="res-box" style="display:none; margin-bottom: 20px;">
            <button id="copy-btn" style="background:none; border:1px dashed #ff0055; color:#ff0055; padding:15px; width:100%; font-size:25px; font-weight:900; border-radius:10px; cursor:pointer;">--------</button>
            <div style="font-size:10px; color:#ff0055; margin-top:8px;">TAP CODE TO COPY</div>
        </div>

        <div class="portal-switch">
            <a href="#" class="nav-btn active">🔗 PAIR CODE</a>
            <a href="https://savage-pair.vercel.app/" class="nav-btn">🔳 QR SCAN</a>
        </div>

        <div class="footer">
            <span class="meryl-glow">Inspired by Meryl</span><br>
            © 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.
        </div>
    </div>

    <script>
        const phrases = ["not everyone gets access", "initializing quantum link...", "securing terminal...", "encrypting data streams..."];
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

        async function f() {
            const num = document.getElementById('n').value;
            const btn = document.getElementById('b');
            const resBox = document.getElementById('res-box');
            if(!num) return alert("Enter number!");
            btn.innerText = "ESTABLISHING...";
            try {
                const res = await fetch('/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    document.getElementById('copy-btn').innerText = data.code;
                    resBox.style.display = 'block';
                    btn.innerText = "SUCCESS";
                }
            } catch (e) { btn.innerText = "⚡ RETRY"; }
        }
    </script>
</body>
</html>
    `);
});

module.exports = app;

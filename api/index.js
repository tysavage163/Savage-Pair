
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
            background: #0a000f;
            background-image: linear-gradient(rgba(10, 0, 15, 0.8), rgba(10, 0, 15, 0.8)), 
            url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png'); 
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #00f2ff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { 
            background: rgba(0,0,0,0.85); padding: 40px; border-radius: 24px; border: 1px solid #00f2ff; 
            text-align: center; backdrop-filter: blur(15px); max-width: 420px; width: 90%;
            box-shadow: 0 0 30px rgba(0, 242, 255, 0.3);
        }
        .system-title { font-size: 32px; font-weight: 900; letter-spacing: 5px; text-shadow: 0 0 15px #00f2ff; margin-bottom: 5px; color: #00f2ff; }
        
        /* ⌨️ Cyan Glow Typing Animation */
        .typing { 
            color: #00f2ff; 
            text-shadow: 0 0 10px #00f2ff, 0 0 20px #00f2ff;
            margin-bottom: 25px; font-family: monospace; height: 25px; 
            text-transform: lowercase; font-weight: bold; font-size: 16px;
        }

        input { background: rgba(0,0,0,0.6); border: 2px solid #00f2ff; color: #fff; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; }
        button { background: #00f2ff; color: #000; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: 0.3s; }
        button:hover { background: #fff; box-shadow: 0 0 25px #00f2ff; transform: scale(1.02); }
        
        .protocol-box { background: rgba(0,0,0,0.4); border-radius: 12px; padding: 20px; margin-top: 25px; text-align: left; border: 1px solid rgba(0, 242, 255, 0.2); }
        .protocol-title { color: #00f2ff; font-size: 12px; font-weight: 900; margin-bottom: 10px; text-transform: uppercase; }
        .step { font-size: 13px; margin-bottom: 5px; color: #fff; }
        .step b { color: #00f2ff; margin-right: 5px; }

        #res-box { margin-top: 25px; display: none; }
        #copy-btn { 
            background: rgba(0, 242, 255, 0.1); border: 1px dashed #00f2ff; color: #00f2ff;
            padding: 20px; border-radius: 12px; font-size: 32px; font-weight: 900;
            letter-spacing: 10px; cursor: pointer; width: 100%; transition: 0.2s;
        }
        #copy-btn:active { transform: scale(0.95); background: #00f2ff; color: #000; }
        
        .footer { margin-top: 30px; font-size: 14px; font-weight: bold; color: #fff; }
        .copyright { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .hint { font-size: 10px; color: #00f2ff; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px; }
    </style>
</head>
<body>
    <audio id="m" loop><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4"></audio>
    <div class="card">
        <h1 class="system-title">SΛVΛGΞ QUANTUM</h1>
        <div class="typing" id="t"></div>
        <input type="text" id="n" placeholder="254798841125">
        <button onclick="f()" id="b">⚡ GENERATE CODE</button>
        
        <div id="res-box">
            <button id="copy-btn" onclick="copy()">--------</button>
            <div class="hint" id="h">Tap Code to Copy</div>
        </div>

        <div class="protocol-box">
            <div class="protocol-title">Quantum Protocol:</div>
            <div class="step"><b>01.</b> Input Number with Country Code.</div>
            <div class="step"><b>02.</b> Generate code and check WhatsApp.</div>
            <div class="step"><b>03.</b> Tap 'Link Device' on your phone.</div>
            <div class="step"><b>04.</b> Enter the 8-digit code shown here.</div>
        </div>
        
        <div class="footer">Inspired by Meryl</div>
        <div class="copyright">© 2026 SΛVΛGΞ-TECH. ALL RIGHTS RESERVED.</div>
    </div>
    <script>
        const phrases = [
            "entering the quantum realm...",
            "data is being encrypted...",
            "only the worthy remain...",
            "the core is stabilizing...",
            "secure your session now...",
            "time is running out...",
            "shadows see everything..."
        ];
        let pIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const current = phrases[pIdx];
            const display = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
            document.getElementById('t').innerText = display + (isDeleting ? "" : "|");
            
            let speed = isDeleting ? 50 : 100;
            if (!isDeleting && charIdx > current.length) { 
                speed = 2000; 
                isDeleting = true; 
            } else if (isDeleting && charIdx < 0) { 
                isDeleting = false; 
                charIdx = 0; 
                pIdx = (pIdx + 1) % phrases.length; 
                speed = 500; 
            }
            setTimeout(type, speed);
        }
        type();

        async function f() {
            const num = document.getElementById('n').value;
            const btn = document.getElementById('b');
            const box = document.getElementById('res-box');
            const copyBtn = document.getElementById('copy-btn');
            const audio = document.getElementById('m');
            
            if(!num) return alert("Enter number!");
            
            audio.play().catch(() => {});
            btn.innerText = "ESTABLISHING...";
            
            try {
                const response = await fetch('https://spencers-quantam-core.onrender.com/code?number=' + num);
                const data = await response.json();
                if(data.code) {
                    copyBtn.innerText = data.code;
                    box.style.display = 'block';
                    btn.innerText = "SUCCESS";
                } else {
                    btn.innerText = "⚡ RETRY";
                }
            } catch (err) { 
                alert("Render Backend is Offline");
                btn.innerText = "⚡ RETRY"; 
            }
        }

        function copy() {
            const code = document.getElementById('copy-btn').innerText;
            navigator.clipboard.writeText(code);
            document.getElementById('h').innerText = "✅ COPIED TO SYSTEM";
            setTimeout(() => { document.getElementById('h').innerText = "Tap Code to Copy"; }, 2000);
        }
    </script>
</body>
</html>
    `);
});

module.exports = app;

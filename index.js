const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ-TECH | CORE</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #000;
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
            url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #fff; font-family: 'Segoe UI', sans-serif;
            display: flex; align-items: center; justify-content: center; min-height: 100vh;
        }
        .container { width: 90%; max-width: 450px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #ff0055; text-shadow: 0 0 15px #ff0055; margin-bottom: 30px; }
        .nexus-card { background: rgba(0, 0, 0, 0.85); border: 1.5px solid #ff0055; border-radius: 24px; padding: 35px; backdrop-filter: blur(15px); box-shadow: 0 0 40px rgba(255, 0, 85, 0.2); }
        .status-msg { color: #ff0055; font-family: monospace; font-size: 13px; margin-bottom: 15px; font-weight: bold; }
        input { background: rgba(0,0,0,0.6); border: 2px solid #ff0055; color: #ff0055; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 18px; outline: none; font-weight: bold; text-shadow: 0 0 10px #ff0055; }
        .action-btn { background: #ff0055; color: #fff; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        .meryl-glow { color: #fff; font-weight: bold; text-shadow: 0 0 10px #ff0055, 0 0 20px #ff0055; animation: pulse 2s infinite; font-size: 14px; margin-top: 30px; display: block; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
    </style>
</head>
<body>
    <audio id="bg-music" loop><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/music.mp3" type="audio/mpeg"></audio>
    <div class="container">
        <h1 class="logo">SΛVΛGΞ-CORE</h1>
        <div class="nexus-card">
            <div class="status-msg">READY TO LINK...</div>
            <input type="text" id="n" placeholder="254798841125">
            <button class="action-btn" onclick="f()" id="gen-btn">⚡ GENER∆TE CODE</button>
            <div id="res-box" style="display:none; margin-top:20px;">
                <div id="copy-btn" onclick="copyCode()" style="border:1px dashed #ff0055; color:#ff0055; padding:15px; font-size:25px; font-weight:900; border-radius:10px; cursor:pointer;">--------</div>
            </div>
        </div>
        <span class="meryl-glow">Inspired by Meryl</span>
    </div>
    <script>
        window.addEventListener('click', () => {
            const m = document.getElementById('bg-music');
            if(m.paused) { m.play(); m.volume = 0.5; }
        }, {once: true});
        async function f() {
            const num = document.getElementById('n').value;
            const btn = document.getElementById('gen-btn');
            if(!num) return alert("Enter number!");
            btn.innerText = "LINKING...";
            try {
                const res = await fetch('/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    document.getElementById('copy-btn').innerText = data.code;
                    document.getElementById('res-box').style.display = 'block';
                    btn.innerText = "SUCCESS";
                }
            } catch (e) { btn.innerText = "⚡ RETRY"; }
        }
        function copyCode() {
            const code = document.getElementById('copy-btn').innerText;
            navigator.clipboard.writeText(code);
            alert("Code copied!");
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => console.log('Render CORE live'));

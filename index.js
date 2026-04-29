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
        
        .nexus-card {
            background: rgba(0, 0, 0, 0.85); border: 1.5px solid #ff0055; border-radius: 24px;
            padding: 35px; backdrop-filter: blur(15px); box-shadow: 0 0 40px rgba(255, 0, 85, 0.2);
        }

        .method-box { display: flex; flex-direction: column; gap: 15px; margin-bottom: 10px; }
        .method-btn { 
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
            padding: 25px; border-radius: 18px; cursor: pointer; transition: 0.3s;
            display: flex; align-items: center; gap: 20px; text-align: left;
        }
        .method-btn:hover { border-color: #ff0055; transform: scale(1.02); background: rgba(255,0,85,0.05); }
        .icon { font-size: 28px; }
        .btn-title { font-weight: bold; font-size: 18px; color: #fff; }
        .btn-desc { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }

        .section { display: none; margin-top: 20px; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .status-msg { color: #ff0000; font-family: monospace; font-size: 13px; margin-bottom: 15px; font-weight: bold; }
        input { background: rgba(0,0,0,0.6); border: 2px solid #ff0055; color: #bc13fe; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 18px; outline: none; font-weight: bold; }
        
        .action-btn { background: #ff0055; color: #fff; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; }

        #qr-container { background: white; padding: 15px; border-radius: 15px; display: inline-block; margin-top: 15px; min-width: 230px; min-height: 230px; }
        #qr-image { width: 200px; height: 200px; display: none; }
        .qr-loading { color: #000; font-weight: bold; padding: 80px 0; }

        .meryl-glow { color: #fff; font-weight: bold; text-shadow: 0 0 10px #ff0055, 0 0 20px #ff0055; animation: pulse 2s infinite; font-size: 14px; margin-top: 30px; display: block; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
        
        .back-link { background: none; border: none; color: rgba(255,255,255,0.4); margin-top: 25px; cursor: pointer; display: block; width: 100%; font-size: 12px; letter-spacing: 1px; }
    </style>
</head>
<body>
    <audio id="bg-music" loop>
        <source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/music.mp3" type="audio/mpeg">
    </audio>

    <div class="container">
        <h1 class="logo">SΛVΛGΞ-TECH</h1>
        <div class="nexus-card">
            <div id="selection-area" class="method-box">
                <div class="method-btn" onclick="showSection('pair-section')">
                    <div class="icon">🔗</div>
                    <div><div class="btn-title">PAIR CODE</div><div class="btn-desc">Connect with phone number</div></div>
                </div>
                <div class="method-btn" onclick="showSection('qr-section')">
                    <div class="icon">🔳</div>
                    <div><div class="btn-title">QR SCAN</div><div class="btn-desc">Scan QR code to connect</div></div>
                </div>
            </div>

            <div id="pair-section" class="section">
                <div class="status-msg" id="pair-status">READY TO LINK...</div>
                <input type="text" id="n" placeholder="254798841125">
                <button class="action-btn" onclick="f()" id="gen-btn">⚡ GENER∆TE CODE</button>
                <div id="res-box" style="display:none; margin-top:20px;">
                    <div id="copy-btn" onclick="copyCode()" style="border:1px dashed #ff0055; color:#ff0055; padding:15px; font-size:25px; font-weight:900; border-radius:10px; cursor:pointer;">--------</div>
                </div>
                <button onclick="back()" class="back-link">← BACK TO SELECTION</button>
            </div>

            <div id="qr-section" class="section">
                <div class="status-msg">SCAN TO AUTHORIZE</div>
                <div id="qr-container">
                    <img id="qr-image" src="" alt="QR CODE">
                    <div id="qr-loading" class="qr-loading">GENERATING...</div>
                </div>
                <button onclick="back()" class="back-link">← BACK TO SELECTION</button>
            </div>
        </div>
        <span class="meryl-glow">Inspired by Meryl</span>
    </div>

    <script>
        let qrInterval;

        // Start music on first click
        window.addEventListener('click', () => {
            const music = document.getElementById('bg-music');
            if (music.paused) {
                music.play().catch(e => console.log("Music blocked"));
                music.volume = 0.5;
            }
        }, { once: true });

        function showSection(id) {
            document.getElementById('selection-area').style.display = 'none';
            document.getElementById(id).style.display = 'block';
            if(id === 'qr-section') startQR();
        }
        function back() {
            clearInterval(qrInterval);
            document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
            document.getElementById('selection-area').style.display = 'flex';
        }
        async function startQR() {
            const img = document.getElementById('qr-image');
            const loader = document.getElementById('qr-loading');
            qrInterval = setInterval(async () => {
                img.src = "/qr?t=" + Date.now();
                img.onload = () => { img.style.display = 'block'; loader.style.display = 'none'; };
            }, 3000);
        }
        async function f() {
            const num = document.getElementById('n').value;
            const btn = document.getElementById('gen-btn');
            if(!num) return alert("Enter number!");
            btn.innerText = "ESTABLISHING...";
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

app.listen(PORT, () => {
    console.log('Server live on port ' + PORT);
});

module.exports = app;

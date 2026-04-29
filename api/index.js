const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
const RENDER_URL = "https://spencers-quantam-core.onrender.com";

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ-TECH | QUANTUM</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; background-image: url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png'); background-size: cover; color: #fff; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .container { width: 90%; max-width: 450px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #00f2ff; text-shadow: 0 0 15px #00f2ff; margin-bottom: 30px; }
        .nexus-card { background: rgba(0, 0, 0, 0.85); border: 1.5px solid #00f2ff; border-radius: 24px; padding: 35px; box-shadow: 0 0 40px rgba(0, 242, 255, 0.2); }
        .typing-cyan { color: #00f2ff; font-family: monospace; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 8px #00f2ff; }
        input { background: rgba(0,0,0,0.6); border: 2px solid #00f2ff; color: #00f2ff; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 18px; font-weight: bold; }
        .action-btn { background: #00f2ff; color: #000; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; }
        .contact-dev { margin-top: 20px; font-size: 11px; color: rgba(255,255,255,0.6); text-decoration: none; display: block; }
        .contact-dev span { color: #00f2ff; font-weight: bold; }
    </style>
</head>
<body>
    <audio id="bg-music" loop><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/music.mp3" type="audio/mpeg"></audio>
    <div class="container">
        <h1 class="logo">SΛVΛGΞ-QUANTUM</h1>
        <div class="nexus-card">
            <div class="typing-cyan">ESTABLISHING QUANTUM LINK...</div>
            <input type="text" id="n" placeholder="254798841125">
            <button class="action-btn" onclick="f()">⚡ GENER∆TE CODE</button>
        </div>
        <a href="https://wa.me/254798841125" class="contact-dev">Having trouble pairing? <span>Contact developer</span></a>
    </div>
    <script>
        window.addEventListener('click', () => {
            const m = document.getElementById('bg-music');
            if(m.paused) { m.play(); m.volume = 0.5; }
        }, {once: true});
        async function f() {
            const num = document.getElementById('n').value;
            try {
                const res = await fetch('${RENDER_URL}/code?number=' + num);
                const data = await res.json();
                if(data.code) alert("Code: " + data.code);
            } catch (e) { alert("Backend Offline"); }
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => console.log('Vercel link live'));

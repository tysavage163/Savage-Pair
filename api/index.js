const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// PASTE YOUR RENDER URL HERE
const RENDER_URL = "https://spencers-quantam-core.onrender.com";

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ-QUANTUM | CYAN</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000 url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png') center/cover; color: #fff; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .container { width: 90%; max-width: 450px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #00f2ff; text-shadow: 0 0 15px #00f2ff; margin-bottom: 30px; }
        .card { background: rgba(0, 0, 0, 0.85); border: 1.5px solid #00f2ff; border-radius: 24px; padding: 35px; box-shadow: 0 0 40px rgba(0, 242, 255, 0.2); }
        input { background: rgba(0,0,0,0.6); border: 2px solid #00f2ff; color: #00f2ff; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 18px; font-weight: bold; outline: none; }
        .btn { background: #00f2ff; color: #000; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; }
        #copy-btn { margin-top: 20px; border: 1px dashed #00f2ff; color: #00f2ff; padding: 15px; font-size: 25px; font-weight: 900; cursor: pointer; display: none; }
    </style>
</head>
<body>
    <audio id="bg-music" loop src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/music.mp3"></audio>
    <div class="container">
        <h1 class="logo">SΛVΛGΞ-QUANTUM</h1>
        <div class="card">
            <div style="color:#00f2ff; font-weight:bold; margin-bottom:10px;">QUANTUM LINK ACTIVE</div>
            <input type="text" id="n" placeholder="254798841125">
            <button class="btn" onclick="f()">⚡ GENERATE CODE</button>
            <div id="copy-btn" onclick="copy()">--------</div>
        </div>
        <a href="https://wa.me/254798841125" style="margin-top:20px; display:block; color:#00f2ff; text-decoration:none; font-size:12px;">Contact Developer</a>
    </div>
    <script>
        document.body.addEventListener('click', () => {
            document.getElementById('bg-music').play();
        }, {once: true});

        async function f() {
            const num = document.getElementById('n').value;
            if(!num) return alert("Enter number!");
            try {
                const res = await fetch('${RENDER_URL}/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    const cb = document.getElementById('copy-btn');
                    cb.innerText = data.code; cb.style.display = 'block';
                }
            } catch (e) { alert("Backend Offline - Try Render Site Directly"); }
        }
        function copy() {
            navigator.clipboard.writeText(document.getElementById('copy-btn').innerText);
            alert("Code Copied!");
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => console.log('Vercel link live'));

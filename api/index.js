const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// REPLACE THIS WITH YOUR ACTUAL RENDER URL
const RENDER_URL = "https://spencers-quantam-core.onrender.com";

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ TECH | QUANTUM</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #0a000f url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png') center/cover fixed;
            color: #00f2ff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { 
            background: rgba(0,0,0,0.85); padding: 40px; border-radius: 24px; border: 1px solid #00f2ff; 
            text-align: center; backdrop-filter: blur(15px); max-width: 420px; width: 90%;
            box-shadow: 0 0 30px rgba(0, 242, 255, 0.3);
        }
        .system-title { font-size: 32px; font-weight: 900; letter-spacing: 5px; text-shadow: 0 0 15px #00f2ff; margin-bottom: 5px; color: #00f2ff; }
        .typing { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; margin-bottom: 25px; font-family: monospace; height: 25px; font-weight: bold; font-size: 16px; }
        input { background: rgba(0,0,0,0.6); border: 2px solid #00f2ff; color: #fff; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; }
        button { background: #00f2ff; color: #000; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: 0.3s; }
        #res-box { margin-top: 25px; display: none; }
        #copy-btn { background: rgba(0, 242, 255, 0.1); border: 1px dashed #00f2ff; color: #00f2ff; padding: 20px; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 10px; width: 100%; cursor: pointer; }
        .footer { margin-top: 30px; font-size: 14px; font-weight: bold; color: #fff; }
    </style>
</head>
<body>
    <audio id="m" loop><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4"></audio>
    <div class="card">
        <h1 class="system-title">SΛVΛGΞ QUANTUM</h1>
        <div class="typing" id="t"></div>
        <input type="text" id="n" placeholder="2547XXXXXXXX">
        <button onclick="f()" id="b">⚡ GENERATE CODE</button>
        <div id="res-box">
            <button id="copy-btn" onclick="copy()">--------</button>
            <div style="font-size: 10px; color: #00f2ff; margin-top: 8px;" id="h">Tap Code to Copy</div>
        </div>
        <div class="footer">Inspired by Meryl</div>
    </div>
    <script>
        const phrases = ["entering the quantum realm...", "data is being encrypted...", "only the worthy remain...", "the core is stabilizing..."];
        let pIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const current = phrases[pIdx];
            document.getElementById('t').innerText = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
            let speed = isDeleting ? 50 : 100;
            if (!isDeleting && charIdx > current.length) { speed = 2000; isDeleting = true; }
            else if (isDeleting && charIdx < 0) { isDeleting = false; charIdx = 0; pIdx = (pIdx + 1) % phrases.length; speed = 500; }
            setTimeout(type, speed);
        }
        type();

        window.onclick = () => { const a = document.getElementById('m'); if(a.paused) a.play(); };

        async function f() {
            const num = document.getElementById('n').value;
            if(!num) return alert("Enter number!");
            document.getElementById('b').innerText = "ESTABLISHING...";
            try {
                const res = await fetch('${RENDER_URL}/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    document.getElementById('copy-btn').innerText = data.code;
                    document.getElementById('res-box').style.display = 'block';
                    document.getElementById('b').innerText = "SUCCESS";
                }
            } catch (err) { alert("Core Offline"); }
        }
        function copy() {
            navigator.clipboard.writeText(document.getElementById('copy-btn').innerText);
            document.getElementById('h').innerText = "✅ COPIED";
        }
    </script>
</body>
</html>
    `);
});

module.exports = app;

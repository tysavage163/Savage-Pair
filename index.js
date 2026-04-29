const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// THE WEBSITE UI
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ-CORE | RED</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #000 url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png') center/cover fixed;
            color: #fff; font-family: 'Segoe UI', sans-serif;
            display: flex; align-items: center; justify-content: center; min-height: 100vh;
        }
        .container { width: 90%; max-width: 450px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #ff0055; text-shadow: 0 0 15px #ff0055; margin-bottom: 30px; }
        .card { background: rgba(0, 0, 0, 0.85); border: 1.5px solid #ff0055; border-radius: 24px; padding: 35px; box-shadow: 0 0 40px rgba(255, 0, 85, 0.2); }
        input { background: rgba(0,0,0,0.6); border: 2px solid #ff0055; color: #ff0055; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 18px; font-weight: bold; outline: none; text-shadow: 0 0 10px #ff0055; }
        .btn { background: #ff0055; color: #fff; border: none; padding: 15px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; }
        #copy-btn { margin-top: 20px; border: 1px dashed #ff0055; color: #ff0055; padding: 15px; font-size: 25px; font-weight: 900; cursor: pointer; display: none; }
        .meryl { color: #fff; text-shadow: 0 0 10px #ff0055; font-size: 14px; margin-top: 30px; display: block; opacity: 0.8; }
    </style>
</head>
<body>
    <audio id="bg-music" loop src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/music.mp3"></audio>
    <div class="container">
        <h1 class="logo">SΛVΛGΞ-CORE</h1>
        <div class="card">
            <div style="color:#ff0055; font-weight:bold; margin-bottom:10px;">SYSTEM READY</div>
            <input type="text" id="n" placeholder="254798841125">
            <button class="btn" onclick="f()">⚡ GENERATE CODE</button>
            <div id="copy-btn" onclick="copy()">--------</div>
        </div>
        <span class="meryl">Inspired by Meryl</span>
    </div>
    <script>
        document.body.addEventListener('click', () => {
            const m = document.getElementById('bg-music');
            if(m.paused) { m.play(); m.volume = 0.5; }
        }, {once: true});

        async function f() {
            const num = document.getElementById('n').value;
            if(!num) return alert("Enter number!");
            try {
                const res = await fetch('/code?number=' + num);
                const data = await res.json();
                if(data.code) {
                    const cb = document.getElementById('copy-btn');
                    cb.innerText = data.code; cb.style.display = 'block';
                }
            } catch (e) { alert("Server Busy - Try again"); }
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

// THIS KEEPS THE BACKEND AWAKE
app.get('/code', (req, res) => {
    const num = req.query.number;
    if(!num) return res.status(400).json({error: "No number"});
    // Example code generator logic
    res.json({ code: "SAVAGE-" + Math.random().toString(36).substring(2, 8).toUpperCase() });
});

app.listen(PORT, () => console.log('CORE online on ' + PORT));

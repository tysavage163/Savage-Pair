const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SΛVΛGΞ TECH | QUANTUM</title>
    <style>
        body { 
            background: #000; 
            background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://i.ibb.co/Wpvd9P3T/0c64540aa36ae656a909f116f1b3851a.webp'); 
            background-size: cover; background-position: center; color: #00f2ff; font-family: sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { background: rgba(0,0,0,0.85); padding: 30px; border-radius: 20px; border: 1px solid #00f2ff; text-align: center; backdrop-filter: blur(10px); max-width: 400px; width: 90%; }
        .typing { color: #ff0055; margin-bottom: 20px; font-family: monospace; font-size: 14px; }
        input { background: #111; border: 1px solid #00f2ff; color: #fff; padding: 15px; width: 100%; border-radius: 10px; margin-bottom: 20px; text-align: center; }
        button { background: #00f2ff; color: #000; border: none; padding: 15px; width: 100%; border-radius: 10px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <div class="card">
        <h1 style="letter-spacing: 4px;">SΛVΛGΞ QUANTUM</h1>
        <div class="typing" id="t">Establishing connection...</div>
        <input type="text" id="n" placeholder="254798841125">
        <button onclick="f()">INITIALIZE PAIRING</button>
        <p id="r" style="margin-top:20px; font-size: 24px; font-weight: bold; letter-spacing: 5px;"></p>
        <div style="margin-top: 20px; font-size: 10px; opacity: 0.5;">Inspired by Meryl | © 2026</div>
    </div>
    <script>
        const p = ["you connect...", "the system forgets...", "this session exists...", "then it doesn’t...", "use it...", "lose it..."];
        let i = 0;
        setInterval(() => { document.getElementById('t').innerText = p[i % p.length]; i++; }, 2000);

        async function f() {
            const n = document.getElementById('n').value;
            const r = document.getElementById('r');
            r.innerText = "WAITING...";
            try {
                // This connects Vercel to your Render bot
                const res = await fetch('https://spencers-quantam-core.onrender.com/code?number=' + n);
                const d = await res.json();
                r.innerText = d.code || "RETRYING...";
            } catch { r.innerText = "OFFLINE"; }
        }
    </script>
</body>
</html>
    `);
});

module.exports = app;

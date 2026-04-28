const express = require('express');
const cors = require('cors'); // Added this
const app = express();

app.use(cors()); // Enable communication with Render

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
            background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png'); 
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #00f2ff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
        }
        .card { 
            background: rgba(0,0,0,0.85); padding: 40px; border-radius: 24px; border: 1px solid #00f2ff; 
            text-align: center; backdrop-filter: blur(15px); max-width: 420px; width: 90%;
            box-shadow: 0 0 30px rgba(0, 242, 255, 0.3);
        }
        .system-title { font-size: 32px; font-weight: 900; letter-spacing: 5px; text-shadow: 0 0 15px #00f2ff; margin-bottom: 5px; }
        .typing { color: #ff0055; margin-bottom: 25px; font-family: monospace; height: 20px; text-transform: lowercase; }
        input { background: rgba(0,0,0,0.6); border: 2px solid #00f2ff; color: #fff; padding: 18px; width: 100%; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 18px; outline: none; }
        button { background: #00f2ff; color: #000; border: none; padding: 18px; width: 100%; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: 0.3s; }
        button:hover { background: #fff; box-shadow: 0 0 25px #00f2ff; transform: scale(1.02); }
        #result { margin-top: 25px; font-size: 35px; font-weight: 900; color: #fff; text-shadow: 0 0 20px #00f2ff; letter-spacing: 8px; }
    </style>
</head>
<body>
    <audio id="m" loop><source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4"></audio>
    <div class="card">
        <h1 class="system-title">SΛVΛGΞ QUANTUM</h1>
        <div class="typing" id="t">Initializing...</div>
        <input type="text" id="n" placeholder="254798841125">
        <button onclick="f()" id="b">⚡ GENERATE CODE</button>
        <div id="result"></div>
        <div style="margin-top: 30px; font-size: 11px; opacity: 0.6; letter-spacing: 1px;">Inspired by Meryl | © 2026</div>
    </div>
    <script>
        const phrases = ["you connect...", "the system forgets...", "this session exists...", "then it doesn’t...", "lose it..."];
        let i = 0;
        setInterval(() => { document.getElementById('t').innerText = phrases[i % phrases.length]; i++; }, 2500);

        async function f() {
            const num = document.getElementById('n').value;
            const btn = document.getElementById('b');
            const res = document.getElementById('result');
            const audio = document.getElementById('m');
            
            if(!num) return alert("Enter number!");
            
            audio.play().catch(() => console.log("Audio needs interaction"));
            btn.innerText = "ESTABLISHING...";
            
            try {
                const response = await fetch('https://spencers-quantam-core.onrender.com/code?number=' + num);
                const data = await response.json();
                if(data.code) {
                    res.innerText = data.code;
                    btn.innerText = "SUCCESS";
                } else {
                    res.innerText = "BUSY";
                    btn.innerText = "⚡ RETRY";
                }
            } catch (err) { 
                res.innerText = "OFFLINE"; 
                btn.innerText = "⚡ RETRY"; 
                console.error(err);
            }
        }
    </script>
</body>
</html>
    `);
});

module.exports = app;

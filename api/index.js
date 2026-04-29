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
    <title>SΛVΛGΞ PORTAL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #000; color: #fff; font-family: 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
            background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
            background-size: cover; background-position: center;
        }
        .container { text-align: center; width: 90%; max-width: 450px; }
        .logo { font-size: 35px; font-weight: 900; letter-spacing: 7px; color: #ff0055; text-shadow: 0 0 20px #ff0055; margin-bottom: 40px; }
        
        .choice-card { 
            display: flex; align-items: center; gap: 20px; background: rgba(255,255,255,0.05); 
            border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 18px; 
            margin-bottom: 20px; text-decoration: none; transition: 0.3s; text-align: left;
            backdrop-filter: blur(10px);
        }
        .choice-card:hover { transform: translateY(-5px); border-color: #ff0055; box-shadow: 0 0 20px rgba(255, 0, 85, 0.2); }
        
        .icon { font-size: 30px; }
        .title { font-weight: bold; color: #fff; font-size: 18px; letter-spacing: 1px; }
        .desc { color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 5px; }
        
        .footer { margin-top: 50px; font-size: 11px; opacity: 0.5; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">SΛVΛGΞ-TECH</div>
        
        <a href="https://your-savage-core.onrender.com" class="choice-card">
            <div class="icon">🔗</div>
            <div>
                <div class="title">PAIR CODE</div>
                <div class="desc">Connect with your phone number</div>
            </div>
        </a>

        <a href="https://your-savage-quantum.vercel.app" class="choice-card">
            <div class="icon">🔳</div>
            <div>
                <div class="title">QR SCAN</div>
                <div class="desc">Scan QR code to connect</div>
            </div>
        </a>

        <div class="footer">INSPIRED BY MERYL | © 2026 SΛVΛGΞ-TECH</div>
    </div>
</body>
</html>
    `);
});

module.exports = app;

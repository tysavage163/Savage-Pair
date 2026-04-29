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
*{margin:0;padding:0;box-sizing:border-box;}

body{
    background:#0a000f;
    background-image:linear-gradient(rgba(10,0,15,0.85),rgba(10,0,15,0.85)),
    url('https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/bg.png');
    background-size:cover;
    background-position:center;
    background-attachment:fixed;
    color:#00f2ff;
    font-family:'Segoe UI',sans-serif;
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:100vh;
}

.card{
    background:rgba(0,0,0,0.85);
    padding:40px;
    border-radius:24px;
    border:1px solid #00f2ff;
    text-align:center;
    backdrop-filter:blur(15px);
    max-width:420px;
    width:90%;
    box-shadow:0 0 40px rgba(0,242,255,0.4);
    animation:fadeIn 1s ease;
}

@keyframes fadeIn{
    from{opacity:0;transform:translateY(20px);}
    to{opacity:1;transform:translateY(0);}
}

.system-title{
    font-size:32px;
    font-weight:900;
    letter-spacing:5px;
    text-shadow:0 0 20px #00f2ff;
    margin-bottom:5px;
}

.typing{
    margin-bottom:25px;
    font-family:monospace;
    height:25px;
    font-size:16px;
    font-weight:bold;
    text-transform:lowercase;
}

input{
    background:rgba(0,0,0,0.6);
    border:2px solid #00f2ff;
    color:#fff;
    padding:18px;
    width:100%;
    border-radius:12px;
    margin-bottom:20px;
    text-align:center;
    font-size:18px;
    outline:none;
    transition:0.3s;
}

input:focus{
    box-shadow:0 0 15px #00f2ff;
}

button{
    background:#00f2ff;
    color:#000;
    border:none;
    padding:18px;
    width:100%;
    border-radius:12px;
    font-weight:900;
    cursor:pointer;
    text-transform:uppercase;
    transition:0.3s;
}

button:hover{
    background:#fff;
    box-shadow:0 0 25px #00f2ff;
    transform:scale(1.03);
}

.protocol-box{
    background:rgba(0,0,0,0.4);
    border-radius:12px;
    padding:20px;
    margin-top:25px;
    text-align:left;
    border:1px solid rgba(0,242,255,0.2);
}

.protocol-title{
    font-size:12px;
    font-weight:900;
    margin-bottom:10px;
    text-transform:uppercase;
}

.step{
    font-size:13px;
    margin-bottom:5px;
    color:#fff;
}

.step b{color:#00f2ff;}

#res-box{
    margin-top:25px;
    display:none;
}

#copy-btn{
    background:rgba(0,242,255,0.1);
    border:1px dashed #00f2ff;
    color:#00f2ff;
    padding:20px;
    border-radius:12px;
    font-size:32px;
    font-weight:900;
    letter-spacing:10px;
    cursor:pointer;
    width:100%;
    transition:0.2s;
}

#copy-btn:active{
    transform:scale(0.95);
    background:#00f2ff;
    color:#000;
}

.footer{
    margin-top:30px;
    font-size:14px;
    font-weight:bold;
    color:#fff;
}

.copyright{
    font-size:10px;
    color:rgba(255,255,255,0.4);
    margin-top:5px;
    text-transform:uppercase;
    letter-spacing:1px;
}

.hint{
    font-size:10px;
    color:#00f2ff;
    margin-top:8px;
    text-transform:uppercase;
    letter-spacing:2px;
}
</style>
</head>

<body>

<audio id="m" loop>
<source src="https://raw.githubusercontent.com/tysavage163/Savage-Pair/main/song.m4a" type="audio/mp4">
</audio>

<div class="card">
<h1 class="system-title">SΛVΛGΞ QUANTUM</h1>
<div class="typing" id="t"></div>

<input type="text" id="n" placeholder="2547XXXXXXXX">

<button onclick="f()" id="b">GENERATE CODE</button>

<div id="res-box">
<button id="copy-btn" onclick="copy()">--------</button>
<div class="hint" id="h">Tap Code to Copy</div>
</div>

<div class="protocol-box">
<div class="protocol-title">Quantum Protocol:</div>
<div class="step"><b>01.</b> Input Number with Country Code.</div>
<div class="step"><b>02.</b> Generate code and check WhatsApp.</div>
<div class="step"><b>03.</b> Tap Link Device on your phone.</div>
<div class="step"><b>04.</b> Enter the 8-digit code shown here.</div>
</div>

<div class="footer">Inspired by Meryl</div>
<div class="copyright">© 2026 SΛVΛGΞ-TECH</div>
</div>

<script>
const phrases=[
"entering the quantum realm...",
"encrypting session...",
"validating user...",
"core stabilizing...",
"secure link forming...",
"system watching...",
"shadow protocol active..."
];

let p=0,c=0,d=false;

function type(){
let txt=phrases[p];
let out=d?txt.substring(0,c--):txt.substring(0,c++);
document.getElementById("t").innerText=out+(d?"":"|");

let speed=d?50:90;

if(!d && c>txt.length){d=true;speed=1500;}
else if(d && c<0){d=false;c=0;p=(p+1)%phrases.length;speed=400;}

setTimeout(type,speed);
}
type();

async function f(){
const num=document.getElementById("n").value.trim();
const btn=document.getElementById("b");
const box=document.getElementById("res-box");
const copyBtn=document.getElementById("copy-btn");
const audio=document.getElementById("m");

if(!num || num.length < 10){
alert("Enter a valid number with country code");
return;
}

audio.play().catch(()=>{});
btn.innerText="CONNECTING...";

try{
const res=await fetch('https://spencers-quantam-core.onrender.com/code?number='+num);
const data=await res.json();

if(data.code){
copyBtn.innerText=data.code;
box.style.display='block';
btn.innerText="SUCCESS";
}else{
btn.innerText="RETRY";
}
}catch(e){
alert("Backend Offline");
btn.innerText="RETRY";
}
}

function copy(){
const code=document.getElementById("copy-btn").innerText;
navigator.clipboard.writeText(code);
const h=document.getElementById("h");
h.innerText="COPIED";
setTimeout(()=>{h.innerText="Tap Code to Copy";},2000);
}
</script>

</body>
</html>
`);
});

module.exports = app;

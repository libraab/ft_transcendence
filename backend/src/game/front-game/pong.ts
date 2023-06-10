//import io from "socket.io-client";
const io = require('socket.io-client');

const socket = io("ws://" + location.hostname + ":3000");

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknowGame);
socket.on('tooManyPlayers', handleTooManyPlayers);

let playerNumber: number;
let gameActive: boolean = false;
let canvas: any;
let ctx: any;

const initialScreen = document.getElementById('initialScreen') as HTMLInputElement;
const newGameBtn = document.getElementById('newGameBtn') as HTMLInputElement;
const joinGameBtn = document.getElementById('joinGameBtn') as HTMLInputElement;
const gameCodeInput = document.getElementById('gameCodeInput') as HTMLInputElement;
const game = document.getElementById('game') as HTMLInputElement;
const gameCodeDisplay = document.getElementById('gameCodeDisplay') as HTMLInputElement;

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
    socket.emit('newGame');
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

function drawRect(x: number, y: number, w: number, h: number, color: any) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x: number, y: number, r: number, color: any) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawNet(statenet: any) {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(statenet.net.x, statenet.net.y + i, statenet.net.width, statenet.net.height, statenet.net.color);
    }
}

function drawText(text: string, x: number, y: number) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function render(state: any) {    
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    drawText(state.user.score, canvas.width / 4, canvas.height / 5);

    drawText(state.com.score, 3 * canvas.width / 4, canvas.height / 5);

    drawNet(state);

    drawRect(state.user.x, state.user.y, state.user.width, state.user.height, state.user.color);

    drawRect(state.com.x, state.com.y, state.com.width, state.com.height, state.com.color);

    drawArc(state.ball.x, state.ball.y, state.ball.radius, state.ball.color);
}

function handleInit(number: number) {
    playerNumber = number;
}

function handleGameState(gameState: any) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => render(gameState));
}

function handleGameOver(data: any) {
    if (!gameActive) {
        return;
    }
    let date = JSON.parse(data);
    if (date.winner === playerNumber) {
        alert('You win!');
    }
    else {
        alert('You lose!');
    }
    gameActive = false;
}

function handleGameCode(gameCode: string) {
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknowGame() {
    reset();
    alert('Unknow game code');
}

function handleTooManyPlayers() {
    reset();
    alert('This game is already in progress');
}

function reset() {
    playerNumber = 0;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "";
    initialScreen.style.display = "block";
    game.style.display = "none";
}

function init() {
    initialScreen.style.display = "none";
    game.style.display = "block";
    canvas = document.getElementById("pong");
    ctx = canvas.getContext('2d');
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    gameActive = true;
}
    
function keydown(e: any) {
    socket.emit('keydown', e.keyCode);
}

function keyup(e: any) {
    socket.emit('keyup', e.keyCode);
}
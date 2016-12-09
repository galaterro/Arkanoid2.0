//inicio libreria
var x = 25;
var y = 250;
var dx = 1.5;
var dy = -4;
var ctx;
var WIDTH;
var HEIGHT;
var paddlex;
var paddleh = 10;
var paddlew = 75;
var rightDown = false;
var leftDown = false;
var canvasMinX = 0;
var canvasMaxX = 0;
var intervalId = 0;
var bricks;
var NROWS = 5;
var NCOLS = 5;
var BRICKWIDTH;
var BRICKHEIGHT = 15;
var PADDING = 1;
var marcador = 0;
var lives = 3;
var marcadorVidas;
var rowcolors;
var winnerPoints = NROWS * NCOLS;
var playerPoints = 0;
var playerName = null;
var canSearchMaximum = true;
function init() {
    if (playerName == null){
        playerName = prompt("Introduzca el nombre de jugador: ");
        document.getElementById("userName").innerHTML = "Nombre: " + playerName;
    }
    syncBestPoints(playerName);
    getMaximumPoints();
    playerPoints = 0;
    ctx = document.getElementById("canvas").getContext("2d");
    rowcolors = getRandomColors();
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    paddlex = WIDTH / 2;
    BRICKWIDTH = (WIDTH / NCOLS) - 1;
    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    initbricks();
    intervalId = setInterval(draw, 10);
    return intervalId;
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    rect(0, 0, WIDTH, HEIGHT);
}

function onKeyDown(evt) {
    if (evt.keyCode == 39) rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
    else if (evt.keyCode == 82) {
        lives = 3;
        syncLives();
    }
    else if (evt.keyCode == 76){
        lives += 1;
        marcadorVidas = document.getElementById("live")
        marcadorVidas.innerHTML = "Vidas: " + lives;
    }
}

function onKeyUp(evt) {
    if (evt.keyCode == 39) rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function onMouseMove(evt) {
    if ((evt.pageX > canvasMinX && evt.pageX < canvasMaxX) && (lives > 0)) {
        paddlex = Math.max(evt.pageX - canvasMinX - (paddlew / 2), 0);
        paddlex = Math.min(WIDTH - paddlew, paddlex);
    }
}

$(document).mousemove(onMouseMove);

function initbricks() {
    bricks = new Array(NROWS);
    for (i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (j = 0; j < NCOLS; j++) {
            bricks[i][j] = 1;
        }
    }
}

function drawbricks() {
    for (k = 0; k < NROWS; k++) {
        ctx.fillStyle = rowcolors[k];
        for (l = 0; l < NCOLS; l++) {
            if (bricks[k][l] == 1) {
                rect((l * (BRICKWIDTH + PADDING)) + PADDING,
                    (k * (BRICKHEIGHT + PADDING)) + PADDING,
                    BRICKWIDTH, BRICKHEIGHT);
            }
        }
    }
}
//fin de la libreria
var ballr = 10;
rowcolors = getRandomColors();
var paddlecolor = "#FFFFFF";
var ballcolor = "#FFFFFF";
var backcolor = "#000000";

function draw() {

    ctx.fillStyle = backcolor;
    clear();
    ctx.fillStyle = ballcolor;
    circle(x, y, ballr);

    if (rightDown) paddlex += 5;
    else if (leftDown) paddlex -= 5;
    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    drawbricks();


    var rowheight = BRICKHEIGHT + PADDING;
    var colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(y / rowheight);
    col = Math.floor(x / colwidth);
    //reverse the ball and mark the brick as broken
    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
        dy = -dy;
        bricks[row][col] = 0;
        marcador = marcador + 50;
        points();
        playerPoints +=1;
        if(getMaximumScore(playerName) < marcador){
            savePoints(playerName, marcador);
            syncBestPoints(playerName);
        }
        if(playerPoints >= winnerPoints){
            gameCompleted();
        }

    }

    if (x + dx + ballr > WIDTH || x + dx - ballr < 0)
        dx = -dx;

    if (y + dy - ballr < 0)
        dy = -dy;
    else if (y + dy + ballr > HEIGHT - paddleh) {
        if (x > paddlex && x < paddlex + paddlew) {
            //move the ball differently based on where it hit the paddle
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
        }
        else if (y + dy + ballr > HEIGHT) {
            if (lives == 1) {
                gameOver();
            } else {
                lives -= 1;
                syncLives();
            }
        }
    }

    x += dx;
    y += dy;

}
//funcion que nos de el resultado
function points() {
    var punto = document.getElementById("puntuacion");
    punto.innerHTML = "Puntuación: " + marcador;

}
function gameOver() {
    clearInterval(intervalId);
    ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, 600, 800);
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "centerline";
    ctx.fillText("Game Over", WIDTH / 2 - 140, HEIGHT / 2);
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "centerline";
    ctx.fillText("Pulsa R para iniciar", WIDTH / 2 - 220, HEIGHT / 2.5);
    marcadorVidas = document.getElementById("live")
    marcadorVidas.innerHTML = "Vidas: 0";

}

function gameCompleted(){
    clearInterval(intervalId);
    ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, 600, 800);
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "centerline";
    ctx.fillText("¡Has Ganado!", WIDTH / 2 - 140, HEIGHT / 2);
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "centerline";
    ctx.fillText("Pulsa R para iniciar", WIDTH / 2 - 220, HEIGHT / 2.5);
}

function syncLives() {
    setTimeout("init()", 2000);
    clearInterval(intervalId);
    x = 150;
    y = 150;
    var marcadorVidas = document.getElementById("live")
    marcadorVidas.innerHTML = "Vidas: " + lives;

}

function getRandomColors(){
    var random = Math.floor((Math.random() * 5) + 1);
    switch (random){
        case 1:
            return ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
        case 2:
            return ["#FF0000", "#FF0000", "#FFFF00", "#00FF00", "#00FF00"];
        case 3:
            return ["#2A6CFF", "#262FE8", "#6437FF", "#8726E8", "#CE2AFF"];
        case 4:
            return ["#7FFF27", "#7FFF27", "#34FF63", "#23E8C0", "#27B6FF"];
        case 5:
            return ["#FF091E", "#FF4B09", "#FF8F03", "#E8B408", "#FFF709"];
    }

}

function savePoints(clave, valor){
    localStorage.setItem(clave,valor);
}

function getMaximumScore(clave){
    var valor = localStorage.getItem(clave);
    return valor;
}

function syncBestPoints(nombre){
    var puntos = localStorage.getItem(nombre);
    document.getElementById("bestPoints").innerHTML = ("Mejor puntuación: " + puntos)
}
function getMaximumPoints(){
    if(canSearchMaximum){
        var leaderboard = document.getElementById("bestPlayers");
        for(var i = 0; i < localStorage.length; i++){
            var key = localStorage.key(i);
            leaderboard.innerHTML += "<br>" + key + " - " + getMaximumScore(key);
        }
        canSearchMaximum = false;
    }
}

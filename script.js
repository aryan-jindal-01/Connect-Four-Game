const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = "red";
let gameOver = false;

let score1 = Number(localStorage.getItem("score1")) || 0;
let score2 = Number(localStorage.getItem("score2")) || 0;

document.getElementById("score1").textContent = score1;
document.getElementById("score2").textContent = score2;

const boardElement = document.getElementById("board");
const currentPlayerText = document.getElementById("currentPlayer");
const message = document.getElementById("message");
const moveSound = new Audio("sounds/move.mp3");
const winSound = new Audio("sounds/win.mp3");

createBoard();

function createBoard() {

    board = [];
    boardElement.innerHTML = "";

     document.querySelectorAll(".cell").forEach(cell=>{
        cell.classList.remove("win");
    });

    for (let row = 0; row < ROWS; row++) {

        board[row] = [];

        for (let col = 0; col < COLS; col++) {

            board[row][col] = "";

            const cell = document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener("click", handleMove);

            boardElement.appendChild(cell);

        }

    }

}

function handleMove(e){

    if(gameOver) return;

    const col = Number(e.target.dataset.col);

    for(let row = ROWS-1; row>=0; row--){

        if(board[row][col]==""){

            board[row][col]=currentPlayer;

            updateBoard();
            moveSound.play();

           if (checkWinner()) {

    gameOver = true;

    if (currentPlayer == "red") {

        score1++;
        localStorage.setItem("score1", score1);
        document.getElementById("score1").textContent = score1;

        showPopup("🏆 Player 1 Wins");

    } else {

        score2++;
        localStorage.setItem("score2", score2);
        document.getElementById("score2").textContent = score2;

        showPopup("🏆 Player 2 Wins");

    }

    winSound.play();

    confetti({
        particleCount:300,
        spread:180,
        startVelocity:50,
        origin:{ y:0.6 }
    });

    return;
}

            currentPlayer=currentPlayer=="red"?"yellow":"red";

            currentPlayerText.innerHTML=currentPlayer=="red"?"🔴 Player 1":"🟡 Player 2";

            return;

        }

    }

}

function updateBoard(){

    const cells=document.querySelectorAll(".cell");

    cells.forEach(cell=>{

        const row=cell.dataset.row;
        const col=cell.dataset.col;

        cell.classList.remove("red","yellow");

        if(board[row][col]!=""){

            cell.classList.add(board[row][col]);

        }

    });

}

function checkWinner() {

    // Horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {

            let p = board[r][c];

            if (
                p !== "" &&
                p === board[r][c + 1] &&
                p === board[r][c + 2] &&
                p === board[r][c + 3]
            ) {
                highlightCells([
                
                [r,c],
                [r,c+1],
                [r,c+2],
                [r,c+3]
]);

                return true; 
            }

        }
    }

    // Vertical
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 3; r++) {

            let p = board[r][c];

            if (
                p !== "" &&
                p === board[r + 1][c] &&
                p === board[r + 2][c] &&
                p === board[r + 3][c]
            ) {
                return true;
            }

        }
    }

    // Diagonal \
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {

            let p = board[r][c];

            if (
                p !== "" &&
                p === board[r + 1][c + 1] &&
                p === board[r + 2][c + 2] &&
                p === board[r + 3][c + 3]
            ) {
                return true;
            }

        }
    }

    // Diagonal /
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {

            let p = board[r][c];

            if (
                p !== "" &&
                p === board[r - 1][c + 1] &&
                p === board[r - 2][c + 2] &&
                p === board[r - 3][c + 3]
            ) {
                return true;
            }

        }
    }

    return false;

}
document.getElementById("restartBtn").addEventListener("click", () => {

    gameOver = false;
    currentPlayer = "red";
    currentPlayerText.innerHTML = "🔴 Player 1";
    message.innerHTML = "";

    createBoard();

});

document.getElementById("newGameBtn").addEventListener("click", () => {

    score1 = 0;
    score2 = 0;
    localStorage.removeItem("score1");
    localStorage.removeItem("score2");

    document.getElementById("score1").textContent = 0;
    document.getElementById("score2").textContent = 0;

    gameOver = false;
    currentPlayer = "red";
    currentPlayerText.innerHTML = "🔴 Player 1";
    message.innerHTML = "";

    createBoard();

});

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeBtn.innerHTML = "🌞 Light";
    } else {
        themeBtn.innerHTML = "🌙 Theme";
    }

});

function showPopup(text){

document.getElementById("popup").style.display="block";

document.getElementById("popupText").innerHTML=text;

}

function closePopup(){

document.getElementById("popup").style.display="none";

gameOver=false;

createBoard();

}

function highlightCells(cells){

const allCells=document.querySelectorAll(".cell");

cells.forEach(pos=>{

const row=pos[0];
const col=pos[1];

allCells.forEach(cell=>{

if(
Number(cell.dataset.row)===row &&
Number(cell.dataset.col)===col
){
cell.classList.add("win");
}

});

});

}
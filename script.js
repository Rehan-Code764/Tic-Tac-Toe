// ==========================================
// SELECT ELEMENTS
// ==========================================

const cells = document.querySelectorAll(".cell");

const turnText = document.querySelector(".turn-box h3");
const turnIcon = document.querySelector(".turn-icon");

const resetBtn = document.querySelector(".reset-btn");
const winLine = document.querySelector(".win-line");

// Winner popup
const winnerPopup = document.querySelector(".winner-popup");
const winnerMessage = document.querySelector(".winner-message");
const closeWinner = document.querySelector(".close-winner");

// Sounds
const backgroundMusic = document.querySelector("#backgroundMusic");
const moveSound = document.querySelector("#moveSound");
const winSound = document.querySelector("#winSound");

// Scoreboard
const xScore = document.querySelector("#xScore");
const oScore = document.querySelector("#oScore");
const drawScore = document.querySelector("#drawScore");


// ==========================================
// GAME VARIABLES
// ==========================================

let currentPlayer = "X";
let gameActive = true;

// Scores
let xWins = 0;
let oWins = 0;
let draws = 0;


// ==========================================
// WINNING PATTERNS
// ==========================================

const winningPatterns = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


// ==========================================
// CELL CLICK
// ==========================================

cells.forEach((cell) => {

    cell.addEventListener("click", () => {

        // Cell already filled
        // or game already finished
        if (cell.textContent !== "" || !gameActive) {
            return;
        }


        // ==================================
        // START BACKGROUND MUSIC
        // ==================================

        if (backgroundMusic && backgroundMusic.paused) {

            backgroundMusic.volume = 0.3;

            backgroundMusic.play().catch(() => {
                console.log("Background music blocked.");
            });

        }


        // ==================================
        // PUT X OR O
        // ==================================

        cell.textContent = currentPlayer;


        // ==================================
        // MOVE SOUND
        // ==================================

        if (moveSound) {

            moveSound.currentTime = 0;

            moveSound.volume = 0.7;

            moveSound.play().catch(() => {
                console.log("Move sound blocked.");
            });

        }


        // ==================================
        // X STYLE
        // ==================================

        if (currentPlayer === "X") {

            cell.style.color = "#c04cff";

            cell.style.textShadow =
                "0 0 10px #c04cff, 0 0 25px #c04cff";

        }


        // ==================================
        // O STYLE
        // ==================================

        else {

            cell.style.color = "#2575fc";

            cell.style.textShadow =
                "0 0 10px #2575fc, 0 0 25px #2575fc";

        }


        // ==================================
        // CHECK RESULT
        // ==================================

        checkWinner();

    });

});


// ==========================================
// CHECK WINNER
// ==========================================

function checkWinner() {

    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        const first = cells[a].textContent;
        const second = cells[b].textContent;
        const third = cells[c].textContent;


        // ==================================
        // WINNER FOUND
        // ==================================

        if (
            first !== "" &&
            first === second &&
            second === third
        ) {

            // Stop game
            gameActive = false;


            // ==================================
            // UPDATE TURN BOX
            // ==================================

            turnText.textContent =
                `Player ${currentPlayer} Wins!`;

            turnIcon.textContent =
                currentPlayer;


            // ==================================
            // WINNER COLOR
            // ==================================

            const winnerColor =
                currentPlayer === "X"
                    ? "#c04cff"
                    : "#2575fc";


            // ==================================
            // HIGHLIGHT WINNING CELLS
            // ==================================

            cells[a].style.boxShadow =
                `0 0 25px ${winnerColor}`;

            cells[b].style.boxShadow =
                `0 0 25px ${winnerColor}`;

            cells[c].style.boxShadow =
                `0 0 25px ${winnerColor}`;


            // ==================================
            // DRAW WINNING LINE
            // ==================================

            drawWinLine(a, c);


            // ==================================
            // UPDATE SCORE
            // ==================================

            if (currentPlayer === "X") {

                xWins++;

                xScore.textContent =
                    xWins;

            }

            else {

                oWins++;

                oScore.textContent =
                    oWins;

            }


            // ==================================
            // STOP BACKGROUND MUSIC
            // ==================================

            if (backgroundMusic) {

                backgroundMusic.pause();

            }


            // ==================================
            // WINNER SOUND
            // ==================================

            if (winSound) {

                winSound.currentTime = 0;

                winSound.volume = 0.8;

                winSound.play().catch(() => {
                    console.log("Winner sound blocked.");
                });

            }


            // ==================================
            // CONGRATULATIONS POPUP
            // ==================================

            winnerMessage.textContent =
                `Player ${currentPlayer} Wins!`;

            winnerPopup.style.display =
                "flex";


            return;

        }

    }


    // ==========================================
    // CHECK DRAW
    // ==========================================

    let draw = true;


    cells.forEach((cell) => {

        if (cell.textContent === "") {

            draw = false;

        }

    });


    // ==========================================
    // DRAW FOUND
    // ==========================================

    if (draw) {

        gameActive = false;


        // Update draw score
        draws++;

        drawScore.textContent =
            draws;


        // Turn box
        turnText.textContent =
            "It's a Draw!";

        turnIcon.textContent =
            "🤝";


        // Stop music
        if (backgroundMusic) {

            backgroundMusic.pause();

        }


        return;

    }


    // ==========================================
    // CHANGE PLAYER
    // ==========================================

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    // Update turn box
    turnText.textContent =
        `Player ${currentPlayer}'s Turn`;

    turnIcon.textContent =
        currentPlayer;

}


// ==========================================
// DRAW WINNING LINE
// ==========================================

function drawWinLine(start, end) {

    const board =
        document.querySelector(".game-board");


    const firstCell =
        cells[start].getBoundingClientRect();

    const lastCell =
        cells[end].getBoundingClientRect();

    const boardRect =
        board.getBoundingClientRect();


    // ==================================
    // START POINT
    // ==================================

    const x1 =
        firstCell.left +
        firstCell.width / 2 -
        boardRect.left;

    const y1 =
        firstCell.top +
        firstCell.height / 2 -
        boardRect.top;


    // ==================================
    // END POINT
    // ==================================

    const x2 =
        lastCell.left +
        lastCell.width / 2 -
        boardRect.left;

    const y2 =
        lastCell.top +
        lastCell.height / 2 -
        boardRect.top;


    // ==================================
    // LINE LENGTH
    // ==================================

    const length =
        Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2)
        );


    // ==================================
    // LINE ANGLE
    // ==================================

    const angle =
        Math.atan2(
            y2 - y1,
            x2 - x1
        ) * 180 / Math.PI;


    // ==================================
    // LINE COLOR
    // ==================================

    const lineColor =
        currentPlayer === "X"
            ? "#c04cff"
            : "#2575fc";


    // ==================================
    // APPLY LINE
    // ==================================

    winLine.style.display =
        "block";

    winLine.style.width =
        `${length}px`;

    winLine.style.height =
        "6px";

    winLine.style.left =
        `${x1}px`;

    winLine.style.top =
        `${y1}px`;

    winLine.style.background =
        lineColor;

    winLine.style.boxShadow =
        `0 0 8px ${lineColor},
         0 0 18px ${lineColor},
         0 0 30px ${lineColor}`;

    winLine.style.transform =
        `rotate(${angle}deg)`;

    winLine.style.transformOrigin =
        "0 50%";

}


// ==========================================
// CLOSE WINNER POPUP
// ==========================================

closeWinner.addEventListener("click", () => {

    winnerPopup.style.display =
        "none";

});


// ==========================================
// RESET CURRENT GAME
// ==========================================

resetBtn.addEventListener("click", () => {


    // ==================================
    // CLEAR CELLS
    // ==================================

    cells.forEach((cell) => {

        cell.textContent = "";

        cell.style.color = "";

        cell.style.textShadow = "";

        cell.style.boxShadow = "";

    });


    // ==================================
    // RESET GAME VARIABLES
    // ==================================

    currentPlayer = "X";

    gameActive = true;


    // ==================================
    // RESET TURN BOX
    // ==================================

    turnText.textContent =
        "Player X's Turn";

    turnIcon.textContent =
        "✕";


    // ==================================
    // HIDE WINNING LINE
    // ==================================

    winLine.style.display =
        "none";


    // ==================================
    // HIDE WINNER POPUP
    // ==================================

    winnerPopup.style.display =
        "none";


    // ==================================
    // RESET MUSIC
    // ==================================

    if (backgroundMusic) {

        backgroundMusic.pause();

        backgroundMusic.currentTime = 0;

    }

});
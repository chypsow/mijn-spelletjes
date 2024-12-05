"use strict";
const feedback = document.getElementById('feedback');
const boardSize = document.getElementById("boardSize");
let BOARD_SIZE = 0;
let winningNum = 0;
let board = [];
let currentPlayer = "X";
let gameWon = false;

const sideBar = document.getElementById('side-bar');
Array.from(sideBar.children).forEach((elt, index) => {
  elt.addEventListener('click', () => {
    sideBar.querySelector('.active').classList.remove("active");
    elt.classList.add("active");
  });
});

maakDropMenu();
initializeBoard();
displayMessage(`Speler ${currentPlayer}'s beurt`);
function maakDropMenu() {
  let dropMenuHTML ='';
  for(let i = 0; i < 5; i++) {
    dropMenuHTML += `<option value='${i+3}'>${i+3} op een rij Tic Tac Toe</option>`;
  }
  boardSize.innerHTML = dropMenuHTML;
  BOARD_SIZE = 3;
  winningNum = 3;
  board = Array.from(Array(3), () => Array(3).fill(""));
}

boardSize.onchange = () => {
  BOARD_SIZE = parseInt(boardSize.value);
  winningNum = bepaalY(BOARD_SIZE);
  board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(""));
  resetGame();
}

function bepaalY(x) {
  const waarden = {
      3: 3,
      4: 3,
      5: 4,
      6: 4,
      7: 4
  };
  return waarden[x];
}

// Initialiseer het spelbord
function initializeBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 100px)`;
  gameBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 100px)`;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleCellClick(row, col));
      gameBoard.appendChild(cell);
    }
  }
}

// Reset het spel
function resetGame() {
  board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(""));
  currentPlayer = "X";
  gameWon = false;
  initializeBoard();
  //document.getElementById("win-line").style.display = "none"; // Verberg de lijn
  feedback.hidden = true;
  //currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  displayMessage(`Speler ${currentPlayer}'s beurt`);
}

// Behandel een klik op een cel
function handleCellClick(row, col) {
  if (board[row][col] === "" && !gameWon) {
    board[row][col] = currentPlayer;
    updateBoard(row, col);
    
    if (checkWinner(row, col)) {
      displayMessage('');
      feedback.innerText = (`${currentPlayer} heeft gewonnen!`);
      feedback.hidden = false;
      //showWinningLine();  // Toon de winnende lijn
      //highlightWinningCells();
      gameWon = true;
    } else if (isDraw()) {
      feedback.innerText = "Niemand heeft gewonnen!";
      feedback.style.color = '';
      feedback.hidden = false;
      displayMessage("Gelijkspel!");
      gameWon = true;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      displayMessage(`Speler ${currentPlayer}'s beurt`);
    }
  }
}

// Update de weergave van het bord
function updateBoard(row, col) {
  //for (let row = 0; row < BOARD_SIZE; row++) {
    //for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.textContent = board[row][col];
      currentPlayer === 'X' ? cell.style.color = '#7f2f9e' : cell.style.color ='#221fe4';
    }
  //}
//}

// Toon berichten aan de speler
function displayMessage(msg) {
  document.getElementById("message").textContent = msg;
}


// Controleer op een winnaar
let winningCells = [];

function checkWinner(row, col) {
  const directions = [
    [[0, 1], [0, -1]],    // Horizontaal
    [[1, 0], [-1, 0]],    // Verticaal
    [[1, 1], [-1, -1]],   // Diagonaal
    [[1, -1], [-1, 1]]    // Omgekeerde diagonaal
  ];

  for (let [dir1, dir2] of directions) {
    let count = 1;
    winningCells = [[row, col]];

    count += countDirection(row, col, dir1[0], dir1[1], winningCells);
    count += countDirection(row, col, dir2[0], dir2[1], winningCells);

    if (count >= winningNum) {
      highlightWinningCells(winningCells);
      
      return true;
    }
  }
  return false;
}

// Tel het aantal opeenvolgende symbolen in een richting
function countDirection(row, col, rowDir, colDir, winningCells) {
  let count = 0;
  let r = row + rowDir;
  let c = col + colDir;

  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === currentPlayer) {
    count++;
    winningCells.push([r, c]);
    r += rowDir;
    c += colDir;
  }
  return count;
}
function highlightWinningCells(winningCells) {
    for (let [row, col] of winningCells) {
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.add("winning");
    }
    feedback.style.color = document.querySelector(`.cell[data-row='${winningCells[0][0]}'][data-col='${winningCells[0][1]}']`).style.color;
  }

// Controleer op een gelijkspel
function isDraw() {
  return board.flat().every(cell => cell !== "");
}









// Toon een lijn over de winnende cellen
function showWinningLine() {
    const gameBoard = document.getElementById("game-board");
    const line = document.getElementById("win-line");
    
    // Haal de absolute positie van het game-board op
    const boardRect = gameBoard.getBoundingClientRect();
    const cellSize = 100; // breedte/hoogte van de cellen, overeenkomend met CSS
  
    const [start, end] = [winningCells[0], winningCells[winningCells.length - 1]];
  
    // Startpositie van de lijn in het bord
    const startX = boardRect.left + start[1] * cellSize + cellSize / 2; //boardRect.left +
    const startY = boardRect.top + start[0] * cellSize + cellSize / 2; //boardRect.top + 
  
    // Eindpositie van de lijn in het bord
    const endX = boardRect.left + end[1] * cellSize + cellSize / 2; //boardRect.left + 
    const endY = boardRect.top + end[0] * cellSize + cellSize / 2; //boardRect.top + 
  
    // Bereken de lengte en hoek van de lijn
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
    // Pas de lijn aan op basis van berekeningen
    line.style.width = `${length}px`;
    line.style.height = `4px`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.display = "block";
  }
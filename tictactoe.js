"use strict";
import { DOM, toggleModal, saveGameToLocalStorage } from "./main.js";

//const bericht = document.getElementById('message');
let BOARD_SIZE = 0;
let winningNum = 0;

let board = [];
let winningCells = [];
let currentPlayer = "X";
let gameWon = false;

export function initializeGame() {
  makeGameboard();
  makeDropMenu();
};

export function resetGame() {
  const bericht = document.getElementById('message');
  gameWon = false;
  currentPlayer = "X";
  board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(""));
  resetBoard();
  bericht.classList.remove('blue');
  bericht.classList.add('red');
  bericht.textContent = `Speler ${currentPlayer}'s beurt`;
};

function resetBoard() {
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
};

function makeDropMenu() {
  const dropMenu = document.createElement('select');
  const options = [[3,3],[3,4],[4,5],[4,6],[5,6],[5,7],[6,7]];
  options.forEach(([x,y], index) => {
    dropMenu.innerHTML += `
      <option value=${index}>${x}/${y} op een rij Tic Tac Toe</option>
    `;
  });

  dropMenu.addEventListener('change', () => {
    saveGameToLocalStorage('selectedOption', dropMenu.value);
    BOARD_SIZE = options[dropMenu.value][1];
    winningNum = options[dropMenu.value][0];
    board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(""));
    resetGame();
  });

  DOM.topic.appendChild(dropMenu);
  dropMenu.value = JSON.parse(localStorage.getItem('selectedOption')) || 0;
  dropMenu.dispatchEvent(new Event('change'));
};

function makeGameboard() {
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');

  const gameBoard = document.createElement('div');
  gameBoard.setAttribute('id', 'game-board');
  gameBoard.classList.add('game-board');
  gameContainer.appendChild(gameBoard);

  const message = document.createElement('div');
  message.setAttribute('id', 'message');
  message.classList.add('bericht');
  gameContainer.appendChild(message);

  DOM.middenSectie.appendChild(gameContainer);
};

function handleCellClick(row, col) {
  if (board[row][col] !== "" || gameWon) return;
  const bericht = document.getElementById('message');
  board[row][col] = currentPlayer;
  updateBoard(row, col);
  
  if (checkWinner(row, col)) {
    bericht.textContent = '';
    const msg = `${currentPlayer} heeft gewonnen!`;
    const gameBoard = document.getElementById("game-board"); 
    setTimeout(() => {
      toggleModal(true, true,'#007c80', msg, gameBoard)
    }, 500);
    gameWon = true;
    if (!DOM.geluidStaatAan.hidden) DOM.soundWin.play();
  } else if (isDraw()) {
    bericht.textContent = "Gelijkspel!";
    bericht.classList.remove('blue');
    bericht.classList.remove('red');
    gameWon = true;
  } else {
    if(currentPlayer === 'X') {
      currentPlayer = 'O';
      bericht.classList.remove('red');
      bericht.classList.add('blue');
    } else {
      currentPlayer = 'X';
      bericht.classList.remove('blue');
      bericht.classList.add('red');
    }
    bericht.textContent = `Speler ${currentPlayer}'s beurt`;
  }
};

function updateBoard(row, col) {
  const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  cell.textContent = board[row][col];
  currentPlayer === 'X' ? cell.style.color = '#a320c5' : cell.style.color ='#221fe4';
};
 
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
};

function highlightWinningCells(winningCells) {
  for (let [row, col] of winningCells) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add("winning");
    setTimeout(() => {
      cell.classList.add('animate');
    }, 200);
  }
};

function isDraw() {
  return board.flat().every(cell => cell !== "");
};


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
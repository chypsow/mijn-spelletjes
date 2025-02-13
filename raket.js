"use strict";
import { DOM, toggleModal } from "./main.js";

let raketTeller = 0;
let randomRaket = 0;

export function initializeRaket() {
    resetRaket();
    makeDifficultyLevel();
    makeDoors();
};

export function resetRaket() {
  raketTeller = 0;
  randomRaket = Math.floor((Math.random() * 24));
  console.log(`raket index: ${randomRaket}`);
};

export function resetDeuren() {
    const deuren = document.querySelectorAll('#deuren img');
    deuren.forEach(deur => {
        deur.src = "images/deurtoe.svg";
        deur.alt = "deur toe";
        deur.style.pointerEvents = 'auto';
    });
};

function makeDifficultyLevel() {
    const graad = document.createElement('div');
    graad.classList.add('graad');
    graad.innerHTML = `
        <label><input type="radio" id="easy" name="difficulty" value="Easy" checked>Easy</label>
        <label><input type="radio" id="difficult" name="difficulty" value="Difficult">Difficult</label>
    `;
    document.querySelector('.media').appendChild(graad);
};

function makeDoors() {
    const leftSide = document.createElement('div');
    leftSide.id = 'left-side';
    const deuren = document.createElement('div');
    deuren.setAttribute('id', 'deuren');
    deuren.classList.add('doors-container');
    Array.from({length : 24}).forEach(_ => {
        const deur = document.createElement('img');
        deur.src = "images/deurtoe.svg";
        deur.alt = "deur toe";
        deur.addEventListener('click', deurOpenen);
        deuren.appendChild(deur);
    });
    leftSide.appendChild(deuren);
    DOM.middenSectie.appendChild(leftSide);
};

function deurOpenen(event) {
  const openedDoor = event.target;
  const easy = document.getElementById('easy');
  const deuren = document.querySelectorAll('#deuren img');
  if(!easy.checked) {
    deuren.forEach(deur => {
      deur.src = "images/deurtoe.svg";
      deur.alt = "deur toe";});
  }
  const deurMetRaket = deuren[randomRaket];
  if (openedDoor === deurMetRaket) {
    playerWon(openedDoor);
  } else {
    showMissedTry(openedDoor);
  }
};

function showMissedTry(openedDoor) {
  raketTeller++;
  const galgje = document.getElementById('foutePogingen');
  galgje.src = `images/galgjeSvg/${String(raketTeller).padStart(2, "0")}.svg`;
  openedDoor.src = "images/deuropen.svg";
  openedDoor.alt = "deur open";
  if (raketTeller === 12) playerLost();
};

function playerWon(openedDoor) {
  openedDoor.src = "images/gevonden.svg";
  openedDoor.alt = "gevonden";
  const msg = `U had ${raketTeller} beurt(en) nodig.`;
  const doors = document.getElementById('deuren');
  toggleModal(true, 'green', msg, doors, DOM.modal);
  if (!DOM.geluidStaatAan.hidden) DOM.soundWin.play();
  const deuren = document.querySelectorAll('#deuren img');
  deuren.forEach(deur => deur.style.pointerEvents = 'none');
};

function playerLost() {
  const deuren = document.querySelectorAll('#deuren img');
  const deurMetRaket = deuren[randomRaket];
  deurMetRaket.src = "images/gevonden.svg";
  deurMetRaket.alt = "gevonden";
  const msg = 'Je hebt verloren.';
  const doors = document.getElementById('deuren');
  toggleModal(true, 'red', msg, doors, DOM.modal);
  if (!DOM.geluidStaatAan.hidden) DOM.soundFailure.play();
  deuren.forEach(deur => deur.style.pointerEvents = 'none');
};
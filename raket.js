"use strict";
import { DOM, toggleModal, updateStarsVsCounter } from "./main.js";

let raketTeller = 0;
let randomRaket = 0;
let gameOver = false;

export function initializeRaket() {
    resetRaket();
    makeDifficultyLevel();
    makeDoors();
};

export function resetRaket() {
  gameOver = false;
  raketTeller = 0;
  randomRaket = Math.floor((Math.random() * 24));
  console.log(`raket index: ${randomRaket+1}`);
  sessionStorage.setItem('raketIndex', -1);
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
    //insert the difficulty level between geluid and reset button
    DOM.topSectie.querySelector('.media').insertBefore(graad, DOM.reset);
    // event listeners when changing difficulty
    //const easy = document.getElementById('easy');
    const difficult = document.getElementById('difficult');
    /*easy.addEventListener('change', () => {
      resetDeuren();
    });*/
    difficult.addEventListener('change', () => {
      if(!gameOver) {
        sessionStorage.setItem('raketIndex', -1);
        resetDeuren();
      }
    });
};

function makeDoors() {
    const deuren = document.createElement('div');
    deuren.setAttribute('id', 'deuren');
    deuren.classList.add('doors-container');
    Array.from({length : 24}).forEach(_ => {
        const deur = document.createElement('img');
        deur.src = "images/deurtoe.svg";
        deur.alt = "deur toe";
        deur.dataset.index = deuren.children.length;
        deur.addEventListener('click', (e) => {
          deurOpenen(e);
    
        });
        deuren.appendChild(deur);
    });
    DOM.middenSectie.appendChild(deuren);
};

function deurOpenen(event) {
  const openedDoor = event.target;
  // first check the last opened door via session storage
  const lastRaketIdx = parseInt(sessionStorage.getItem('raketIndex')) || -1;
  if (lastRaketIdx === parseInt(openedDoor.dataset.index)) {
    return; // ignore if the same door is clicked again
  }

  
  const easy = document.getElementById('easy');
  const deuren = document.querySelectorAll('#deuren img');
  if(!easy.checked) {
    deuren.forEach(deur => {
      deur.src = "images/deurtoe.svg";
      deur.alt = "deur toe";});
  } else {
    openedDoor.style.pointerEvents = 'none';
  }
  const deurMetRaket = deuren[randomRaket];
  if (openedDoor === deurMetRaket) {
    playerWon(openedDoor);
  } else {
    showMissedTry(openedDoor);
  }
  // store the index of the last opened door
  sessionStorage.setItem('raketIndex', openedDoor.dataset.index);
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
  gameOver = true;
  openedDoor.src = "images/gevonden.svg";
  openedDoor.alt = "gevonden";
  const msg = `Je hebt gewonnen!, u had ${raketTeller} beurt${raketTeller === 1 ? '' : 'en'} nodig.`;
  const doors = document.getElementById('deuren');
  updateStarsVsCounter(raketTeller);
  toggleModal(true, true, 'green', msg, doors, 'rgba(0,0,0,0.5)');
  if (!DOM.geluidStaatAan.hidden) DOM.soundWin.play();
  const deuren = document.querySelectorAll('#deuren img');
  deuren.forEach(deur => deur.style.pointerEvents = 'none');
};

function playerLost() {
  gameOver = true;
  const deuren = document.querySelectorAll('#deuren img');
  const deurMetRaket = deuren[randomRaket];
  deurMetRaket.src = "images/gevonden.svg";
  deurMetRaket.alt = "gevonden";
  const msg = 'Je hebt verloren.';
  const doors = document.getElementById('deuren');
  toggleModal(true, false,'red', msg, doors, 'rgba(0,0,0,0.5)');
  if (!DOM.geluidStaatAan.hidden) DOM.soundFailure.play();
  deuren.forEach(deur => deur.style.pointerEvents = 'none');
};

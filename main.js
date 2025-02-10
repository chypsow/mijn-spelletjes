"use strict";
import { initializeRiddle, makeTopicRiddle, makeKeyboard } from "./raadsel.js";
import { initializeRaket, makeDifficultyLevel, makeDoors } from "./raket.js";
import { initializeBoard, makeDropMenu, displayMessage, currentPlayer, makeGameboard, resetGame } from "./tictactoe.js";
import { makeTimer } from "./timer.js";

export const DOM = {
  sideBar : document.getElementById('side-bar'),
  topic : document.getElementById('topic'),
  reset : document.getElementById("reset"),
  geluidStaat : document.querySelectorAll(".geluid img"),
  geluidStaatAan : document.getElementById("son"),
  geluidStaatUit : document.getElementById("mute"),
  soundWin : document.getElementById("soundWin"),
  soundFailure : document.getElementById("soundFailure"),
  timerContainer : document.getElementById('timer-container'),
  middenSectie : document.getElementById('midden-sectie'),
  modal : document.getElementById("modal"),
  modalOverlay : document.getElementById('modal-overlay'),
  overlay : document.getElementById("overlay"),
  sluiten : document.getElementById('sluiten')
};

export let spel = 0;

const builtSelectedGame = {
  0: () => {
    DOM.modal.style.setProperty("--translate-value", "-50%");
    DOM.middenSectie.style.marginTop = '100px';
    emptyContainers();
    makeTopicRiddle();
    makeTimer();
    makeKeyboard();
    makeGalgjeContainer();
    initializeRiddle();
  },
  1: () => {
    DOM.modal.style.setProperty("--translate-value", "-50%");
    DOM.middenSectie.style.marginTop = '100px';
    emptyContainers();
    makeTopicRiddle();
    makeTimer();
    makeKeyboard();
    makeGalgjeContainer();
    initializeRiddle();
  },
  2: () => {
    DOM.modal.style.setProperty("--translate-value", "-50%");
    DOM.middenSectie.style.marginTop = '100px';
    emptyContainers();
    makeDifficultyLevel();
    makeDoors();
    makeGalgjeContainer();
    initializeRaket();
  },
  3: () => {
    DOM.modal.style.setProperty("--translate-value", "-25%");
    DOM.middenSectie.style.marginTop = '20px';
    emptyContainers();
    makeDropMenu();
    makeGameboard();
    initializeBoard();
    displayMessage(`Speler ${currentPlayer}'s beurt`);
  }
};

function makeSidebar() {
  const tabArray = ['Auto raadsel', 'Land raadsel', 'Raket vinden', 'Tic tac toe'];
  DOM.sideBar.setAttribute('role', 'tablist');
  tabArray.forEach((tab, index) => {
      const hyperlink = document.createElement('a');
      hyperlink.href = '#';
      hyperlink.textContent = tab;
      hyperlink.setAttribute('role', 'tab');
      hyperlink.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      if(index === 0) hyperlink.classList.add('active');
      hyperlink.addEventListener('click', () => {
          const activeLink = DOM.sideBar.querySelector('.active');
          if(activeLink === hyperlink) return;
          activeLink.classList.remove("active");
          activeLink.setAttribute('aria-selected', 'false');
          hyperlink.setAttribute('aria-selected', 'true');
          hyperlink.classList.add("active");
          spel = index;
          builtSelectedGame[spel]();
      });
      DOM.sideBar.appendChild(hyperlink);
  });
};

function emptyContainers() {
  const media = document.querySelector('.media');
  const graad = document.querySelector('.graad');
  if (graad !== null) media.removeChild(graad);
  DOM.topic.innerHTML = '';
  DOM.timerContainer.innerHTML = '';
  DOM.middenSectie.innerHTML = '';
};

function makeGalgjeContainer() {
  const rightSide = document.createElement('div');
  rightSide.id = 'right-side';
  const galgje = document.createElement('img');
  galgje.setAttribute('id', 'foutePogingen');
  galgje.src = "images/00.svg";
  galgje.alt = "beuren";
  rightSide.appendChild(galgje);
  DOM.middenSectie.appendChild(rightSide);
};

export function toggleModal(show, kleur = "", message = "", positie = "") {
  DOM.modalOverlay.style.display = show ? "block" : "none";
  DOM.modal.style.display = show ? "block" : "none";
  DOM.modal.style.top = positie;
  DOM.overlay.style.backgroundColor = kleur;
  DOM.overlay.innerHTML = message;
};

function closeModal() {
  toggleModal(false);
};

function toggleGeluid() {
  DOM.geluidStaatAan.hidden = !DOM.geluidStaatAan.hidden;
  DOM.geluidStaatUit.hidden = !DOM.geluidStaatUit.hidden;
};

const herstartSpel = {
  0: () => initializeRiddle(),
  1: () => initializeRiddle(),
  2: () => initializeRaket(),
  3: () => resetGame()
};

DOM.geluidStaat.forEach(geluid => geluid.addEventListener('click', toggleGeluid));
DOM.sluiten.addEventListener('click', closeModal);
DOM.reset.addEventListener('click', () => {
  herstartSpel[spel]();
});

document.addEventListener('DOMContentLoaded', () => {
  makeSidebar();
  builtSelectedGame[spel]();
})



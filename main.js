"use strict";
import { initializeRiddle, makeTopicRiddle, makeKeyboard } from "./raadsel.js";
import { initializeRaket, resetRaket, makeDifficultyLevel, makeDoors } from "./raket.js";
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
    setBackgroundImage('images/auto.jpg');
    //DOM.modal.style.setProperty("--translate-value", "-70%");
    DOM.middenSectie.style.marginTop = '100px';
    DOM.middenSectie.style.justifyContent = 'space-between';
    emptyContainers();
    makeTopicRiddle();
    makeTimer();
    makeKeyboard();
    makeGalgjeContainer();
    initializeRiddle();
  },
  1: () => {
    setBackgroundImage('images/landenKaart.jpg');
    //DOM.modal.style.setProperty("--translate-value", "-70%");
    DOM.middenSectie.style.marginTop = '100px';
    DOM.middenSectie.style.justifyContent = 'space-between';
    emptyContainers();
    makeTopicRiddle();
    makeTimer();
    makeKeyboard();
    makeGalgjeContainer();
    initializeRiddle();
  },
  2: () => {
    setBackgroundImage('images/blue-background.jpg');
    //DOM.modal.style.setProperty("--translate-value", "-75%");
    DOM.middenSectie.style.marginTop = '100px';
    DOM.middenSectie.style.justifyContent = 'space-between';
    emptyContainers();
    makeDifficultyLevel();
    makeDoors();
    makeGalgjeContainer();
    initializeRaket();
  },
  3: () => {
    setBackgroundImage('images/tictactoe.jpg');
    //DOM.modal.style.setProperty("--translate-value", "-25%");
    DOM.middenSectie.style.marginTop = '20px';
    DOM.middenSectie.style.justifyContent = 'center';
    emptyContainers();
    makeDropMenu();
    makeGameboard();
    initializeBoard();
    displayMessage(`Speler ${currentPlayer}'s beurt`);
  }
};

async function setBackgroundImage(url) {
  try {
      const img = new Image();
      img.src = url;

      // Wacht tot de afbeelding volledig geladen is
      await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
      });

      // Pas de achtergrond toe zonder "crash" effect
      document.body.style.backgroundImage = `url(${url})`;
  } catch (error) {
      console.error("Fout bij laden van de achtergrondafbeelding:", error);
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
  galgje.src = "images/galgjeSvg/00.svg";
  galgje.alt = "beuren";
  rightSide.appendChild(galgje);
  DOM.middenSectie.appendChild(rightSide);
};

function positioneerOverlay(triggerElement, overlayElement) {
  const rect = triggerElement.getBoundingClientRect();
  const top = `${rect.bottom}px`; // Plaats de overlay direct onder het element
  const left = `${rect.left + rect.width / 2}px`; // Centreer
  //const left = Math.round(leftPx/window.innerWidth*100)}%`;
  //console.log(`element.left: ${rect.left}px, element.width: ${rect.width}, modal.width: ${overlayElement.offsetWidth}`);
  //console.log(`modal.left: ${left}px`);
  //const left = `${Math.round(leftPx/window.innerWidth*100)}%`;
  return [top, left]; // Zorg dat het als array wordt teruggegeven
};

export function toggleModal(show, kleur = "", message = "", triggerElement, overlayElement) {
  let top = '', left = '';
  if(show) {
    [top, left] = positioneerOverlay(triggerElement, overlayElement);
    DOM.modal.style.top = top;
    DOM.modal.style.left = left;
    //console.log(`left: ${left}px`);
    DOM.overlay.style.backgroundColor = kleur;
    DOM.overlay.innerHTML = message;
  }
  DOM.modalOverlay.style.display = show ? "block" : "none";
  DOM.modal.style.display = show ? "block" : "none";
  
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
  2: () => resetRaket(),
  3: () => resetGame()
};

DOM.geluidStaat.forEach(geluid => geluid.addEventListener('click', toggleGeluid));
DOM.sluiten.addEventListener('click', closeModal);
DOM.reset.addEventListener('click', () => {
  herstartSpel[spel]();
});

/*window.addEventListener("resize", function () {
  if(DOM.modal.style.display === 'none') return;
  let schaal = 1 / window.devicePixelRatio;
  //console.log(`schaal: ${schaal}`);
  //let schaal = window.innerWidth / screen.width; // Berekent de zoomfactor
  //element.style.left = `${schaal}px`; // Past grootte aan
});*/

document.addEventListener('DOMContentLoaded', () => {
  makeSidebar();
  builtSelectedGame[spel]();
})



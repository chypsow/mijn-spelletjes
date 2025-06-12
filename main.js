"use strict";
import { initializeRiddle, resetRiddle, resetToetsenbord, resetHints } from "./raadsel.js";
import { initializeRaket, resetRaket, resetDeuren } from "./raket.js";
import { initializeGame, resetGame } from "./tictactoe.js";

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
  stars : document.getElementById('stars'),
  modal : document.getElementById("modal"),
  modalOverlay : document.getElementById('modal-overlay'),
  overlay : document.getElementById("overlay"),
  sluiten : document.getElementById('sluiten')
};

export let spel = JSON.parse(localStorage.getItem('activeGame')) || 0;

const builtSelectedGame = {
  0: () => {
    setBackgroundImage('images/auto.jpg');
    DOM.middenSectie.style.marginTop = '100px';
    DOM.middenSectie.style.justifyContent = 'space-between';
    DOM.middenSectie.style.gap = '50px';
    makeGalgjeContainer();
    initializeRiddle();
  },
  1: () => {
    setBackgroundImage('images/landenKaart.jpg');
    DOM.middenSectie.style.marginTop = '100px';
    DOM.middenSectie.style.justifyContent = 'space-between';
    DOM.middenSectie.style.gap = '20px';
    makeGalgjeContainer();
    initializeRiddle();
  },
  2: () => {
    setBackgroundImage('images/blue-background.jpg');
    DOM.middenSectie.style.marginTop = '100px';
    DOM.middenSectie.style.justifyContent = '';
    DOM.middenSectie.style.gap = '100px';
    makeGalgjeContainer();
    initializeRaket();
  },
  3: () => {
    setBackgroundImage('images/tictactoe.jpg');
    DOM.middenSectie.style.marginTop = '20px';
    DOM.middenSectie.style.justifyContent = 'center';
    DOM.middenSectie.style.gap = '20px';
    initializeGame();
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
      if(index === spel) hyperlink.classList.add('active');
      hyperlink.addEventListener('click', () => {
          const activeLink = DOM.sideBar.querySelector('.active');
          if(activeLink === hyperlink) return;
          activeLink.classList.remove("active");
          activeLink.setAttribute('aria-selected', 'false');
          hyperlink.setAttribute('aria-selected', 'true');
          hyperlink.classList.add("active");
          spel = index;
          saveGameToLocalStorage('activeGame', spel);
          emptyContainers();
          resetStars();
          builtSelectedGame[spel]();
      });
      DOM.sideBar.appendChild(hyperlink);
  });
};

export function saveGameToLocalStorage(Key, value) {
  localStorage.setItem(Key, JSON.stringify(value));
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

function resetGalgje() {
  const galgje = document.getElementById('foutePogingen');
  galgje.src = `images/galgjeSvg/00.svg`;
};

export function updateStarsVsCounter(teller) {
  let sterren = Math.max(1, 3 - Math.floor(teller / 4));

  Array.from({ length: sterren }, (_, index) => {
    setTimeout(() => {
        goudeSterToevoegen(index);
    }, (index + 1) * 300 + 300);
  });
};

export function updateStarsVsHints() {
    const usedHints = document.querySelectorAll('.hint-used');
    if (usedHints.length === 3) return; 
  
    Array.from({ length: 3 - usedHints.length }).forEach((_, index) => {
        setTimeout(() => {
            goudeSterToevoegen(index);
        }, (index + 1) * 300 + 300);
    });
};

function goudeSterToevoegen(index) {
  DOM.stars.children[index].classList.add('star-goud');
};

function resetStars() {
  if(spel === 3) {
    Array.from(DOM.stars.children).forEach(star => {
      star.classList.add('star-goud');
    });
  } else {
    Array.from(DOM.stars.children).forEach(star => {
        star.classList.remove('star-goud');
    });
  }
};

function positioneerOverlay(triggerElement) {
  const rect = triggerElement.getBoundingClientRect();
  const top = `${rect.bottom + 20}px`;
  const left = `${rect.left + rect.width / 2}px`;
  return [top, left];
};

export function toggleModal(show, star, kleur = "", message = "", triggerElement, bg = 'rgba(0,0,0,0.5)') {
  let top = '', left = '';
  if(show) {
    [top, left] = positioneerOverlay(triggerElement);
    DOM.modal.style.top = top;
    DOM.modal.style.left = left;
    DOM.overlay.style.backgroundColor = kleur;
    DOM.overlay.innerHTML = message;
    DOM.modalOverlay.style.display = 'block';
    DOM.modalOverlay.style.backgroundColor = bg;
    setTimeout(() => {
        DOM.modalOverlay.classList.add('open');
    }, 10)
  } else {
    DOM.modalOverlay.classList.remove('open');
    setTimeout(() => {
        DOM.modalOverlay.style.display = 'none';
    }, 300);
  }
  const stars = document.querySelector('.stars');
  //DOM.modalOverlay.style.display = show ? "block" : "none";
  DOM.modal.style.display = show ? "block" : "none";
  stars.style.visibility = star ? 'visible': 'hidden';

};

function closeModal() {
  toggleModal(false);
};

function toggleGeluid() {
  DOM.geluidStaatAan.hidden = !DOM.geluidStaatAan.hidden;
  DOM.geluidStaatUit.hidden = !DOM.geluidStaatUit.hidden;
};

const herstartSpel = {
  0: () => {
    resetRiddle();
    resetToetsenbord();
    resetStars();
    resetGalgje();
  },
  1:() => {
    resetRiddle();
    resetToetsenbord();
    resetStars();
    resetHints();
    resetGalgje();
  },
  2: () => {
    resetRaket();
    resetDeuren();
    resetStars();
    resetGalgje();
  },
  3: () => resetGame()
};

DOM.geluidStaat.forEach(geluid => geluid.addEventListener('click', toggleGeluid));
DOM.sluiten.addEventListener('click', closeModal);
DOM.reset.addEventListener('click', () => {
  herstartSpel[spel]();
});

document.addEventListener('click', (event) => {
  if(DOM.modalOverlay.contains(event.target) && !DOM.modal.contains(event.target)) {
    toggleModal(false);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  makeSidebar();
  resetStars();
  builtSelectedGame[spel]();
});



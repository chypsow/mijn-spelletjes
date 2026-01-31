"use strict";
import { initializeRiddle, resetRiddle, resetToetsenbord, resetHints } from "./raadsel.js";
import { initializeRaket, resetRaket, resetDeuren } from "./raket.js";
import { initializeGame, resetGame } from "./tictactoe.js";

const tabArray = ['Auto raadsel', 'Land raadsel', 'Raket vinden', 'Tic tac toe'];

export const DOM = {
  navBar : document.getElementById('nav-bar'),
  gameTopic : document.getElementById('game-topic'),
  reset : document.getElementById("reset"),
  geluidStaat : document.querySelectorAll(".geluid img"),
  geluidStaatAan : document.getElementById("son"),
  geluidStaatUit : document.getElementById("mute"),
  soundWin : document.getElementById("soundWin"),
  soundFailure : document.getElementById("soundFailure"),
  timerContainer : document.getElementById('timer-container'),
  topSectie : document.getElementById('top-sectie'),
  middenSectie : document.getElementById('midden-sectie'),
  stars : document.getElementById('stars'),
  modal : document.getElementById("modal"),
  modalOverlay : document.getElementById('modal-overlay'),
  overlay : document.getElementById("overlay"),
  sluiten : document.getElementById('sluiten')
};

export let spel = JSON.parse(localStorage.getItem('activeGame')) || 0;

const createSelectedGame = {
  0: () => {
    setBackgroundImage('images/auto.jpg');
    setGameSettings({
      backgroundUrl: 'images/auto.jpg',
      galg: true,
      //topSectieBg: '#20232bde'
    });
    initializeRiddle();
  },
  1: () => {
    setBackgroundImage('images/landenKaart.jpg');
    setGameSettings({
      backgroundUrl: 'images/landenKaart.jpg',
      galg: true,
      //topSectieBg: '#20232bde'
    });
    initializeRiddle();
  },
  2: () => {
    setBackgroundImage('images/blue-background.jpg');
    setGameSettings({
      backgroundUrl: 'images/blue-background.jpg',
      //marginTop: '100px',
      justifyContent: '',
      gap: '100px',
      galg: true
    });
    initializeRaket();
  },
  3: () => {
    setBackgroundImage('images/tictactoe.jpg');
    setGameSettings({
      backgroundUrl: 'images/tictactoe.jpg',
      //marginTop: '20px',
      justifyContent: 'center',
      gap: '20px'
    });
    initializeGame();
  }
};

function setGameSettings({backgroundUrl, marginTop = 0, justifyContent = 'center', gap = 0, galg = false, topSectieBg = 'transparent'}) {
  setBackgroundImage(backgroundUrl);
  if( marginTop !== 0) DOM.middenSectie.style.marginTop = marginTop;
  DOM.middenSectie.style.justifyContent = justifyContent;
  if( gap !== 0) DOM.middenSectie.style.gap = gap;
  if (galg) makeGalgjeContainer();
  DOM.topSectie.style.backgroundColor = topSectieBg;
}

function setBackgroundImage(url) {
  const img = new Image();
  img.src = url;

  img.onload = () => {
      // Maak overlay element voor smooth transition
      let overlay = document.getElementById('bg-transition-overlay');
      if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'bg-transition-overlay';
          overlay.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: black;
              opacity: 0;
              pointer-events: none;
              z-index: 9999;
              transition: opacity 0.25s ease-out;
          `;
          document.body.appendChild(overlay);
      }

      // Fade in overlay
      overlay.style.opacity = '1';
      
      // Zet nieuwe achtergrond na 300ms
      setTimeout(() => {
          document.body.style.backgroundImage = `url(${url})`;
          
          // Fade out overlay
          setTimeout(() => {
              overlay.style.opacity = '0';
          }, 50);
      }, 300);
  };

  img.onerror = () => {
      console.error("Fout bij laden van de achtergrondafbeelding:", url);
  };
}

function makeNavBar() {
  DOM.navBar.setAttribute('role', 'tablist');
  tabArray.forEach((tab, index) => {
      const hyperlink = document.createElement('a');
      hyperlink.href = '#';
      hyperlink.textContent = tab;
      hyperlink.setAttribute('role', 'tab');
      hyperlink.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      if(index === spel) hyperlink.classList.add('active');
      hyperlink.addEventListener('click', () => {
          const activeLink = DOM.navBar.querySelector('.active');
          if(activeLink === hyperlink) return;
          activeLink.classList.remove("active");
          activeLink.setAttribute('aria-selected', 'false');
          hyperlink.setAttribute('aria-selected', 'true');
          hyperlink.classList.add("active");
          spel = index;
          saveGameToLocalStorage('activeGame', spel);
          emptyContainers();
          resetStars();
          createSelectedGame[spel]();
      });
      DOM.navBar.appendChild(hyperlink);
  });
};

export function saveGameToLocalStorage(Key, value) {
  localStorage.setItem(Key, JSON.stringify(value));
};

function emptyContainers() {
  const media = document.querySelector('.media');
  const graad = document.querySelector('.graad');
  if (graad !== null) media.removeChild(graad);
  DOM.gameTopic.innerHTML = '';
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
  makeNavBar();
  resetStars();
  createSelectedGame[spel]();
});



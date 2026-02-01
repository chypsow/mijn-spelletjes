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
    setGameSettings({ backgroundUrl: 'images/auto.jpg', marginTop: '2rem' });
    initializeRiddle();
  },
  1: () => {
    setGameSettings({ backgroundUrl: 'images/landenKaart.jpg', marginTop: '2rem' });
    initializeRiddle();
  },
  2: () => {
    setGameSettings({ backgroundUrl: 'images/blue-background.jpg', marginTop: '4rem' });
    initializeRaket();
  },
  3: () => {
    setGameSettings({
      backgroundUrl: 'images/tictactoe.jpg',
      //gap: '1rem',
      maxHeight: '80px',
      galg: false
    });
    initializeGame();
  }
};

function setGameSettings({backgroundUrl, maxHeight = 'fit-content', marginTop = '0px', galg = true}) {
  setBackgroundImage(backgroundUrl);
  DOM.middenSectie.style.marginTop = marginTop;
  DOM.topSectie.style.maxHeight = maxHeight;
  if (galg) makeGalgjeContainer();
}

function setBackgroundImage(url) {
  const img = new Image();
  img.src = url;

  img.onload = () => {
      // Maak overlay element voor smooth transition
      const overlay = document.getElementById('bg-transition-overlay');
      
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
  galgje.classList.add('foute-pogingen', 'on-small');
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

// Text-to-speech helper — spreekt tekst als geluid aanstaat
function speakText(text, onPlayCallback = null) {
  if (!('speechSynthesis' in window)) return;
  // Spraak onafhankelijk van het geluid-icoon; play-knop in modal activeert spraak

  const plain = typeof text === 'string' ? text.replace(/<[^>]+>/g, '') : String(text);

  // stop lopende spraak
  window.speechSynthesis.cancel();

  const speakNow = () => {
    const voices = window.speechSynthesis.getVoices() || [];
    //console.log('Alle stemmen beschikbaar:', voices.map(v => ({ name: v.name, lang: v.lang })));

    // Filter STRIKT op Nederlandse taal (nl-NL of nl-*)
    const dutchVoices = voices.filter(v => 
      v.lang && (v.lang.toLowerCase().startsWith('nl-') || v.lang.toLowerCase() === 'nl')
    );
    //console.log('Nederlandse stemmen:', dutchVoices.map(v => ({ name: v.name, lang: v.lang })));

    // zoek naar mannelijke stem in Nederlandse stemmen
    const maleKeywords = ['microsoft bart', 'bart', 'male', 'man', 'hallo', 'boy'];
    const pickMaleVoice = (list) => {
      if (!list || list.length === 0) return null;
      for (const v of list) {
        const n = (v.name || '').toLowerCase();
        if (maleKeywords.some(k => n.includes(k))) return v;
      }
      // fallback: eerste stem uit lijst
      return list[0];
    };

    // Kies eerst Nederlandse mannelijke stem, dan fallback naar eerste Nederlandse stem
    let chosen = pickMaleVoice(dutchVoices) || dutchVoices[0] || voices[0];
    //console.log('Gekozen stem:', chosen ? { name: chosen.name, lang: chosen.lang } : 'geen');

    const utter = new SpeechSynthesisUtterance(plain);
    if (chosen) {
      utter.voice = chosen;
      // Override lang naar Nederlands als de stem Nederlands is
      if (dutchVoices.includes(chosen)) {
        utter.lang = 'nl-NL';
      }
    }
    // diepe, mannelijke indruk
    utter.pitch = 1;
    utter.rate = 0.8;
    utter.volume = 1;
    // forceer taal Nederlands voor de uitspraak
    utter.lang = 'nl-NL';

    // callbacks voor play/stop state
    utter.onstart = () => {
      if (onPlayCallback) onPlayCallback('playing');
    };
    utter.onend = () => {
      if (onPlayCallback) onPlayCallback('stopped');
    };

    window.speechSynthesis.speak(utter);
  };

  const avail = window.speechSynthesis.getVoices();
  if (!avail || avail.length === 0) {
    const handler = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      speakNow();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
  } else {
    speakNow();
  }
}

export function toggleModal(show, star, kleur = "", message = "", triggerElement, bg = 'rgba(0,0,0,0.5)') {
  let top = '', left = '';
  if(show) {
    [top, left] = positioneerOverlay(triggerElement);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    console.log('width: ', screenWidth, 'height: ', screenHeight);
    if (screenWidth <= 1600) top = `${screenHeight / 3}px`;
    console.log('top: ', top);
    DOM.modal.style.top = top;
    DOM.modal.style.left = left;
    DOM.overlay.style.backgroundColor = kleur;
    
    // SVG icons voor play en pause
    const playSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>';
    const pauseSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
    
    DOM.overlay.innerHTML = `<div style="display: flex; align-items: center; gap: 12px;">
      <div class="modal-message" style="flex: 1;">${message}</div>
      <button id="modal-play-btn" aria-label="Speel bericht" class="modal-play-btn" title="Klik om bericht voor te lezen">${playSvg}</button>
    </div>`;
    
    DOM.modalOverlay.style.display = 'block';
    DOM.modalOverlay.style.backgroundColor = bg;
    setTimeout(() => {
      DOM.modalOverlay.classList.add('open');
      // voeg play-knop listener toe met callback voor state wisseling
      const btn = document.getElementById('modal-play-btn');
      if (btn) {
        const onStateChange = (state) => {
          if (state === 'playing') {
            btn.innerHTML = pauseSvg;
            btn.classList.add('playing');
          } else if (state === 'stopped') {
            btn.innerHTML = playSvg;
            btn.classList.remove('playing');
          }
        };
        btn.addEventListener('click', () => {
          if (btn.classList.contains('playing')) {
            btn.innerHTML = playSvg;
            btn.classList.remove('playing');
            window.speechSynthesis.cancel();
            return;
          }
          speakText(message, onStateChange);
        });
      }
    }, 10)
  } else {
    // stop lopende spraak en sluit overlay
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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



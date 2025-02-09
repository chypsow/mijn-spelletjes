"use strict";
import { DOM, handelLetter, asc, lettersAanpassen, gameConstructor } from './main.js';
import { handelStartTimer, stopTimer, aftellen } from './timer.js';

export let tabBlad = 0;

export function makeSidebar() {
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
            activeLink.classList.remove("active");
            activeLink.setAttribute('aria-selected', 'false');
            hyperlink.setAttribute('aria-selected', 'true');
            hyperlink.classList.add("active");
            tabBlad = index;
            gameConstructor[tabBlad]();
        });
        DOM.sideBar.appendChild(hyperlink);
    });
  };

export function makeTopicRiddle() {
    DOM.topic.classList.add('topic');
    const topicTxt = document.createElement('p');
    const raadsels = ['automerk', 'land']
    topicTxt.textContent = `Te raden ${raadsels[tabBlad]}:`;
    topic.appendChild(topicTxt);
    const toBeFound = document.createElement('div');
    toBeFound.setAttribute('id', 'teRadenObject');
    toBeFound.classList.add('raad-container');
    DOM.topic.appendChild(toBeFound);
}

export function makeKeyboard() {
    const kleineLetters = document.createElement('div');
    kleineLetters.classList.add('kleine-letters');
    kleineLetters.innerHTML = `
        <label><input id="kleine-letter" type="checkbox">Kleine letters</label>
    `;
    kleineLetters.addEventListener('change', lettersAanpassen);
    DOM.leftSide.appendChild(kleineLetters);

    const toetsenbord = document.createElement('div');
    toetsenbord.setAttribute('id', 'toetsenbord');
    toetsenbord.classList.add('toetsenbord');
    for(let i = 0; i < 26;  i++) {
        const letter = document.createElement('div');
        letter.classList.add('letter');
        letter.textContent = String.fromCharCode(i + asc);
        letter.addEventListener("click", handelLetter);
        toetsenbord.appendChild(letter);
    }
    DOM.leftSide.appendChild(toetsenbord);
};

export function makeTimer() {
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    const startBtn = document.createElement('button');
    startBtn.setAttribute('id', 'start');
    startBtn.classList.add('btn');
    startBtn.textContent = 'Start timer';
    startBtn.addEventListener('click', handelStartTimer);
    btnContainer.appendChild(startBtn);
    const stopBtn = document.createElement('button');
    stopBtn.setAttribute('id', 'stop');
    stopBtn.classList.add('btn');
    stopBtn.textContent = 'Stop timer';
    stopBtn.addEventListener('click', stopTimer);
    btnContainer.appendChild(stopBtn);
    DOM.timerContainer.appendChild(btnContainer);

    const afstellen = document.createElement('div');
    afstellen.classList.add('afstellen');
    const instellen = document.createElement('p');
    instellen.textContent = 'Timer instellen:';
    afstellen.appendChild(instellen);
    const timerAfstellen = document.createElement('select');
    timerAfstellen.setAttribute('id', 'timerAfstellen');
    const array = ['00:30:00', '01:00:00', '01:30:00'];
    array.forEach(tijd => {
        const option = document.createElement('option');
        option.textContent = tijd;
        timerAfstellen.appendChild(option);
    });
    afstellen.appendChild(timerAfstellen);
    DOM.timerContainer.appendChild(afstellen);

    const timerElt = document.createElement('div');
    timerElt.setAttribute('id', 'timer');
    timerElt.classList.add('timer-element');
    timerElt.textContent = "00:30:00";
    DOM.timerContainer.appendChild(timerElt);

    timerAfstellen.addEventListener('change', () => {
        if(!aftellen) {
            timerElt.textContent = timerAfstellen.value;
            startBtn.textContent = "Start timer";
        }
    });
};

export function makeGalgjeContainer() {
    const galgje = document.createElement('img');
    galgje.setAttribute('id', 'foutePogingen');
    galgje.src = "images/00.svg";
    galgje.alt = "beuren";
    DOM.rightSide.appendChild(galgje);
};
"use strict";
import { DOM, spel, toggleModal, updateStarsVsCounter, updateStarsVsHints } from './main.js';
import { stopTimer, pauzeerTimer, timerInterval, makeTimer } from './timer.js';
import { landen, autoLijst } from './data.js';

export let spelAfgelopen = false;
let raadselTeller = 0;
let randomRaadsel = 0;
let asc = 65;
let toBeFound ='';
let emptyArray = [];
let lijst = [];
let assignedHints  = {};

const landLijst = () => retrieveCountries();
function retrieveCountries() {
    let countries = [];
    let lengte = [];
    landen.forEach(land =>{
        countries.push(land.naam);
        lengte.push(land.naam.length);
    });
    return countries;   
};

export function initializeRiddle() {
    const lijsten = {
        0: autoLijst,
        1: landLijst()
    };
    lijst = lijsten[spel];
    makeTopicRiddle();
    makeKeyboard();
    makeHints();
    makeTimer();
    document.querySelector('.hint-container').style.visibility = spel === 1 ? 'visible' : 'hidden';
    resetRiddle();
};

export function resetRiddle() {
    if(spelAfgelopen) spelAfgelopen = false;
    if(timerInterval !== null) stopTimer();
    if(raadselTeller !== 0) raadselTeller = 0;
    assignHints();
    //console.log(assignedHints);
    const kleineLetter = document.getElementById('kleine-letter');
    const hoofdLetter = !kleineLetter.checked;
    randomRaadsel = Math.floor((Math.random() * lijst.length));
    //console.log(`Raadsel Index: ${randomRaadsel}, To be found: ${lijst[randomRaadsel]}`);
    toBeFound = hoofdLetter ? lijst[randomRaadsel].toUpperCase() : lijst[randomRaadsel].toLowerCase();
    emptyArray = [];
    const teRadenObject = document.getElementById('teRadenObject');
    teRadenObject.innerHTML = '';
    for (let i = 0; i < toBeFound.length; i++) {
        const letter = document.createElement('div');
        letter.classList.add('blok');
        teRadenObject.appendChild(letter);
    }
};

export function resetToetsenbord() {
    const letters = document.querySelectorAll('.letter');
    Array.from(letters).forEach(letter => {
        letter.classList.remove("letter-used");
    });
};

export function resetHints() {
    document.querySelectorAll('.hint').forEach(hint => {
        hint.classList.remove('hint-used');
    });
};

function handelLetter(event) {
  if(spelAfgelopen || event.target.classList.contains('letter-used')) return;
  const myLetter = event.target.textContent;
  const teRadenObject = document.getElementById('teRadenObject');
  if (toBeFound.includes(myLetter)) {
    toBeFound.split("").forEach((char, i) => {
      if (char === myLetter) {
        emptyArray[i] = myLetter;
        teRadenObject.children[i].textContent = myLetter;
      }
    });
    if (emptyArray.join("") === toBeFound) {
      spelerGewonnen();
    }
  } else {
    toonFoutePoging();
  }
  event.target.classList.add('letter-used');
};

function lettersAanpassen() {
    const kleineLetter = document.getElementById('kleine-letter');
    const hoofdLetter = !kleineLetter.checked;
    const caseFunc = hoofdLetter ? 'toUpperCase' : 'toLowerCase';
    toBeFound = toBeFound[caseFunc]();
    emptyArray = emptyArray.map(elt => elt[caseFunc]());
    
    const teRadenObject = document.getElementById('teRadenObject');
    Array.from(teRadenObject.children).forEach((letter, index) => {
        letter.textContent = emptyArray[index];  
    });

    asc = hoofdLetter ? 65 : 97;
    const letters = document.querySelectorAll('.letter');
    Array.from(letters).forEach((letter, index) => {
        letter.textContent = String.fromCharCode(index + asc);
    });
};
  
function toonFoutePoging() {
    raadselTeller++;
    const galgje = document.getElementById('foutePogingen');
    galgje.src = `images/galgjeSvg/${String(raadselTeller).padStart(2, "0")}.svg`;
    if (raadselTeller === 12) spelerVerloren();
};

function spelerGewonnen() {
    eindeSpel();
    const wonText = {
        0: 'De automerk was',
        1: 'Het land was'
    };
    const msg = `Jij hebt gewonnen. ${wonText[spel]} ${toBeFound}`;
    const toetsenbord = document.getElementById('toetsenbord');
    spel === 0 ? updateStarsVsCounter(raadselTeller) : updateStarsVsHints();
    toggleModal(true, true, 'green', msg, toetsenbord, 'rgba(0,0,0,0.5)');
    if (!DOM.geluidStaatAan.hidden) DOM.soundWin.play();
};

export function spelerVerloren() {
    eindeSpel();
    const msg = `Jij hebt verloren. ${spel === 0 ? "De automerk was " : "Het land was "} ${toBeFound}`;
    const toetsenbord = document.getElementById('toetsenbord');
    toggleModal(true, false, 'red', msg, toetsenbord, 'rgba(0,0,0,0.5)');
    if (!DOM.geluidStaatAan.hidden) DOM.soundFailure.play();
};

function eindeSpel() {
    spelAfgelopen = true;
    pauzeerTimer();
};

function makeTopicRiddle() {
    const topicTxt = document.createElement('p');
    topicTxt.classList.add('topic-text');
    const raadsels = ['automerk', 'land'];
    topicTxt.textContent = `Te raden ${raadsels[spel]}:`;
    DOM.gameTopic.appendChild(topicTxt);
    const toBeFound = document.createElement('div');
    toBeFound.setAttribute('id', 'teRadenObject');
    toBeFound.classList.add('raad-container');
    DOM.gameTopic.appendChild(toBeFound);
};

function makeKeyboard() {
    const leftSide = document.createElement('div');
    leftSide.id = 'left-side';
    const kleineLetters = document.createElement('div');
    kleineLetters.classList.add('kleine-letters');
    kleineLetters.innerHTML = `
        <label><input id="kleine-letter" type="checkbox">Kleine letters</label>
    `;
    kleineLetters.addEventListener('change', lettersAanpassen);
    leftSide.appendChild(kleineLetters);
    
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
    leftSide.appendChild(toetsenbord);
    DOM.middenSectie.appendChild(leftSide);
};

function makeHints() {
    const hintContainer = document.createElement('div');
    hintContainer.classList.add('hint-container');
    const topicTxt = document.createElement('p');
    topicTxt.classList.add('topic-text');
    topicTxt.textContent = 'Tips:';
    hintContainer.appendChild(topicTxt);
    const array = [1,2,3];
    array.forEach(hint => {
        const hintDiv = document.createElement('div');
        hintDiv.id = `hint-${hint}`;
        hintDiv.classList.add('hint');
        hintDiv.textContent = hint;
        hintDiv.addEventListener('click', (e) => {
            toonHint(e);
        });
        hintContainer.appendChild(hintDiv);
    });
    DOM.middenSectie.appendChild(hintContainer);
};

function assignHints() {
    let numbers = [1, 2, 3];
    numbers = numbers.sort(() => Math.random() - 0.5); // Schudt de nummers willekeurig
  
    assignedHints.hint1 = numbers[0];
    assignedHints.hint2 = numbers[1];
    assignedHints.hint3 = numbers[2];
};

const getLandInfo = () => {
    const lijst = landLijst();
    const teRadenLand = lijst[randomRaadsel];

    const land = landen.find(country => country.naam === teRadenLand);
    if (!land) return [null, null, null];

    return [land.continent, `${land.oppervlakte} km²`, land.taal];
};

function toonHint(e) {
    const hintText = {
        1: 'Het continent van het land is:',
        2: 'De oppervlakte van het land is:',
        3: 'De officiële taal(en) van het land is(zijn):'
    };
    const hintId = e.target;
    if(!hintId.classList.contains('hint-used')) hintId.classList.add('hint-used');
    const [cont, opp, taal] = getLandInfo();
    const hintNum = assignedHints[`hint${parseInt(hintId.textContent)}`];
    //console.log(hintNum);
    const msg = `${hintText[hintNum]} ${[cont, opp, taal][hintNum - 1]}`;
    const toetsenbord = document.getElementById('toetsenbord');
    toggleModal(true, false, '#2b2b2b', msg, toetsenbord, 'rgba(0,0,0,0.5)');

};





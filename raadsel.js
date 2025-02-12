"use strict";
import { DOM, spel, toggleModal } from './main.js';
import { stopTimer, pauzeerTimer, timerInterval } from './timer.js';
import { landen } from './dataLanden.js';

export let spelAfgelopen = false;
let raadselTeller = 0;
let randomRaadsel = 0;
let asc = 65;
let toBeFound ='';
let emptyArray = [];

const autoLijst = [
    "Acura", "AlfaRomeo", "Audi", "Bentley", "BMW", "Bugatti", "Buick",
    "Cadillac", "Chevrolet", "Chrysler", "Citroen", "Dacia", "Daewoo",
    "Daihatsu", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC",
    "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia",
    "Koenigsegg", "Lamborghini", "Lancia", "LandRover", "Lexus", "Lincoln",
    "Lotus", "Maserati", "Mazda", "McLaren", "Mercedes", "Mini", "Mitsubishi",
    "Nissan", "Opel", "Pagani", "Peugeot", "Porsche", "Ram", "Renault",
    "RollsRoyce", "Saab", "Seat", "Skoda", "Smart", "SsangYong", "Subaru",
    "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

const landLijst = () => retrieveCountries();
function retrieveCountries() {
    let countries = [];
    landen.forEach(land =>{
        countries.push(land.naam);
    });
    return countries;    
};

//console.log(landLijst);
/*const landLijst = [
    "Belgie", "Frankrijk", "Spanje", "Duitsland", "Nederland", "Luxembourg", "Engeland",
    "Zweden", "Dublin", "Iceland", "Turkije", "Marocco", "Tunesie", "Egypte", "Lybia", "Palestina",
    "Algerije", "Dubai", "Portugal", "California", "Japan", "Rusland", "Iran", "Syrie",
    "Dannemark", "Chicago", "Italia", "Polen", "Roemenie", "Zwitserland", "Oostenrijk", "NewYork",
    "Canada", "Mexico", "Cuba", "Brazilie", "Argentina", "Croatia", "Greekenland", "Soedan", "Guinee",
    "Tanzania", "Nigeria", "Philippijn", "China", "Amerika", "Sinegaal", "Zambia", "Namibia", "Madagaskar" 
];*/

export function initializeRiddle() {
    if(spelAfgelopen) spelAfgelopen = false;
    if(timerInterval !== null) stopTimer();
    if(raadselTeller !== 0) raadselTeller = 0;

    const lijsten = {
        0: autoLijst,
        1: landLijst()
    };
    const kleineLetter = document.getElementById('kleine-letter');
    const hoofdLetter = !kleineLetter.checked;
    const lijst = lijsten[spel];
    randomRaadsel = Math.floor((Math.random() * lijst.length));
    console.log(`Raadsel Index: ${randomRaadsel}, To be found: ${lijst[randomRaadsel]}`);
    //randomIndex = 28;
    toBeFound = hoofdLetter ? lijst[randomRaadsel].toUpperCase() : lijst[randomRaadsel].toLowerCase();
    emptyArray = [];
    const teRadenObject = document.getElementById('teRadenObject');
    teRadenObject.innerHTML = '';
    for (let i = 0; i < toBeFound.length; i++) {
        const letter = document.createElement('div');
        letter.classList.add('blok');
        teRadenObject.appendChild(letter);
    }
    const galgje = document.getElementById('foutePogingen');
    galgje.src = `images/galgjeSvg/00.svg`;
    const letters = document.querySelectorAll('.letter');
    Array.from(letters).forEach(letter => {
        letter.classList.remove("letter-used");
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
    const msg = `Jij hebt gewonnen. ${spel === 0 ? "De automerk was " : "Het land was "} ${toBeFound}`;
    const toetsenbord = document.getElementById('toetsenbord');
    toggleModal(true, 'green', msg, toetsenbord, DOM.modal);
    if (!DOM.geluidStaatAan.hidden) DOM.soundWin.play();
};
  
export function spelerVerloren() {
    eindeSpel();
    const msg = `Jij hebt verloren. ${spel === 0 ? "De automerk was " : "Het land was "} ${toBeFound}`;
    const toetsenbord = document.getElementById('toetsenbord');
    toggleModal(true, 'red', msg, toetsenbord, DOM.modal);
    if (!DOM.geluidStaatAan.hidden) DOM.soundFailure.play();
};

function eindeSpel() {
    spelAfgelopen = true;
    pauzeerTimer();
};

export function makeTopicRiddle() {
    DOM.topic.classList.add('topic');
    const topicTxt = document.createElement('p');
    topicTxt.classList.add('topic-text');
    const raadsels = ['automerk', 'land'];
    topicTxt.textContent = `Te raden ${raadsels[spel]}:`;
    topic.appendChild(topicTxt);
    const toBeFound = document.createElement('div');
    toBeFound.setAttribute('id', 'teRadenObject');
    toBeFound.classList.add('raad-container');
    DOM.topic.appendChild(toBeFound);
};

export function makeKeyboard() {
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





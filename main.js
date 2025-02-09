"use strict";
import { tabBlad, makeSidebar, makeKeyboard, makeTopicRiddle, makeTimer, makeGalgjeContainer } from "./makeComponents.js";
import { stopTimer, pauzeerTimer, timerInterval } from "./timer.js";

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
//console.log(autoLijst.indexOf('Lamborghini'));
const landLijst = [
  "Belgie", "Frankrijk", "Spanje", "Duitsland", "Nederland", "Luxembourg", "Engeland",
  "Zweden", "Dublin", "Iceland", "Turkije", "Marocco", "Tunesie", "Egypte", "Lybia", "Palestina",
  "Algerije", "Dubai", "Portugal", "California", "Japan", "Rusland", "Iran", "Syrie",
  "Dannemark", "Chicago", "Italia", "Polen", "Roemenie", "Zwitserland", "Oostenrijk", "NewYork",
  "Canada", "Mexico", "Cuba", "Brazilie", "Argentina", "Croatia", "Greekenland", "Soedan", "Guinee",
  "Tanzania", "Nigeria", "Philippijn", "China", "Amerika", "Sinegaal", "Zambia", "Namibia", "Madagaskar" 
];

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
  leftSide : document.getElementById('left-side'),
  rightSide : document.getElementById('right-side'),
  modal : document.getElementById("modal"),
  modalOverlay : document.getElementById('modal-overlay'),
  overlay : document.getElementById("overlay"),
  sluiten : document.getElementById('sluiten')
};

export let spelAfgelopen = false;
let randomIndex = 0;
let teller = 0;

//raadsel
export let asc = 65;
let toBeFound ='';
let emptyArray = [];

//raket


export const gameConstructor = {
  0: () => {
    emptyContainers();
    makeTopicRiddle();
    makeTimer();
    makeKeyboard();
    makeGalgjeContainer();
    initializeRiddle();
    //console.log(`teller auto: ${teller}`);
  },
  1: () => {
    emptyContainers();
    makeTopicRiddle();
    makeTimer();
    makeKeyboard();
    makeGalgjeContainer();
    initializeRiddle();
    //console.log(`teller land: ${teller}`);
  },
  2: () => {
    emptyContainers();
  },
  3: () => {
    emptyContainers();
  }
};

const initialize = {
  0: () => initializeRiddle(),
  1: () => initializeRiddle(),
  2: () => initializeRaket(),
  3: () => initializeBoard()
}

function emptyContainers() {
  DOM.topic.innerHTML = '';
  DOM.timerContainer.innerHTML = '';
  DOM.leftSide.innerHTML = '';
  DOM.rightSide.innerHTML = '';
};

function initializeRiddle() {
  if(spelAfgelopen) spelAfgelopen = false;
  if(timerInterval !== null) stopTimer();
  if(teller !== 0) teller = 0;

  const lijsten = {
    0: autoLijst,
    1: landLijst
  };
  const kleineLetter = document.getElementById('kleine-letter');
  const hoofdLetter = !kleineLetter.checked;
  const lijst = lijsten[tabBlad];
  randomIndex = Math.floor(Math.random() * lijst.length);
  //console.log(`Random Index: ${randomIndex}, To be found: ${lijst[randomIndex]}`);
  //randomIndex = 28;
  toBeFound = hoofdLetter ? lijst[randomIndex].toUpperCase() : lijst[randomIndex].toLowerCase();
  emptyArray = [];
  const teRadenObject = document.getElementById('teRadenObject');
  teRadenObject.innerHTML = '';
  for (let i = 0; i < toBeFound.length; i++) {
    const letter = document.createElement('div');
    letter.classList.add('blok');
    teRadenObject.appendChild(letter);
  }
  const galgje = document.getElementById('foutePogingen');
  galgje.src = `images/00.svg`;
  const letters = document.querySelectorAll('.letter');
  Array.from(letters).forEach(letter => {
    letter.classList.remove("letter-used");
  });
};

function initializeRaket() {

};

function initializeBoard() {

};

export function handelLetter(event) {
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

export function lettersAanpassen() {
  const kleineLetter = document.getElementById('kleine-letter');
  const hoofdLetter = !kleineLetter.checked;
  const caseFunc = hoofdLetter ? 'toUpperCase' : 'toLowerCase';
  toBeFound = toBeFound[caseFunc]();
  emptyArray = emptyArray.map(elt => elt[caseFunc]());
  let i = 0;
  const teRadenObject = document.getElementById('teRadenObject');
  for(const letter of teRadenObject.children) {
    letter.textContent = emptyArray[i];
    i++;
  }
  asc = hoofdLetter ? 65 : 97;
  const toetsenbord = document.getElementById('toetsenbord');
  const letters = toetsenbord.querySelectorAll('.letter');
  Array.from(letters).forEach((letter, index) => {
    letter.textContent = String.fromCharCode(index + asc);
  });
};

function toonFoutePoging() {
  teller++;
  const galgje = document.getElementById('foutePogingen');
  galgje.src = `images/${String(teller).padStart(2, "0")}.svg`;
  if (teller === 12) spelerVerloren();
};

function toggleModal(show, kleur = "", message = "") {
  DOM.modalOverlay.style.display = show ? "block" : "none";
  DOM.modal.style.display = show ? "block" : "none";
  DOM.overlay.style.backgroundColor = kleur;
  DOM.overlay.innerHTML = message;
};

function closeModal() {
  toggleModal(false);
};

function spelerGewonnen() {
  eindeSpel();
  const msg = `Jij hebt gewonnen. ${tabBlad === 0 ? "De automerk was " : "Het land was "} ${toBeFound}`;
  toggleModal(true, 'green', msg);
  if (!DOM.geluidStaatAan.hidden) DOM.soundWin.play();
};

export function spelerVerloren() {
  eindeSpel();
  const msg = `Jij hebt verloren. ${tabBlad === 0 ? "De automerk was " : "Het land was "} ${toBeFound}`;
  toggleModal(true, 'red', msg);
  if (!DOM.geluidStaatAan.hidden) DOM.soundFailure.play();
};

function eindeSpel() {
  spelAfgelopen = true;
  pauzeerTimer();
};

function toggleGeluid() {
  DOM.geluidStaatAan.hidden = !DOM.geluidStaatAan.hidden;
  DOM.geluidStaatUit.hidden = !DOM.geluidStaatUit.hidden;
};

DOM.geluidStaat.forEach(geluid => geluid.addEventListener('click', toggleGeluid));
DOM.sluiten.addEventListener('click', closeModal);
DOM.reset.addEventListener('click', () => {
  initialize[tabBlad]();
});

document.addEventListener('DOMContentLoaded', () => {
  makeSidebar();
  gameConstructor[tabBlad]();
})


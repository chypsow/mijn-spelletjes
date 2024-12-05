import { autoLijst, landLijst } from "./lijsten.js";

const img = document.getElementById("foutePogingen");
const teRadenMerk = document.getElementById("teRadenMerk");
const toetsenbord = document.getElementById('toetsenbord');
const kleineLetters = document.getElementById("kleine-letter");
const topic = document.getElementById("topic");
const sideBar = document.getElementById('side-bar');

const modal = document.getElementById("modal");
const modalOverlay = document.getElementById('modal-overlay');
const overlay = document.getElementById("overlay");

const timerElement = document.getElementById('timer');
const timerAfstellen = document.getElementById("timerAfstellen");
const start = document.getElementById("start");
const stop = document.getElementById("stop");

let spel = "auto";
let lijst = [];
let aantalMerken = 0;
let merkIndex = 0;
let merk ='';
let emptyMerk = [];
let teller = 0;
let letters = [];
let asc = 65;
let hoofdLetter = true;
let spelAfgelopen = false;

let aftellen = false;
let timerInterval = null;

Array.from(sideBar.children).forEach((elt, index) => {
  elt.addEventListener('click', () => {
    sideBar.querySelector('.active').classList.remove("active");
    elt.classList.add("active");
  });
});

topic.onchange = function() {
  if(this.value === "auto") {
    document.querySelector("body").style.backgroundImage = `url(images/auto.jpg)`;
    spel = "auto";
    herstartSpel();
  } else {
    document.querySelector("body").style.backgroundImage = `url(images/landenKaart.jpg)`;
    spel = "land";
    herstartSpel();
  }
};

maakToesenbord();
initializeren();

function maakToesenbord() {
  for(let i = 0; i < 26;  i++) {
    const letter = document.createElement('div');
    letter.classList.add('letter');
    letter.textContent = String.fromCharCode(i + asc);
    letter.addEventListener("click", raadLetter);
    letters.push(letter);
    toetsenbord.appendChild(letter);
  }
};

function initializeren() {
  lijst = spel === "auto" ? autoLijst : landLijst;
  aantalMerken = lijst.length;
  merkIndex = Math.floor(Math.random() * aantalMerken);
  merk = hoofdLetter ? lijst[merkIndex].toUpperCase() : lijst[merkIndex].toLowerCase();
  emptyMerk = [];
  teRadenMerk.innerHTML = '';
  for (let i = 0; i < merk.length; i++) {
    const huis = document.createElement('div');
    huis.classList.add('part');
    teRadenMerk.appendChild(huis);
  }                        
};

function herstartSpel() {
  spelAfgelopen = false;
  stopTimer();
  teller = 0;
  img.src = `images/00.svg`;
  initializeren();
  letters.forEach(letter => {
    letter.classList.remove("letter-used");
    letter.addEventListener("click", raadLetter);
  });
};

function lettersAanpassen() {
  hoofdLetter = !kleineLetters.checked;
  const caseFunc = hoofdLetter ? 'toUpperCase' : 'toLowerCase';
  merk = merk[caseFunc]();
  emptyMerk = emptyMerk.map(elt => elt[caseFunc]());
  let i = 0;
  for(const letter of teRadenMerk.children) {
    letter.textContent = emptyMerk[i];
    i++;
  }
  asc = hoofdLetter ? 65 : 97;
  letters.forEach((letter, i) => {
    letter.textContent = String.fromCharCode(i + asc);
  });
};

kleineLetters.addEventListener('change', lettersAanpassen);

function raadLetter(event) {
  const myLetter = event.target.textContent;
  if (merk.includes(myLetter)) {
    merk.split("").forEach((char, i) => {
      if (char === myLetter) {
        emptyMerk[i] = myLetter;
        teRadenMerk.children[i].textContent = myLetter;
      }
    });
    if (emptyMerk.join("") === merk) {
      spelerGewonnen();
    }
  } else {
    toonFoutePoging();
  }
  event.target.classList.add('letter-used');
  event.target.removeEventListener('click', raadLetter) 
};

function toonFoutePoging() {
  teller++;
  img.src = `images/${String(teller).padStart(2, "0")}.svg`;
  if (teller === 12) spelerVerloren();
};

function toggleModal(show, kleur = "", message = "") {
  modalOverlay.style.display = show ? "block" : "none";
  modal.style.display = show ? "block" : "none";
  overlay.style.backgroundColor = kleur;
  overlay.innerHTML = message;
};

function closeModal() {
  toggleModal(false);
};

function spelerGewonnen() {
  eindeSpel();
  const msg = `Jij hebt gewonnen. ${spel === "auto" ? "De auto was " : "Het land was "} ${lijst[merkIndex]}`;
  toggleModal(true, 'green', msg);
};

function spelerVerloren() {
  eindeSpel();
  const msg = `Jij hebt verloren. ${spel === "auto" ? "De auto was " : "Het land was "} ${lijst[merkIndex]}`;
  toggleModal(true, 'red', msg);
};

function eindeSpel() {
  spelAfgelopen = true;
  pauzeerTimer();
  letters.forEach(letter => letter.removeEventListener("click", raadLetter));
};
document.getElementById('sluiten').addEventListener('click', closeModal);
document.getElementById("reset").addEventListener('click', herstartSpel);

//timer
timerAfstellen.addEventListener('change', () => {
  if(!aftellen) timerElement.textContent = timerAfstellen.value ;
});

function handelStartTimer() {
  aftellen ? pauzeerTimer() : startTimer();
};

function pauzeerTimer() {
  if(timerInterval !== null) {
    clearInterval(timerInterval);
    aftellen = false;
    start.innerText ="Resume";
  }
};

function stopTimer() {
  if(timerInterval !== null) {
    clearInterval(timerInterval); 
    aftellen = false;
    start.innerText ="Start timer";
    timerElement.textContent = timerAfstellen.value;
  }
};

timerElement.textContent = "00:30:00";
start.addEventListener('click', handelStartTimer);
stop.addEventListener('click', stopTimer);

function startTimer() {
  aftellen = true;
  start.innerText = "Pauze";
  const [minutes, seconds, millis] = timerElement.textContent.split(":").map(Number);
  let remainingTime = minutes * 60 * 1000 + seconds * 1000 + millis * 10;

  function updateClock() {
    if (remainingTime > 0 && aftellen) {
      remainingTime -= 10; 
      //const hoursNum = String(Math.floor((remainingTime / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutesNum = String(Math.floor((remainingTime / (1000 * 60)) % 60)).padStart(2, '0');
      const secondsNum = String(Math.floor((remainingTime / 1000) % 60)).padStart(2, '0');
      const millisNum = String(Math.floor((remainingTime / 10) % 100)).padStart(2, '0');
      timerElement.textContent = `${minutesNum}:${secondsNum}:${millisNum}`;
    } else {
      stopTimer();
      if(!spelAfgelopen) spelerVerloren();
    }
  }

  timerInterval = setInterval(updateClock, 10);
  updateClock();
};
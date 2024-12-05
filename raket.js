"use strict";
const easy = document.getElementById("easy");
const difficult =document.getElementById("difficult");
const beurten = document.getElementById("beurten");
const resultaat = document.getElementById("resultaat");
const verloren = document.getElementById("verloren");
const galgje = document.getElementById("foutePogingen");
const soundWin = document.getElementById("soundWin");
const soundFailure = document.getElementById("soundFailure");
const geluidStaat = document.querySelectorAll(".geluid img");
const geluidStaatAan = document.getElementById("son");
const geluidStaatUit = document.getElementById("mute");
const sideBar = document.getElementById('side-bar');

geluidStaat.forEach(geluid => geluid.addEventListener('click', toggleGeluid));
function toggleGeluid() {
  geluidStaatAan.hidden = !geluidStaatAan.hidden;
  geluidStaatUit.hidden = !geluidStaatUit.hidden;
}

Array.from(sideBar.children).forEach((elt, index) => {
  elt.addEventListener('click', () => {
    sideBar.querySelector('.active').classList.remove("active");
    elt.classList.add("active");
  });
});

let deuren = [];
maakDeuren();
function maakDeuren() {
  for (let index = 0; index < 24; index++) {
      const deur = document.createElement("img");
      deur.src = "images/deurtoe.svg";
      deur.alt = "deur toe";
      //const hyperlink = document.createElement("a");
      //hyperlink.href = "#";
      //hyperlink.appendChild(myImg);
      document.getElementById("deuren").appendChild(deur);
  }
  deuren = document.querySelectorAll("#deuren img");
  deuren.forEach(deur => deur.addEventListener('click', deurOpenen));
}

let raketIndex = Math.floor((Math.random() * deuren.length));
let deurMetRaket = deuren[raketIndex];
let teller = 0;

function deurOpenen(e) {
  const mijnDeur = e.target;
  if(!easy.checked) {
    deuren.forEach(deur => {
      deur.src = "images/deurtoe.svg";
      deur.alt = "deur toe";});
  }
  if (mijnDeur === deurMetRaket) {
    spelerGewonnen(mijnDeur);
  } else {
    toonFoutePoging(mijnDeur);
  }
}
function toonFoutePoging(mijnDeur) {
  teller++;
  galgje.src = `images/${String(teller).padStart(2, "0")}.svg`;
  mijnDeur.src = "images/deuropen.svg";
  mijnDeur.alt = "deur open";
  if (teller === 12) spelerVerloren();
}
function spelerGewonnen(mijnDeur) {
  mijnDeur.src = "images/gevonden.svg";
  mijnDeur.alt = "gevonden";
  beurten.innerText = teller;
  resultaat.hidden = false;
  if (!geluidStaatAan.hidden) soundWin.play();
  //setTimeout(playerWins, 100);
  deuren.forEach(deur => deur.style.pointerEvents = 'none');
}
function spelerVerloren() {
  deurMetRaket.src = "images/gevonden.svg";
  deurMetRaket.alt = "gevonden";
  verloren.hidden = false;
  if (geluidStaatAan.hidden === false) soundFailure.play();
  deuren.forEach(deur => deur.style.pointerEvents = 'none');
}
function herstartSpel() {
    resultaat.hidden = true;
    verloren.hidden = true;
    deuren.forEach(deur => {
        deur.src = "images/deurtoe.svg";
        deur.alt = "deur toe";
        deur.style.pointerEvents = 'auto';
    });
    teller = 0;
    deurMetRaket = deuren[Math.floor((Math.random() * deuren.length))];
    galgje.src = "images/00.svg";
}



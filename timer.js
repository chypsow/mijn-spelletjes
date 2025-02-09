"use strict";
import { spelAfgelopen, spelerVerloren } from './main.js';

export let aftellen = false;
export let timerInterval = null;

export function handelStartTimer() {
    aftellen ? pauzeerTimer() : startTimer();
  };
  
export function pauzeerTimer() {
    if(timerInterval !== null) {
        clearInterval(timerInterval);
        aftellen = false;
        const start = document.getElementById('start');
        start.innerText ="Resume";
    }
};

export function stopTimer() {
    if(timerInterval !== null) {
        clearInterval(timerInterval); 
        aftellen = false;
        const start = document.getElementById('start');
        start.innerText ="Start timer";
        const timerElement = document.getElementById('timer');
        const timerAfstellen = document.getElementById('timerAfstellen');
        timerElement.textContent = timerAfstellen.value;
    }
};

function startTimer() {
    aftellen = true;
    const timerElement = document.getElementById('timer');
    const start = document.getElementById('start');
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
"use strict";
import { DOM } from './main.js';
import { spelAfgelopen, spelerVerloren } from './raadsel.js';

export let aftellen = false;
export let timerInterval = null;

export function makeTimer() {
    

    const timerGroup = document.createElement('div');
    timerGroup.classList.add('timer-group');
    DOM.timerContainer.appendChild(timerGroup);

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
    timerGroup.appendChild(btnContainer);

    const timerElt = document.createElement('div');
    timerElt.setAttribute('id', 'timer');
    timerElt.classList.add('timer-element');
    timerElt.textContent = "00:30:00";
    timerGroup.appendChild(timerElt);

    const afstellen = document.createElement('div');
    afstellen.classList.add('timer-afstellen');
    const instellen = document.createElement('p');
    instellen.textContent = 'Timer instellen:';
    afstellen.appendChild(instellen);
    const timerAfstellen = document.createElement('select');
    timerAfstellen.setAttribute('id', 'timerAfstellen');
    const timeArray = ['00:30:00', '01:00:00', '01:30:00'];
    timeArray.forEach(time => {
        const option = document.createElement('option');
        option.textContent = time;
        timerAfstellen.appendChild(option);
    });
    timerAfstellen.addEventListener('change', () => {
        if(!aftellen) {
            timerElt.textContent = timerAfstellen.value;
            startBtn.textContent = "Start timer";
        }
    });
    afstellen.appendChild(timerAfstellen);
    DOM.timerContainer.appendChild(afstellen);
};


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
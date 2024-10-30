const start = document.querySelector(".start");
const hours = document.querySelector(".hours");
const minutesDisplay = document.querySelector(".minuts");
const milliDisplay = document.querySelector(".millisecond");
const secondDisplay = document.querySelector(".second");
const reset = document.querySelector(".reset");
const lapButton = document.querySelector(".lap");
const lapTable = document.querySelector(".lap-time-container");

let startTime = null;
let elapsedPausedTime = 0; 
let intervalId = null;
let lapNumber = 0;
let lastLapMilliseconds = 0;
let isRunning = false; 

start.addEventListener("click", handleStartClick);
reset.addEventListener("click", handleResetClick);
lapButton.addEventListener("click", handleLapClick);
document.querySelector(".lap").style.display = "none";
hours.style.display = "none";

function handleStartClick() {
  if (!isRunning) {
    startCounting();
    start.innerHTML = "Stop";
    start.style.backgroundColor = "red";
    document.querySelector(".lap").style.display = "block";
  } else {
    handleStopClick();
  }
}

function startCounting() {
  if (!intervalId) {
    isRunning = true;
    startTime = startTime ? startTime : Date.now();
    intervalId = setInterval(updateTimer, 10);
  }
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime - elapsedPausedTime;
  
  let milliseconds = Math.floor((elapsedTime % 1000) / 10);
  let seconds = Math.floor((elapsedTime / 1000) % 60);
  let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  let hoursCount = Math.floor(elapsedTime / (1000 * 60 * 60));

  displayTime(milliseconds, seconds, minutes, hoursCount);
}

function displayTime(millisecondCount, secondCount, minutesCount, hoursCount) {
  milliDisplay.innerHTML = formatTime(millisecondCount);
  secondDisplay.innerHTML = `${formatTime(secondCount)} :`;
  minutesDisplay.innerHTML = `${formatTime(minutesCount)} :`;
  hours.innerHTML = `${formatTime(hoursCount)} :`;
  hours.style.display = hoursCount > 0 ? "block" : "none";
}

function formatTime(unit) {
  return unit < 10 ? "0" + unit : unit;
}

function handleStopClick() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  start.innerHTML = "Start";
  start.style.cssText = "background-color: #101920; color: white";
  document.querySelector(".lap").style.display = "none";
  elapsedPausedTime += Date.now() - startTime;
}

function handleResetClick() {
  clearInterval(intervalId);
  intervalId = null;
  startTime = null;
  elapsedPausedTime = 0;
  lapNumber = lastLapMilliseconds = 0;
  lapTable.innerHTML = '';
  isRunning = false;
  start.innerHTML = "Start";
  start.style.backgroundColor = "black";
  start.style.color = "white";
  document.querySelector(".lap-time").style.display = "none";
  document.querySelector(".lap").style.display = "none";
  displayTime(0, 0, 0, 0);
}

function handleLapClick() {
  if (isRunning) {
    recordLap();
  }
}

function recordLap() {
  lapNumber++;
  if (lapNumber === 1) {
    document.querySelector(".lap-time").style.display = "block";
  }

  const elapsedTime = Date.now() - startTime - elapsedPausedTime;
  const lapTimeMilliseconds = elapsedTime - lastLapMilliseconds;
  lastLapMilliseconds = elapsedTime;

  const lapTime = formatLapTime(lapTimeMilliseconds);
  const totalTime = `${formatTime(minutesDisplay.innerHTML)} ${formatTime(secondDisplay.innerHTML)} ${formatTime(milliDisplay.innerHTML)}`;

  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${lapNumber}</td><td>${lapTime}</td><td>${totalTime}</td>`;
  lapTable.appendChild(newRow);
}

function formatLapTime(milliseconds) {
  const lapMinutes = Math.floor((milliseconds % 3600000) / 60000);
  const lapSeconds = Math.floor((milliseconds % 60000) / 1000);
  const lapMilliseconds = Math.floor((milliseconds % 1000) / 10);
  return `${formatTime(lapMinutes)}:${formatTime(lapSeconds)}:${formatTime(lapMilliseconds)}`;
}

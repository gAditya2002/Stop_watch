const start = document.getElementById("start");
const hours = document.getElementById("hours");
const minutesDisplay = document.getElementById("minutes");
const milliDisplay = document.getElementById("milliseconds");
const secondDisplay = document.getElementById("seconds");
const reset = document.getElementById("reset");
const lapButton = document.getElementById("lap");
const lapTable = document.getElementById("lap-time-container");

let hoursCount = 0;
let millisecondCount = 0;
let secondCount = 0;
let minutesCount = 0;
let intervalId = null;
let lapNumber = 0;
let lastLapMilliseconds = 0;
let isRunning = false;
let startTime = 0; 
let elapsedTime = 0; 

start.addEventListener("click", handleStartClick);
reset.addEventListener("click", handleResetClick);
lapButton.addEventListener("click", handleLapClick);
lapButton.style.display = "none";
hours.style.display = "none";

function handleStartClick() {
  if (!isRunning) {
    startTime = Date.now(); 
    startCounting();
    start.innerHTML = "Stop";
    start.classList.add("start-active");
    start.classList.remove("start-inactive");
    lapButton.style.display = "block";
    isRunning = true;
  } else {
    handleStopClick();
  }
}

function startCounting() {
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 10);
  }
}

function updateTimer() {
  const currentTime = Date.now();
  elapsedTime += currentTime - startTime; 
  startTime = currentTime; 

  millisecondCount = Math.floor((elapsedTime % 1000) / 10);
  secondCount = Math.floor((elapsedTime / 1000) % 60);
  minutesCount = Math.floor((elapsedTime / 60000) % 60);
  hoursCount = Math.floor((elapsedTime / 3600000));

  displayTime();
}

function displayTime() {
  milliDisplay.innerHTML = formatTime(millisecondCount);
  secondDisplay.innerHTML = `${formatTime(secondCount)} :`;
  minutesDisplay.innerHTML = `${formatTime(minutesCount)} :`;
  hours.innerHTML = `${formatTime(hoursCount)} :`;
}

function formatTime(unit) {
  return unit < 10 ? "0" + unit : unit;
}

function handleStopClick() {
  clearInterval(intervalId);
  intervalId = null;
  start.innerHTML = "Start";
  start.classList.remove("start-active");
  start.classList.add("start-inactive");
  lapButton.style.display = "none";
  isRunning = false;
}

function handleResetClick() {
  clearInterval(intervalId);
  intervalId = null;
  hoursCount = minutesCount = secondCount = millisecondCount = 0;
  elapsedTime = 0; 
  lapNumber = lastLapMilliseconds = 0;
  lapTable.innerHTML = '';
  start.innerHTML = "Start";
  start.classList.remove("start-active");
  start.classList.add("reset-active");
  document.querySelector(".lap-time").style.display = "none";
  lapButton.style.display = "none";
  displayTime();
  isRunning = false;
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
  
  const lapTimeMilliseconds = elapsedTime - lastLapMilliseconds;
  lastLapMilliseconds = elapsedTime;
  const lapTime = formatLapTime(lapTimeMilliseconds);
  const totalTime = formatTime(minutesCount) + ":" + formatTime(secondCount) + ":" + formatTime(millisecondCount);
  
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${lapNumber}</td><td>${lapTime}</td><td>${totalTime}</td>`;
  lapTable.appendChild(newRow);
}

function formatLapTime(milliseconds) {
  const lapMinutes = Math.floor((milliseconds / 60000) % 60);
  const lapSeconds = Math.floor((milliseconds / 1000) % 60);
  const lapMilliseconds = Math.floor((milliseconds % 1000) / 10);
  return `${formatTime(lapMinutes)}:${formatTime(lapSeconds)}:${formatTime(lapMilliseconds)}`;
}

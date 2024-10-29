
const start = document.querySelector(".start");
const minutesDisplay = document.querySelector(".minuts");
const milliDisplay = document.querySelector(".millisecond");
const secondDisplay = document.querySelector(".second");
const stop = document.querySelector(".stop");
const reset = document.querySelector(".reset");
const hoursDisplay = document.querySelector(".hours");
const lapTable = document.querySelector(".lap-time-container");


let hoursCount = 0;
let millisecondCount = 0;
let secondCount = 0;
let minutesCount = 0;
let intervalId = null;
let lapNumber = 0;
let lastLapMilliseconds = 0;


start.addEventListener("click", handleStartClick);
stop.addEventListener("click", handleStopClick);
reset.addEventListener("click", handleResetClick);


function handleStartClick() {
  if (start.innerHTML === "Start") {
    startCounting();
    start.innerHTML = "Lap";
  } else {
    recordLap();
  }
}


function startCounting() {
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 10);
  }
}


function updateTimer() {
  millisecondCount++;
  if (millisecondCount === 100) {
    millisecondCount = 0;
    secondCount++;
  }
  if (secondCount === 60) {
    secondCount = 0;
    minutesCount++;
  }
  if (minutesCount === 60) {
    minutesCount = 0;
    hoursCount++;
  }
  displayTime();
}


function displayTime() {
  milliDisplay.innerHTML = formatTime(millisecondCount);
  secondDisplay.innerHTML = `${formatTime(secondCount)} :`;
  minutesDisplay.innerHTML = `${formatTime(minutesCount)} :`;
  hoursDisplay.innerHTML = `${formatTime(hoursCount)} :`;
}


function formatTime(unit) {
  return unit < 10 ? "0" + unit : unit;
}


function handleStopClick() {
  clearInterval(intervalId);
  intervalId = null;
  start.innerHTML = "Start";
}


function handleResetClick() {
  clearInterval(intervalId);
  intervalId = null;
  hoursCount = minutesCount = secondCount = millisecondCount = 0;
  lapNumber = lastLapMilliseconds = 0;
  lapTable.innerHTML = '';
  start.innerHTML = "Start";
  document.querySelector(".lap-time").style.display = "none";
  displayTime();
}


function recordLap() {
  lapNumber++;

  if (lapNumber === 1) {
    document.querySelector(".lap-time").style.display = "block";
  }


  const currentTotalMilliseconds = getTotalMilliseconds();
  const lapTimeMilliseconds = currentTotalMilliseconds - lastLapMilliseconds;
  lastLapMilliseconds = currentTotalMilliseconds;

 
  const lapTime = formatLapTime(lapTimeMilliseconds);
  const totalTime = `${formatTime(hoursCount)}:${formatTime(minutesCount)}:${formatTime(secondCount)}:${formatTime(millisecondCount)}`;
  

  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${lapNumber}</td><td>${lapTime}</td><td>${totalTime}</td>`;
  lapTable.appendChild(newRow);
}


function getTotalMilliseconds() {
  return (hoursCount * 3600000) + (minutesCount * 60000) + (secondCount * 1000) + (millisecondCount * 10);
}

function formatLapTime(milliseconds) {
  const lapHours = Math.floor(milliseconds / 3600000);
  const lapMinutes = Math.floor((milliseconds % 3600000) / 60000);
  const lapSeconds = Math.floor((milliseconds % 60000) / 1000);
  const lapMilliseconds = Math.floor((milliseconds % 1000) / 10);
  
  return `${formatTime(lapMinutes)}:${formatTime(lapSeconds)}:${formatTime(lapMilliseconds)}`;
}

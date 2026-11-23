const KEY = "idle-eden";
const THIRSTY_MS = 10000;
const WILT_MS = 30000;
const SCALE = 1;

function loadState() {
  const saved = localStorage.getItem(KEY);
  if (saved) return JSON.parse(saved);
  return { plantedAt: Date.now(), lastWatered: Date.now(), waterCount: 0, hue: Math.floor(Math.random() * 360) };
}

function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

const state = loadState();
if (state.hue === undefined) state.hue = Math.floor(Math.random() * 360);
saveState(state);
console.log(state);

function getAgeSeconds(state) {
  return Math.floor((Date.now() - state.plantedAt) / 1000);
}

function formatTime(s) {
  if (s < 60) return s + "s";
  return Math.floor(s / 60) + "m " + (s % 60) + "s";
}

function getStage(age) {
  age = age / SCALE;
  if (age < 10) return "seed";
  if (age < 30) return "sprout";
  if (age < 90) return "plant";
  return "tree";
}

function logStage() {
  if (!state.log) state.log = [];
  const stage = getStage(getAgeSeconds(state));
  const last = state.log[state.log.length - 1];
  if (!last || last.stage !== stage) {
    state.log.push({ stage: stage, at: Date.now() });
    saveState(state);
  }
}

function renderLog() {
  const list = document.getElementById("log");
  list.innerHTML = "";
  state.log.forEach(function (entry) {
    const li = document.createElement("li");
    li.textContent = entry.stage + " at " + formatTime(Math.floor((entry.at - state.plantedAt) / 1000));
    list.appendChild(li);
  });
}

function render() {
  const thirsty = Date.now() - state.lastWatered > THIRSTY_MS;
  document.getElementById("status").textContent =
    "Age: " + formatTime(getAgeSeconds(state)) + " | Water: " + state.waterCount + (thirsty ? " | thirsty" : "");
  const height = 10 + getAgeSeconds(state) / SCALE;
  document.getElementById("plant").style.height = Math.min(height, 200) + "px";
  document.getElementById("plant").dataset.stage = getStage(getAgeSeconds(state));
  document.getElementById("plant").classList.toggle("wilted", Date.now() - state.lastWatered > WILT_MS);
  document.getElementById("plant").style.filter = "hue-rotate(" + state.hue + "deg)";
  document.getElementById("thirst").textContent = "Last watered: " + Math.floor((Date.now() - state.lastWatered) / 1000) + "s ago";
  logStage();
  renderLog();
}

render();

document.getElementById("water").addEventListener("click", function () {
  state.lastWatered = Date.now();
  state.waterCount++;
  saveState(state);
  render();
    const plant = document.getElementById("plant");
  plant.classList.add("bounce");
  setTimeout(function () { plant.classList.remove("bounce"); }, 400);
});

document.getElementById("reset").addEventListener("click", function () {
  if (!confirm("Plant a new garden? The old one will be gone.")) return;
  localStorage.removeItem(KEY);
  location.reload();
});

setInterval(render, 1000);
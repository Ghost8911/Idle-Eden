const KEY = "idle-eden";
const THIRSTY_MS = 10000;
const WILT_MS = 30000;
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

function getStage(age) {
  if (age < 10) return "seed";
  if (age < 30) return "sprout";
  if (age < 90) return "plant";
  return "tree";
}

function render() {
  const thirsty = Date.now() - state.lastWatered > THIRSTY_MS;
  document.getElementById("status").textContent =
    "Age: " + getAgeSeconds(state) + "s | Water: " + state.waterCount + (thirsty ? " | thirsty" : "");
  const height = 10 + getAgeSeconds(state);
  document.getElementById("plant").style.height = Math.min(height, 200) + "px";
  document.getElementById("plant").dataset.stage = getStage(getAgeSeconds(state));
    document.getElementById("plant").classList.toggle("wilted", Date.now() - state.lastWatered > WILT_MS);
  document.getElementById("plant").style.filter = "hue-rotate(" + state.hue + "deg)";
}

render();

document.getElementById("water").addEventListener("click", function () {
  state.lastWatered = Date.now();
  state.waterCount++;
  saveState(state);
  render();
});

setInterval(render, 1000);
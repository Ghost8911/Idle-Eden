const KEY = "idle-eden";

function loadState() {
  const saved = localStorage.getItem(KEY);
  if (saved) return JSON.parse(saved);
  return { plantedAt: Date.now(), lastWatered: Date.now(), waterCount: 0 };
}
function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

const state = loadState();
saveState(state);
console.log(state);
function getAgeSeconds(state) {
  return Math.floor((Date.now() - state.plantedAt) / 1000);
}
function render() {
  const thirsty = Date.now() - state.lastWatered > 10000;
  document.getElementById("status").textContent =
    "Age: " + getAgeSeconds(state) + "s | Water: " + state.waterCount + (thirsty ? " | thirsty" : "");
  const height = 10 + getAgeSeconds(state);
  document.getElementById("plant").style.height = Math.min(height, 200) + "px";
}
render();
document.getElementById("water").addEventListener("click", function () {
  state.lastWatered = Date.now();
  state.waterCount++;
  saveState(state);
  render();
  });
setInterval(render, 1000);
const KEY = "idle-eden";

function loadState() {
  const saved = localStorage.getItem(KEY);
  if (saved) return JSON.parse(saved);
  return { plantedAt: Date.now(), lastWatered: Date.now(), waterCount: 0 };
}
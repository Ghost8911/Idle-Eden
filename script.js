const KEY = "idle-eden";

function loadState() {
  const saved = localStorage.getItem(KEY);
  if (saved) return JSON.parse(saved);
}
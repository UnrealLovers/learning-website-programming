/* =========================================================
   CodeQuest — Common Core
   Dipakai bareng oleh script.js (roadmap), settings.js, dan
   profile.js. Taruh file ini SETELAH data.js dan SEBELUM
   file khusus halaman di tag <script> — supaya WORLDS/LEVELS
   sudah ada saat common.js jalan.

   Ini yang bikin index.html, settings.html, dan profile.html
   "pasti kesambung": ketiganya baca/tulis localStorage key
   yang sama lewat fungsi-fungsi di file ini.
   ========================================================= */

const STORAGE_KEY = "codequest_progress_v1";
const SETTINGS_KEY = "codequest_settings_v1";
const MATERI_PER_LEVEL = 13;

/* ---------------- DOM helpers ---------------- */

function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBody(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

const TYPE_ICON = { reading: "📖", quiz: "❓", challenge: "⌨️" };
const TYPE_LABEL = { reading: "Bacaan", quiz: "Kuis", challenge: "Tantangan Kode" };

function levelById(id) {
  return LEVELS.find((l) => l.id === id);
}

function worldOf(level) {
  return WORLDS[level.world - 1];
}

/* ---------------- Progress state ---------------- */

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {} };
    const parsed = JSON.parse(raw);
    if (!parsed.completed) parsed.completed = {};
    return parsed;
  } catch (e) {
    return { completed: {} };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Gagal menyimpan progres:", e);
  }
}

let state = loadState();

function getLevelArr(id) {
  if (!state.completed[id]) {
    state.completed[id] = Array(MATERI_PER_LEVEL).fill(false);
  }
  return state.completed[id];
}

function isMateriDone(levelId, idx) {
  return !!getLevelArr(levelId)[idx];
}

/** Tandai satu materi selesai + catat tanggal aktif hari ini (dipakai info "terakhir belajar" di Profil). */
function markMateriComplete(levelId, idx) {
  const arr = getLevelArr(levelId);
  const wasDone = arr[idx];
  arr[idx] = true;
  state.lastActive = new Date().toISOString().slice(0, 10);
  saveState();
  return !wasDone;
}

function isLevelDone(levelId) {
  return getLevelArr(levelId).every(Boolean);
}

function isLevelUnlocked(levelId) {
  if (levelId === 1) return true;
  return isLevelDone(levelId - 1);
}

function countCompletedMateri() {
  let n = 0;
  Object.values(state.completed).forEach((arr) => {
    n += arr.filter(Boolean).length;
  });
  return n;
}

function countCompletedLevels() {
  return LEVELS.filter((l) => isLevelDone(l.id)).length;
}

function computeXp() {
  return countCompletedMateri() * 10 + countCompletedLevels() * 50;
}

function currentLevelId() {
  const firstUnfinished = LEVELS.find((l) => isLevelUnlocked(l.id) && !isLevelDone(l.id));
  if (firstUnfinished) return firstUnfinished.id;
  const allDone = LEVELS.every((l) => isLevelDone(l.id));
  return allDone ? 100 : 1;
}

function isWorldDone(worldId) {
  return LEVELS.filter((l) => l.world === worldId).every((l) => isLevelDone(l.id));
}

/* ---------------- Settings (Profil + Tampilan + Belajar) ---------------- */

const DEFAULT_SETTINGS = {
  username: "",
  avatar: "🧑‍💻",
  accent: "blue",
  fontSize: "md",
  reduceMotion: false,
  soundEnabled: true,
  dailyGoal: 3,
};

const AVATAR_CHOICES = ["🧑‍💻", "👩‍💻", "🧑‍🎓", "🐱", "🦊", "🐼", "🤖", "👾", "🚀", "⚡"];

const ACCENT_COLORS = {
  blue: "#6dcfff",
  purple: "#c792ea",
  green: "#89ca78",
  orange: "#f2a65a",
  pink: "#f07178",
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(next) {
  appSettings = { ...appSettings, ...next };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
  } catch (e) {
    console.warn("Gagal menyimpan pengaturan:", e);
  }
  applySettings();
  return appSettings;
}

/** Menerapkan pengaturan ke DOM halaman manapun yang memuat common.js ini. */
function applySettings() {
  const s = loadSettings();
  appSettings = s;

  const root = document.documentElement;
  root.style.setProperty("--accent", ACCENT_COLORS[s.accent] || ACCENT_COLORS.blue);
  root.classList.toggle("reduce-motion", !!s.reduceMotion);
  document.body.classList.remove("fs-sm", "fs-md", "fs-lg");
  document.body.classList.add("fs-" + (s.fontSize || "md"));

  const greeting = document.getElementById("greeting");
  if (greeting) {
    greeting.textContent = s.username ? `${s.avatar || "🧑‍💻"} Halo, ${s.username}` : "";
  }
  return s;
}

let appSettings = { ...DEFAULT_SETTINGS };
appSettings = applySettings();

function playChime(kind) {
  if (!appSettings.soundEnabled) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = kind === "correct" ? [660, 880] : kind === "complete" ? [523, 659, 784] : [300];
    let t = ctx.currentTime;
    notes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
      t += 0.11;
    });
    setTimeout(() => ctx.close(), (notes.length * 0.11 + 0.3) * 1000);
  } catch (e) { /* audio nggak tersedia, abaikan */ }
}

/* ---------------- Data export / import / reset (dipakai Settings) ---------------- */

function exportProgressFile() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "CodeQuest",
    version: 1,
    progress: state,
    settings: appSettings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `codequest-progress-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importProgressFile(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const incomingProgress = data.progress && data.progress.completed ? data.progress : null;
      if (!incomingProgress) throw new Error("Format file nggak dikenali.");
      state = incomingProgress;
      saveState();
      if (data.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, ...data.settings }));
        applySettings();
      }
      onDone(true);
    } catch (e) {
      onDone(false, e.message);
    }
  };
  reader.onerror = () => onDone(false, "Gagal membaca file.");
  reader.readAsText(file);
}

function resetAllProgress() {
  state = { completed: {} };
  saveState();
}

/* ---------------- Toast kecil (dipakai Settings & Profil) ---------------- */

let toastTimer;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg || "Tersimpan ✓";
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}
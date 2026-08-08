/* =========================================================
   CodeQuest — App Logic
   ========================================================= */

const STORAGE_KEY = "codequest_progress_v1";
const MATERI_PER_LEVEL = 13;

/* ---------------- State ---------------- */

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

/* ---------------- Helpers ---------------- */

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

function levelById(id) {
  return LEVELS.find((l) => l.id === id);
}

function worldOf(level) {
  return WORLDS[level.world - 1];
}

function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

const TYPE_ICON = { reading: "📖", quiz: "❓", challenge: "⌨️" };
const TYPE_LABEL = { reading: "Bacaan", quiz: "Kuis", challenge: "Tantangan Kode" };

/* ---------------- Top bar stats ---------------- */

function renderTopbarStats() {
  $("#stat-materi").textContent = countCompletedMateri();
  $("#stat-xp").textContent = computeXp();
  $("#stat-level").textContent = currentLevelId();
}

/* ---------------- Roadmap rendering ---------------- */

function generatePattern(n) {
  const pattern = [];
  for (let i = 0; i < n; i++) {
    const val = 50 + 34 * Math.sin(i * (Math.PI / 2.15));
    pattern.push(Math.max(14, Math.min(86, val)));
  }
  return pattern;
}

function getCssPx(varName, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
  const num = parseFloat(raw);
  return isNaN(num) ? fallback : num;
}

function renderRoadmap() {
  const wrap = $("#roadmap-wrap");
  wrap.innerHTML = "";

  const curId = currentLevelId();

  WORLDS.forEach((world) => {
    const worldLevels = LEVELS.filter((l) => l.world === world.id);

    const banner = document.createElement("div");
    banner.className = "world-banner";
    banner.style.setProperty("--world-color", world.color);
    banner.innerHTML = `
      <span class="world-banner-index">${String(world.id).padStart(2, "0")}</span>
      <div class="world-banner-text">
        <p class="world-banner-name">${world.emoji} ${escapeHtml(world.name)}</p>
        <p class="world-banner-sub">level ${worldLevels[0].id}–${worldLevels[worldLevels.length - 1].id}</p>
      </div>
    `;
    wrap.appendChild(banner);

    const track = document.createElement("div");
    track.className = "world-track";
    track.style.setProperty("--world-color", world.color);
    wrap.appendChild(track);

    layoutTrack(track, worldLevels, curId);
  });

  renderTopbarStats();
  renderHeroProgress();
}

function layoutTrack(track, levels, curId) {
  const rowHeight = getCssPx("--row-height", 108);
  const nodeSize = getCssPx("--node-size", 66);
  const n = levels.length;
  const pattern = generatePattern(n);
  const totalHeight = n * rowHeight;

  track.style.height = totalHeight + "px";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 100 ${totalHeight}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const points = levels.map((lvl, i) => {
    const x = pattern[i];
    const y = i * rowHeight + rowHeight / 2;
    return { x, y, lvl };
  });

  if (points.length > 1) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--border)");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-dasharray", "3 9");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    svg.appendChild(path);
  }
  track.appendChild(svg);

  points.forEach(({ x, y, lvl }) => {
    const done = isLevelDone(lvl.id);
    const unlocked = isLevelUnlocked(lvl.id);
    const isCurrent = lvl.id === curId && !done;

    const node = document.createElement("div");
    node.className = "node " + (done ? "node--completed" : unlocked ? (isCurrent ? "node--current" : "node--completed") : "node--locked");
    node.style.left = x + "%";
    node.style.top = y + "px";
    node.style.setProperty("--node-color", worldOf(lvl).color);

    const doneCount = getLevelArr(lvl.id).filter(Boolean).length;

    node.innerHTML = `
      <button class="node-btn" type="button" ${unlocked ? "" : "disabled"} aria-label="Level ${lvl.id}: ${escapeHtml(lvl.title)}">
        ${done ? "✓" : lvl.id}
        ${!done && unlocked && doneCount > 0 ? `<span class="node-check" title="${doneCount}/13">${doneCount}</span>` : ""}
      </button>
      <div class="node-label">${escapeHtml(lvl.title)}</div>
    `;

    if (unlocked) {
      node.querySelector(".node-btn").addEventListener("click", () => openLevel(lvl.id));
    }

    track.appendChild(node);
  });
}

function renderHeroProgress() {
  const totalMateri = LEVELS.length * MATERI_PER_LEVEL;
  const done = countCompletedMateri();
  const pct = Math.round((done / totalMateri) * 100);
  $("#hero-progress-fill").style.width = pct + "%";
  $("#hero-progress-label").textContent = `${pct}% jalur selesai (${done}/${totalMateri} materi)`;
}

/* ---------------- View switching ---------------- */

let activeLevelId = null;
let activeMateriIdx = 0;

function showRoadmap() {
  $("#level-view").classList.add("view-hidden");
  $("#roadmap-view").classList.remove("view-hidden");
  renderRoadmap();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function openLevel(levelId) {
  activeLevelId = levelId;
  const arr = getLevelArr(levelId);
  const firstUnfinished = arr.findIndex((v) => !v);
  activeMateriIdx = firstUnfinished === -1 ? 0 : firstUnfinished;

  $("#roadmap-view").classList.add("view-hidden");
  $("#level-view").classList.remove("view-hidden");
  renderLevelView();
  window.scrollTo({ top: 0, behavior: "auto" });
}

/* ---------------- Level view ---------------- */

function renderLevelView() {
  const level = levelById(activeLevelId);
  const world = worldOf(level);

  const tag = $("#level-world-tag");
  tag.textContent = `${world.emoji} ${world.name}`;
  tag.style.setProperty("--world-color", world.color);

  $("#level-title").textContent = `Level ${level.id} · ${level.title}`;

  renderMateriRail(level);
  renderMateriPanel(level);
  renderLevelProgress(level);
}

function renderLevelProgress(level) {
  const arr = getLevelArr(level.id);
  const done = arr.filter(Boolean).length;
  const pct = Math.round((done / MATERI_PER_LEVEL) * 100);
  $("#level-progress-fill").style.width = pct + "%";
  $("#level-progress-label").textContent = `${done}/${MATERI_PER_LEVEL} materi`;
}

function renderMateriRail(level) {
  const rail = $("#materi-rail");
  const arr = getLevelArr(level.id);
  rail.innerHTML = "";

  level.materi.forEach((m, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rail-item" + (idx === activeMateriIdx ? " active" : "") + (arr[idx] ? " done" : "");
    btn.innerHTML = `
      <span class="rail-num">${arr[idx] ? "✓" : idx + 1}</span>
      <span class="rail-type-icon">${TYPE_ICON[m.type]}</span>
      <span class="rail-title">${escapeHtml(m.title)}</span>
    `;
    btn.addEventListener("click", () => {
      activeMateriIdx = idx;
      renderMateriRail(level);
      renderMateriPanel(level);
    });
    rail.appendChild(btn);
  });
}

function renderMateriPanel(level) {
  const panel = $("#materi-panel");
  const m = level.materi[activeMateriIdx];
  const done = isMateriDone(level.id, activeMateriIdx);
  const isLast = activeMateriIdx === MATERI_PER_LEVEL - 1;

  let html = `
    <div class="materi-kicker">
      <span class="pill pill--${m.type}">${TYPE_ICON[m.type]} ${TYPE_LABEL[m.type]}</span>
      <span>materi ${activeMateriIdx + 1} / 13 · ~2 menit</span>
    </div>
    <h3 class="materi-h">${escapeHtml(m.title)}</h3>
  `;

  if (m.type === "reading") {
    html += `<div class="materi-body">${formatBody(m.body)}</div>`;
    if (m.code) html += `<div class="code-block">${escapeHtml(m.code)}</div>`;
    html += `
      <div class="materi-actions">
        <button class="btn-primary" id="btn-mark-done" type="button">${done ? (isLast ? "Selesai ✓" : "Lanjut →") : "Tandai selesai & lanjut"}</button>
      </div>
    `;
  } else if (m.type === "quiz") {
    html += `<div class="materi-body">${formatBody(m.q)}</div>`;
    html += `<div class="quiz-opts" id="quiz-opts">`;
    m.opts.forEach((opt, i) => {
      const letter = String.fromCharCode(65 + i);
      html += `
        <button class="quiz-opt" data-idx="${i}" type="button" ${done ? "disabled" : ""}>
          <span class="quiz-opt-letter">${letter}</span>
          <span>${escapeHtml(opt)}</span>
        </button>
      `;
    });
    html += `</div>`;
    html += `<div class="feedback" id="quiz-feedback"></div>`;
    html += `
      <div class="materi-actions">
        <button class="btn-primary" id="btn-quiz-continue" type="button" style="display:${done ? "inline-block" : "none"}">${isLast ? "Selesai ✓" : "Lanjut →"}</button>
        <button class="btn-ghost" id="btn-quiz-skip" type="button" style="display:${done ? "none" : "inline-block"}">Lewati materi ini</button>
      </div>
    `;
  } else if (m.type === "challenge") {
    html += `<div class="challenge-prompt">${formatBody(m.prompt)}</div>`;
    html += `<textarea class="code-input mono" id="code-input" spellcheck="false" ${done ? "readonly" : ""}>${escapeHtml(done ? (m._lastSubmission || m.starter) : m.starter)}</textarea>`;
    html += `<div class="challenge-hint" id="challenge-hint">💡 ${escapeHtml(m.hint)}</div>`;
    html += `<div class="feedback" id="challenge-feedback"></div>`;
    html += `
      <div class="materi-actions">
        <button class="btn-primary" id="btn-check" type="button" style="display:${done ? "none" : "inline-block"}">Cek jawaban</button>
        <button class="btn-secondary" id="btn-show-hint" type="button" style="display:${done ? "none" : "inline-block"}">Kasih hint</button>
        <button class="btn-ghost" id="btn-challenge-skip" type="button" style="display:${done ? "none" : "inline-block"}">Lewati materi ini</button>
        <button class="btn-primary" id="btn-challenge-continue" type="button" style="display:${done ? "inline-block" : "none"}">${isLast ? "Selesai ✓" : "Lanjut →"}</button>
      </div>
    `;
  }

  panel.innerHTML = html;
  wireMateriEvents(level, m, done);
}

function wireMateriEvents(level, m, done) {
  if (m.type === "reading") {
    $("#btn-mark-done").addEventListener("click", () => {
      completeMateri(level, true);
    });
  } else if (m.type === "quiz") {
    if (!done) {
      $all(".quiz-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const correct = idx === m.ans;
          $all(".quiz-opt").forEach((b) => (b.disabled = true));
          btn.classList.add(correct ? "correct" : "wrong");
          if (!correct) {
            const correctBtn = $(`.quiz-opt[data-idx="${m.ans}"]`);
            if (correctBtn) correctBtn.classList.add("correct");
          }
          const fb = $("#quiz-feedback");
          fb.className = "feedback show " + (correct ? "ok" : "bad");
          fb.textContent = correct ? "Betul! Mantap." : "Belum tepat, tapi lihat jawaban yang benar di atas ya.";
          $("#btn-quiz-continue").style.display = "inline-block";
          $("#btn-quiz-skip").style.display = "none";
          completeMateri(level, false);
        });
      });
      const skipBtn = $("#btn-quiz-skip");
      if (skipBtn) skipBtn.addEventListener("click", () => completeMateri(level, true));
    }
    const cont = $("#btn-quiz-continue");
    if (cont) cont.addEventListener("click", () => goNextMateri(level));
  } else if (m.type === "challenge") {
    if (!done) {
      $("#btn-show-hint").addEventListener("click", () => {
        $("#challenge-hint").classList.toggle("show");
      });
      $("#btn-check").addEventListener("click", () => {
        const val = $("#code-input").value;
        const result = checkChallenge(val, m);
        const fb = $("#challenge-feedback");
        fb.className = "feedback show " + (result.pass ? "ok" : "bad");
        fb.textContent = result.message;
        if (result.pass) {
          m._lastSubmission = val;
          $("#btn-check").style.display = "none";
          $("#btn-show-hint").style.display = "none";
          $("#btn-challenge-skip").style.display = "none";
          $("#code-input").readOnly = true;
          $("#btn-challenge-continue").style.display = "inline-block";
          completeMateri(level, false);
        }
      });
      const skip2 = $("#btn-challenge-skip");
      if (skip2) skip2.addEventListener("click", () => completeMateri(level, true));
    }
    const cont2 = $("#btn-challenge-continue");
    if (cont2) cont2.addEventListener("click", () => goNextMateri(level));
  }
}

function checkChallenge(code, m) {
  const lower = code.toLowerCase();
  const missing = (m.requiredTokens || []).filter((tok) => tok && !lower.includes(tok.toLowerCase()));
  if (m.minLength && code.trim().length < m.minLength) {
    return { pass: false, message: `Kodenya kayaknya masih terlalu pendek, coba dikembangin sedikit lagi.` };
  }
  if (missing.length > 0) {
    return { pass: false, message: `Belum ketemu nih: "${missing.join('", "')}". Coba cek lagi kodenya.` };
  }
  return { pass: true, message: "Kerja bagus! Kodenya sudah sesuai." };
}

function completeMateri(level, autoRerender) {
  const arr = getLevelArr(level.id);
  const wasDone = arr[activeMateriIdx];
  arr[activeMateriIdx] = true;
  saveState();
  renderMateriRail(level);
  renderLevelProgress(level);
  renderTopbarStats();

  if (autoRerender) {
    if (activeMateriIdx === MATERI_PER_LEVEL - 1) {
      renderMateriPanel(level);
      maybeShowLevelComplete(level);
    } else {
      goNextMateri(level);
    }
  } else {
    renderMateriPanel(level);
  }

  if (!wasDone && activeMateriIdx === MATERI_PER_LEVEL - 1 && isLevelDone(level.id)) {
    maybeShowLevelComplete(level);
  }
}

function goNextMateri(level) {
  if (activeMateriIdx < MATERI_PER_LEVEL - 1) {
    activeMateriIdx += 1;
    renderMateriRail(level);
    renderMateriPanel(level);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    maybeShowLevelComplete(level);
  }
}

function maybeShowLevelComplete(level) {
  if (!isLevelDone(level.id)) return;
  const overlay = $("#complete-overlay");
  const hasNext = level.id < 100;
  $("#complete-text").textContent = hasNext
    ? `Kamu menyelesaikan semua 13 materi di Level ${level.id}: ${level.title}. Level berikutnya sudah terbuka!`
    : `Kamu menyelesaikan semua 13 materi di Level ${level.id}: ${level.title}. Selamat, kamu sudah menyelesaikan seluruh roadmap CodeQuest! 🎉`;
  $("#btn-complete-next").style.display = hasNext ? "inline-block" : "none";
  overlay.classList.remove("overlay-hidden");
}

/* ---------------- Global events ---------------- */

function init() {
  $("#btn-home").addEventListener("click", showRoadmap);
  $("#btn-back").addEventListener("click", showRoadmap);

  $("#btn-reset").addEventListener("click", () => {
    if (confirm("Yakin mau reset semua progres belajar? Ini nggak bisa dibatalkan.")) {
      state = { completed: {} };
      saveState();
      showRoadmap();
    }
  });

  $("#btn-complete-roadmap").addEventListener("click", () => {
    $("#complete-overlay").classList.add("overlay-hidden");
    showRoadmap();
  });

  $("#btn-complete-next").addEventListener("click", () => {
    $("#complete-overlay").classList.add("overlay-hidden");
    const nextId = Math.min(activeLevelId + 1, 100);
    openLevel(nextId);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!$("#roadmap-view").classList.contains("view-hidden")) renderRoadmap();
    }, 200);
  });

  showRoadmap();
}

document.addEventListener("DOMContentLoaded", init);

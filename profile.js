/* =========================================================
   CodeQuest — Profile page logic
   Identitas (nama & avatar) disimpan lewat common.js supaya
   langsung kepakai sebagai sapaan di topbar index.html.
   ========================================================= */

function renderProfileHeader(s) {
  $("#profile-avatar").textContent = s.avatar || "🧑‍💻";
  $("#input-username").value = s.username || "";

  const doneLevels = countCompletedLevels();
  const materi = countCompletedMateri();
  const sub =
    materi === 0
      ? `Level ${currentLevelId()} · Belum ada materi selesai`
      : `Level ${currentLevelId()} · ${doneLevels} level & ${materi} materi selesai`;
  $("#profile-sub").textContent = sub;
}

function renderAvatarPicker(s) {
  const row = $("#avatar-row");
  row.innerHTML = "";
  AVATAR_CHOICES.forEach((emo) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "avatar-btn" + (s.avatar === emo ? " active" : "");
    btn.textContent = emo;
    btn.addEventListener("click", () => {
      const next = saveSettings({ avatar: emo });
      renderAvatarPicker(next);
      renderProfileHeader(next);
      showToast("Avatar diganti ✓");
    });
    row.appendChild(btn);
  });
}

function renderProfileStats() {
  const totalMateri = LEVELS.length * MATERI_PER_LEVEL;
  const materi = countCompletedMateri();
  const pct = Math.round((materi / totalMateri) * 100);

  $("#sum-level").textContent = currentLevelId();
  $("#sum-levels-done").textContent = countCompletedLevels();
  $("#sum-materi").textContent = materi;
  $("#sum-xp").textContent = computeXp();

  $("#profile-progress-fill").style.width = pct + "%";
  $("#profile-progress-label").textContent = `${pct}% roadmap selesai (${materi}/${totalMateri} materi)`;
}

function renderBadges() {
  const grid = $("#badge-grid");
  grid.innerHTML = "";
  WORLDS.forEach((world) => {
    const done = isWorldDone(world.id);
    const worldLevels = LEVELS.filter((l) => l.world === world.id);
    const doneCount = worldLevels.filter((l) => isLevelDone(l.id)).length;

    const el = document.createElement("div");
    el.className = "badge" + (done ? "" : " locked");
    el.innerHTML = `
      <div class="badge-emoji">${world.emoji}</div>
      <div>
        <div class="badge-name">${escapeHtml(world.name)}</div>
        <div class="badge-status">${done ? "Selesai ✓" : `${doneCount}/${worldLevels.length} level`}</div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function initProfilePage() {
  let s = loadSettings();

  renderProfileHeader(s);
  renderAvatarPicker(s);
  renderProfileStats();
  renderBadges();

  let saveTimer;
  $("#input-username").addEventListener("input", (e) => {
    clearTimeout(saveTimer);
    const val = e.target.value.trim();
    saveTimer = setTimeout(() => {
      s = saveSettings({ username: val });
      renderProfileHeader(s);
      showToast("Nama disimpan ✓");
    }, 400);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applySettings();
  initProfilePage();
});
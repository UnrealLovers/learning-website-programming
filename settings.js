/* =========================================================
   CodeQuest — Settings page logic
   Baca/tulis lewat common.js (loadSettings/saveSettings/
   exportProgressFile/importProgressFile/resetAllProgress)
   supaya selalu sinkron dengan index.html & profile.html.
   ========================================================= */

function renderFontSizePills(s) {
  $all("#fontsize-group .pill-opt").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.val === s.fontSize);
  });
}

function renderSwatches(s) {
  const row = $("#swatch-row");
  row.innerHTML = "";
  Object.entries(ACCENT_COLORS).forEach(([key, hex]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch" + (s.accent === key ? " active" : "");
    btn.style.background = hex;
    btn.title = key;
    btn.addEventListener("click", () => {
      saveSettings({ accent: key });
      renderSwatches(loadSettings());
      showToast("Warna aksen diganti ✓");
    });
    row.appendChild(btn);
  });
}

function renderGoal(s) {
  $("#goal-val").textContent = `${s.dailyGoal} materi`;
}

function initSettingsForm() {
  let s = loadSettings();

  renderFontSizePills(s);
  renderSwatches(s);
  renderGoal(s);

  $("#toggle-motion").checked = !!s.reduceMotion;
  $("#toggle-sound").checked = !!s.soundEnabled;

  $all("#fontsize-group .pill-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      s = saveSettings({ fontSize: btn.dataset.val });
      renderFontSizePills(s);
      showToast("Ukuran teks diganti ✓");
    });
  });

  $("#toggle-motion").addEventListener("change", (e) => {
    saveSettings({ reduceMotion: e.target.checked });
    showToast(e.target.checked ? "Animasi dikurangi ✓" : "Animasi dinormalkan ✓");
  });

  $("#toggle-sound").addEventListener("change", (e) => {
    saveSettings({ soundEnabled: e.target.checked });
    if (e.target.checked) playChime("correct");
    showToast(e.target.checked ? "Efek suara dinyalakan ✓" : "Efek suara dimatikan ✓");
  });

  $("#goal-minus").addEventListener("click", () => {
    s = saveSettings({ dailyGoal: Math.max(1, appSettings.dailyGoal - 1) });
    renderGoal(s);
    showToast("Target harian disimpan ✓");
  });
  $("#goal-plus").addEventListener("click", () => {
    s = saveSettings({ dailyGoal: Math.min(13, appSettings.dailyGoal + 1) });
    renderGoal(s);
    showToast("Target harian disimpan ✓");
  });

  $("#btn-export").addEventListener("click", () => {
    exportProgressFile();
    showToast("File progres diunduh ✓");
  });

  $("#btn-import").addEventListener("click", () => $("#import-file-input").click());
  $("#import-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importProgressFile(file, (ok, err) => {
      if (ok) {
        showToast("Progres berhasil diimpor ✓");
      } else {
        showToast("Gagal impor: " + (err || "file tidak valid"));
      }
      e.target.value = "";
    });
  });

  $("#btn-reset-progress").addEventListener("click", () => {
    if (confirm("Yakin mau reset semua progres belajar? Ini nggak bisa dibatalkan.")) {
      resetAllProgress();
      showToast("Semua progres direset");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applySettings();
  initSettingsForm();
});
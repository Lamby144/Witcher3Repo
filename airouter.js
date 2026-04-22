const AIRouter = {

/* =========================
   🎯 INITIALISE UI LOOP
========================= */

init() {
  this.updateUI();

  // live refresh loop (feels like "AI thinking")
  setInterval(() => this.updateUI(), 1000);
},

/* =========================
   🧠 MAIN UPDATE FUNCTION
========================= */

updateUI() {

  const next = RouteEngine.getNextAction();
  const progress = RouteEngine.getProgress();

  /* =========================
     🎯 NEXT ACTION DISPLAY
  ========================= */

  const nextEl = document.getElementById("nextTask");

  if (nextEl) {
    nextEl.innerHTML = `
      <div class="next-card">
        <h3>${next.name || next.text}</h3>
        <p>Type: ${next.type || "objective"}</p>
        <p>Region: ${next.regionName || "Endgame"}</p>
      </div>
    `;
  }

  /* =========================
     📊 PROGRESS BAR
  ========================= */

  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");

  if (fill) fill.style.width = progress + "%";
  if (text) text.innerText = progress + "% Complete";

  /* =========================
     ⚠️ WARNINGS SYSTEM
  ========================= */

  const warningsEl = document.getElementById("warnings");

  if (warningsEl && next.region) {
    const regionRules = RouteEngine.getWarnings(next.region);

    warningsEl.innerHTML = regionRules
      .map(w => `<div class="warning">⚠️ ${w}</div>`)
      .join("");
  }

},

/* =========================
   🔍 MANUAL TRIGGER (OPTIONAL)
========================= */

refresh() {
  this.updateUI();
}

};

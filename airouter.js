const AIRouter = {
  init() {
    this.updateUI();
    setInterval(() => this.updateUI(), 2500);
  },

  updateUI() {
    const next = RouteEngine.getNextAction();
    const progress = RouteEngine.getProgress();

    // Next action
    const nextEl = document.getElementById("nextTask");
    if (nextEl) {
      nextEl.innerHTML = `
        <div class="next-card">
          <h3>${next.name || next.text || "Next objective"}</h3>
          <p>Type: ${next.type || "objective"}</p>
          <p>Region: ${next.regionName || "Endgame"}</p>
        </div>
      `;
    }

    // Progress
    const fill = document.getElementById("progressFill");
    const text = document.getElementById("progressText");
    if (fill) fill.style.width = progress + "%";
    if (text) text.innerText = `${progress}% Complete`;

    // Warnings
    const warningsEl = document.getElementById("warnings");
    if (warningsEl && next.region) {
      const regionRules = RouteEngine.getWarnings(next.region);
      warningsEl.innerHTML = regionRules
        .map(w => `<div class="warning">⚠️ ${w}</div>`)
        .join("");
    } else if (warningsEl) {
      warningsEl.innerHTML = "";
    }
  },

  refresh() {
    this.updateUI();
  }
};

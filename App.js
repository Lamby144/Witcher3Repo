/* =========================
   🧠 INITIAL SETUP
========================= */

const app = document.getElementById("app");

/* =========================
   📦 RENDER FULL ROUTE
========================= */

function renderApp() {
  app.innerHTML = "";

  GAME_DATA.route.forEach(region => {

    const section = document.createElement("div");
    section.className = "section";

    const header = document.createElement("h2");
    header.innerText = region.name + " (" + region.level + ")";

    const content = document.createElement("div");
    content.className = "content";

    /* =========================
       🧭 TOGGLE OPEN/CLOSE
    ========================= */

    header.onclick = () => {
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    };

    /* =========================
       📋 TASK LIST
    ========================= */

    region.quests.forEach(task => {

      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      // load saved state
      checkbox.checked = localStorage.getItem(task.id) === "done";

      /* =========================
         ✔ TOGGLE COMPLETE
      ========================= */

      checkbox.onchange = () => {
        if (checkbox.checked) {
          localStorage.setItem(task.id, "done");
        } else {
          localStorage.removeItem(task.id);
        }

        // refresh AI instantly
        AIRouter.updateUI();
      };

      /* =========================
         🧾 LABEL TEXT
      ========================= */

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + task.name));

      /* =========================
         ⚠ MISSABLE HIGHLIGHT
      ========================= */

      if (task.missable) {
        label.style.color = "#ff5555";
        label.title = "⚠ MISSABLE CONTENT";
      }

      content.appendChild(label);
    });

    section.appendChild(header);
    section.appendChild(content);
    app.appendChild(section);
  });
}

/* =========================
   🔍 SEARCH FUNCTION
========================= */

document.getElementById("search").addEventListener("input", (e) => {

  const value = e.target.value.toLowerCase();

  document.querySelectorAll("label").forEach(label => {
    label.style.display =
      label.innerText.toLowerCase().includes(value)
        ? "block"
        : "none";
  });

});

/* =========================
   🚀 INIT APP
========================= */

renderApp();

/* start AI system */
AIRouter.init(); Sent from my iPhone

Begin forwarded message:

From: Matthew Lamb <mattylamb6@gmail.com>
Date: 22 April 2026 at 3:06:00 pm BST
To: Matthew Lamb <Matthew.Lamb1@amey.co.uk>
Subject: Fwd: Uni GitHub Test for DevOps5

﻿
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

}; Sent from my iPhone

Begin forwarded message:

From: Matthew Lamb <mattylamb6@gmail.com>
Date: 22 April 2026 at 3:03:54 pm BST
To: Matthew Lamb <Matthew.Lamb1@amey.co.uk>
Subject: Fwd: Uni GitHub Test for DevOps3

﻿
const RouteEngine = {

/* =========================
   🎯 GET ALL TASKS FLATTENED
========================= */

getAllTasks() {
  return GAME_DATA.route.flatMap(region =>
    region.quests.map(q => ({
      ...q,
      region: region.id,
      regionName: region.name,
      priority: this.getPriority(q, region)
    }))
  );
},

/* =========================
   ⚖️ PRIORITY SYSTEM (CORE AI LOGIC)
========================= */

getPriority(task, region) {
  let score = 0;

  // 🚨 MISSABLE BOOST (VERY IMPORTANT)
  if (task.missable) score += 200;

  // 🃏 GWENT PRIORITY
  if (task.type === "gwent") score += 120;

  // 🧭 MAIN STORY BALANCE
  if (task.type === "main") score += 80;

  // ⚠️ REGION RISK ZONES
  if (region.priority === "CRITICAL") score += 100;

  if (region.priority === "CRITICAL_FINAL_CHECK") score += 150;

  // 🧠 EARLY GAME BOOST
  if (region.id === "white-orchard") score += 50;

  return score;
},

/* =========================
   🎯 GET NEXT BEST ACTION
========================= */

getNextAction() {
  const all = this.getAllTasks();

  const remaining = all.filter(t => !this.isDone(t.id));

  remaining.forEach(t => {
    t.score = this.getPriority(t, GAME_DATA.route.find(r => r.id === t.region));
  });

  remaining.sort((a, b) => b.score - a.score);

  return remaining[0] || {
    name: "🏆 PLATINUM COMPLETE",
    type: "complete"
  };
},

/* =========================
   ✔ COMPLETION CHECK
========================= */

isDone(id) {
  return localStorage.getItem(id) === "done";
},

/* =========================
   📊 PROGRESS CALCULATION
========================= */

getProgress() {
  const all = this.getAllTasks();
  const done = all.filter(t => this.isDone(t.id));

  return Math.round((done.length / all.length) * 100);
},

/* =========================
   ⚠️ MISSABLE WARNING SYSTEM
========================= */

getWarnings(currentRegionId) {
  const region = GAME_DATA.route.find(r => r.id === currentRegionId);

  if (!region) return [];

  return region.rules || [];
}

};

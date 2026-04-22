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

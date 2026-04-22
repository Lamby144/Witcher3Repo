const RouteEngine = {
  /* =========================
     🃏 GWENT TASKS (supports 2 modes)
     - Mode 1: GwentStore.cards (runtime loaded full dataset)
     - Mode 2: GWENT_DATA (your current gwent.js object)
  ========================= */

  getGwentTasks() {
    // Mode 1: runtime loaded dataset
    if (typeof GwentStore !== "undefined" && Array.isArray(GwentStore.cards) && GwentStore.cards.length) {
      return GwentStore.cards.map(card => ({
        id: card.id,
        name: `🃏 ${card.name}${card.deck ? ` (${card.deck})` : ""}`,
        type: "gwent",
        missable: !!card.missable,
        expansion: card.expansion || "Base game",
        region: this.mapTerritoryToRegionId(card.territory, card.expansion),
        regionName: this.mapTerritoryToRegionName(card.territory, card.expansion),
        meta: {
          obtainType: card.obtainType || "",
          details: card.details || "",
          territory: card.territory || "",
          deck: card.deck || ""
        }
      }));
    }

    // Mode 2: local GWENT_DATA object (your current gwent.js)
    if (typeof GWENT_DATA === "undefined") return [];

    return Object.keys(GWENT_DATA).flatMap(faction =>
      (GWENT_DATA[faction] || []).map(card => ({
        id: card.id,
        name: `🃏 ${card.name}`,
        type: "gwent",
        missable: !!card.missable,
        expansion: card.expansion || "Base game",
        region: this.mapTerritoryToRegionId(card.region, card.expansion),
        regionName: this.mapTerritoryToRegionName(card.region, card.expansion),
        meta: {
          source: card.source || "",
          faction
        }
      }))
    );
  },

  /* =========================
     🗺️ MAP TERRITORY -> YOUR SECTIONS
  ========================= */

  mapTerritoryToRegionId(territory, expansion) {
    const t = String(territory || "").toLowerCase();
    const e = String(expansion || "").toLowerCase();

    // DLC buckets
    if (e.includes("hearts")) return "dlc_hos";
    if (e.includes("blood")) return "dlc_baw";

    // Base game regions
    if (t.includes("white orchard")) return "white-orchard";
    if (t.includes("velen")) return "velen";
    if (t.includes("novigrad")) return "novigrad";
    if (t.includes("skellige")) return "skellige";

    return "misc";
  },

  mapTerritoryToRegionName(territory, expansion) {
    const e = String(expansion || "").toLowerCase();

    if (e.includes("hearts")) return "DLC – Hearts of Stone";
    if (e.includes("blood")) return "DLC – Blood and Wine";

    return territory || "Other";
  },

  /* =========================
     🎯 GET ALL TASKS (quests + gwent)
  ========================= */

  getAllTasks() {
    const routeTasks = GAME_DATA.route.flatMap(region =>
      region.quests.map(q => ({
        ...q,
        region: region.id,
        regionName: region.name,
        priority: this.getPriority(q, region)
      }))
    );

    const gwentTasks = this.getGwentTasks().map(t => ({
      ...t,
      priority: 120 + (t.missable ? 200 : 0) // keep your weighting
    }));

    return [...routeTasks, ...gwentTasks];
  },

  /* =========================
     ⚖️ PRIORITY SYSTEM
  ========================= */

  getPriority(task, region) {
    let score = 0;

    if (task.missable) score += 200;
    if (task.type === "gwent") score += 120;
    if (task.type === "main") score += 80;

    // region can be missing for some tasks, so guard it
    if (region && region.priority === "CRITICAL") score += 100;
    if (region && region.priority === "CRITICAL_FINAL_CHECK") score += 150;

    if (region && region.id === "white-orchard") score += 50;

    return score;
  },

  /* =========================
     🎯 NEXT BEST ACTION
  ========================= */

  getNextAction() {
    const remaining = this.getAllTasks().filter(t => !this.isDone(t.id));
    remaining.sort((a, b) => (b.priority || 0) - (a.priority || 0));

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
     📊 PROGRESS
  ========================= */

  getProgress() {
    const all = this.getAllTasks();
    if (!all.length) return 0;

    const done = all.filter(t => this.isDone(t.id));
    return Math.round((done.length / all.length) * 100);
  },

  /* =========================
     ⚠️ WARNINGS
  ========================= */

  getWarnings(currentRegionId) {
    const region = GAME_DATA.route.find(r => r.id === currentRegionId);
    return region?.rules || [];
  }
};

const RouteEngine = {
  // Turn GWENT_DATA into "tasks" so it works with the route engine + UI
  getGwentTasks() {
    if (typeof GWENT_DATA === "undefined") return [];

    const factions = Object.keys(GWENT_DATA);
    const cards = factions.flatMap(faction => GWENT_DATA[faction]);

    return cards.map(card => ({
      id: card.id,
      name: `🃏 ${card.name}`,
      type: "gwent",
      missable: !!card.missable,
      region: "gwent",
      regionName: "Gwent Cards",
      meta: {
        source: card.source,
        faction
      }
    }));
  },

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
      priority: 120 + (t.missable ? 200 : 0) // keeps your priority logic
    }));

    return [...routeTasks, ...gwentTasks];
  },

  getPriority(task, region) {
    let score = 0;

    if (task.missable) score += 200;
    if (task.type === "gwent") score += 120;
    if (task.type === "main") score += 80;

    if (region.priority === "CRITICAL") score += 100;
    if (region.priority === "CRITICAL_FINAL_CHECK") score += 150;

    if (region.id === "white-orchard") score += 50;

    return score;
  },

  getNextAction() {
    const remaining = this.getAllTasks().filter(t => !this.isDone(t.id));
    remaining.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return remaining[0] || {
      name: "🏆 PLATINUM COMPLETE",
      type: "complete"
    };
  },

  isDone(id) {
    return localStorage.getItem(id) === "done";
  },

  getProgress() {
    const all = this.getAllTasks();
    if (!all.length) return 0;
    const done = all.filter(t => this.isDone(t.id));
    return Math.round((done.length / all.length) * 100);
  },

  getWarnings(currentRegionId) {
    // For GWENT region, no rules unless you add them later
    const region = GAME_DATA.route.find(r => r.id === currentRegionId);
    return region?.rules || [];
  }
};

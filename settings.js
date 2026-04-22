const Settings = {
  key: "witcher3_settings",

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.key) || "{}");
    } catch {
      return {};
    }
  },

  set(patch) {
    const current = this.get();
    const next = { ...current, ...patch };
    localStorage.setItem(this.key, JSON.stringify(next));
    return next;
  },

  initUI() {
    const saved = this.get();

    const difficulty = document.getElementById("difficulty");
    if (difficulty) {
      difficulty.value = saved.difficulty || "deathmarch";
      difficulty.addEventListener("change", () => {
        this.set({ difficulty: difficulty.value });
        if (typeof AIRouter !== "undefined") AIRouter.refresh();
      });
    }

    const storyStage = document.getElementById("storyStage");
    if (storyStage) {
      storyStage.value = saved.storyStage || "early";
      storyStage.addEventListener("change", () => {
        this.set({ storyStage: storyStage.value });
        if (typeof AIRouter !== "undefined") AIRouter.refresh();
      });
    }
  }
};

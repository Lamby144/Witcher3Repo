const GwentStore = {
  cards: [],
  loaded: false,
  // Community checklist JSON endpoint
  sourceUrl: "https://gwentcards.github.io/cards.json",

  async load() {
    const res = await fetch(this.sourceUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load Gwent dataset: " + res.status);
    const json = await res.json();

    const cards = json.cards || [];
    this.cards = cards.map((c, idx) => ({
      id: `gw_${idx}_${slugify(c.name)}_${slugify(c.deck)}_${slugify(c.expansion)}`,
      name: c.name,
      type: "gwent",
      expansion: c.expansion || "Base game",
      deck: c.deck || "Unknown",
      territory: c.territory || "Unknown",
      obtainType: c.type || "",
      details: c.details || "",
      missable: false // dataset doesn't always label missable reliably; we keep missables via warning logic + trophy missables
    }));

    this.loaded = true;
    return this.cards;
  }
};

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

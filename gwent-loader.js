// gwent-loader.js
const GwentStore = {
  cards: [],
  loaded: false,
  sourceUrl: "https://gwentcards.github.io/cards.json", // public JSON endpoint [8](https://gwentcards.github.io/cards.json)

  async load() {
    const res = await fetch(this.sourceUrl);
    if (!res.ok) throw new Error("Failed to load Gwent dataset: " + res.status);
    const json = await res.json();

    // Expected shape: { cards: [...] } [8](https://gwentcards.github.io/cards.json)
    const cards = json.cards || [];

    // Normalise into a structure your app understands
    this.cards = cards.map((c, idx) => ({
      id: `gw_${idx}_${slugify(c.name)}_${slugify(c.deck)}_${slugify(c.expansion)}`,
      name: c.name,
      type: "gwent",
      missable: /missable/i.test(c.details || "") ? true : false, // not perfect but usable
      expansion: c.expansion || "Base game",
      deck: c.deck || "Unknown",
      territory: c.territory || "Unknown",
      obtainType: c.type || "",
      details: c.details || "",
      picture: c.picture || ""
    }));

    this.loaded = true;
    return this.cards;
  }
};

// helper: stable ids
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

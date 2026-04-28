/* Witcher 3 – Ultimate Platinum Checklist
   - Main checklist is defined in CHECKLIST
   - Gwent cards are loaded from data/cards.json
   - Tick state persists in localStorage
*/

const LS_PREFIX = "w3check:";
const LS_VERSION = "v1";

// -----------------------------
// 1) Your main checklist content
// -----------------------------
const CHECKLIST = [
  {
    id: "global-rules",
    title: "⚙️ Global Rules",
    open: true,
    items: [
      { text: "Start on Death March (do not lower until finished)" },
      { text: "Enable: Enemy Upscaling / Auto Oils / Quick Casting" },
      { text: "Manual save before EVERY main quest" },
      { text: "Always do side quests BEFORE main quests" },
      { text: "Play EVERY Gwent player immediately" },
      { text: "Buy EVERY Gwent card when seen" },
    ]
  },
  {
    id: "romance",
    title: "❤️ Romance Tracker",
    open: false,
    groups: [
      {
        title: "🚫 Triss (DO NOT ROMANCE)",
        warn: true,
        items: [
          { text: "Let Triss Merigold leave" },
          { text: "Do NOT say “I love you”" },
          { text: "Do NOT ask her to stay" }
        ]
      },
      {
        title: "💜 Yennefer (LOCK IN)",
        items: [
          { text: "Tell Yennefer “I still love you”" },
          { text: "Do NOT romance both" }
        ]
      }
    ]
  },
  {
    id: "white-orchard",
    title: "🌿 White Orchard (Lv 1–4)",
    open: false,
    groups: [
      {
        title: "World",
        items: [
          { text: "All quests complete" },
          { text: "All ? cleared" },
          { text: "All Places of Power" }
        ]
      },
      {
        title: "🃏 Gwent",
        items: [
          { text: "Tutorial win" },
          { text: "Beat Scholar (MISSABLE)" },
          { text: "Buy all cards" }
        ]
      }
    ]
  },
  {
    id: "velen",
    title: "🪵 Velen (Lv 5–15)",
    open: false,
    groups: [
      { title: "⚠️ Keira", warn: true, items: [
        { text: "Help Keira Metz" },
        { text: "Send to Kaer Morhen" },
      ]},
      { title: "⚠️ Baron", warn: true, items: [
        { text: "Complete full questline" }
      ]},
      { title: "🃏 Gwent", items: [
        { text: "All players beaten" },
        { text: "All cards bought" }
      ]},
      { title: "World", items: [
        { text: "Contracts complete" },
        { text: "Side quests complete" }
      ]}
    ]
  },
  {
    id: "novigrad",
    title: "🏙️ Novigrad (Lv 10–18)",
    open: false,
    groups: [
      { title: "Main", items: [
        { text: "Confirm Triss not romanced" }
      ]},
      { title: "🃏 Gwent Quests", items: [
        { text: "Big City Players" },
        { text: "A Dangerous Game" },
        { text: "All players beaten" },
        { text: "All cards bought" }
      ]},
      { title: "World", items: [
        { text: "All side quests complete" }
      ]}
    ]
  },
  {
    id: "skellige",
    title: "🏔️ Skellige (Lv 16–25)",
    open: false,
    groups: [
      { title: "Main", items: [
        { text: "Support Cerys an Craite" },
        { text: "Confirm Yen romance" }
      ]},
      { title: "🃏 Gwent", items: [
        { text: "All players beaten" },
        { text: "All cards bought" }
      ]},
      { title: "World", items: [
        { text: "Side quests complete" },
        { text: "Contracts complete" }
      ]}
    ]
  },
  {
    id: "kaer-morhen",
    title: "🏰 Kaer Morhen",
    open: false,
    items: [
      { text: "All quests complete" },
      { text: "All Gwent done" },
      { text: "All allies recruited" },
      { text: "Backup save created" }
    ]
  },
  {
    id: "final-act",
    title: "❄️ Final Act",
    open: false,
    groups: [
      { title: "🎯 Ciri Best Ending", items: [
        { text: "Snowball fight" },
        { text: "Let her decide" },
        { text: "Let her trash lab" },
        { text: "Visit grave" },
        { text: "Encourage her" },
        { text: "Finish game on Death March" }
      ]}
    ]
  },
  {
    id: "gwent-master",
    title: "🃏 Gwent Master",
    open: false,
    groups: [
      { title: "Quests", items: [
        { text: "Collect ‘Em All" },
        { text: "Velen Players" },
        { text: "Big City Players" },
        { text: "Old Pals" },
        { text: "A Dangerous Game" },
        { text: "Skellige Style" }
      ]},
      { title: "Regions", items: [
        { text: "White Orchard complete" },
        { text: "Velen complete" },
        { text: "Novigrad complete" },
        { text: "Skellige complete" }
      ]},
      { title: "Rules", items: [
        { text: "No failed Gwent quests" },
        { text: "All cards collected" }
      ]}
    ]
  },
  {
    id: "cleanup",
    title: "🏆 Cleanup",
    open: false,
    items: [
      { text: "Combat trophies complete" },
      { text: "Contracts complete" },
      { text: "Side quests complete" }
    ]
  },
  {
    id: "dlc",
    title: "🩸 DLC",
    open: false,
    items: [
      { text: "Hearts of Stone complete" },
      { text: "Blood and Wine complete" }
    ]
  },
  {
    id: "daily-session",
    title: "🎮 Daily Session Checklist",
    open: false,
    groups: [
      { title: "During play", items: [
        { text: "Check quest level vs your level" },
        { text: "Do ALL side quests first" },
        { text: "Play nearby Gwent players" },
        { text: "Visit merchants for cards" },
        { text: "Complete nearby contracts" }
      ]},
      { title: "Before logging off", items: [
        { text: "Manual save" },
        { text: "Check Gwent progress" },
        { text: "Check for missed quests" }
      ]}
    ]
  },
  {
    id: "gwent-easy-win",
    title: "♠️ Gwent – Easy Win Setup",
    open: false,
    groups: [
      { title: "Deck", items: [
        { text: "Use Northern Realms" },
        { text: "Keep deck ~22 cards" },
        { text: "Remove weak cards" }
      ]},
      { title: "Priority cards", items: [
        { text: "Spy cards" },
        { text: "Decoys" },
        { text: "Medics" },
        { text: "Tight Bond" }
      ]},
      { title: "Strategy", items: [
        { text: "Round 1: Use spies / Gain card advantage" },
        { text: "Round 2: Force opponent to waste cards" },
        { text: "Round 3: Play strongest combo / Use leader ability" }
      ]}
    ]
  },
  {
    id: "op-build",
    title: "⚔️ OP Build Guide",
    open: false,
    groups: [
      { title: "Level 1–10", items: [
        { text: "Muscle Memory" },
        { text: "Resolve" },
        { text: "Exploding Shield" }
      ]},
      { title: "Level 10–20", items: [
        { text: "Precise Blows" },
        { text: "Fleet Footed" },
        { text: "Better Quen" }
      ]},
      { title: "Level 20–30", items: [
        { text: "Whirl" },
        { text: "Rage Management" },
        { text: "Active Shield" }
      ]},
      { title: "Level 30+", items: [
        { text: "Max fast attacks" },
        { text: "Max Quen" },
        { text: "Add alchemy" }
      ]},
      { title: "Potions", items: [
        { text: "Swallow" },
        { text: "Thunderbolt" },
        { text: "Tawny Owl" }
      ]},
      { title: "Playstyle", items: [
        { text: "Quen always active" },
        { text: "Dodge > roll" },
        { text: "Fast attacks" },
        { text: "Oils active" }
      ]}
    ]
  },
  {
    id: "final-safety",
    title: "📊 Final Safety Tracker",
    open: false,
    items: [
      { text: "Keira alive" },
      { text: "Cerys ruler" },
      { text: "Ciri best ending" },
      { text: "Yen romance locked" },
      { text: "No failed Gwent" }
    ]
  },
  {
    id: "save-tracker",
    title: "💾 Save Tracker",
    open: false,
    items: [
      { text: "Pre-Kaer Morhen save" },
      { text: "Pre-final act save" },
      { text: "Multiple rotating saves" }
    ]
  },
  {
    id: "final-rules",
    title: "💡 Final Rules",
    open: false,
    items: [
      { text: "Don’t rush story" },
      { text: "Gwent early = easy" },
      { text: "Save before big choices" },
      { text: "If unsure → STOP and check" }
    ]
  }
];

// Helpers to flatten checklist for progress calc
function getStorageKey(id) {
  return `${LS_PREFIX}${LS_VERSION}:${id}`;
}

function safeId(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadBool(key, fallback = false) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "1";
}

function saveBool(key, val) {
  localStorage.setItem(key, val ? "1" : "0");
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// -----------------------------
// 2) Render main checklist
// -----------------------------
function buildNav() {
  const nav = document.getElementById("navLinks");
  nav.innerHTML = "";
  for (const section of CHECKLIST) {
    const a = document.createElement("a");
    a.href = `#sec-${section.id}`;
    a.textContent = section.title;
    nav.appendChild(a);
  }
  const a2 = document.createElement("a");
  a2.href = "#gwentSection";
  a2.textContent = "🃏 Gwent Cards";
  nav.appendChild(a2);
}

function sectionItems(section) {
  const arr = [];
  if (section.items) arr.push(...section.items);
  if (section.groups) {
    for (const g of section.groups) arr.push(...(g.items || []));
  }
  return arr;
}

function computeSectionProgress(section) {
  const items = sectionItems(section);
  let done = 0;
  for (let i = 0; i < items.length; i++) {
    const key = getStorageKey(`task:${section.id}:${i}`);
    if (loadBool(key)) done++;
  }
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
}

function renderChecklist() {
  const root = document.getElementById("checklistRoot");
  root.innerHTML = "";

  for (const section of CHECKLIST) {
    const wrapper = document.createElement("section");
    wrapper.className = "card section";
    wrapper.id = `sec-${section.id}`;
    wrapper.dataset.open = section.open ? "true" : "false";

    const { done, total, pct } = computeSectionProgress(section);

    const head = document.createElement("div");
    head.className = "section__head";

    const title = document.createElement("div");
    title.className = "section__title";
    title.innerHTML = `<h2>${section.title}</h2><div class="muted small">${done} / ${total} complete</div>`;

    const meta = document.createElement("div");
    meta.className = "section__meta";

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = `${pct}%`;

    meta.appendChild(badge);
    head.appendChild(title);
    head.appendChild(meta);

    const body = document.createElement("div");
    body.className = "section__body";

    // Body content
    if (section.items) {
      body.appendChild(renderItems(section, section.items, section.id, 0));
    }

    if (section.groups) {
      let offset = section.items ? section.items.length : 0;
      for (const group of section.groups) {
        const g = document.createElement("div");
        g.className = "group";

        const gTitle = document.createElement("div");
        gTitle.className = "group__title";
        gTitle.textContent = group.title;
        if (group.warn) gTitle.classList.add("badge--warn");

        const h = document.createElement("h3");
        h.textContent = group.title;
        h.className = group.warn ? "badge badge--warn" : "badge";
        h.style.display = "inline-block";
        h.style.marginBottom = "10px";
        h.style.background = group.warn ? "rgba(255,200,87,0.12)" : "rgba(102,227,196,0.10)";
        h.style.borderColor = group.warn ? "rgba(255,200,87,0.25)" : "rgba(102,227,196,0.25)";

        g.appendChild(h);
        g.appendChild(renderItems(section, group.items, section.id, offset));
        offset += group.items.length;

        body.appendChild(g);
      }
    }

    // Toggle open/close
    head.addEventListener("click", () => {
      wrapper.dataset.open = wrapper.dataset.open === "true" ? "false" : "true";
    });

    wrapper.appendChild(head);
    wrapper.appendChild(body);
    root.appendChild(wrapper);
  }

  updateOverallProgress();
}

function renderItems(section, items, sectionId, offsetIndex) {
  const frag = document.createDocumentFragment();

  items.forEach((item, idx) => {
    const row = document.createElement("label");
    row.className = "item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    const key = getStorageKey(`task:${sectionId}:${offsetIndex + idx}`);
    cb.checked = loadBool(key);

    cb.addEventListener("change", () => {
      saveBool(key, cb.checked);
      // update section badge + overall
      renderChecklist(); // simple + reliable (small app)
    });

    const textWrap = document.createElement("div");
    textWrap.className = "item__text";
    textWrap.textContent = item.text;

    row.appendChild(cb);
    row.appendChild(textWrap);
    frag.appendChild(row);
  });

  return frag;
}

function updateOverallProgress() {
  // Main checklist overall
  let total = 0;
  let done = 0;

  for (const section of CHECKLIST) {
    const items = sectionItems(section);
    total += items.length;
    for (let i = 0; i < items.length; i++) {
      const key = getStorageKey(`task:${section.id}:${i}`);
      if (loadBool(key)) done++;
    }
  }

  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("overallText").textContent = `${pct}%`;
  document.getElementById("overallBar").style.width = `${pct}%`;
  document.getElementById("overallCount").textContent = `${done} / ${total}`;
}

// -----------------------------
// 3) Save export/import/reset
// -----------------------------
function exportSave() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) data[k] = localStorage.getItem(k);
  }
  downloadJson("witcher3-checklist-save.json", data);
}

function importSave(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(reader.result);
      for (const [k, v] of Object.entries(obj)) {
        if (k.startsWith(LS_PREFIX)) localStorage.setItem(k, v);
      }
      renderChecklist();
      // also update gwent UI if loaded
      if (typeof refreshGwentUI === "function") refreshGwentUI();
      alert("Save imported ✅");
    } catch (e) {
      alert("That file doesn’t look like a valid save.");
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm("Reset ALL progress? This cannot be undone.")) return;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) keysToRemove.push(k);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  renderChecklist();
  if (typeof refreshGwentUI === "function") refreshGwentUI();
}

// -----------------------------
// 4) Gwent cards checklist
// -----------------------------
let GWENT_ALL = [];
let GWENT_FILTERED = [];

function gwentKey(card) {
  // Use stable unique-ish key across datasets
  return getStorageKey(
    `gwent:${card.expansion}|${card.deck}|${card.territory}|${card.name}|${card.type}|${card.details}`
  );
}

function isGwentChecked(card) {
  return loadBool(gwentKey(card), false);
}

function setGwentChecked(card, val) {
  saveBool(gwentKey(card), val);
}

async function loadGwentCards() {
  // Prefer local repo file; optional fallback to remote.
  const localUrl = "./data/cards.json";
  const fallbackUrl = "https://gwentcards.github.io/cards.json"; // dataset source [1](https://gwentcards.github.io/cards.json)

  let data;
  try {
    const r = await fetch(localUrl, { cache: "no-store" });
    if (!r.ok) throw new Error("Local cards.json missing");
    data = await r.json();
  } catch {
    const r2 = await fetch(fallbackUrl, { cache: "no-store" });
    data = await r2.json();
  }

  // Dataset may be { cards: [...] } or direct array; handle both
  const cards = Array.isArray(data) ? data : (data.cards || []);
  GWENT_ALL = cards.map(c => ({
    expansion: c.expansion || "Unknown",
    deck: c.deck || "Unknown",
    territory: c.territory || "Unknown",
    name: c.name || "Unknown",
    type: c.type || "",
    details: c.details || "",
    picture: c.picture || ""
  }));

  initGwentFilters();
  applyGwentFilters();
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b));
}

function initGwentFilters() {
  const expSel = document.getElementById("gwentExpansion");
  const deckSel = document.getElementById("gwentDeck");
  const terrSel = document.getElementById("gwentTerritory");

  const exps = uniqueSorted(GWENT_ALL.map(c => c.expansion));
  const decks = uniqueSorted(GWENT_ALL.map(c => c.deck));
  const terrs = uniqueSorted(GWENT_ALL.map(c => c.territory));

  for (const e of exps) expSel.appendChild(new Option(e, e));
  for (const d of decks) deckSel.appendChild(new Option(d, d));
  for (const t of terrs) terrSel.appendChild(new Option(t, t));

  // Hook filter events
  ["gwentSearch", "gwentExpansion", "gwentDeck", "gwentTerritory", "gwentOnlyUnchecked"]
    .forEach(id => document.getElementById(id).addEventListener("input", applyGwentFilters));
  document.getElementById("gwentOnlyUnchecked").addEventListener("change", applyGwentFilters);
}

function applyGwentFilters() {
  const q = (document.getElementById("gwentSearch").value || "").trim().toLowerCase();
  const exp = document.getElementById("gwentExpansion").value;
  const deck = document.getElementById("gwentDeck").value;
  const terr = document.getElementById("gwentTerritory").value;
  const onlyUnchecked = document.getElementById("gwentOnlyUnchecked").checked;

  GWENT_FILTERED = GWENT_ALL.filter(c => {
    if (exp && c.expansion !== exp) return false;
    if (deck && c.deck !== deck) return false;
    if (terr && c.territory !== terr) return false;
    if (onlyUnchecked && isGwentChecked(c)) return false;

    if (!q) return true;
    const hay = `${c.name} ${c.deck} ${c.expansion} ${c.territory} ${c.type} ${c.details}`.toLowerCase();
    return hay.includes(q);
  });

  renderGwent();
  updateGwentProgress();
}

function updateGwentProgress() {
  const total = GWENT_ALL.length;
  let done = 0;
  for (const c of GWENT_ALL) if (isGwentChecked(c)) done++;

  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("gwentBar").style.width = `${pct}%`;
  document.getElementById("gwentProgressText").textContent = `${done} / ${total} (${pct}%)`;
  document.getElementById("gwentCount").textContent = `Showing ${GWENT_FILTERED.length} of ${total} cards`;
}

function renderGwent() {
  const root = document.getElementById("gwentRoot");
  root.innerHTML = "";

  // Group by territory (region-style)
  const groups = new Map();
  for (const c of GWENT_FILTERED) {
    const k = c.territory || "Unknown";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }

  // Sort territories in a nice order with common ones first
  const preferredOrder = [
    "White Orchard", "Velen", "Novigrad", "Skellige", "Kaer Morhen", "Vizima",
    "Toussaint", "Random", "Base Deck"
  ];
  const terrs = [...groups.keys()].sort((a, b) => {
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return a.localeCompare(b);
  });

  terrs.forEach((territory) => {
    const wrap = document.createElement("div");
    wrap.className = "territory";
    wrap.dataset.open = "false";

    const head = document.createElement("div");
    head.className = "territory__head";

    const list = groups.get(territory).slice().sort((a, b) => {
      const da = a.deck.localeCompare(b.deck);
      if (da !== 0) return da;
      return a.name.localeCompare(b.name);
    });

    const tDone = list.filter(isGwentChecked).length;
    const tTotal = list.length;
    const tPct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

    head.innerHTML = `
      <div>
        <strong>${territory}</strong>
        <div class="muted small">${tDone} / ${tTotal} (${tPct}%)</div>
      </div>
      <div class="badge">${tPct}%</div>
    `;

    const body = document.createElement("div");
    body.className = "territory__body";

    list.forEach(card => {
      const row = document.createElement("label");
      row.className = "gwentRow";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = isGwentChecked(card);

      cb.addEventListener("change", () => {
        setGwentChecked(card, cb.checked);
        // re-render current view + progress
        renderGwent();
        updateGwentProgress();
      });

      const meta = document.createElement("div");
      meta.className = "gwentMain";

      const name = document.createElement("div");
      name.className = "gwentName";
      name.textContent = card.name;

      const line1 = document.createElement("div");
      line1.className = "gwentMeta";
      line1.textContent = `${card.expansion} • ${card.deck} • ${card.territory}`;

      const line2 = document.createElement("div");
      line2.className = "gwentMeta";
      line2.textContent = `${card.type}${card.details ? " — " + card.details : ""}`;

      meta.appendChild(name);
      meta.appendChild(line1);
      meta.appendChild(line2);

      row.appendChild(cb);
      row.appendChild(meta);

      body.appendChild(row);
    });

    head.addEventListener("click", () => {
      wrap.dataset.open = wrap.dataset.open === "true" ? "false" : "true";
    });

    wrap.appendChild(head);
    wrap.appendChild(body);
    root.appendChild(wrap);
  });
}

// Allow main app to refresh gwent UI after import/reset
function refreshGwentUI() {
  applyGwentFilters();
}

// -----------------------------
// 5) Boot
// -----------------------------
document.getElementById("btnExport").addEventListener("click", exportSave);
document.getElementById("btnReset").addEventListener("click", resetAll);
document.getElementById("fileImport").addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  if (f) importSave(f);
  e.target.value = "";
});

buildNav();
renderChecklist();
loadGwentCards();

/* Witcher 3 – Ultimate Platinum Checklist (V2)
   - Matches Matthew's V2 index.html structure:
     * Main checklist -> #checklistRoot
     * Trophies -> #trophyRoot (with filters)
     * Gwent -> #gwentRoot (from ./data/cards.json)
     * Isle of Mists banner -> #iomBanner + #iomText (shows only when triggered)
     * KPIs -> corePct/coreBar/coreCount, baseTrophyPct/baseTrophyBar/baseTrophyCount,
              dlcTrophyPct/dlcTrophyBar/dlcTrophyCount, ccPct/ccBar/ccCount
     * Chips -> chipDM/dmState + chipIOM/iomState
   - Saves tick state in localStorage + Export/Import/Reset
*/

const APP_VERSION = "v2";
const LS_PREFIX = `w3:${APP_VERSION}:`;

// -----------------------------
// DOM helpers
// -----------------------------
const $ = (id) => document.getElementById(id);

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function setWidth(id, pct) {
  const el = $(id);
  if (el) el.style.width = `${pct}%`;
}

function addClass(el, cls) {
  if (el && !el.classList.contains(cls)) el.classList.add(cls);
}

function removeClass(el, cls) {
  if (el && el.classList.contains(cls)) el.classList.remove(cls);
}

// -----------------------------
// Storage
// -----------------------------
function sk(key) {
  return `${LS_PREFIX}${key}`;
}

function loadBool(key, fallback = false) {
  try {
    const v = localStorage.getItem(sk(key));
    if (v === null) return fallback;
    return v === "1";
  } catch {
    return fallback;
  }
}

function saveBool(key, val) {
  try {
    localStorage.setItem(sk(key), val ? "1" : "0");
  } catch {}
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
// Data templates
// -----------------------------
function item(id, text, note = "", tags = []) {
  return { id, text, note, tags };
}

function group(title, items, opts = {}) {
  return { title, items, ...opts };
}

function section(id, title, groups, opts = {}) {
  return { id, title, groups, ...opts };
}

// -----------------------------
// CORE CHECKLIST (Main Planner + Isle of Mists)
// -----------------------------
const CORE = [
  section("global-rules", "⚙️ Global Rules", [
    group("Rules", [
      item("gr-deathmarch", "Start on Death March (do not lower until finished)", "", ["DM"]),
      item("gr-settings", "Enable: Enemy Upscaling / Auto Oils / Quick Casting"),
      item("gr-save-main", "Manual save before EVERY main quest", "", ["SAFE"]),
      item("gr-side-first", "Always do side quests BEFORE main quests"),
      item("gr-gwent-play", "Play EVERY Gwent player immediately", "", ["GWENT"]),
      item("gr-gwent-buy", "Buy EVERY Gwent card when seen", "", ["GWENT"]),
    ]),
  ], { open: true }),

  section("romance", "❤️ Romance Tracker", [
    group("🚫 Triss (DO NOT ROMANCE)", [
      item("ro-triss-leave", "Let Triss Merigold leave", "", ["MISSABLE"]),
      item("ro-triss-no-love", "Do NOT say “I love you”", "", ["MISSABLE"]),
      item("ro-triss-no-stay", "Do NOT ask her to stay", "", ["MISSABLE"]),
    ], { warn: true }),

    group("💜 Yennefer (LOCK IN)", [
      item("ro-yen-love", "Tell Yennefer “I still love you”", "", ["MISSABLE"]),
      item("ro-no-both", "Do NOT romance both", "", ["MISSABLE"]),
    ]),
  ]),

  section("white-orchard", "🌿 White Orchard (Lv 1–4)", [
    group("World", [
      item("wo-quests", "All quests complete"),
      item("wo-qmarks", "All ? cleared"),
      item("wo-pop", "All Places of Power", "", ["POW"]),
    ]),
    group("🃏 Gwent", [
      item("wo-gwent-tutorial", "Tutorial win", "", ["GWENT"]),
      item("wo-gwent-scholar", "Beat Scholar (MISSABLE)", "", ["GWENT", "MISSABLE"]),
      item("wo-gwent-buy", "Buy all cards", "", ["GWENT"]),
    ]),
  ]),

  section("velen", "🪵 Velen (Lv 5–15)", [
    group("⚠️ Keira", [
      item("ve-keira-help", "Help Keira Metz", "", ["MISSABLE"]),
      item("ve-keira-kaer", "Send to Kaer Morhen", "", ["MISSABLE"]),
    ], { warn: true }),

    group("⚠️ Baron", [
      item("ve-baron-line", "Complete full questline", "", ["MISSABLE"]),
    ], { warn: true }),

    group("🃏 Gwent", [
      item("ve-gwent-players", "All players beaten", "", ["GWENT"]),
      item("ve-gwent-buy", "All cards bought", "", ["GWENT"]),
    ]),

    group("World", [
      item("ve-contracts", "Contracts complete"),
      item("ve-sides", "Side quests complete"),
    ]),
  ]),

  section("novigrad", "🏙️ Novigrad (Lv 10–18)", [
    group("Main", [
      item("no-triss-confirm", "Confirm Triss not romanced", "", ["MISSABLE"]),
    ]),
    group("🃏 Gwent Quests", [
      item("no-gwent-bigcity", "Big City Players", "", ["GWENT", "MISSABLE"]),
      item("no-gwent-dangerous-game", "A Dangerous Game", "", ["GWENT", "MISSABLE"]),
      item("no-gwent-players", "All players beaten", "", ["GWENT"]),
      item("no-gwent-buy", "All cards bought", "", ["GWENT"]),
    ]),
    group("World", [
      item("no-sides", "All side quests complete"),
    ]),
  ]),

  section("skellige", "🏔️ Skellige (Lv 16–25)", [
    group("Main", [
      item("sk-cerys", "Support Cerys an Craite", "", ["MISSABLE"]),
      item("sk-yen-confirm", "Confirm Yen romance", "", ["MISSABLE"]),
    ]),
    group("🃏 Gwent", [
      item("sk-gwent-players", "All players beaten", "", ["GWENT"]),
      item("sk-gwent-buy", "All cards bought", "", ["GWENT"]),
    ]),
    group("World", [
      item("sk-sides", "Side quests complete"),
      item("sk-contracts", "Contracts complete"),
    ]),
  ]),

  section("kaer-morhen", "🏰 Kaer Morhen", [
    group("Prep", [
      item("km-quests", "All quests complete"),
      item("km-gwent", "All Gwent done", "", ["GWENT"]),
      item("km-allies", "All allies recruited", "", ["MISSABLE"]),
      item("km-backup", "Backup save created", "", ["SAFE", "MISSABLE"]),
    ]),
  ]),

  section("final-act", "❄️ Final Act", [
    group("🎯 Ciri Best Ending", [
      item("fa-snowball", "Snowball fight", "", ["MISSABLE"]),
      item("fa-let-decide", "Let her decide", "", ["MISSABLE"]),
      item("fa-trash-lab", "Let her trash lab", "", ["MISSABLE"]),
      item("fa-visit-grave", "Visit grave", "", ["MISSABLE"]),
      item("fa-encourage", "Encourage her", "", ["MISSABLE"]),
      item("fa-finish-dm", "Finish game on Death March", "", ["DM"]),
    ]),
  ]),

  section("cleanup", "🏆 Cleanup", [
    group("Post-game", [
      item("cu-combat", "Combat trophies complete"),
      item("cu-contracts", "Contracts complete"),
      item("cu-sides", "Side quests complete"),
    ]),
  ]),

  section("dlc-run", "🩸 DLC — Progress", [
    group("DLC", [
      item("dlc-hos", "Hearts of Stone complete"),
      item("dlc-baw", "Blood and Wine complete"),
    ]),
  ]),

  section("daily-session", "🎮 Daily Session Checklist", [
    group("During play", [
      item("ds-levelcheck", "Check quest level vs your level"),
      item("ds-sidefirst", "Do ALL side quests first"),
      item("ds-gwent-players", "Play nearby Gwent players", "", ["GWENT"]),
      item("ds-merchants", "Visit merchants for cards", "", ["GWENT"]),
      item("ds-contracts", "Complete nearby contracts"),
    ]),
    group("Before logging off", [
      item("ds-save", "Manual save", "", ["SAFE"]),
      item("ds-gwent-check", "Check Gwent progress", "", ["GWENT"]),
      item("ds-missables", "Check for missed quests", "", ["MISSABLE"]),
    ]),
  ]),

  section("op-build", "⚔️ OP Build Guide", [
    group("Level 1–10", [
      item("ob-mm", "Muscle Memory"),
      item("ob-resolve", "Resolve"),
      item("ob-exp-shield", "Exploding Shield"),
    ]),
    group("Level 10–20", [
      item("ob-precise", "Precise Blows"),
      item("ob-fleet", "Fleet Footed"),
      item("ob-better-quen", "Better Quen"),
    ]),
    group("Level 20–30", [
      item("ob-whirl", "Whirl"),
      item("ob-rage", "Rage Management"),
      item("ob-active-shield", "Active Shield"),
    ]),
    group("Level 30+", [
      item("ob-max-fast", "Max fast attacks"),
      item("ob-max-quen", "Max Quen"),
      item("ob-add-alch", "Add alchemy"),
    ]),
  ]),

  // Isle of Mists: “triggered” banner is controlled by iom-trigger
  section("isle-of-mists", "⚠️ Isle of Mists – HARD STOP (Point of No Return)", [
    group("Trigger", [
      item("iom-trigger", "I’m at the Isle of Mists warning prompt (turn banner ON)", "Tick this when the game gives you the save warning.", ["SAFE", "MISSABLE"]),
    ], { warn: true }),

    group("Do BEFORE sailing into the fog", [
      item("iom-backup-save", "Create a dedicated backup save (separate slot)", "", ["SAFE", "MISSABLE"]),
      item("iom-brothers", "Complete all ‘Brothers in Arms’ ally recruitment quests", "", ["MISSABLE"]),
      item("iom-keira", "Keira questline resolved (and sent to Kaer Morhen)", "", ["MISSABLE"]),
      item("iom-triss", "Triss questline resolved (no romance if following your plan)", "", ["MISSABLE"]),
      item("iom-yen", "Yennefer ‘Last Wish’ resolved (lock romance)", "", ["MISSABLE"]),
      item("iom-radovid", "Radovid/Dijkstra chain progressed correctly (Assassin of Kings path)", "", ["MISSABLE"]),
      item("iom-gwent", "Finish any active Gwent quests & buy missables you can access now", "", ["GWENT", "MISSABLE"]),
      item("iom-clear-quests", "Clear key-character side quests (don’t leave them in-progress)", "", ["MISSABLE"]),
    ], { warn: true }),
  ], { open: false }),

  section("save-tracker", "💾 Save Tracker", [
    group("Saves", [
      item("sv-pre-km", "Pre-Kaer Morhen save", "", ["SAFE", "MISSABLE"]),
      item("sv-pre-final", "Pre-final act save", "", ["SAFE", "MISSABLE"]),
      item("sv-rotate", "Multiple rotating saves", "", ["SAFE"]),
    ]),
  ]),
];

const IOM_REQUIRED = [
  "iom-backup-save",
  "iom-brothers",
  "iom-keira",
  "iom-triss",
  "iom-yen",
  "iom-radovid",
  "iom-gwent",
  "iom-clear-quests",
];

// -----------------------------
// TROPHIES (Base + DLC + optional NG)
// Total = 79 across base + DLC packs. [1](https://www.reddit.com/r/gwent/comments/i1zuzg/gwent_card_exporter_art_and_data/)[2](https://game-checklists.com/witcher3/all-gwent-cards-checklist.html)
// -----------------------------
const TROPHIES = [
  // Base game trophies (split into sensible groups)
  { id: "t-base-story", pack: "base", title: "Base Game — Story", open: false, trophies: [
    item("tr-lilac", "Lilac and Gooseberries", "Find Yennefer of Vengerberg.", ["STORY"]),
    item("tr-friend", "A Friend in Need", "Find and free Dandelion.", ["STORY"]),
    item("tr-necro", "Necromancer", "Help Yennefer extract information from Skjall’s body.", ["STORY"]),
    item("tr-family", "Family Counselor", "Find the baron’s wife and daughter.", ["STORY"]),
    item("tr-somethingmore", "Something More", "Find Ciri.", ["STORY"]),
    item("tr-xenonaut", "Xenonaut", "Visit Tir ná Lia and convince Ge’els to betray Eredin.", ["STORY"]),
    item("tr-kingdead", "The King is Dead", "Defeat Eredin.", ["STORY"]),
  ]},

  { id: "t-base-difficulty", pack: "base", title: "Base Game — Difficulty", open: false, trophies: [
    item("tr-passed", "Passed the Trial", "Finish the game on any difficulty.", ["DM"]),
    item("tr-gautlet", "Ran the Gauntlet", "Finish on Blood & Broken Bones or Death March.", ["DM"]),
    item("tr-walked", "Walked the Path", "Finish on Death March.", ["DM"]),
  ]},

  { id: "t-base-missables", pack: "base", title: "Base Game — Missables / Quest Outcomes", open: false, trophies: [
    item("tr-kingmaker", "Kingmaker", "Complete the subplot about choosing Skellige’s ruler.", ["MISSABLE"]),
    item("tr-assassin", "Assassin of Kings", "Take part in the assassination of King Radovid.", ["MISSABLE"]),
    item("tr-fwb", "Friends With Benefits", "Complete the subplot involving Keira Metz.", ["MISSABLE"]),
    item("tr-fullcrew", "Full Crew", "Bring all possible allies to Kaer Morhen.", ["MISSABLE"]),
  ]},

  { id: "t-base-gwent", pack: "base", title: "Base Game — Gwent", open: false, trophies: [
    item("tr-cardcollector", "Card Collector", "Acquire all base-game Gwent cards.", ["GWENT", "MISSABLE"]),
    item("tr-gwentmaster", "Gwent Master", "Win Passiflora tournament (Tybalt).", ["GWENT", "MISSABLE"]),
    item("tr-geraltfriends", "Geralt and Friends", "Win a Gwent round using only neutral cards.", ["GWENT"]),
    item("tr-allin", "All In", "Play three hero cards in one round and win.", ["GWENT"]),
  ]},

  { id: "t-base-combat", pack: "base", title: "Base Game — Combat / Exploration / Misc", open: false, trophies: [
    item("tr-dendro", "Dendrologist", "Acquire all abilities in one tree.", []),
    item("tr-mutant", "Mutant", "Fill all mutagen slots.", []),
    item("tr-globetrotter", "Globetrotter", "Discover 100 fast travel points.", []),
    item("tr-professional", "Geralt: The Professional", "Complete all Witcher contracts.", []),
    item("tr-brawlmaster", "Brawl Master", "Complete all fistfighting quests (Velen, Skellige, Novigrad).", []),
    item("tr-fastfurious", "Fast and Furious", "Win all horse races in the game.", []),
    item("tr-evenodds", "Even Odds", "Kill 2 contract monsters without Signs/potions/oils/bombs/mutagens.", []),
    item("tr-marksman", "Master Marksman", "Kill 50 opponents with crossbow headshots.", []),
    item("tr-humpty", "Humpty Dumpty", "Knock 10 opponents off somewhere high with Aard.", []),
    item("tr-axii", "The Enemy of My Enemy", "Use Axii to force one opponent to kill another (20 times).", []),
  ]},

  // Hearts of Stone DLC trophies (13) [3](https://www.youtube.com/watch?v=OOH74kZHl0o)
  { id: "t-hos", pack: "dlc", dlc: "hos", title: "Hearts of Stone — DLC Trophies", open: false, trophies: [
    item("hos-toad", "I’m Not Kissing That", "Kill the prince cursed into a toad.", ["DLC"]),
    item("hos-wedding", "Let the Good Times Roll!", "Participate in all wedding activities.", ["DLC", "MISSABLE"]),
    item("hos-shop", "Shopaholic", "Buy all items at the auction house.", ["DLC", "MISSABLE"]),
    item("hos-curator", "Curator of Nightmares", "Recreate all of Iris’ nightmares.", ["DLC", "MISSABLE"]),
    item("hos-pacta", "Pacta Sunt Servanda", "Finish Hearts of Stone.", ["DLC", "STORY"]),
    item("hos-many", "When It’s Many Against One…", "Provoke all nightmares at once and defeat them.", ["DLC", "MISSABLE"]),
    item("hos-return", "Return to Sender", "Kill 3 opponents with their own arrows.", ["DLC"]),
    item("hos-seven", "Can Quit Anytime I Want", "Be under 7 potions/decoctions at once.", ["DLC"]),
    item("hos-rose", "Wild Rose Dethorned", "Defeat fallen knights and loot their camps.", ["DLC"]),
    item("hos-ofieri", "I Wore Ofieri Before It Was Cool", "Collect all Ofieri gear + at least one sword.", ["DLC"]),
    item("hos-moo", "Moo-rderer", "Kill 20 cows.", ["DLC"]),
    item("hos-rad", "Rad Steez, Bro!", "Slide downhill uninterrupted for 10 seconds.", ["DLC"]),
    item("hos-killedit", "Killed It", "Win a round of Gwent with total strength of at least 187.", ["DLC", "GWENT"]),
  ]},

  // Blood and Wine DLC trophies (13) [2](https://game-checklists.com/witcher3/all-gwent-cards-checklist.html)
  { id: "t-baw", pack: "dlc", dlc: "baw", title: "Blood and Wine — DLC Trophies", open: false, trophies: [
    item("baw-south", "The Witcher’s Gone South", "Travel to Toussaint.", ["DLC", "STORY"]),
    item("baw-david", "David and Golyat", "Kill Golyat with a crossbow bolt to his eye.", ["DLC", "MISSABLE"]),
    item("baw-last", "Last Action Hero", "Be decorated with the Order of Vitis Vinifera.", ["DLC", "STORY"]),
    item("baw-kling", "Kling of the Clink", "Serve time in Toussaint.", ["DLC", "STORY"]),
    item("baw-knight", "A Knight to Remember", "Flawless victory in all tourney competitions.", ["DLC", "MISSABLE"]),
    item("baw-virtues", "Embodiment of the Five Virtues", "Receive Aerondight.", ["DLC"]),
    item("baw-house", "Playing House", "Use all options for developing Corvo Bianco.", ["DLC"]),
    item("baw-stone", "Turned Every Stone", "Find all grandmaster diagrams for each witcher school.", ["DLC"]),
    item("baw-gwent", "I Have a Gwent Problem", "Collect all cards in the Skellige deck.", ["DLC", "GWENT"]),
    item("baw-grapes", "The Grapes of Wrath Stomped", "Unite vineyards and have a wine named in your honor.", ["DLC"]),
    item("baw-dressed", "Dressed to Kill", "Unlock bonus for equipping all gear from one School.", ["DLC"]),
    item("baw-mutation", "Weapon “W”", "Develop a mutation.", ["DLC"]),
    item("baw-hasta", "Hasta la Vista™", "Kill a frozen opponent with a crossbow bolt.", ["DLC"]),
  ]},

  // Optional NG+ goals (NOT an official separate trophy pack, just your personal tracker)
  { id: "t-ng", pack: "ng", title: "Optional — NG+ Goals", open: false, trophies: [
    item("ng-gear", "Start NG+ with endgame gear & oils ready", "Prep so NG+ is painless.", ["NG+"]),
    item("ng-build", "Finalise endgame build (combat/sign/alchemy)", "Respec if needed.", ["NG+"]),
    item("ng-alt", "Use NG+ for alternative story choices (optional)", "", ["NG+"]),
  ]},
];

// -----------------------------
// Render helpers (Main checklist)
// -----------------------------
function calcSectionProgress(sec) {
  let done = 0, total = 0;
  sec.groups.forEach(g => g.items.forEach(it => {
    total++;
    if (loadBool(`task:${it.id}`)) done++;
  }));
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

function calcCoreProgress() {
  let done = 0, total = 0;
  CORE.forEach(sec => sec.groups.forEach(g => g.items.forEach(it => {
    total++;
    if (loadBool(`task:${it.id}`)) done++;
  })));
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

function renderMainChecklist() {
  const root = $("checklistRoot");
  if (!root) return;
  root.innerHTML = "";

  CORE.forEach(sec => {
    const wrap = document.createElement("section");
    wrap.className = "card section";
    wrap.id = `sec-${sec.id}`;
    wrap.dataset.open = sec.open ? "true" : "false";

    const pr = calcSectionProgress(sec);

    const head = document.createElement("div");
    head.className = "section__head";

    const left = document.createElement("div");
    left.className = "section__title";
    left.innerHTML = `<h2>${sec.title}</h2><div class="muted small">${pr.done} / ${pr.total} complete</div>`;

    const right = document.createElement("div");
    right.className = "section__meta";
    const badge = document.createElement("div");
    badge.className = sec.groups.some(g => g.warn) ? "badge badge--warn" : "badge";
    badge.textContent = `${pr.pct}%`;
    right.appendChild(badge);

    head.appendChild(left);
    head.appendChild(right);

    const body = document.createElement("div");
    body.className = "section__body";

    sec.groups.forEach(g => {
      const gWrap = document.createElement("div");
      gWrap.className = "group";

      const h = document.createElement("h3");
      h.className = g.warn ? "badge badge--warn" : "badge";
      h.style.display = "inline-block";
      h.style.marginBottom = "10px";
      h.textContent = g.title;

      gWrap.appendChild(h);

      g.items.forEach(it => {
        const row = document.createElement("label");
        row.className = "item";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = loadBool(`task:${it.id}`);

        cb.addEventListener("change", () => {
          saveBool(`task:${it.id}`, cb.checked);
          // Re-render to refresh KPIs/banners quickly and safely
          renderAll();
        });

        const txt = document.createElement("div");
        txt.className = "item__text";
        txt.innerHTML = `<div>${it.text}</div>`;
        if (it.note) {
          const note = document.createElement("div");
          note.className = "muted small";
          note.style.marginTop = "4px";
          note.textContent = it.note;
          txt.appendChild(note);
        }

        row.appendChild(cb);
        row.appendChild(txt);
        gWrap.appendChild(row);
      });

      body.appendChild(gWrap);
    });

    head.addEventListener("click", () => {
      wrap.dataset.open = wrap.dataset.open === "true" ? "false" : "true";
    });

    wrap.appendChild(head);
    wrap.appendChild(body);
    root.appendChild(wrap);
  });
}

// -----------------------------
// Nav (Quick Jump)
// -----------------------------
function buildNav() {
  const nav = $("navLinks");
  if (!nav) return;
  nav.innerHTML = "";

  // Core sections
  CORE.forEach(sec => {
    const a = document.createElement("a");
    a.href = `#sec-${sec.id}`;
    a.textContent = sec.title;
    nav.appendChild(a);
  });

  // Jump links you already have
  const trophiesJump = document.createElement("a");
  trophiesJump.href = "#trophies";
  trophiesJump.textContent = "🏆 Trophies";
  nav.appendChild(trophiesJump);

  const gwentJump = document.createElement("a");
  gwentJump.href = "#gwentSection";
  gwentJump.textContent = "🃏 Gwent Cards";
  nav.appendChild(gwentJump);
}

// -----------------------------
// Isle of Mists banner + chips
// -----------------------------
function updateIomBannerAndChip() {
  const triggered = loadBool("task:iom-trigger", false);

  // Remaining hard-stop items
  const remaining = IOM_REQUIRED.filter(id => !loadBool(`task:${id}`, false));

  // Chip state
  const chip = $("chipIOM");
  const state = $("iomState");
  if (chip && state) {
    chip.classList.remove("chip--ok", "chip--warn", "chip--bad");

    if (!triggered && remaining.length === IOM_REQUIRED.length) {
      state.textContent = "Not started";
      addClass(chip, "chip--ok");
    } else if (remaining.length === 0) {
      state.textContent = "READY (safe to proceed)";
      addClass(chip, "chip--ok");
    } else if (triggered) {
      state.textContent = "STOP — checklist incomplete";
      addClass(chip, "chip--bad");
    } else {
      state.textContent = "In progress";
      addClass(chip, "chip--warn");
    }
  }

  // Banner behaviour: only show when triggered is ON and items remain
  const banner = $("iomBanner");
  const bannerText = $("iomText");
  if (!banner || !bannerText) return;

  if (triggered && remaining.length > 0) {
    banner.classList.remove("banner--hidden");
    bannerText.innerHTML =
      `You still have <strong>${remaining.length}</strong> Isle of Mists HARD STOP task(s) unchecked.<br>` +
      `Finish them before proceeding.`;
  } else {
    banner.classList.add("banner--hidden");
    bannerText.textContent = "";
  }
}

// -----------------------------
// Death March chip
// -----------------------------
function updateDmChip() {
  const chip = $("chipDM");
  const state = $("dmState");
  if (!chip || !state) return;

  chip.classList.remove("chip--ok", "chip--warn", "chip--bad");

  // Define "locked" as: you ticked the Global Rule AND you haven't reset it
  const locked = loadBool("task:gr-deathmarch", false);

  if (locked) {
    state.textContent = "LOCKED";
    addClass(chip, "chip--ok");
  } else {
    state.textContent = "Not locked";
    addClass(chip, "chip--warn");
  }
}

// -----------------------------
// Trophy logic + rendering
// -----------------------------
function trophyKey(id) {
  return `trophy:${id}`;
}

function isTrophyChecked(id) {
  return loadBool(trophyKey(id), false);
}

function setTrophyChecked(id, val) {
  saveBool(trophyKey(id), val);
}

function getTrophyFilters() {
  const q = ($("trophySearch")?.value || "").trim().toLowerCase();
  const showDLC = $("toggleShowDLC") ? $("toggleShowDLC").checked : true;
  const showNG = $("toggleShowNG") ? $("toggleShowNG").checked : false;
  const onlyMissable = $("toggleOnlyMissable") ? $("toggleOnlyMissable").checked : false;
  return { q, showDLC, showNG, onlyMissable };
}

function trophyMatchesFilters(t, filters) {
  const tags = t.tags || [];
  if (filters.onlyMissable && !tags.includes("MISSABLE")) return false;

  if (filters.q) {
    const hay = `${t.text} ${t.note} ${(t.tags || []).join(" ")}`.toLowerCase();
    if (!hay.includes(filters.q)) return false;
  }
  return true;
}

function renderTrophies() {
  const root = $("trophyRoot");
  if (!root) return;

  root.innerHTML = "";
  const filters = getTrophyFilters();

  // Determine which packs to include
  const includeBase = true;
  const includeDLC = filters.showDLC;
  const includeNG = filters.showNG;

  const visibleGroups = TROPHIES.filter(g => {
    if (g.pack === "base") return includeBase;
    if (g.pack === "dlc") return includeDLC;
    if (g.pack === "ng") return includeNG;
    return false;
  });

  visibleGroups.forEach(g => {
    // Filter trophies inside each group
    const list = g.trophies.filter(t => trophyMatchesFilters(t, filters));
    if (list.length === 0) return;

    const wrap = document.createElement("div");
    wrap.className = "trophyGroup";
    wrap.dataset.open = g.open ? "true" : "false";

    const done = list.filter(t => isTrophyChecked(t.id)).length;
    const total = list.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const head = document.createElement("div");
    head.className = "trophyGroup__head";
    head.innerHTML = `
      <div>
        <strong>${g.title}</strong>
        <div class="muted small">${done} / ${total} (${pct}%)</div>
      </div>
      <div class="badge">${pct}%</div>
    `;

    const body = document.createElement("div");
    body.className = "trophyGroup__body";

    list.forEach(t => {
      const row = document.createElement("label");
      row.className = "trophyRow";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = isTrophyChecked(t.id);

      cb.addEventListener("change", () => {
        setTrophyChecked(t.id, cb.checked);
        updateKpis();
        // quick re-render to update group % and filtered view
        renderTrophies();
      });

      const main = document.createElement("div");
      main.innerHTML = `
        <div class="trophyName">${t.text}</div>
        <div class="trophyMeta">${t.note || ""}</div>
        <div class="trophyMeta">${(t.tags || []).length ? (t.tags || []).join(" • ") : ""}</div>
      `;

      row.appendChild(cb);
      row.appendChild(main);
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

function trophyCounts(packFilterFn) {
  let total = 0;
  let done = 0;

  TROPHIES.forEach(g => {
    if (!packFilterFn(g)) return;
    g.trophies.forEach(t => {
      total++;
      if (isTrophyChecked(t.id)) done++;
    });
  });

  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

// -----------------------------
// Gwent full checklist
// -----------------------------
let GWENT_ALL = [];
let GWENT_FILTERED = [];

function gwentStorageKey(card) {
  // stable-ish unique key
  return `gwent:${card.expansion}|${card.deck}|${card.territory}|${card.name}|${card.type}|${card.details}`;
}

function isCardChecked(card) {
  return loadBool(gwentStorageKey(card), false);
}

function setCardChecked(card, val) {
  saveBool(gwentStorageKey(card), val);
}

async function loadGwentCards() {
  if (!$("gwentRoot")) return;

  try {
    const r = await fetch("./data/cards.json", { cache: "no-store" });
    if (!r.ok) throw new Error("Missing cards.json");
    const data = await r.json();

    const cards = Array.isArray(data) ? data : (data.cards || []);
    GWENT_ALL = cards.map(c => ({
      expansion: c.expansion || "Unknown",
      deck: c.deck || "Unknown",
      territory: c.territory || "Unknown",
      name: c.name || "Unknown",
      type: c.type || "",
      details: c.details || ""
    }));

    initGwentFilters();
    applyGwentFilters();
  } catch (e) {
    setText("gwentCount", "Missing ./data/cards.json (add it to /data/cards.json)");
  }
}

function initGwentFilters() {
  const expSel = $("gwentExpansion");
  const deckSel = $("gwentDeck");
  const terrSel = $("gwentTerritory");

  function uniqSorted(arr) {
    return [...new Set(arr)].sort((a, b) => a.localeCompare(b));
  }

  if (expSel && expSel.options.length === 1) {
    uniqSorted(GWENT_ALL.map(c => c.expansion)).forEach(x => expSel.add(new Option(x, x)));
  }
  if (deckSel && deckSel.options.length === 1) {
    uniqSorted(GWENT_ALL.map(c => c.deck)).forEach(x => deckSel.add(new Option(x, x)));
  }
  if (terrSel && terrSel.options.length === 1) {
    uniqSorted(GWENT_ALL.map(c => c.territory)).forEach(x => terrSel.add(new Option(x, x)));
  }

  ["gwentSearch", "gwentExpansion", "gwentDeck", "gwentTerritory"].forEach(id => {
    const node = $(id);
    if (node) node.addEventListener("input", applyGwentFilters);
  });
  $("gwentOnlyUnchecked")?.addEventListener("change", applyGwentFilters);
}

function applyGwentFilters() {
  const q = ($("gwentSearch")?.value || "").trim().toLowerCase();
  const exp = $("gwentExpansion")?.value || "";
  const deck = $("gwentDeck")?.value || "";
  const terr = $("gwentTerritory")?.value || "";
  const onlyUnchecked = $("gwentOnlyUnchecked")?.checked || false;

  GWENT_FILTERED = GWENT_ALL.filter(c => {
    if (exp && c.expansion !== exp) return false;
    if (deck && c.deck !== deck) return false;
    if (terr && c.territory !== terr) return false;
    if (onlyUnchecked && isCardChecked(c)) return false;

    if (!q) return true;
    const hay = `${c.name} ${c.deck} ${c.expansion} ${c.territory} ${c.type} ${c.details}`.toLowerCase();
    return hay.includes(q);
  });

  renderGwent();
  updateGwentProgress();
  updateCardCollectorKpi();
}

function updateGwentProgress() {
  if (!$("gwentBar") || !$("gwentProgressText") || !$("gwentCount")) return;

  const total = GWENT_ALL.length;
  const done = GWENT_ALL.filter(isCardChecked).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  setWidth("gwentBar", pct);
  setText("gwentProgressText", `${done} / ${total} (${pct}%)`);
  setText("gwentCount", `Showing ${GWENT_FILTERED.length} of ${total} cards`);
}

// Card Collector KPI = only base game cards.
// The dataset uses expansion labels that vary a bit, so we use a robust heuristic.
function isBaseGameCard(card) {
  const exp = (card.expansion || "").toLowerCase();
  if (!exp || exp === "unknown") return true;
  if (exp.includes("base")) return true;
  if (exp.includes("wild hunt")) return true;
  // treat explicit DLC markers as non-base
  if (exp.includes("hearts")) return false;
  if (exp.includes("blood")) return false;
  return false; // default: if expansion string exists and isn’t base, assume DLC
}

function updateCardCollectorKpi() {
  const baseCards = GWENT_ALL.filter(isBaseGameCard);
  const total = baseCards.length;
  const done = baseCards.filter(isCardChecked).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  setText("ccPct", `${pct}%`);
  setWidth("ccBar", pct);
  setText("ccCount", `${done} / ${total}`);
}

function renderGwent() {
  const root = $("gwentRoot");
  if (!root) return;
  root.innerHTML = "";

  // group by territory
  const groups = new Map();
  GWENT_FILTERED.forEach(c => {
    const k = c.territory || "Unknown";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  });

  const preferredOrder = ["White Orchard", "Velen", "Novigrad", "Skellige", "Kaer Morhen", "Vizima", "Toussaint", "Random", "Base Deck", "Unknown"];
  const territories = [...groups.keys()].sort((a, b) => {
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return a.localeCompare(b);
  });

  territories.forEach(territory => {
    const list = groups.get(territory).slice().sort((a, b) => (a.deck + a.name).localeCompare(b.deck + b.name));
    const tDone = list.filter(isCardChecked).length;
    const tTotal = list.length;
    const tPct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

    const wrap = document.createElement("div");
    wrap.className = "territory";
    wrap.dataset.open = "false";

    const head = document.createElement("div");
    head.className = "territory__head";
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
      cb.checked = isCardChecked(card);

      cb.addEventListener("change", () => {
        setCardChecked(card, cb.checked);
        renderGwent();
        updateGwentProgress();
        updateCardCollectorKpi();
      });

      const meta = document.createElement("div");
      meta.className = "gwentMain";
      meta.innerHTML = `
        <div class="gwentName">${card.name}</div>
        <div class="gwentMeta">${card.expansion} • ${card.deck} • ${card.territory}</div>
        <div class="gwentMeta">${card.type}${card.details ? " — " + card.details : ""}</div>
      `;

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

// -----------------------------
// KPIs (Core + trophies + chips + banner)
// -----------------------------
function updateKpis() {
  // Core checklist KPI
  const core = calcCoreProgress();
  setText("corePct", `${core.pct}%`);
  setWidth("coreBar", core.pct);
  setText("coreCount", `${core.done} / ${core.total}`);

  // Base trophies KPI (all base groups)
  const base = trophyCounts(g => g.pack === "base");
  setText("baseTrophyPct", `${base.pct}%`);
  setWidth("baseTrophyBar", base.pct);
  setText("baseTrophyCount", `${base.done} / ${base.total}`);

  // DLC selected KPI (only if showDLC)
  const showDLC = $("toggleShowDLC") ? $("toggleShowDLC").checked : true;
  if (showDLC) {
    const dlc = trophyCounts(g => g.pack === "dlc");
    setText("dlcTrophyPct", `${dlc.pct}%`);
    setWidth("dlcTrophyBar", dlc.pct);
    setText("dlcTrophyCount", `${dlc.done} / ${dlc.total}`);
  } else {
    setText("dlcTrophyPct", `0%`);
    setWidth("dlcTrophyBar", 0);
    setText("dlcTrophyCount", `0 / 0`);
  }

  updateDmChip();
  updateIomBannerAndChip();
}

// -----------------------------
// Export / Import / Reset
// -----------------------------
function exportSave() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) data[k] = localStorage.getItem(k);
  }
  downloadJson("witcher3-checklist-save-v2.json", data);
}

function importSave(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(reader.result);
      for (const [k, v] of Object.entries(obj)) {
        if (k.startsWith(LS_PREFIX)) localStorage.setItem(k, v);
      }
      renderAll();
      alert("Save imported ✅");
    } catch {
      alert("That file doesn’t look like a valid V2 save.");
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm("Reset ALL progress? This cannot be undone.")) return;
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
  renderAll();
}

// -----------------------------
// Wire events
// -----------------------------
function wireUi() {
  $("btnExport")?.addEventListener("click", exportSave);
  $("btnReset")?.addEventListener("click", resetAll);

  $("fileImport")?.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importSave(f);
    e.target.value = "";
  });

  // Trophy filter controls
  ["trophySearch", "toggleShowDLC", "toggleShowNG", "toggleOnlyMissable"].forEach(id => {
    const node = $(id);
    if (!node) return;
    const evt = (node.type === "checkbox") ? "change" : "input";
    node.addEventListener(evt, () => {
      renderTrophies();
      updateKpis(); // DLC KPI depends on toggleShowDLC
    });
  });
}

// -----------------------------
// Render all
// -----------------------------
function renderAll() {
  buildNav();
  renderMainChecklist();
  renderTrophies();
  updateKpis();
  // Gwent KPIs depend on dataset; if loaded, update; otherwise harmless
  updateGwentProgress();
  updateCardCollectorKpi();
}

// -----------------------------
// Boot
// -----------------------------
(function boot() {
  wireUi();
  renderAll();
  loadGwentCards();
})();

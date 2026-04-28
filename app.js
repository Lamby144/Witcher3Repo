/*  Witcher 3 – Ultimate Platinum Checklist (v2)
    - Run planner (your Notes)
    - Isle of Mists hard-stop warning
    - Full trophy checklist (Base + HoS + B&W) + optional NG+ goals
    - Full Gwent card checklist loaded from ./data/cards.json
    - Progress saved locally (localStorage) + Export/Import

    Designed to "fail-soft": if some elements/IDs are missing in index.html, it won't crash.
*/

const APP_VERSION = "v2";
const LS_PREFIX = `w3:${APP_VERSION}:`;

// ----------------------------
// Utilities
// ----------------------------
const $ = (id) => document.getElementById(id);

function lsKey(key) {
  return `${LS_PREFIX}${key}`;
}

function loadBool(key, fallback = false) {
  try {
    const v = localStorage.getItem(lsKey(key));
    if (v === null) return fallback;
    return v === "1";
  } catch {
    return fallback;
  }
}

function saveBool(key, val) {
  try {
    localStorage.setItem(lsKey(key), val ? "1" : "0");
  } catch {}
}

function safeId(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("data-")) node.setAttribute(k, v);
    else node[k] = v;
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

// ----------------------------
// Data builders
// ----------------------------
function item(id, text, note = "", tags = []) {
  return { id, text, note, tags };
}
function group(title, items, opts = {}) {
  return { title, items, ...opts };
}
function section(id, title, groups = [], opts = {}) {
  return { id, title, groups, ...opts };
}

// ----------------------------
// 1) Run Planner (your Notes) + additions
// ----------------------------
const RUN_PLANNER = [
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

  section("gwent-master", "🃏 Gwent Master (Quest + Safety)", [
    group("Quests", [
      item("gm-collect", "Collect ‘Em All", "", ["GWENT", "MISSABLE"]),
      item("gm-velen", "Velen Players", "", ["GWENT", "MISSABLE"]),
      item("gm-bigcity", "Big City Players", "", ["GWENT", "MISSABLE"]),
      item("gm-oldpals", "Old Pals", "", ["GWENT", "MISSABLE"]),
      item("gm-dangerous", "A Dangerous Game", "", ["GWENT", "MISSABLE"]),
      item("gm-skellige", "Skellige Style", "", ["GWENT", "MISSABLE"]),
    ]),
    group("Regions", [
      item("gm-wo", "White Orchard complete", "", ["GWENT"]),
      item("gm-ve", "Velen complete", "", ["GWENT"]),
      item("gm-no", "Novigrad complete", "", ["GWENT"]),
      item("gm-sk", "Skellige complete", "", ["GWENT"]),
    ]),
    group("Rules", [
      item("gm-nofail", "No failed Gwent quests", "", ["GWENT", "MISSABLE"]),
      item("gm-allcards", "All cards collected", "", ["GWENT"]),
    ]),
  ]),

  section("cleanup", "🏆 Cleanup", [
    group("Post-game", [
      item("cu-combat", "Combat trophies complete"),
      item("cu-contracts", "Contracts complete"),
      item("cu-sides", "Side quests complete"),
    ]),
  ]),

  section("dlc-run", "🩸 DLC – Run Planner", [
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

  section("gwent-win", "♠️ Gwent – Easy Win Setup", [
    group("Deck", [
      item("gw-deck-nr", "Use Northern Realms", "", ["GWENT"]),
      item("gw-deck-22", "Keep deck ~22 cards", "", ["GWENT"]),
      item("gw-deck-remove", "Remove weak cards", "", ["GWENT"]),
    ]),
    group("Priority cards", [
      item("gw-prio-spies", "Spy cards", "", ["GWENT"]),
      item("gw-prio-decoys", "Decoys", "", ["GWENT"]),
      item("gw-prio-medics", "Medics", "", ["GWENT"]),
      item("gw-prio-bond", "Tight Bond", "", ["GWENT"]),
    ]),
    group("Strategy", [
      item("gw-r1", "Round 1: Use spies / Gain card advantage", "", ["GWENT"]),
      item("gw-r2", "Round 2: Force opponent to waste cards", "", ["GWENT"]),
      item("gw-r3", "Round 3: Play strongest combo / Use leader ability", "", ["GWENT"]),
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
    group("Potions", [
      item("ob-swallow", "Swallow"),
      item("ob-thunderbolt", "Thunderbolt"),
      item("ob-tawny", "Tawny Owl"),
    ]),
    group("Playstyle", [
      item("ob-quen-up", "Quen always active"),
      item("ob-dodge", "Dodge > roll"),
      item("ob-fast", "Fast attacks"),
      item("ob-oils", "Oils active"),
    ]),
  ]),

  section("safety-tracker", "📊 Final Safety Tracker", [
    group("Must be true", [
      item("st-keira", "Keira alive", "", ["MISSABLE"]),
      item("st-cerys", "Cerys ruler", "", ["MISSABLE"]),
      item("st-ciri", "Ciri best ending", "", ["MISSABLE"]),
      item("st-yen", "Yen romance locked", "", ["MISSABLE"]),
      item("st-gwent", "No failed Gwent", "", ["GWENT", "MISSABLE"]),
    ]),
  ]),

  section("save-tracker", "💾 Save Tracker", [
    group("Saves", [
      item("sv-pre-km", "Pre-Kaer Morhen save", "", ["SAFE", "MISSABLE"]),
      item("sv-pre-final", "Pre-final act save", "", ["SAFE", "MISSABLE"]),
      item("sv-rotate", "Multiple rotating saves", "", ["SAFE"]),
    ]),
  ]),

  section("final-rules", "💡 Final Rules", [
    group("Rules", [
      item("fr-dontrush", "Don’t rush story"),
      item("fr-gwent-early", "Gwent early = easy", "", ["GWENT"]),
      item("fr-save", "Save before big choices", "", ["SAFE", "MISSABLE"]),
      item("fr-stop", "If unsure → STOP and check", "", ["SAFE"]),
    ]),
  ]),
];

// ----------------------------
// 2) Isle of Mists Hard Stop (Warning + checklist)
// ----------------------------
const ISLE_OF_MISTS = section("isle-of-mists", "⚠️ Isle of Mists – HARD STOP (Point of No Return)", [
  group("Do BEFORE sailing into the fog", [
    item("iom-backup-save", "Create a dedicated backup save (separate slot)", "The game warns you here—treat it as a cut-off.", ["SAFE", "MISSABLE"]),
    item("iom-brothers", "Complete all ‘Brothers in Arms’ ally recruitment quests", "These link to Kaer Morhen allies.", ["MISSABLE"]),
    item("iom-keira", "Keira questline resolved (and sent to Kaer Morhen)", "Do NOT leave this hanging.", ["MISSABLE"]),
    item("iom-triss", "Triss questline resolved (no romance if following your plan)", "", ["MISSABLE"]),
    item("iom-yen", "Yennefer ‘Last Wish’ resolved (lock romance)", "", ["MISSABLE"]),
    item("iom-radovid", "Progress Radovid/Dijkstra chain correctly (if going for Assassin of Kings)", "", ["MISSABLE"]),
    item("iom-gwent", "Finish any active Gwent quests and buy cards you can access now", "", ["GWENT", "MISSABLE"]),
    item("iom-clear-quests", "Clear side quests involving key characters (don’t leave them in-progress)", "Many character quests can fail/lock after this.", ["MISSABLE"]),
  ], { warn: true }),
], { open: false });

// We’ll treat these as the “banner-required” items:
const IOM_REQUIRED_IDS = new Set([
  "iom-backup-save",
  "iom-brothers",
  "iom-keira",
  "iom-triss",
  "iom-yen",
  "iom-radovid",
  "iom-gwent",
  "iom-clear-quests",
]);

// ----------------------------
// 3) Trophy Checklist (Base + HoS + B&W) + Optional NG+ goals
// Trophy names align to common published trophy lists. [1](https://www.gamepressure.com/thewitcher3/trophies-list/zb7875)[6](https://www.ign.com/wikis/the-witcher-3-wild-hunt/Achievements_and_Trophies)[7](https://www.truetrophies.com/game/The-Witcher-3-Wild-Hunt-v2/dlc/Hearts-of-Stone)[8](https://www.truetrophies.com/game/The-Witcher-3-Wild-Hunt-Complete-Edition/dlc/Blood-and-Wine)
// ----------------------------
const TROPHIES = [
  section("trophy-base-story", "🏆 Trophies – Base Game (Story + Endings)", [
    group("Story / main progression", [
      item("tr-lilac", "Lilac and Gooseberries", "Find Yennefer of Vengerberg.", ["TROPHY", "STORY"]),
      item("tr-friend", "A Friend in Need", "Find and free Dandelion.", ["TROPHY", "STORY"]),
      item("tr-necro", "Necromancer", "Help Yennefer extract information from Skjall’s body.", ["TROPHY", "STORY"]),
      item("tr-family", "Family Counselor", "Find the baron’s wife and daughter.", ["TROPHY", "STORY"]),
      item("tr-somethingmore", "Something More", "Find Ciri.", ["TROPHY", "STORY"]),
      item("tr-xenonaut", "Xenonaut", "Visit Tir ná Lia and convince Ge’els to betray Eredin.", ["TROPHY", "STORY"]),
      item("tr-kingdead", "The King is Dead", "Defeat Eredin.", ["TROPHY", "STORY"]),
    ]),
    group("Difficulty trophies", [
      item("tr-passed", "Passed the Trial", "Finish the game on any difficulty.", ["TROPHY", "DM"]),
      item("tr-gautlet", "Ran the Gauntlet", "Finish on Blood & Broken Bones or Death March.", ["TROPHY", "DM"]),
      item("tr-walked", "Walked the Path", "Finish on Death March.", ["TROPHY", "DM"]),
    ], { warn: true }),
  ]),

  section("trophy-base-missables", "🏆 Trophies – Base Game (Missables / Quest Outcomes)", [
    group("Missable / branching", [
      item("tr-kingmaker", "Kingmaker", "Choose Skellige’s ruler subplot.", ["TROPHY", "MISSABLE"]),
      item("tr-assassin", "Assassin of Kings", "Take part in the assassination of King Radovid.", ["TROPHY", "MISSABLE"]),
      item("tr-friendsbenefits", "Friends With Benefits", "Complete Keira Metz subplot.", ["TROPHY", "MISSABLE"]),
      item("tr-fullcrew", "Full Crew", "Bring all possible allies to Kaer Morhen.", ["TROPHY", "MISSABLE"]),
      item("tr-geraltfriends", "Geralt and Friends", "Win a Gwent round using only neutral cards.", ["TROPHY", "GWENT"]),
      item("tr-allin", "All In", "Play three hero cards in one Gwent round and win.", ["TROPHY", "GWENT"]),
      item("tr-gwentmaster", "Gwent Master", "Win Passiflora tournament (Tybalt).", ["TROPHY", "GWENT", "MISSABLE"]),
      item("tr-cardcollector", "Card Collector", "Acquire all base-game Gwent cards.", ["TROPHY", "GWENT", "MISSABLE"]),
    ], { warn: true }),
    group("Notes", [
      item("tr-iom-note", "IMPORTANT: Back up a save before Isle of Mists", "Many quests/content can fail after the warning.", ["SAFE", "MISSABLE"]),
    ]),
  ]),

  section("trophy-base-combat", "🏆 Trophies – Base Game (Combat / Exploration / Misc)", [
    group("Character / build / exploration", [
      item("tr-dendro", "Dendrologist", "Acquire all abilities in one tree.", ["TROPHY"]),
      item("tr-mutant", "Mutant", "Fill all mutagen slots.", ["TROPHY"]),
      item("tr-globetrotter", "Globetrotter", "Discover 100 fast travel points.", ["TROPHY"]),
      item("tr-pest", "Pest Control", "Destroy all monster nests in Velen/Novigrad OR Skellige.", ["TROPHY"]),
      item("tr-professional", "Geralt: The Professional", "Complete all Witcher contracts.", ["TROPHY"]),
      item("tr-armed", "Armed and Dangerous", "Find and equip a full set of Witcher gear.", ["TROPHY"]),
      item("tr-power", "Power Overwhelming", "Have all possible Place of Power bonuses active at once.", ["TROPHY"]),
      item("tr-bookworm", "Bookworm", "Read 30 books/journals/documents.", ["TROPHY"]),
      item("tr-cook", "Let’s Cook!", "Learn 12 potion formulae.", ["TROPHY"]),
      item("tr-bombard", "Bombardier", "Collect formulae for 6 different bomb types.", ["TROPHY"]),
      item("tr-munchkin", "Munchkin", "Reach character development level 35.", ["TROPHY"]),
    ]),
    group("Combat feats", [
      item("tr-axii", "The Enemy of My Enemy", "Use Axii to force one opponent to kill another (20 times).", ["TROPHY"]),
      item("tr-humpty", "Humpty Dumpty", "Knock 10 opponents off somewhere high with Aard.", ["TROPHY"]),
      item("tr-env", "Environmentally Unfriendly", "Kill 50 opponents using the environment.", ["TROPHY"]),
      item("tr-kaertrained", "Kaer Morhen Trained", "Perform 10 effective counterattacks in a row.", ["TROPHY"]),
      item("tr-canttouch", "Can’t Touch This!", "Kill 5 foes without taking damage and without Quen.", ["TROPHY"]),
      item("tr-evilest", "That Is the Evilest Thing…", "Ignite Dragon’s Dream gas with a burning opponent (10 times).", ["TROPHY"]),
      item("tr-butcher", "Butcher of Blaviken", "Kill at least 5 opponents in under 10 seconds.", ["TROPHY"]),
      item("tr-triple", "Triple Threat", "Kill 3 opponents in one fight using 3 different methods.", ["TROPHY"]),
      item("tr-brawler", "Brawler", "Defeat Olaf (Skellige fistfight champion).", ["TROPHY"]),
      item("tr-overkill", "Overkill", "Cause bleeding, poisoning and burning simultaneously (10 times).", ["TROPHY"]),
      item("tr-marksman", "Master Marksman", "Kill 50 opponents with headshots using the crossbow.", ["TROPHY"]),
      item("tr-whatwas", "What Was That?", "Attack, counter, Sign, bomb in under 4 seconds.", ["TROPHY"]),
      item("tr-evenodds", "Even Odds", "Kill 2 contract monsters without Signs/potions/oils/bombs/mutagens.", ["TROPHY"]),
    ]),
    group("Activities", [
      item("tr-brawlmaster", "Brawl Master", "Complete all fistfighting quests (Velen, Skellige, Novigrad).", ["TROPHY"]),
      item("tr-fastfurious", "Fast and Furious", "Win all horse races in the game.", ["TROPHY"]),
      item("tr-firehole", "Fire in the Hole", "Destroy 10 monster nests using bombs.", ["TROPHY"]),
      item("tr-fistsouth", "Fist of the South Star", "Win a fistfight without taking damage.", ["TROPHY"]),
    ]),
    group("Contracts (named trophies)", [
      item("tr-shrieker", "Shrieker", "Complete the Shrieker contract.", ["TROPHY"]),
      item("tr-vampire", "Fearless Vampire Slayer", "Complete the Sarasti contract.", ["TROPHY"]),
      item("tr-woodland", "Woodland Spirit", "Complete the Woodland Spirit contract.", ["TROPHY"]),
      item("tr-fiend", "Fiend or Foe?", "Complete Morvudd contract path.", ["TROPHY"]),
      item("tr-ashes", "Ashes to Ashes", "Complete the Therazane contract.", ["TROPHY"]),
      item("tr-doppler", "The Doppler Effect", "Complete the Doppler contract.", ["TROPHY"]),
    ]),
  ]),

  section("trophy-hos", "🩸 Trophies – Hearts of Stone (DLC)", [
    group("Hearts of Stone (13 trophies)", [
      item("hos-toad", "I’m Not Kissing That", "Kill the prince cursed into a toad.", ["TROPHY", "DLC"]),
      item("hos-wedding", "Let the Good Times Roll!", "Do all wedding activities.", ["TROPHY", "DLC", "MISSABLE"]),
      item("hos-shop", "Shopaholic", "Buy all auction items.", ["TROPHY", "DLC", "MISSABLE"]),
      item("hos-curator", "Curator of Nightmares", "Recreate all Iris’ nightmares.", ["TROPHY", "DLC", "MISSABLE"]),
      item("hos-pacta", "Pacta Sunt Servanda", "Finish Hearts of Stone.", ["TROPHY", "DLC", "STORY"]),
      item("hos-many", "When It’s Many Against One…", "Provoke all Iris’ Nightmares at once and defeat them.", ["TROPHY", "DLC", "MISSABLE"]),
      item("hos-return", "Return to Sender", "Kill 3 opponents with their own arrows.", ["TROPHY", "DLC"]),
      item("hos-seven", "Can Quit Anytime I Want", "Be under 7 potions/decoctions at once.", ["TROPHY", "DLC"]),
      item("hos-rose", "Wild Rose Dethorned", "Defeat fallen knights and loot camps.", ["TROPHY", "DLC"]),
      item("hos-ofieri", "I Wore Ofieri Before It Was Cool", "Collect all Ofieri gear and at least one sword.", ["TROPHY", "DLC"]),
      item("hos-moo", "Moo-rderer", "Kill 20 cows.", ["TROPHY", "DLC"]),
      item("hos-rad", "Rad Steez, Bro!", "Slide downhill uninterrupted for 10 seconds.", ["TROPHY", "DLC"]),
      item("hos-killedit", "Killed It", "Win a Gwent round with 187+ strength.", ["TROPHY", "DLC", "GWENT"]),
    ], { warn: true }),
  ]),

  section("trophy-baw", "🍷 Trophies – Blood and Wine (DLC)", [
    group("Blood and Wine (13 trophies)", [
      item("baw-south", "The Witcher’s Gone South", "Travel to Toussaint.", ["TROPHY", "DLC", "STORY"]),
      item("baw-david", "David and Golyat", "Kill Golyat with a crossbow bolt to his eye.", ["TROPHY", "DLC", "MISSABLE"]),
      item("baw-last", "Last Action Hero", "Be decorated with the Order of Vitis Vinifera.", ["TROPHY", "DLC", "STORY"]),
      item("baw-kling", "Kling of the Clink", "Serve time in Toussaint.", ["TROPHY", "DLC", "STORY"]),
      item("baw-knight", "A Knight to Remember", "Flawless victory in all tourney competitions.", ["TROPHY", "DLC", "MISSABLE"]),
      item("baw-virtues", "Embodiment of the Five Virtues", "Receive Aerondight.", ["TROPHY", "DLC"]),
      item("baw-house", "Playing House", "Use all options for developing Corvo Bianco.", ["TROPHY", "DLC"]),
      item("baw-stone", "Turned Every Stone", "Find all grandmaster diagrams (each school).", ["TROPHY", "DLC"]),
      item("baw-gwent", "I Have a Gwent Problem", "Collect all cards in the Skellige deck.", ["TROPHY", "DLC", "GWENT"]),
      item("baw-grapes", "The Grapes of Wrath Stomped", "Unite vineyards and have wine named in your honor.", ["TROPHY", "DLC"]),
      item("baw-dressed", "Dressed to Kill", "Unlock bonus for equipping all gear from one School.", ["TROPHY", "DLC"]),
      item("baw-mutation", "Weapon “W”", "Develop a mutation.", ["TROPHY", "DLC"]),
      item("baw-hasta", "Hasta la Vista™", "Kill a frozen opponent with a crossbow bolt.", ["TROPHY", "DLC"]),
    ], { warn: true }),
  ]),

  section("ngplus-goals", "🆕 Optional – NG+ Goals (No separate trophy pack)", [
    group("NG+ (optional)", [
      item("ng-gear", "Start NG+ with endgame gear & oils ready", "Prep so Death March NG+ is painless.", ["NG+"]),
      item("ng-build", "Plan final build (combat/signs/alchemy)", "Respec if needed.", ["NG+"]),
      item("ng-clean", "Use NG+ for any alternative story choices", "Only if you want to see other outcomes.", ["NG+"]),
    ]),
  ]),
];

// All sections in the order we want them on page:
const ALL_SECTIONS = [
  ...RUN_PLANNER,
  ISLE_OF_MISTS,
  ...TROPHIES
];

// ----------------------------
// Rendering: checklist sections
// ----------------------------
function ensureContainer() {
  // Must exist in your index.html, but we fail-soft:
  if (!$("checklistRoot")) {
    const main = document.querySelector("main") || document.body;
    main.appendChild(el("div", { id: "checklistRoot" }));
  }
  if (!$("navLinks")) {
    const root = document.querySelector("main") || document.body;
    const nav = el("div", { class: "card nav" }, [
      el("div", { class: "nav__title" }, "Quick Jump"),
      el("div", { id: "navLinks", class: "nav__links" }),
    ]);
    root.insertBefore(nav, $("checklistRoot"));
  }
}

function sectionProgress(sec) {
  let done = 0;
  let total = 0;
  sec.groups.forEach((g) => {
    g.items.forEach((it) => {
      total++;
      if (loadBool(`task:${it.id}`)) done++;
    });
  });
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

function overallProgress() {
  let done = 0;
  let total = 0;
  ALL_SECTIONS.forEach((sec) => {
    sec.groups.forEach((g) => {
      g.items.forEach((it) => {
        // If user hides NG+ by choice, we still count it as part of the dataset,
        // but we will display overall as “everything visible” for less confusion.
        if (it.tags?.includes("NG+") && !isNgPlusVisible()) return;
        total++;
        if (loadBool(`task:${it.id}`)) done++;
      });
    });
  });
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

function isNgPlusVisible() {
  return loadBool("ui:showNgPlus", false);
}

function setNgPlusVisible(val) {
  saveBool("ui:showNgPlus", val);
}

function buildNav() {
  const nav = $("navLinks");
  if (!nav) return;
  nav.innerHTML = "";

  ALL_SECTIONS.forEach((sec) => {
    if (sec.id === "ngplus-goals" && !isNgPlusVisible()) return;
    const a = el("a", { href: `#sec-${sec.id}` }, sec.title);
    nav.appendChild(a);
  });

  // Ensure Gwent jump exists if your index.html has that section
  if ($("gwentSection")) {
    nav.appendChild(el("a", { href: "#gwentSection" }, "🃏 Gwent Cards"));
  }
}

function renderSection(sec) {
  const wrap = el("section", {
    class: "card section",
    id: `sec-${sec.id}`,
    "data-open": sec.open ? "true" : "false",
  });

  const { done, total, pct } = sectionProgress(sec);

  const headLeft = el("div", { class: "section__title" }, [
    el("h2", {}, sec.title),
    el("div", { class: "muted small" }, `${done} / ${total} complete`),
  ]);

  const headRight = el("div", { class: "section__meta" }, [
    el("div", { class: sec.groups.some(g => g.warn) ? "badge badge--warn" : "badge" }, `${pct}%`),
  ]);

  const head = el("div", { class: "section__head" }, [headLeft, headRight]);

  const body = el("div", { class: "section__body" });

  sec.groups.forEach((g) => {
    // hide NG+ section if toggle off
    const isNgGroup = g.items.some(i => i.tags?.includes("NG+"));
    if (isNgGroup && !isNgPlusVisible()) return;

    const gWrap = el("div", { class: "group" });
    const gTitle = el(
      "h3",
      {
        class: g.warn ? "badge badge--warn" : "badge",
        style:
          "display:inline-block;margin-bottom:10px;" +
          (g.warn
            ? "background:rgba(255,200,87,0.12);border-color:rgba(255,200,87,0.25);"
            : "background:rgba(102,227,196,0.10);border-color:rgba(102,227,196,0.25);"),
      },
      g.title
    );
    gWrap.appendChild(gTitle);

    g.items.forEach((it) => {
      // hide NG+ items if toggle off
      if (it.tags?.includes("NG+") && !isNgPlusVisible()) return;

      const row = el("label", { class: "item" });

      const cb = el("input", { type: "checkbox" });
      cb.checked = loadBool(`task:${it.id}`);

      cb.addEventListener("change", () => {
        saveBool(`task:${it.id}`, cb.checked);
        // Re-render everything reliably (small enough)
        renderAll();
      });

      const textWrap = el("div", { class: "item__text" }, [
        el("div", {}, it.text),
      ]);

      if (it.note) {
        textWrap.appendChild(el("div", { class: "item__note" }, it.note));
      }

      if (it.tags && it.tags.length) {
        const tagLine = el("div", { class: "item__note" });
        tagLine.appendChild(
          el(
            "span",
            {
              style:
                "display:inline-flex;gap:6px;flex-wrap:wrap;margin-top:6px;",
            },
            it.tags.map((t) =>
              el(
                "span",
                {
                  class: t === "MISSABLE" || t === "DM" ? "badge badge--warn" : "badge",
                  style:
                    "font-size:11px;padding:4px 8px;border-radius:999px;opacity:0.95;",
                },
                t
              )
            )
          )
        );
        textWrap.appendChild(tagLine);
      }

      row.appendChild(cb);
      row.appendChild(textWrap);
      gWrap.appendChild(row);
    });

    body.appendChild(gWrap);
  });

  head.addEventListener("click", () => {
    wrap.dataset.open = wrap.dataset.open === "true" ? "false" : "true";
  });

  wrap.appendChild(head);
  wrap.appendChild(body);
  return wrap;
}

function ensureIoMBanner() {
  // If your index.html already contains a banner div, we use it.
  // Otherwise we create one under the summary card (or at top of main).
  let banner = $("iomBanner");
  if (banner) return banner;

  const container = document.querySelector(".container") || document.querySelector("main") || document.body;
  banner = el("div", { id: "iomBanner", class: "card", style: "border-color:rgba(255,200,87,0.25);background:rgba(255,200,87,0.08);display:none;" }, [
    el("div", { class: "card__header" }, [
      el("div", {}, [
        el("h2", {}, "⚠️ Isle of Mists WARNING (Point of No Return)"),
        el("p", { class: "muted" }, "If you sail to the Isle of Mists too early, multiple quests/content can become unavailable. Clear your Hard Stop items first."),
      ]),
      el("div", { class: "badge badge--warn" }, "HARD STOP"),
    ]),
    el("div", { id: "iomBannerBody", class: "muted small" }),
    el("div", { style: "margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;" }, [
      el("a", { href: "#sec-isle-of-mists", class: "btn btn--ghost", style: "text-decoration:none;display:inline-block;" }, "Go to Hard Stop section"),
    ]),
  ]);

  // Try to place after summary card if exists
  const summary = document.querySelector(".summary");
  if (summary && summary.parentNode) summary.parentNode.insertBefore(banner, summary.nextSibling);
  else container.insertBefore(banner, container.firstChild);

  return banner;
}

function updateIoMBanner() {
  const banner = ensureIoMBanner();
  const body = $("iomBannerBody");
  if (!banner || !body) return;

  // Count required items remaining
  let remaining = [];
  ISLE_OF_MISTS.groups.forEach((g) => {
    g.items.forEach((it) => {
      if (!IOM_REQUIRED_IDS.has(it.id)) return;
      if (!loadBool(`task:${it.id}`)) remaining.push(it.text);
    });
  });

  if (remaining.length === 0) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "block";
  body.innerHTML = `<strong>${remaining.length}</strong> Hard Stop item(s) still unchecked:<br>• ${remaining
    .slice(0, 6)
    .map((x) => x)
    .join("<br>• ")}${remaining.length > 6 ? "<br>• …" : ""}`;
}

function updateSummaryProgress() {
  const { done, total, pct } = overallProgress();

  if ($("overallText")) $("overallText").textContent = `${pct}%`;
  if ($("overallBar")) $("overallBar").style.width = `${pct}%`;
  if ($("overallCount")) $("overallCount").textContent = `${done} / ${total}`;

  // Optional: add a NG+ toggle into summary if your HTML has a placeholder
  let ngToggle = $("toggleNgPlus");
  if (!ngToggle) {
    // Fail-soft: if there is a quickNav card, we’ll add it there once.
    const quickNav = $("quickNav") || document.querySelector(".nav.card") || null;
    if (quickNav && !quickNav.dataset.ngAdded) {
      quickNav.dataset.ngAdded = "true";
      const line = el("label", { class: "checkboxLine", style: "margin-top:10px;" }, [
        el("input", { type: "checkbox", id: "toggleNgPlus" }),
        el("span", {}, "Show NG+ goals"),
      ]);
      quickNav.appendChild(line);
      ngToggle = $("toggleNgPlus");
    }
  }
  if (ngToggle) {
    ngToggle.checked = isNgPlusVisible();
    ngToggle.onchange = () => {
      setNgPlusVisible(ngToggle.checked);
      renderAll();
    };
  }
}

// ----------------------------
// 4) Export / Import / Reset
// ----------------------------
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
      Object.entries(obj).forEach(([k, v]) => {
        if (k.startsWith(LS_PREFIX)) localStorage.setItem(k, v);
      });
      renderAll();
      if (typeof refreshGwentUI === "function") refreshGwentUI();
      alert("Save imported ✅");
    } catch {
      alert("That file doesn’t look like a valid v2 save.");
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
  keys.forEach((k) => localStorage.removeItem(k));
  renderAll();
  if (typeof refreshGwentUI === "function") refreshGwentUI();
}

// ----------------------------
// 5) Gwent Card Checklist (from ./data/cards.json)
// ----------------------------
let GWENT_ALL = [];
let GWENT_FILTERED = [];

function gwentStorageKey(card) {
  return `gwent:${card.expansion}|${card.deck}|${card.territory}|${card.name}|${card.type}|${card.details}`;
}
function isGwentChecked(card) {
  return loadBool(gwentStorageKey(card), false);
}
function setGwentChecked(card, val) {
  saveBool(gwentStorageKey(card), val);
}

async function loadGwentCards() {
  if (!$("gwentRoot")) return; // your index.html might not include Gwent section yet

  const localUrl = "./data/cards.json";
  let data;
  try {
    const r = await fetch(localUrl, { cache: "no-store" });
    if (!r.ok) throw new Error("No cards.json");
    data = await r.json();
  } catch {
    // If local missing, we just stop quietly (no crash)
    $("gwentCount") && ($("gwentCount").textContent = "Missing ./data/cards.json");
    return;
  }

  const cards = Array.isArray(data) ? data : (data.cards || []);
  GWENT_ALL = cards.map((c) => ({
    expansion: c.expansion || "Unknown",
    deck: c.deck || "Unknown",
    territory: c.territory || "Unknown",
    name: c.name || "Unknown",
    type: c.type || "",
    details: c.details || "",
    picture: c.picture || "",
  }));

  initGwentFilters();
  applyGwentFilters();
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b));
}

function initGwentFilters() {
  // Fail-soft if your HTML doesn’t have all filters
  const expSel = $("gwentExpansion");
  const deckSel = $("gwentDeck");
  const terrSel = $("gwentTerritory");

  if (expSel && expSel.options.length === 1) {
    uniqueSorted(GWENT_ALL.map((c) => c.expansion)).forEach((e) => expSel.add(new Option(e, e)));
  }
  if (deckSel && deckSel.options.length === 1) {
    uniqueSorted(GWENT_ALL.map((c) => c.deck)).forEach((d) => deckSel.add(new Option(d, d)));
  }
  if (terrSel && terrSel.options.length === 1) {
    uniqueSorted(GWENT_ALL.map((c) => c.territory)).forEach((t) => terrSel.add(new Option(t, t)));
  }

  const ids = ["gwentSearch", "gwentExpansion", "gwentDeck", "gwentTerritory", "gwentOnlyUnchecked"];
  ids.forEach((id) => {
    const node = $(id);
    if (!node) return;
    const ev = id === "gwentOnlyUnchecked" ? "change" : "input";
    node.addEventListener(ev, applyGwentFilters);
  });
}

function applyGwentFilters() {
  const q = ($("gwentSearch")?.value || "").trim().toLowerCase();
  const exp = $("gwentExpansion")?.value || "";
  const deck = $("gwentDeck")?.value || "";
  const terr = $("gwentTerritory")?.value || "";
  const onlyUnchecked = $("gwentOnlyUnchecked")?.checked || false;

  GWENT_FILTERED = GWENT_ALL.filter((c) => {
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
  if (!$("gwentBar") || !$("gwentProgressText") || !$("gwentCount")) return;

  const total = GWENT_ALL.length;
  let done = 0;
  for (const c of GWENT_ALL) if (isGwentChecked(c)) done++;

  const pct = total ? Math.round((done / total) * 100) : 0;
  $("gwentBar").style.width = `${pct}%`;
  $("gwentProgressText").textContent = `${done} / ${total} (${pct}%)`;
  $("gwentCount").textContent = `Showing ${GWENT_FILTERED.length} of ${total} cards`;
}

function renderGwent() {
  const root = $("gwentRoot");
  if (!root) return;
  root.innerHTML = "";

  const groups = new Map();
  for (const c of GWENT_FILTERED) {
    const k = c.territory || "Unknown";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }

  const preferredOrder = [
    "White Orchard", "Velen", "Novigrad", "Skellige", "Kaer Morhen", "Vizima",
    "Toussaint", "Random", "Base Deck", "Unknown"
  ];

  const terrs = [...groups.keys()].sort((a, b) => {
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return a.localeCompare(b);
  });

  terrs.forEach((territory) => {
    const list = groups.get(territory).slice().sort((a, b) => {
      const da = a.deck.localeCompare(b.deck);
      if (da !== 0) return da;
      return a.name.localeCompare(b.name);
    });

    const tDone = list.filter(isGwentChecked).length;
    const tTotal = list.length;
    const tPct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

    const wrap = el("div", { class: "territory", "data-open": "false" });
    const head = el("div", { class: "territory__head", html: `
      <div>
        <strong>${territory}</strong>
        <div class="muted small">${tDone} / ${tTotal} (${tPct}%)</div>
      </div>
      <div class="badge">${tPct}%</div>
    `});

    const body = el("div", { class: "territory__body" });

    list.forEach((card) => {
      const row = el("label", { class: "gwentRow" });
      const cb = el("input", { type: "checkbox" });
      cb.checked = isGwentChecked(card);
      cb.addEventListener("change", () => {
        setGwentChecked(card, cb.checked);
        renderGwent();
        updateGwentProgress();
      });

      const meta = el("div", { class: "gwentMain" }, [
        el("div", { class: "gwentName" }, card.name),
        el("div", { class: "gwentMeta" }, `${card.expansion} • ${card.deck} • ${card.territory}`),
        el("div", { class: "gwentMeta" }, `${card.type}${card.details ? " — " + card.details : ""}`),
      ]);

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

function refreshGwentUI() {
  applyGwentFilters();
}

// ----------------------------
// 6) Render everything
// ----------------------------
function renderAll() {
  ensureContainer();
  buildNav();

  const root = $("checklistRoot");
  if (!root) return;
  root.innerHTML = "";

  ALL_SECTIONS.forEach((sec) => {
    if (sec.id === "ngplus-goals" && !isNgPlusVisible()) return;
    root.appendChild(renderSection(sec));
  });

  updateSummaryProgress();
  updateIoMBanner();
  updateGwentProgress();
}

// ----------------------------
// 7) Wire buttons (fail-soft if missing)
// ----------------------------
function wireButtons() {
  $("btnExport")?.addEventListener("click", exportSave);
  $("btnReset")?.addEventListener("click", resetAll);

  $("fileImport")?.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importSave(f);
    e.target.value = "";
  });
}

// ----------------------------
// Boot
// ----------------------------
(function boot() {
  wireButtons();
  renderAll();
  loadGwentCards();
})();

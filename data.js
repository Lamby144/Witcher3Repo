const GAME_DATA = {

/* =========================
   🗺️ MAIN PLATINUM ROUTE
========================= */

route: [
  {
    id: "white-orchard",
    name: "White Orchard (DO EVERYTHING)",
    level: "1-4",
    priority: "CRITICAL_START",
    rules: [
      "Complete ALL side quests before leaving",
      "Collect ALL Gwent cards here (MISSABLE)",
      "Play Scholar Gwent match (mandatory)",
      "Do NOT leave region early"
    ],
    quests: [
      {
        id: "wo_gwent_scholar",
        name: "Play Scholar Gwent Match",
        type: "gwent",
        missable: true,
        completed: false
      },
      {
        id: "wo_beast",
        name: "The Beast of White Orchard",
        type: "main",
        missable: false,
        completed: false
      }
    ]
  },

  {
    id: "velen",
    name: "Velen (Early Game Core)",
    level: "4-10",
    priority: "HIGH",
    rules: [
      "Do Bloody Baron BEFORE free roaming heavily",
      "Unlock Claywich merchant ASAP (missable rescue)",
      "Start full Gwent collection immediately"
    ],
    quests: [
      {
        id: "velen_baron",
        name: "Bloody Baron Questline",
        type: "main",
        missable: false,
        completed: false
      },
      {
        id: "velen_claywich",
        name: "Rescue Claywich Merchant",
        type: "gwent_unlock",
        missable: true,
        completed: false
      }
    ]
  },

  {
    id: "novigrad",
    name: "Novigrad (MISSABLE WARNING ZONE)",
    level: "10-16",
    priority: "CRITICAL",
    rules: [
      "DO NOT start Isle of Mists yet",
      "Complete Now or Never BEFORE story lock",
      "Finish ALL Gwent innkeepers BEFORE progression"
    ],
    quests: [
      {
        id: "nov_now_or_never",
        name: "Now or Never",
        type: "main",
        missable: true,
        completed: false
      },
      {
        id: "nov_gwent_city",
        name: "Big City Players",
        type: "gwent",
        missable: true,
        completed: false
      }
    ]
  },

  {
    id: "skellige",
    name: "Skellige (Midgame Exploration)",
    level: "16-22",
    priority: "HIGH",
    rules: [
      "Finish ALL Gwent before Isle of Mists",
      "Complete Skellige contracts BEFORE main story push"
    ],
    quests: [
      {
        id: "sk_gwent_chain",
        name: "Skellige Gwent Chain",
        type: "gwent",
        missable: true,
        completed: false
      },
      {
        id: "sk_explore",
        name: "Explore Skellige Isles",
        type: "exploration",
        missable: false,
        completed: false
      }
    ]
  },

  {
    id: "endgame_setup",
    name: "Endgame Preparation (CRITICAL LOCK POINT)",
    level: "22+",
    priority: "CRITICAL_FINAL_CHECK",
    rules: [
      "Full Crew must be recruited",
      "All Gwent cards must be collected",
      "No romance locks pending decisions"
    ],
    quests: [
      {
        id: "end_full_crew",
        name: "Recruit All Allies (Full Crew)",
        type: "main",
        missable: true,
        completed: false
      }
    ]
  }
]

};

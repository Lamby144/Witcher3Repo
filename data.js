const GAME_DATA = {
  route: [
    {
      id: "roadmap",
      name: "Roadmap / Setup",
      level: "Start",
      priority: "CRITICAL_START",
      rules: [
        "Play on Death March from the beginning (default roadmap).",
        "Keep multiple manual saves. Make a backup save before big story points."
      ],
      quests: [
        { id: "setup_deathmarch", name: "Set difficulty to Death March and keep it there", type: "meta", missable: false },
        { id: "setup_saves", name: "Create rotating manual saves (at least 5 slots)", type: "meta", missable: false }
      ]
    },

    {
      id: "white-orchard",
      name: "White Orchard (Do Everything)",
      level: "1–4",
      priority: "CRITICAL_START",
      rules: [
        "Do all side content before leaving.",
        "Buy/earn early Gwent cards and play the tutorial match."
      ],
      quests: [
        { id: "wo_main", name: "Finish White Orchard main quests", type: "main", missable: false },
        { id: "wo_cleanup", name: "Clear POIs and side quests before leaving", type: "side", missable: true }
      ]
    },

    {
      id: "velen",
      name: "Velen (Early Game Core)",
      level: "4–10",
      priority: "HIGH",
      rules: [
        "Build your Gwent collection early. Buy cards from every inn/merchant you meet.",
        "Do contracts and side quests to avoid trophy misses later."
      ],
      quests: [
        { id: "velen_baron", name: "Progress Bloody Baron questline", type: "main", missable: false },
        { id: "velen_contracts", name: "Start working through Witcher contracts (trophy)", type: "contract", missable: false }
      ]
    },

    {
      id: "novigrad",
      name: "Novigrad (Missable Zone)",
      level: "10–16",
      priority: "CRITICAL",
      rules: [
        "⚠ Key missables happen around major Novigrad questlines and side stories.",
        "Keep a manual backup save before progressing too far."
      ],
      quests: [
        { id: "nov_gwent", name: "Keep clearing Gwent players and tournament chain", type: "gwent", missable: true },
        { id: "nov_side", name: "Finish major side questlines before pushing late-game story", type: "side", missable: true }
      ]
    },

    {
      id: "skellige",
      name: "Skellige (Midgame Exploration)",
      level: "16–22",
      priority: "HIGH",
      rules: [
        "Do contracts and side content as you go.",
        "Prepare for Isle of Mists point-of-no-return."
      ],
      quests: [
        { id: "sk_kingmaker", name: "Complete Skellige ruler subplot (trophy)", type: "side", missable: true },
        { id: "sk_cleanup", name: "Cleanup: contracts, races, fistfights, Gwent", type: "side", missable: false }
      ]
    },

    {
      id: "endgame_setup",
      name: "Pre–Isle of Mists Checklist (CRITICAL LOCK POINT)",
      level: "20+",
      priority: "CRITICAL_FINAL_CHECK",
      rules: [
        "⚠ Make a backup save BEFORE Isle of Mists.",
        "Complete ally recruitment and missable questlines before continuing."
      ],
      quests: [
        { id: "preisle_backup", name: "Make a dedicated backup save now (Isle of Mists lock)", type: "meta", missable: true },
        { id: "preisle_allies", name: "Finish ally recruitment for Kaer Morhen (Full Crew trophy)", type: "side", missable: true },
        { id: "preisle_gwent", name: "Double-check Gwent missables & tournament cards", type: "gwent", missable: true }
      ]
    },

    {
      id: "ngplus_prep",
      name: "New Game+ Preparation",
      level: "Endgame",
      priority: "HIGH",
      rules: [
        "NG+ resets map discovery and you lose your Gwent card collection.",
        "Use this section to prep before starting NG+."
      ],
      quests: [
        { id: "ngp_save", name: "Create a clean ‘Post-ending’ save for NG+ start", type: "meta", missable: false },
        { id: "ngp_stash", name: "Move preferred gear into stash (sets/weapons)", type: "meta", missable: false },
        { id: "ngp_note_gwent", name: "Note: NG+ does NOT keep your Gwent collection", type: "meta", missable: false }
      ]
    },

    {
      id: "ngplus",
      name: "New Game+ (Second Run / Cleanup)",
      level: "Scaled",
      priority: "HIGH",
      rules: [
        "Use NG+ to mop up anything missed if needed.",
        "If earning Death March here, keep difficulty fixed for the whole run."
      ],
      quests: [
        { id: "ng_start", name: "Start NG+ from your post-ending save", type: "meta", missable: false }
      ]
    }
  ]
};

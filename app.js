const app = document.getElementById("app");

function buildSearchText(task) {
  const parts = [
    task.name,
    task.type,
    task.regionName,
    task.meta?.source,
    task.meta?.details,
    task.meta?.obtainType,
    task.meta?.territory,
    task.meta?.deck
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function renderRegion(regionName, levelText, tasks) {
  const section = document.createElement("div");
  section.className = "section";

  const header = document.createElement("h2");
  header.innerText = `${regionName} (${levelText})`;

  const content = document.createElement("div");
  content.className = "content";

  header.onclick = () => {
    content.style.display = content.style.display === "block" ? "none" : "block";
  };

  tasks.forEach(task => {
    const label = document.createElement("label");
    label.dataset.search = buildSearchText(task);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = localStorage.getItem(task.id) === "done";

    checkbox.onchange = () => {
      if (checkbox.checked) localStorage.setItem(task.id, "done");
      else localStorage.removeItem(task.id);

      if (typeof AIRouter !== "undefined") AIRouter.refresh();
    };

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.innerText = task.name;

    label.appendChild(checkbox);
    label.appendChild(textSpan);

    // Optional meta line (works for both your gwent.js and loader dataset)
    const metaText =
      task.meta?.source ||
      task.meta?.details ||
      (task.meta?.obtainType ? `${task.meta.obtainType} – ${task.meta.details || ""}`.trim() : "");

    if (metaText) {
      const meta = document.createElement("div");
      meta.className = "task-meta";
      meta.innerText = metaText;
      label.appendChild(meta);
    }

    if (task.missable) {
      label.classList.add("missable");
      label.title = "⚠ MISSABLE CONTENT";
    }

    content.appendChild(label);
  });

  section.appendChild(header);
  section.appendChild(content);
  app.appendChild(section);
}

function renderApp() {
  app.innerHTML = "";

  // Main route sections (quests)
  GAME_DATA.route.forEach(region => {
    renderRegion(region.name, region.level, region.quests);
  });

  // Gwent tasks (from RouteEngine: supports GWENT_DATA OR GwentStore)
  const gwentTasks = RouteEngine.getGwentTasks();
  if (gwentTasks.length) {
    renderRegion("Gwent Cards", "Collection", gwentTasks);
  }
}

// Improved search: hides whole sections with zero matches; expands sections with matches
function hookSearch() {
  const searchEl = document.getElementById("search");
  if (!searchEl) return;

  searchEl.addEventListener("input", e => {
    const value = e.target.value.toLowerCase().trim();
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
      const content = section.querySelector(".content");
      const labels = section.querySelectorAll("label");

      let matches = 0;
      labels.forEach(label => {
        const isMatch = value === "" || (label.dataset.search || "").includes(value);
        label.style.display = isMatch ? "block" : "none";
        if (isMatch) matches++;
      });

      section.style.display = matches > 0 ? "block" : "none";
      if (value !== "" && matches > 0) content.style.display = "block";
    });
  });
}

async function init() {
  // If you have a gwent-loader.js that defines GwentStore, load it
  if (typeof GwentStore !== "undefined" && typeof GwentStore.load === "function") {
    try {
      await GwentStore.load();
    } catch (e) {
      console.warn("Gwent load failed:", e);
    }
  }

  renderApp();
  hookSearch();

  if (typeof AIRouter !== "undefined") AIRouter.init();
}

init();

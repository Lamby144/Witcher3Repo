const app = document.getElementById("app");

function buildSearchText(task) {
  const parts = [
    task.name,
    task.type,
    task.regionName,
    task.expansion,
    task.meta?.source,
    task.meta?.details,
    task.meta?.obtainType,
    task.meta?.territory,
    task.meta?.deck
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

function renderTaskList(tasks) {
  const content = document.createElement("div");
  content.className = "content";

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

  return content;
}

function renderRegionSection({ title, subtitle, quests = [], gwent = [] }) {
  const section = document.createElement("div");
  section.className = "section";

  const header = document.createElement("h2");
  header.innerText = subtitle ? `${title} (${subtitle})` : title;

  const body = document.createElement("div");
  body.className = "content";
  body.style.display = "none";

  header.onclick = () => {
    body.style.display = body.style.display === "block" ? "none" : "block";
  };

  // Quests
  if (quests.length) {
    const h = document.createElement("h3");
    h.className = "subheading";
    h.innerText = "Quests / objectives";
    body.appendChild(h);

    body.appendChild(renderTaskList(quests));
  }

  // Gwent for this region
  if (gwent.length) {
    const h = document.createElement("h3");
    h.className = "subheading";
    h.innerText = "Gwent cards in this region";
    body.appendChild(h);

    // sort by deck/name to keep it tidy
    gwent.sort((a, b) => (a.meta?.deck || "").localeCompare(b.meta?.deck || "") || a.name.localeCompare(b.name));
    body.appendChild(renderTaskList(gwent));
  }

  section.appendChild(header);
  section.appendChild(body);
  app.appendChild(section);
}

function renderApp() {
  app.innerHTML = "";

  const gwentTasks = RouteEngine.getGwentTasks();
  const gwentByRegion = groupBy(gwentTasks, t => t.region);

  // MAIN GAME REGIONS
  GAME_DATA.route.forEach(region => {
    renderRegionSection({
      title: region.name,
      subtitle: region.level,
      quests: region.quests,
      gwent: gwentByRegion[region.id] || []
    });
  });

  // DLC SECTION(S)
  const hos = gwentByRegion["dlc_hos"] || [];
  const baw = gwentByRegion["dlc_baw"] || [];

  if (hos.length || baw.length) {
    renderRegionSection({
      title: "DLC – Hearts of Stone",
      subtitle: "DLC",
      quests: [],
      gwent: hos
    });

    renderRegionSection({
      title: "DLC – Blood and Wine",
      subtitle: "DLC",
      quests: [],
      gwent: baw
    });
  }
}

// Search: hides whole sections with zero matches; expands sections with matches
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

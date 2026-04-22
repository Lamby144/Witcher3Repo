const app = document.getElementById("app");

function renderRegion(regionName, levelText, tasks, regionId) {
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
    label.dataset.search = `${task.name} ${(task.meta?.source || "")}`.toLowerCase();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = localStorage.getItem(task.id) === "done";

    checkbox.onchange = () => {
      if (checkbox.checked) localStorage.setItem(task.id, "done");
      else localStorage.removeItem(task.id);

      AIRouter.refresh();
    };

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.innerText = task.name;

    label.appendChild(checkbox);
    label.appendChild(textSpan);

    // Optional source line for gwent cards
    if (task.meta?.source) {
      const meta = document.createElement("div");
      meta.className = "task-meta";
      meta.innerText = task.meta.source;
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

  // Main route sections
  GAME_DATA.route.forEach(region => {
    renderRegion(region.name, region.level, region.quests, region.id);
  });

  // Gwent section (optional, but makes your placeholder/search truthful)
  const gwentTasks = RouteEngine.getGwentTasks();
  if (gwentTasks.length) {
    renderRegion("Gwent Cards", "Collection", gwentTasks, "gwent");
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

      // Show/hide section based on matches
      section.style.display = matches > 0 ? "block" : "none";

      // Auto expand when searching and matches exist
      if (value !== "" && matches > 0) content.style.display = "block";
    });
  });
}

renderApp();
hookSearch();
AIRouter.init();

// options.js

const DEFAULT_PATTERNS = [
  {
    name: "IPv4",
    pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
  },
  {
    name: "IPv6",
    pattern: "\\b(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}\\b",
  },
  {
    name: "Phone Number",
    pattern: "\\b\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b",
  },
  {
    name: "Email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  },
  {
    name: "UUID",
    pattern:
      "\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b",
  },
];

function loadPatterns(callback) {
  chrome.storage.local.get(["identifierPatterns"], (result) => {
    let patterns = result.identifierPatterns;
    if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
      patterns = DEFAULT_PATTERNS;
    }
    callback(patterns);
  });
}

function savePatterns(patterns, callback) {
  chrome.storage.local.set({ identifierPatterns: patterns }, callback);
}

function renderPatterns(patterns) {
  const list = document.getElementById("pattern-list");
  list.innerHTML = "";
  if (patterns.length === 0) {
    list.innerHTML =
      "<div style='margin:10px;color:#888;'>No patterns defined.</div>";
    return;
  }
  patterns.forEach((p, idx) => {
    const item = document.createElement("div");
    item.className = "pattern-item";
    item.innerHTML = `
      <b>${p.name}</b>
      <span style="color:#888;">/ ${p.pattern} /</span>
      <span class="pattern-actions">
        <button class="save-btn" data-idx="${idx}">Edit</button>
        <button class="delete-btn" data-idx="${idx}">Delete</button>
      </span>
      <span class="error" id="edit-error-${idx}"></span>
    `;
    list.appendChild(item);
  });

  // Edit handler
  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(btn.dataset.idx, 10);
      editPattern(idx);
    });
  });

  // Delete handler
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (confirm("Delete this pattern?")) {
        patterns.splice(idx, 1);
        savePatterns(patterns, () => renderPatterns(patterns));
      }
    });
  });
}

function editPattern(idx) {
  loadPatterns((patterns) => {
    const p = patterns[idx];
    const list = document.getElementById("pattern-list");
    const item = list.children[idx];
    item.innerHTML = `
      <input type="text" id="edit-name-${idx}" value="${p.name}" style="width:110px;" />
      <input type="text" id="edit-regex-${idx}" value="${p.pattern}" style="width:180px;" />
      <button class="save-btn" id="save-edit-${idx}">Save</button>
      <button class="delete-btn" id="cancel-edit-${idx}">Cancel</button>
      <span class="error" id="edit-error-${idx}"></span>
    `;
    document.getElementById(`save-edit-${idx}`).onclick = () => {
      const name = document.getElementById(`edit-name-${idx}`).value.trim();
      const pattern = document.getElementById(`edit-regex-${idx}`).value.trim();
      const errorSpan = document.getElementById(`edit-error-${idx}`);
      if (!name || !pattern) {
        errorSpan.textContent = "Both fields required.";
        return;
      }
      try {
        new RegExp(pattern);
      } catch {
        errorSpan.textContent = "Invalid regex.";
        return;
      }
      patterns[idx] = { name, pattern };
      savePatterns(patterns, () => renderPatterns(patterns));
    };
    document.getElementById(`cancel-edit-${idx}`).onclick = () => {
      renderPatterns(patterns);
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPatterns(renderPatterns);

  document.getElementById("add-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("pattern-name").value.trim();
    const pattern = document.getElementById("pattern-regex").value.trim();
    const errorSpan = document.getElementById("add-error");
    errorSpan.textContent = "";
    if (!name || !pattern) {
      errorSpan.textContent = "Both fields required.";
      return;
    }
    try {
      new RegExp(pattern);
    } catch {
      errorSpan.textContent = "Invalid regex.";
      return;
    }
    loadPatterns((patterns) => {
      patterns.push({ name, pattern });
      savePatterns(patterns, () => {
        renderPatterns(patterns);
        document.getElementById("add-form").reset();
      });
    });
  };
});

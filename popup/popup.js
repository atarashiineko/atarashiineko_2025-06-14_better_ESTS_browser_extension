// popup.js

function sendToBackground(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

function fetchAllIdentifiers() {
  return sendToBackground({ action: "getAllIdentifiers" });
}

function clearAllIdentifiers() {
  return sendToBackground({ action: "clearAllIdentifiers" });
}

function renderList(identifiers, filter = "") {
  const list = document.getElementById("identifier-list");
  list.innerHTML = "";
  let filtered = identifiers;
  if (filter) {
    const f = filter.toLowerCase();
    filtered = identifiers.filter((id) =>
      id.identifier.toLowerCase().includes(f)
    );
  }
  if (filtered.length === 0) {
    list.innerHTML =
      "<div style='margin:10px;color:#888;'>No identifiers found.</div>";
    return;
  }
  filtered.forEach((id, idx) => {
    const item = document.createElement("div");
    item.className = "identifier-item";
    item.innerHTML = `
      <div>
        <b>${id.identifier}</b>
        <span class="details">
          First seen: ${id.firstSeenAt}<br>
          Total occurrences: ${id.occurrences.length}
          <button class="expand-btn" data-idx="${idx}">Details</button>
        </span>
      </div>
      <div class="occurrences hidden" id="occurrences-${idx}">
        ${id.occurrences
          .map(
            (o) =>
              `<div>- <span title="${o.url}">${
                o.url.length > 40 ? o.url.slice(0, 37) + "..." : o.url
              }</span> @ ${o.timestamp}</div>`
          )
          .join("")}
      </div>
    `;
    list.appendChild(item);
  });
  // Add expand/collapse handlers
  document.querySelectorAll(".expand-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = btn.dataset.idx;
      const occ = document.getElementById("occurrences-" + idx);
      occ.classList.toggle("hidden");
      btn.textContent = occ.classList.contains("hidden") ? "Details" : "Hide";
    });
  });
}

async function loadAndRender(filter = "") {
  // Get all identifiers from background
  const identifiers = await fetchAllIdentifiers();
  renderList(identifiers || [], filter);
}

document.addEventListener("DOMContentLoaded", () => {
  loadAndRender();

  document.getElementById("search").addEventListener("input", (e) => {
    loadAndRender(e.target.value);
  });

  document.getElementById("clear-btn").addEventListener("click", async () => {
    if (
      confirm(
        "Are you sure you want to clear all identifier data? This cannot be undone."
      )
    ) {
      await clearAllIdentifiers();
      loadAndRender();
    }
  });
});

// Listen for messages from background (optional, for live updates)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "identifiersUpdated") {
    loadAndRender();
  }
});

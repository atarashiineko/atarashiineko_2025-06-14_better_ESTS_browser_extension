// content-script.js

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

function compilePatterns(patterns) {
  return patterns.map((p) => ({
    name: p.name,
    regex: new RegExp(p.pattern, "g"),
  }));
}

function getPatterns(callback) {
  chrome.storage.local.get(["identifierPatterns"], (result) => {
    let patterns = result.identifierPatterns;
    if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
      patterns = DEFAULT_PATTERNS;
    }
    callback(compilePatterns(patterns));
  });
}

function highlightMatches(patterns) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((textNode) => {
    const parent = textNode.parentNode;
    if (
      parent &&
      !["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(parent.tagName)
    ) {
      let text = textNode.textContent;
      let fragments = [];
      let lastIndex = 0;
      let matches = [];

      patterns.forEach(({ regex, name }) => {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            index: match.index,
            length: match[0].length,
            matchedText: match[0],
            patternName: name,
          });
        }
      });

      // Sort matches by index to avoid overlap
      matches.sort((a, b) => a.index - b.index);

      // Remove overlapping matches (keep earliest/largest)
      let nonOverlapping = [];
      let prevEnd = -1;
      matches.forEach((m) => {
        if (m.index >= prevEnd) {
          nonOverlapping.push(m);
          prevEnd = m.index + m.length;
        }
      });

      if (nonOverlapping.length === 0) return;

      let curr = 0;
      nonOverlapping.forEach((m) => {
        if (m.index > curr) {
          fragments.push(document.createTextNode(text.slice(curr, m.index)));
        }
        const span = document.createElement("span");
        span.textContent = m.matchedText;
        span.dataset.identifier = m.matchedText;
        span.dataset.pattern = m.patternName;
        span.classList.add("identifier-match", "highlight-new");
        fragments.push(span);
        curr = m.index + m.length;
      });
      if (curr < text.length) {
        fragments.push(document.createTextNode(text.slice(curr)));
      }

      const spanContainer = document.createElement("span");
      fragments.forEach((f) => spanContainer.appendChild(f));
      parent.replaceChild(spanContainer, textNode);
    }
  });
}

function processHighlights() {
  const now = new Date().toISOString();
  document.querySelectorAll("span.identifier-match").forEach((span) => {
    const identifier = span.dataset.identifier;
    const pageURL = location.href;
    chrome.runtime.sendMessage(
      {
        action: "checkIdentifier",
        identifier,
        pageURL,
        timestamp: now,
      },
      (response) => {
        if (!response) return;
        if (response.totalOccurrences > 1) {
          span.classList.remove("highlight-new");
          span.classList.add("highlight-seen");
          span.title = `Seen ${response.totalOccurrences} times. First seen: ${response.firstSeenAt}`;
          span.addEventListener("click", () => {
            // Could open popup filtered by this identifier
            // For now, just log occurrence history
            console.log(response.previousPages);
          });
        } else {
          span.title = "New identifier";
        }
      }
    );
  });
}

function scanAndHighlight() {
  getPatterns((patterns) => {
    highlightMatches(patterns);
    processHighlights();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scanAndHighlight);
} else {
  scanAndHighlight();
}

const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.addedNodes.length) {
      scanAndHighlight();
      break;
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });

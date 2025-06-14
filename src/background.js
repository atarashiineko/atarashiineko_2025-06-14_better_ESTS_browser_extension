// background.js (service worker)
import { IdentifierRepository } from "./repository.js";

const repo = new IdentifierRepository();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkIdentifier") {
    const { identifier, pageURL, timestamp } = message;
    repo.get(identifier).then((record) => {
      const isNew = !record;
      repo.addOrUpdate(identifier, pageURL, timestamp).then(() => {
        if (isNew) {
          sendResponse({ totalOccurrences: 1, firstSeenAt: timestamp });
        } else {
          const total = record.occurrences.length + 1;
          sendResponse({
            totalOccurrences: total,
            firstSeenAt: record.firstSeenAt,
            previousPages: record.occurrences,
          });
        }
      });
    });
    return true; // Indicates that sendResponse will be called asynchronously
  } else if (message.action === "getAllIdentifiers") {
    repo.getAll().then((all) => {
      sendResponse(all);
    });
    return true;
  } else if (message.action === "clearAllIdentifiers") {
    repo.clearAll().then(() => {
      sendResponse({ success: true });
      chrome.runtime.sendMessage({ action: "identifiersUpdated" });
    });
    return true;
  }
});

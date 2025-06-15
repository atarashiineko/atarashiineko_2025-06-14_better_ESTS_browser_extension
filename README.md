# Login Count Tracker

This extension records how many times you visit `https://login.microsoftonline.com` and displays the count on the page as well as in the popup window.

## Development

- Build with `npm run build`.
- Load the `dist` directory as an unpacked extension in Chrome or Edge.

## Dexie Setup

`dexie.min.js` is bundled with the extension. A single IndexedDB store named `counters` holds a record with the key `"loginCount"`. Daily counts are stored in keys formatted as `loginCount_YYYY_MM_DD` using the local date.

The background worker manages these values and exposes actions via `chrome.runtime.sendMessage`:

- `increment` – increments both totals and returns the updated numbers.
- `getCounts` – returns the total and today's count.

The content script increments the count each time the login page loads and injects a small UI element showing `Logins: <number>`.

## Cleaning Up

Unnecessary files and features from the original sample have been removed, keeping only the pieces required for tracking the login page visits.

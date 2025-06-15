## 2025-06-15T06:38:07Z — Track daily logins

**Task Overview**:
Add a per-day login counter stored in IndexedDB and display it in both the in-page UI and popup.

**Context**:
The extension only tracked total login counts.

**Thought Process**:
Used local date to create keys for daily counts. Needed to update background, content script and popup to fetch and display both totals. Ensured style remained simple.

**Chosen Solution**:
Added helper functions in background.js to manage daily records. Introduced new getCounts message returning both totals. Updated content and popup scripts to show Logins today line.

**Implementation**:
- Updated `src/background.js` with daily count functions and message handling.
- Modified `src/content-script.js` to render two count lines and poll both values.
- Adjusted `popup/popup.js` and `popup/popup.html` for the new daily display.
- Documented the new behavior in `README.md`.

**Impact Summary**:
Users now see today's login count alongside the overall total, stored per local day for accuracy.
## 2025-06-15T06:00:17Z — Show tenant info

**Task Overview**:
Display the current tenant and referrer on the login page.

**Context**:
The extension only tracked login counts. The request asked to expose tenant and referrer information on the page.

**Thought Process**:
Needed to parse the tenant from the URL and fetch metadata using only standard Web APIs. Also had to handle missing data when the tenant ID could not be resolved to a domain.

**Chosen Solution**:
Fetch the tenant openid configuration to obtain logout URL and GUID. Attempt to read domain names from a hostnames endpoint if available.

**Implementation**:
- Added helper functions in `src/content-script.js` to resolve tenant info.
- Injected a new UI element on the top left showing the tenant, logout link and referrer.
- Updated build to ensure script compiles after changes.

**Impact Summary**:
Users now see which tenant they are signing into and the referring URL directly on the page.

## 2025-06-15T05:38:30Z — Refresh login count

**Task Overview**:
Add periodic polling to keep login counter accurate across open tabs.

**Context**:
The login tracker only updated on page load. Opening new tabs changed the count without updating already loaded pages.

**Thought Process**:
Needed to update each page regularly without new dependencies. Polling via chrome.runtime.sendMessage suits.

**Chosen Solution**:
Use setInterval to request the current count every second from the background script and update the counter DOM.

**Implementation**:
- Added getCount function in src/content-script.js.
- Updated injectCounter to use a span for the count.
- Started a one second interval that fetches and injects updated counts.

**Impact Summary**:
Counters now stay in sync across tabs, showing accurate totals.

## 2025-06-15T01:11:42Z — Namespace window styles

**Task Overview**:
Prevent CSS collisions with the ESTS page by namespacing all classes and IDs for the application UI.

**Context**:
The previous implementation injected generic class names like `.app-button` and `.custom-window`. When loaded with ESTS pages, these could clash with existing styles and cause layout issues.

**Thought Process**:
A simple prefix ensures uniqueness without altering behaviors. Adding a helper function simplifies applying the prefix consistently across modules.

**Chosen Solution**:
Introduced a `pf` utility that prepends `lct-` to any identifier. Updated the scripts and stylesheet to use prefixed selectors.

**Implementation**:
- Created `src/prefix.js`.
- Imported `pf` in `content-script.js` and `window.js` to assign prefixed IDs and classes.
- Updated `window.css` selectors with the new prefix.

**Impact Summary**:
All UI elements now use unique identifiers, eliminating conflicts with host page styles. The window appears correctly with consistent spacing.
## 2025-06-15T01:06:39Z — Fix window UI issues

**Task Overview**:
Resolve problems with the application window added previously: incorrect emoji,
missing spacing, and invisible styling.

**Context**:
The first implementation built a window system but the button used the wrong
icon and the window lacked CSS on load. Only the close button appeared.

**Thought Process**:
Analyzed the DOM structure and build output to discover CSS was not injected and
layout styles were missing. Determined updates were required in the manifest and
content script.

**Chosen Solution**:
Add `content-script.css` to the manifest so styles load. Adjust button display
and emoji, and ensure the counter uses flex layout for spacing.

**Implementation**:
- Updated `manifest.json` to reference the stylesheet.
- Modified `src/content-script.js` for layout fixes and correct emoji.
- Tweaked `.app-button` margin in `src/window.css`.

**Impact Summary**:
Window now renders correctly with visible content and proper spacing, providing
a usable UI foundation.

## 2025-06-14T23:46:36Z — Implement application window

**Task Overview**:
Add an application launch button and in-page window component to the content script.

**Context**:
The extension previously only tracked login counts. No window system existed.

**Thought Process**:
Needed a reusable window built with standard Web APIs and no new dependencies. Considered using existing dialog elements but opted for custom HTML to allow drag and resize behavior.

**Chosen Solution**:
Created `BaseWindow` with drag, resize, show and hide. Added `WindowManager` for z-index control and an `AppWindow` subclass. Injected a button next to the login tracker to open the window.

**Implementation**:
- Added `src/window.js`, `src/app-window.js`, and `src/window.css`.
- Updated `src/content-script.js` to inject the button and open the window.
- Updated build to include styles via import.

**Impact Summary**:
Users can now open a movable, resizable window within the page, providing a foundation for future in-page apps.

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

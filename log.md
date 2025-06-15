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

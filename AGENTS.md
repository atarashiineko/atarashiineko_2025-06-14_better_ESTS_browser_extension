# Agent Instructions

## Directive 1: Use Only Standard APIs  
- Implementers **must not** introduce any new external dependencies or third-party libraries.  
- All functionality should be built using built-in browser standards and native Web APIs.  
- If a capability is missing, implement it in-house rather than pulling in an external package.

## Directive 2: Maintain Detailed Change Log in `log.md`  
- After completing *any* task or feature implementation, append an entry to `log.md`.  
- **Format**:  
  1. A Markdown level-2 header containing the ISO 8601 timestamp and a brief title of the task:  
     ```markdown
     ## 2025-06-14T16:30:00Z — Add Application Button
     ```  
  2. Under that header, a detailed description including:  
     - What was requested.  
     - Key specification points.  
     - Final decisions or trade-offs made.  
- **Ordering**: Always **prepend** new entries so the most recent appears at the top.

## Directive 3: Adhere to This Specification File  
- All implementers **must** follow each directive in this `agents.md` exactly as written.  
- Any deviation requires explicit sign-off from the project lead.

## DIRECTIVE 4: Never use nested markdown lists

## DIRECTIVE 5: For punctuation always use ASCII alternatives when available


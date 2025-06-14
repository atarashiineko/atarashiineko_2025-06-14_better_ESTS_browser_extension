# Agent Instructions

## Directive 1: Use Only Standard APIs  
- Implementers **must not** introduce any new external dependencies or third-party libraries.  
- All functionality should be built using built-in browser standards and native Web APIs.  
- If a capability is missing, implement it in-house rather than pulling in an external package.

## Directive 2: Maintain Detailed Change Log in `log.md`  
- After completing *any* task or feature implementation, append an entry to `log.md`.  
### Format
A Markdown level-2 header containing the ISO 8601 timestamp and a brief title of the task:  
```markdown
## 2025-06-14T16:30:00Z — Add Application Button
```  
Under that header, a detailed description including:  

**Task Overview**:
A concise statement of the goal and scope -- what the agent was asked to accomplish and the boundaries of the work.

**Context**:
A brief snapshot of the repository or environment before changes, plus the ticket or issue that prompted this work.

**Thought Process**:
Describe how the agent analyzed requirements and constraints. Summarize alternative approaches evaluated and key observations that guided decision making.

**Chosen Solution**:
Explain why one approach was selected. Highlight the benefits it delivers and any trade-offs accepted.

**Implementation**:
Outline the main steps taken to implement the solution. For each step, note the files added or modified and any configuration changes.

**Impact Summary**:
Reflect on what changed and why it matters. Emphasize improvements in performance, maintainability, or clarity, and suggest any follow-up tasks or documentation updates.

### Ordering: Always **prepend** new entries so the most recent appears at the top.

## Directive 3: Adhere to This Specification File  
- All implementers **must** follow each directive in this `agents.md` exactly as written.  
- Any deviation requires explicit sign-off from the project lead.

## DIRECTIVE 4: Never use nested markdown lists

## DIRECTIVE 5: For punctuation always use ASCII alternatives when available


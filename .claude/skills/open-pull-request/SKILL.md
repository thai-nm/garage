---
name: open-pull-request
description: Use whenever Claude is about to open a pull request (gh pr create, GitHub MCP create_pull_request, or any other PR-creation flow). Ensures the PR description always includes an issue summary, what's changing, and an optional ticket ID.
---

# Open Pull Request

Defines the required structure for any pull request description Claude authors.

## When to Use

Trigger this whenever a PR is about to be created, regardless of the tool used to create it (`gh pr create`, the GitHub MCP `create_pull_request` tool, etc.). Apply it before finalizing the PR body.

## Required PR Description Structure

```markdown
## Issue summary
<1-3 sentences: the problem or need this PR addresses>

## What's changing
- <bullet list of concrete changes>
- <one bullet per logical change, not one per file>

## Ticket ID
<Optional. Link or ID of the tracking ticket (Jira/Linear/GitHub issue), e.g. PROJ-1234. Omit this section entirely if there is no ticket.>
```

## Implementation Steps

1. **Gather context**
   - Review the commits/diff going into the PR (`git log`, `git diff <base>...HEAD`)
   - Identify the underlying issue or motivation, not just the mechanical change

2. **Write "Issue summary"**
   - 1-3 sentences on why the change is needed
   - Describe the problem/motivation, don't restate the diff

3. **Write "What's changing"**
   - Bullet list of concrete changes
   - One bullet per logical change, not one per file touched

4. **Add "Ticket ID" only if applicable**
   - Look for a ticket reference in the branch name or commit messages, or ask the user
   - If none exists, omit the section entirely — never fabricate one or write "N/A"

5. **Respect any existing PR template**
   - If the repo has `.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE/`, merge these three sections into it rather than replacing it

6. **Create the PR** using the structure above

## Example

```markdown
## Issue summary
Users could not filter the dashboard by date range because the API only accepted a single timestamp instead of a range.

## What's changing
- Added `start_date` and `end_date` query params to `/api/dashboard`
- Updated the frontend date picker to send a range instead of a single date
- Added unit tests for the new date-range filtering logic

## Ticket ID
PROJ-482
```

## Notes

- Keep the section order the same across every PR for consistency.
- "Ticket ID" is optional — never fabricate one when none exists.
- Applies regardless of which tool actually creates the PR.

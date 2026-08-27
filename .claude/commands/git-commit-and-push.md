---
description: Stage changes, create a concise commit, and push to the current branch's remote
argument-hint: [optional commit message]
---

# Git Commit and Push

1. Run in parallel: `git status`, `git diff` (staged and unstaged), `git log --oneline -10`.
2. If there is nothing to commit, say so and stop — do not create an empty commit.
3. Stage the relevant files by name (never a blind `git add -A`) — check `git status` for anything unexpected, like `.env` or credentials, before staging.
4. Commit message:
   - If the user passed one via `$ARGUMENTS`, use it as-is.
   - Otherwise draft a concise one (1-2 sentences, why not what), matching this repo's recent `git log` style.
5. Commit with a HEREDOC, message ending with:
   ```
   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
   ```
6. Push:
   - If the branch has an upstream, `git push`.
   - If not, `git push -u origin <current-branch>`.

Never force-push, never skip hooks (`--no-verify`), never amend an existing commit unless explicitly asked.

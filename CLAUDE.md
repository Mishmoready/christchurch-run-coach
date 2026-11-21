# Christchurch Run Coach

A TypeScript app that syncs my Strava runs and writes short AI training notes, with checks that every number in a note matches the real data. It's a learning and portfolio project, built to practise APIs, webhooks, JSON, automation, checking AI output, tests, logging and Git. The name comes from the Christchurch marathon I'm training for.

## How we work (important)

- **I write all the code myself.** Claude guides and reviews; it does not write or edit project code. I need to own and be able to explain every line.
- Explain each step in small pieces: what we're doing, why, then a short example that uses *different* names or data, so I apply it myself.
- I'm new to TypeScript and Git. Use plain language, exact commands and exact VS Code clicks.
- Review by reading the **saved file on disk**. I sometimes forget to save (the ● on the tab).
- Never ask me to paste secrets, tokens or Strava auth codes into chat, and never print them in logs.
- Ask before creating files or running checks while I'm in the middle of something.
- **Keep [LEARNING.md](LEARNING.md) up to date.** When a new concept, command or gotcha comes up, add it to the right section in plain words with a short example (no project solutions). Claude may edit LEARNING.md and CLAUDE.md without asking; they're notes, not code.

## Setup on a new computer

1. `git pull` (or `git clone https://github.com/Mishmoready/christchurch-run-coach.git`)
2. `npm install`
3. Create `.env` from `.env.example`. The values come from strava.com/settings/api. `.env` is git-ignored and must never be committed.
4. If PowerShell blocks npm: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
5. `npm run dev` runs `tsx --env-file=.env src/index.ts`

Routine: `git pull` before starting work, then commit and push when finishing.

## Tech

- Node 26, TypeScript (strict), tsx, `"type": "module"`, tsconfig `"types": ["node"]`
- Strava API app: callback domain `localhost`, redirect URI `http://localhost:3000/callback`, scope `activity:read_all` (read-only, least privilege)

## Plan

1. ✅ Project setup
2. ✅ Register Strava API app, secrets in `.env`
3. ⏳ OAuth: get an access token
   - ✅ 3a: load `.env` with fail-fast checks
   - ✅ 3b: build the authorize link (tested: Strava returns `code=` and `scope=read,activity:read_all`)
   - ✅ 3c: swap the code for a token (2026-11-17: prints first name and `expires_at`; a fake code returns 400 "code invalid")
   - ⏳ 3d: save tokens to `tokens.json` (git-ignored), then read them back
   - 3e: refresh with `grant_type: "refresh_token"` when expired
4. Fetch recent runs from the API
5. Save them, keyed by Strava activity ID (upsert, no duplicates)
6. Receive Strava's webhook when I finish a run (needs a tunnel for local testing)
7. AI training note, using a fake model first, plus an evaluation that checks every number in the note against the data
8. Real AI model, only with a spending limit
9. Tests, logging (README ✅ 2026-11-18)

## Where I'm up to

**Done:** README written, git history checked for secrets (clean) and repo made public (2026-11-18). 3d piece 1: `tokens.json` added to `.gitignore` and committed (2026-11-20); `git check-ignore -v tokens.json` confirms it.

**Next: carry on with 3d.** Piece 2: after a successful exchange, write `access_token`, `refresh_token` and `expires_at` (not the whole response) to `tokens.json` with `writeFile` from `node:fs/promises` and `JSON.stringify(..., null, 2)`. Piece 3: on the next run, read the tokens back so no new code is needed. Then 3e: refresh.

**README upkeep:** when a planned feature starts working, move it from "What's next" to "What works so far", and keep present tense only for things that work.

**Small tidy-ups suggested:** rename `clientID` to `clientId` (camelCase); clearer error messages that say "missing from .env"; optionally show `expires_at` as a readable date with `new Date(x * 1000)`.

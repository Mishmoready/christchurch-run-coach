# Christchurch Run Coach

A TypeScript app that syncs my Strava runs and writes short AI training notes, with checks that every number in a note matches the real data. It's a portfolio project for a junior automation engineering job, built to show APIs, webhooks, JSON, automation, checking AI output, tests, logging and Git. The name comes from the Christchurch marathon I'm training for.

## How we work (important)

- **I write all the code myself.** Claude guides and reviews; it does not write or edit project code. I need to own and explain every line in interviews.
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
   - ⏳ 3c: swap the code for a token (see "Where I'm up to")
   - then: save tokens to a git-ignored file, refresh with `grant_type=refresh_token`
4. Fetch recent runs from the API
5. Save them, keyed by Strava activity ID (upsert, no duplicates)
6. Receive Strava's webhook when I finish a run (needs a tunnel for local testing)
7. AI training note, using a fake model first, plus an evaluation that checks every number in the note against the data
8. Real AI model, only with a spending limit
9. Tests, logging, README

## Where I'm up to (3c)

**Piece 1 ✅:** `authCode` comes from `process.argv[2]` (run as `npm run dev -- <code>`). No code → prints the authorize link; code given → `else` branch (currently a placeholder log).

**Piece 2 (in progress):** replace the placeholder in the `else`: in the `else`, POST to `https://www.strava.com/oauth/token` with `fetch`. The body holds `client_id`, `client_secret`, `code` and `grant_type: "authorization_code"`. Check `response.ok` and include `response.text()` in the error. Log only `athlete.firstname` and `expires_at`, never the tokens. Test with a fresh code, then reuse the same code and expect Strava to reject it (codes are single-use).

**Piece 2 ✅ (2026-11-17):** the token exchange works end to end. It printed the athlete's first name and `expires_at`, and a fake code returns 400 "code invalid". Optional tidy-up offered: show `expires_at` as a readable date with `new Date(x * 1000)`.

**Now (before applying): write README.md.** I write it; Claude guides and reviews. Six short sections:
1. `# Christchurch Run Coach` plus 1–2 sentences on what it does (the whole vision: Strava sync + AI training notes whose numbers are checked against real data).
2. `## Why I built it`: 2–4 sentences in my own voice (Christchurch marathon, I track every run on Strava, I want to learn APIs, automation and checking AI output by building something I'll use).
3. `## What works so far`: OAuth sign-in with Strava; swapping the code for an access token; fail-fast checks for missing settings; clear API error messages.
4. `## What's next`: save and refresh tokens, fetch runs, store by activity ID, webhook, AI note plus number checks, tests.
5. `## How to run it`: `npm install`, create `.env` from `.env.example`, `npm run dev`, then `npm run dev -- <code>`.
6. `## How I built it`: one honest line: I wrote the code myself, using Claude Code as a tutor and reviewer.
Markdown: `#` heading, `##` section, `-` bullet, `**bold**`, backticks for `code`.
After the README: check git history for secrets → make the repo public → cover letter → apply. Saving and refreshing tokens can wait until after applying.

**Later: save the tokens** (access_token, refresh_token, expires_at) to a git-ignored file (for example `tokens.json`, added to `.gitignore` *first*) so later steps don't need Authorize every time. Then refresh with `grant_type: "refresh_token"` when expired.

**Plan agreed 2026-11-17:** finish step 3 (token exchange, then save tokens to a git-ignored file and refresh them), then write a short README describing the project and plan, then apply for the job with the repo as "in progress". A cover letter is still needed (separate from this repo).

**Small tidy-ups suggested:** rename `clientID` to `clientId` (camelCase); clearer error messages that say "missing from .env".

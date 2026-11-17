# Learning notes

What I've learned building the Christchurch Run Coach, in plain words, to look back on. Newest topics go at the bottom of each section.

---

## 1. VS Code habits

- **Save your files.** A **●** on a tab means unsaved changes. Programs and git only see what's saved on disk. Press **Ctrl+S**, or turn on **File → Auto Save**.
- **Format Document** (right-click in a file) tidies indentation.
- **F2** on a name renames it everywhere it's used.
- **Blue squiggles under words** like `STRAVA` come from the Spell Checker extension, not real code errors.
- **Copying from the terminal:** drag-select the text, then **Ctrl+C** (it copies when text is selected; it only stops a program when nothing is selected). Long lines can wrap and break when copied, so widen the terminal or copy carefully.
- VS Code's built-in browser can hide the end of an address. Use Chrome or Edge to see the whole URL.

## 2. Windows / PowerShell

- PowerShell blocks scripts by default, and `npm` starts through a script (`npm.ps1`). One-time fix for my user account, no admin needed:
  ```
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
  This lets local scripts run; scripts downloaded from the internet still need a signature.

## 3. Setting up a TypeScript project

| Command / file | What it does |
|---|---|
| `npm init -y` | creates `package.json`, the project's ID card (name, libraries, commands) |
| `npm install --save-dev typescript tsx @types/node` | `typescript` checks types, `tsx` runs `.ts` files directly, `@types/node` describes Node's built-ins; `--save-dev` = tools for development only |
| `npx tsc --init` | creates `tsconfig.json`, the rules TypeScript checks against (`strict` on) |
| `"type": "module"` in `package.json` | use the modern `import` style |
| `"types": ["node"]` in `tsconfig.json` | load Node's types so things like `process` are known. `[]` means none get loaded |
| `"scripts": { "dev": "..." }` | a shortcut command, run with `npm run dev` |
| `npm install` | on a new computer, re-downloads everything listed in `package.json` into `node_modules` |

- A `//` at the start of a line in `tsconfig.json` makes it a comment, so it's ignored.

## 4. TypeScript basics

- **`console.log(...)` prints to the terminal.** A string on its own line does nothing; you have to *tell* Node to show it. Logging is also how you see what's going on (debugging).
  ```ts
  console.log("Race city:", raceCity);
  ```
- **`const`** makes a named box that holds a value: `const raceCity = "Christchurch";`. The right side of `=` is what goes in the box.
- **`if` / `!` / `else`**: `!` means "not", so `!x` is true when `x` is empty or missing. `else` means "otherwise do this instead".
  ```ts
  if (!raceCity) {
    console.log("No city given");
  } else {
    console.log("Racing in", raceCity);
  }
  ```
- **`throw new Error("...")`** stops the program and shows the message, the file and the line number.
- **Fail fast:** check for problems at the start and stop with a *clear* message, instead of failing in a confusing way later. Messages should say exactly what's wrong and where to fix it (for example, "STRAVA_CLIENT_SECRET is missing from .env"). A vague message like "Race city is not defined" sends you looking in the wrong place.
- **`string | undefined`**: TypeScript can't know whether an environment variable exists. After an `if (!x) throw ...` check, TypeScript knows `x` is a real `string` (hover over it to see). This is called *narrowing*.
- **camelCase**: TypeScript names usually look like `clientId`, `authCode`, `raceCity`. Each new word starts with a capital, and short forms like ID too (`clientId`, not `clientID`).
- **Template strings** use backticks and `${...}` to put values inside text:
  ```ts
  `Request failed: ${response.status}`
  ```

## 5. Secrets and `.env`

- **`.env`** holds secrets (Strava Client ID and Secret). It's listed in `.gitignore`, so it never goes to GitHub. Each computer needs its own copy.
- **The names inside `.env` aren't usable in code directly.** `STRAVA_CLIENT_ID` only exists as `process.env.STRAVA_CLIENT_ID`. Store it in a constant (like `clientId`) and use the constant everywhere after that. Using the bare `.env` name gives "Cannot find name".
- **`.env.example`** has the same names with no values, and *is* committed. It shows others (or an interviewer) which settings the app needs.
- **`tsx --env-file=.env`** loads `.env` into `process.env` when the program starts, with no extra library.
- Never paste secrets, tokens or auth codes into chats, screenshots, commits or logs. If a secret leaks, reset it on strava.com/settings/api.
- The **Client ID** is public; the **Client Secret** is like a password.

## 6. Command-line arguments

- `process.argv` is a list of the words in the command: `[0]` = Node, `[1]` = your script, `[2]` = the first word you add.
- `npm run dev -- hello`: everything after `--` (with a space) goes to my program. `npm run dev --hello` (no space) is swallowed by npm as its own setting.

## 7. Git and GitHub

| Command | What it does |
|---|---|
| `git init` | start tracking the folder |
| `git status` | what's changed or untracked |
| `git add .` / `git add <file>` | choose what goes in the next commit |
| `git commit -m "message"` | save a snapshot with a description |
| `git log --oneline` | list of commits |
| `git branch -M main` | rename the branch to `main` (GitHub's default) |
| `git remote add origin <url>` | tell git where the GitHub copy lives |
| `git push -u origin main` | first upload; `-u` remembers the link so later just `git push` |
| `git clone <url>` | copy a repo onto a new computer |
| `git pull` | get the latest changes from GitHub |

- **`.gitignore`** lists things git should never track: `node_modules` (huge, re-downloadable), `dist` (built output), `.env` (secrets).
- Check secrets are safe: `.env` should *not* appear in `git status`.
- When creating a GitHub repo for existing code, don't tick "Add README/.gitignore/license", which avoids a conflict on the first push.
- **GitHub no longer accepts passwords for git.** Sign in through the browser (Git Credential Manager, which comes with Git for Windows) or use a personal access token.
- **Working on two computers:** `git pull` when you sit down; `add`, `commit`, `push` when you get up. If git says "rejected" or "conflict", stop and ask before trying anything.
- Half-finished work is fine to commit; label it, like `"WIP: ..."`.

## 8. Strava API and OAuth

- **Registering an API app** (strava.com/settings/api) gives a Client ID and Client Secret. The *Authorization Callback Domain* (`localhost`) is the only place Strava will send people back to.
- **OAuth flow** (how my app gets permission to read my runs):
  1. My code builds a Strava **authorize link** with my Client ID.
  2. I open it and click **Authorize**.
  3. Strava sends the browser back to `localhost:3000/callback?...code=...&scope=...`.
  4. My code sends that one-time **code** plus my Client ID and Secret to Strava and gets back an **access token** (6 hours), a **refresh token** (to get new access tokens) and `expires_at`.
- The **secret is only used from my code** (step 4), never in a browser link.
- **Auth codes are single-use** and expire quickly.
- **Scopes** are the permissions requested. I use `activity:read_all` (read-only, including private runs). Asking for only what you need is called **least privilege**: a leaked token can't change or delete anything. `write` on its own isn't a Strava scope, and Strava rejects it.
- `ERR_CONNECTION_REFUSED` on `localhost` just means nothing is running there yet. After authorizing, that's expected; the useful part is the `code=` in the address bar.
- A Strava "this one stays red" page means the link was broken, usually by copying.

## 9. Building URLs

```ts
const link = new URL("https://example.com/search");
link.searchParams.set("city", "Christchurch");
console.log(link.toString());
```
- `searchParams` adds the `?name=value&...` part and **encodes** special characters safely: `:` becomes `%3A` and `/` becomes `%2F`. Gluing strings together by hand can break links.
- `searchParams.set` adds the `=` itself, so a value like `"code="` is wrong; use `"code"`.

## 10. Calling an API with `fetch`

```ts
const response = await fetch("https://example.com/api/races", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ city: "Christchurch", distance: 42.2 }),
});

if (!response.ok) {
  throw new Error(`Request failed: ${response.status} ${await response.text()}`);
}

const data = await response.json();
```
- **The shape:** `fetch( WHERE , { HOW } );`. WHERE is the URL; HOW is an options box with `method`, `headers` and `body`. Every `(` and `{` needs its partner: click next to one and VS Code highlights its match. A red squiggle on a closing bracket usually means something above it isn't closed yet.
- **POST** sends data to the server; **GET** (the default) just asks for data.
- **`await`** waits for the network reply before carrying on.
- **`JSON.stringify`** turns an object into JSON text, the format APIs exchange; `response.json()` turns the reply back into an object.
- **`response.ok`** is false on errors (like 400). Including `response.text()` in the error shows the server's actual reason, which makes debugging much easier.
- Only log safe fields (like a first name), never tokens.
- **Status codes:** 200 = OK, 400 = bad request (something I sent was wrong), 401 = not allowed (bad or missing credentials), 404 = not found, 500 = the server broke.
- **Test the failure path on purpose.** Sending a fake value (`npm run dev -- hello`) proved the `response.ok` check works without needing a real code. Strava answered `400` with `"field":"code","code":"invalid"`, which pinpoints the problem.

## 11. Watch what suggestions add

- Accepting an autocomplete or Copilot suggestion can quietly add an `import` line at the top of the file (for example, `import { error } from "node:console";`). If nothing uses it, delete it. Every line should be one I can explain.

---

## Glossary

- **API**: a way for programs to talk to another service (here, Strava).
- **Environment variable**: a setting given to a program from outside its code (`process.env.X`).
- **OAuth**: the standard "let this app access my account" sign-in flow.
- **Token**: a temporary key that proves the app has permission.
- **Repo**: a project folder tracked by git.
- **Commit**: a saved snapshot of the project.
- **Remote / origin**: the copy of the repo on GitHub.
- **WIP**: work in progress.

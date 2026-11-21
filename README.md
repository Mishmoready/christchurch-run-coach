# Christchurch Run Coach

Christchurch Run Coach is a TypeScript app I'm building to help me train for my marathon. It connects to Strava and will pull in my runs automatically. When I finish a run, Strava will tell the app straight away, and the app will use AI to write a short training note: how the run went and how I'm tracking towards my goal. Before I see the note, the app will check every number in it against my real data, so the AI can't make anything up.

## Why I built it

I've been a big fan of running ever since I was at my heaviest, at 180 kg. Getting fit and healthy is a big part of my life, and running is one of the main parts of that journey.

My next goal is the Christchurch Marathon on 18 April 2027. Strava shows me the numbers, but I wanted something that explains them in plain words and keeps my progress in check.

## What works so far

- Signing in to Strava with OAuth (the standard "let this app read my account" flow)
- Swapping Strava's one-time code for an access token
- Checks that stop the app with a clear message if a setting is missing or Strava returns an error

## What's next

- Save and refresh tokens, so I only sign in once
- Fetch my runs and store them by Strava activity ID (no duplicates)
- Receive Strava's webhook when I finish a run
- Write the AI training note, plus the checks that compare every number to my data
- Tests and logging
- Later: a simple user interface

## How to run it

1. `npm install`
2. Copy `.env.example` to `.env` and add your Strava API app's Client ID and Secret (from strava.com/settings/api)
3. `npm run dev` prints a Strava sign-in link. Open it and click **Authorize**
4. Copy the `code` from the address bar, then run `npm run dev -- <code>`

## How I built it

- **APIs and automation:** I refreshed my TypeScript and learned how APIs, OAuth and JSON work by building this step by step.
- **AI as a mentor:** I usually code by hand, and I wrote this code myself. I used AI (Claude Code) as a mentor: explaining each step and giving feedback on what I wrote, to improve my coding skills.

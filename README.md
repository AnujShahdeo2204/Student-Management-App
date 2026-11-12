# Student Manager

A single-file Student Manager website built with only HTML, CSS, and vanilla
JavaScript. There is no backend, framework, build step, database, or image
dependency.

## Features

- Home dashboard with greeting, task progress, attendance, classes, and focus stats
- Local task manager with due dates, priorities, completion, and deletion
- Monday-Saturday timetable with sorted classes
- Attendance tracking with present/absent actions and the 75% rule
- Focus timer with 5, 15, 25, and 50 minute presets
- Editable profile name and local data reset
- Light/dark theme
- Responsive layout down to 360px
- CSS 3D card tilt, animated plate, orbiting icons, floating decoration, and view transitions
- Safe localStorage persistence with escaped user-entered text

## Structure

```text
frontend/
└── index.html    Complete application: markup, styles, and JavaScript
```

## Run locally

Open [frontend/index.html](./frontend/index.html) directly in a browser, or
serve the `frontend` folder with VS Code Live Server.

All data stays in the browser's localStorage. Clearing browser site data or
using the **Reset all local data** button removes the saved data.

## Deploy

### GitHub Pages

The GitHub Actions workflow deploys the `frontend/` folder to the `gh-pages`
branch whenever `main` changes.

### Vercel

Set the Vercel project root to the repository root and use `frontend` as the
output/static directory, or deploy the `frontend` folder directly. No
environment variables or server runtime are required.

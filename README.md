# AI Code Reviewer: Frontend

The web app for **AI Code Reviewer**. Students submit their code (pasted, or imported from a public GitHub repository) and get an automated review that combines a linter with an LLM: a list of issues with explanations, suggested fixes and a quality score from 0 to 100. Teachers get a read-only dashboard to follow every student, track progress and compare students.

**Live demo:** https://ai-code-reviewer-app-frontend.vercel.app

> The API runs on a free hosting plan. If nobody used it for a while, the **first request can take up to a minute** while the server wakes up. After that it responds normally.

---

## Backend and Frontend github repository

This app needs the AI Code Reviewer API: a Node.js, Express and MongoDB service that runs ESLint, calls LLM providers with automatic fallback, and stores reviews and score history.

## Backend Repository: https://github.com/HasanMohammodZakaria/ai-code-review-app-backend
## Frontend Repository:https://github.com/HasanMohammodZakaria/ai-code-reviewer-app-frontend

---

## Demo accounts

Use these accounts to explore the app without registering.

| Role | Email | Password |
|---|---|---|
| Teacher | `ariful.teacher@example.com` | `TeacherPass#2026` |
| Student | `demothree@example.com` | `demothree@example3` |
| Student | `demofour@example.com` | `demofour@example4` |

- The teacher dashboard shows data from the student accounts, so log in as a student and run a review first if the dashboard looks empty.
- Please do **not** change the demo passwords or delete the demo projects.
- Demo data may be reset at any time. Do not enter real personal data.
- Password reset emails are sent from a free email address and may land in the spam folder.

---

## Table of contents

- [AI Code Reviewer: Frontend](#ai-code-reviewer-frontend)
  - [Backend and Frontend github repository](#backend-and-frontend-github-repository)
  - [Backend Repository: https://github.com/HasanMohammodZakaria/ai-code-review-app-backend](#backend-repository-httpsgithubcomhasanmohammodzakariaai-code-review-app-backend)
  - [Frontend Repository:https://github.com/HasanMohammodZakaria/ai-code-reviewer-app-frontend](#frontend-repositoryhttpsgithubcomhasanmohammodzakariaai-code-reviewer-app-frontend)
  - [Demo accounts](#demo-accounts)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Pages](#pages)
  - [Tech stack](#tech-stack)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Environment variables](#environment-variables)
  - [Scripts](#scripts)
  - [Project structure](#project-structure)
  - [Theming](#theming)
  - [Authentication on the client](#authentication-on-the-client)
  - [Deployment](#deployment)
  - [Known limitations](#known-limitations)

---

## Features

**Students**
- Register, log in, reset a forgotten password
- Dashboard with total projects, total reviews, latest and average score, issue totals and a score history chart
- Create a project by pasting code (one or several files) or by importing a public GitHub repository
- Run an AI review and read the result: score, summary, issues grouped by severity, explanations and suggested fixes
- Re-run the review after fixing the code and watch the score improve
- Edit or delete projects, change the name and photo, change the password

**Teachers**
- Overview of the whole class: totals, average score, issue totals and a score distribution chart
- Searchable, sortable student list
- Student detail with projects and the full score history
- Side-by-side comparison of 2 to 10 students
- Read-only access to every project and review

**General**
- Dark mode by default with a light mode toggle
- Responsive layout
- Clear loading, empty and error states

---

## Pages

| Path | Page | Who |
|---|---|---|
| `/login`, `/register` | Sign in and registration | Logged-out users |
| `/forgot-password`, `/reset-password` | Password reset | Logged-out users |
| `/dashboard` | Student dashboard | Student |
| `/projects` | My projects | Logged in |
| `/projects/new` | New project (paste code or GitHub import) | Logged in |
| `/projects/:id` | Project detail, run review, history | Logged in |
| `/reviews/:id` | Review detail | Logged in |
| `/settings` | Profile and password | Logged in |
| `/teacher` | Teacher overview | Teacher |
| `/teacher/students` | Student list | Teacher |
| `/teacher/students/:id` | Student detail | Teacher |
| `/teacher/compare` | Compare students | Teacher |

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | React, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Routing | React Router DOM |
| HTTP client | Axios |
| Charts | Recharts |
| Fonts | Inter (interface), JetBrains Mono (code) |

---

## Getting started

### Prerequisites

- Node.js (a current LTS release) and npm
- A running backend: either the deployed API or a local copy (see [Backend](#backend))

### Installation

```bash
git clone <your-frontend-repository-url>
cd ai-code-reviewer-frontend
npm install
cp .env.example .env     # then set the API URL
npm run dev
```

The app opens at `http://localhost:5173`.

If you run the backend locally, set its `CLIENT_URL` to exactly `http://localhost:5173`. The backend allows only that one origin, otherwise the browser blocks the requests (CORS).

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API including `/api`, for example `http://localhost:5000/api` |

Never commit `.env`. Keep `.env.example` up to date instead.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Project structure

```
src/
├── api/            Axios instance and one file per backend area
├── components/
│   ├── ui/         shadcn/ui components
│   ├── layout/     app shell, sidebar, top bar, theme toggle
│   └── ...         feature components (projects, reviews, teacher, charts)
├── context/        auth and theme providers
├── hooks/          reusable hooks
├── lib/            helpers (formatting, score and severity helpers)
├── pages/          page-level composition only
├── routes/         router and route guards
├── types/          shared TypeScript types
└── main.tsx
```

Pages only compose components. All logic lives in `components/`, `hooks/` and `lib/`. Imports are relative.

---

## Theming

- Dark mode is the default. A toggle in the top bar switches to light mode, and the choice is remembered in the browser.
- All colors are CSS custom properties defined once for each mode. Components never contain hard-coded color values (charts are the one exception, because the chart library cannot read CSS variables).
- Palette: Indigo for primary actions, Emerald for positive highlights, slate tones for backgrounds and text.
- Score colors: 0 to 39 red, 40 to 59 amber, 60 to 79 indigo, 80 to 100 green. Numbers and labels are always shown next to colors.

---

## Authentication on the client

- The **access token** (valid for 15 minutes) is kept in memory only, never in `localStorage`.
- The **refresh token** lives in an HTTP-only cookie set by the API. Requests are sent with credentials.
- On page load the app asks the API for a fresh session. When a request returns `401`, one shared refresh runs, then the request is retried once.
- The user's role decides the home page after login (`/dashboard` for students, `/teacher` for teachers), and route guards redirect users who open a page for the wrong role.

---

## Deployment

The frontend is hosted on Vercel and the API on Render.

1. Import the repository in Vercel (framework preset: Vite).
2. Set `VITE_API_URL` to the live API URL including `/api`.
3. Make sure single-page routing works: a `vercel.json` rewrite sends every path to `index.html`, otherwise refreshing a deep link such as `/projects/123` shows a 404.
4. On the backend set `CLIENT_URL` to the exact frontend URL (no trailing slash).

---


## Known limitations

- The API is on a free plan, so the first request after a long idle time is slow.
- Only JavaScript and TypeScript are linted. Other languages are reviewed by the AI only.
- Only public GitHub repositories can be imported, and only the first 20 supported files.
- A review looks at roughly the first 40,000 characters of code.
- There is no email verification and the email address cannot be changed.
# CareerCompass

> Stop Googling. Start Growing.

A web app that generates personalized 12-week career roadmaps for engineering students — calibrated to their year, branch, goal, and current skill level.

## What it does

CareerCompass takes a student's profile as input and uses AI to generate a week-by-week career roadmap with actionable tasks, free resources, and progress tracking.

## Features

- Personalized roadmap based on year, branch, goal, and current skills
- Week-by-week actionable tasks — not vague advice
- One free resource per week — zero cost to student
- Weekly check-in system (Yes / Partial / No)
- Progress bar tracking across all 12 weeks
- Progress saved in localStorage — persists across sessions

## Tech Stack

- **Frontend** — React.js + Tailwind CSS + Vite
- **Backend** — Node.js + Express.js
- **AI Model** — LLaMA 3.3 70B via Groq API
- **Storage** — localStorage (client-side)

## Project Structure

```
first-year-filter/
├── backend/           Node.js + Express backend
├── frontend/person1/  Onboarding form (Screen 1)
├── frontend/person2/  Roadmap view + Check-in (Screen 2 and 3)
└── src/               Main running app
```

## How to Run Locally

**Step 1 — Backend**
```
cd backend
npm install
```
Create a `.env` file inside the backend folder:
```
GROQ_API_KEY=your_groq_api_key_here
```
Then start the backend:
```
npm run dev
```
Backend runs on http://localhost:3001

**Step 2 — Frontend**
```
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Team

Built for InnoForge 2.0 Hackathon

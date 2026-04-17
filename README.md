# IELTS MockTest — IDP-Style Full Academic Practice Platform

A complete IELTS Academic mock test platform with real exam conditions, countdown timers, backend scoring, and detailed results.

## Features

- **🎧 Listening Test** — 4 Parts, 40 questions, browser speech synthesis (text-to-speech), plays once like the real exam
- **📖 Reading Test** — 3 Academic passages, 40 questions (T/F/NG, MCQ, sentence completion)
- **✍️ Writing Test** — Task 1 (graph description) + Task 2 (essay), word counter, self-assessment rubric
- **📊 Backend Scoring API** — Calculates official IELTS band scores, tracks time per section, returns detailed results
- **⏱ Time Analytics** — Shows exactly how long was spent on each section vs recommended time
- **📋 Answer Review** — Full question-by-question breakdown with correct answers after submission

## Tech Stack

- **Next.js 14** (React, pages router)
- **Backend**: `/api/submit` — serverless function, grades Listening + Reading, applies official band conversion tables
- **Storage**: `localStorage` for session state; no database required

---

## 🚀 Deploy to Vercel (Recommended)

### Method 1: Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Inside the project folder
cd ielts-mocktest

# 3. Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: ielts-mocktest (or anything)
# - Framework: Next.js (auto-detected)
# - Deploy!
```

Your live URL will be printed at the end, e.g. `https://ielts-mocktest.vercel.app`

---

### Method 2: GitHub → Vercel (One-time setup, auto-deploys)

```bash
# 1. Create a GitHub repo and push this project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ielts-mocktest.git
git push -u origin main

# 2. Go to https://vercel.com
# 3. Click "Add New Project"
# 4. Import your GitHub repo
# 5. Framework: Next.js (auto-detected)
# 6. Click Deploy
```

Every push to `main` will auto-deploy to Vercel.

---

### Method 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Upload the ZIP, select Next.js, deploy.

---

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
ielts-mocktest/
├── pages/
│   ├── index.js          # Landing page
│   ├── instructions.js   # Pre-test instructions
│   ├── results.js        # Results page
│   ├── test/
│   │   ├── listening.js  # Listening section
│   │   ├── reading.js    # Reading section
│   │   └── writing.js    # Writing section
│   └── api/
│       └── submit.js     # ⭐ Backend scoring API
├── components/
│   ├── Navbar.js         # Top nav with timer
│   ├── Timer.js          # Countdown timer
│   └── QuestionNav.js    # Question navigator sidebar
├── lib/
│   ├── questions.js      # Full question bank (80 questions)
│   └── scoring.js        # IELTS band score logic
└── styles/
    └── globals.css       # All styles
```

## How Scoring Works

### Listening & Reading
Raw scores are converted to IELTS bands using the official IDP conversion table:
- Listening: 40 questions → Band 9 (score 39+) down to Band 2
- Reading: 40 questions → Band 9 (score 39+) down to Band 2

### Writing
Self-assessed on 4 criteria (Task Achievement, Coherence, Lexical Resource, Grammar). Task 2 carries 2x the weight of Task 1.

### Overall Band
Average of Listening + Reading + Writing (Speaking not tested online), rounded to nearest 0.5.

## Notes

- Speaking section is not included (requires human examiner)
- This is for practice only — not affiliated with IDP, British Council, or Cambridge Assessment English
- No database required; all data stored in browser `localStorage`

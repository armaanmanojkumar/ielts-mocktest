# IELTS MockTest - Python Edition

A full IELTS Academic mock test practice app converted from Next.js to a Python runtime.

The app now runs with Python's standard library:

- Python HTTP server in `app.py`
- Vercel Python serverless functions in `api/`
- Python IELTS scoring and results generation in `scoring.py`
- Question bank stored as `data/questions.json`
- Browser UI served from `static/app.js`
- Existing styling reused from `styles/globals.css`

No Python packages are required.

## Run Locally

```bash
python app.py
```

Open:

```text
http://127.0.0.1:8000
```

To use another port:

```bash
python app.py --port 8080
```

## Features

- Listening test: 4 parts, 40 questions, browser text-to-speech playback
- Reading test: 3 academic passages, 40 mixed-format questions
- Writing test: Task 1 and Task 2 with word counts and automatic completion estimate
- Start page with 10 selectable IELTS mock exam sets
- Set-specific Writing Task 1 charts and Task 2 prompts
- Python scoring API at `POST /api/submit`
- Question data API at `GET /api/questions`
- IELTS-style band conversion, timing analytics, and answer review

## Deploy on Vercel

This repo is Vercel-ready as a Python deployment:

- `api/questions.py` serves `GET /api/questions`
- `api/submit.py` serves `POST /api/submit`
- `public/index.html` hosts the browser app
- `vercel.json` rewrites app routes like `/instructions` and `/test/writing` to the static frontend

## Project Structure

```text
ielts-mocktest/
├── app.py                     # Python web server and routes
├── scoring.py                 # Band scoring, answer grading, result builder
├── data/
│   └── questions.json         # Converted question bank
├── api/
│   ├── questions.py           # Vercel Python API route
│   └── submit.py              # Vercel Python scoring API route
├── public/
│   ├── index.html             # Vercel static frontend shell
│   ├── static/app.js          # Vercel static browser app
│   └── styles/globals.css     # Vercel static styles
├── static/
│   └── app.js                 # Browser UI served by Python
├── styles/
│   └── globals.css            # Shared app styles
├── vercel.json
├── .gitignore
└── README.md
```

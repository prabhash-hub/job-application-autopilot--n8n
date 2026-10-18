# Job Application Autopilot — Frontend

A product-focused landing page + application form for **Job Application Autopilot**:
submit once, and the applicant gets an AI fit score (0–100 with reasoning), a personalised
cover letter, a saved record of the application, and a 7-day follow-up reminder.

Built with plain HTML, CSS, and JavaScript — no build step.

## Run
1. Open `index.html` in your browser, or open the folder in VS Code and use Live Server.
2. Out of the box the form runs in **demo mode**: validation, file checks, the animated
   processing steps, and a fully rendered sample result (score + reasoning + cover letter +
   reminder) all work, and nothing leaves the browser.

## Connect it to your n8n workflow
1. In `script.js`, set:
   ```js
   const CONFIG = {
     WEBHOOK_URL: "https://your-n8n.host/webhook/job-application",
     ...
   };
   ```
2. Point it at your **n8n Form Trigger / Webhook** URL. The form is submitted as
   `multipart/form-data`, so the resume file is included.
3. If the workflow responds with JSON, the result panel renders it directly:
   ```json
   {
     "score": 87,
     "reasoning": ["matched: Python", "gap: cloud tooling"],
     "cover_letter": "Dear Hiring Team, ...",
     "reminder_date": "2026-10-23"
   }
   ```
   Send `{ "fallback": true, "message": "..." }` to show the fallback state.
   Any other response is treated as a successful submission (results arrive by email).

## Content & structure
- Hero, stats, "what it does for you", sample outputs, comparison, features, audience, form, FAQ, CTA.
- Interactive skill-match preview that compares editable resume and job-description text, highlights matches and gaps, and suggests resume improvements. It uses keyword matching and does not read uploaded files.
- Copy is product-focused (what the applicant gets) — plugin/node names are kept out of the page.

## Files
- `index.html` — page content and the application form
- `style.css` — design system, layout, responsive rules
- `script.js` — validation, drag-and-drop upload, demo/live run, result rendering, fallback

## Next
- Server-side resume parsing and PDF/DOC/DOCX text extraction
- Real email + calendar handoff through the workflow, plus a history view of past applications

# Job Application Autopilot — Frontend

A product-focused landing page + application form for **Job Application Autopilot**:
submit once, and the applicant gets an AI fit score (0–100 with reasoning), a personalised
cover letter, a saved record of the application, and a 7-day follow-up reminder.

Built with HTML, Tailwind CSS utilities from the CDN, custom CSS, and JavaScript — no build step. An internet connection is needed to load Tailwind and the hosted fonts.

## Run
1. Open `index.html` in your browser, or open the folder in VS Code and use Live Server.
2. `script.js` currently has a workflow URL configured, so submissions are sent to that
   endpoint. To use the browser-only demo instead, set `WEBHOOK_URL` to an empty string.
   Demo mode includes validation, file checks, animated processing steps, and a sample
   result; nothing is sent from the browser in that mode.

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
- Responsive SaaS landing page with workflow steps, evaluation dashboards, comparison,
  pricing/value CTA, interactive skill preview, application form, and result states.
- Interactive skill-match preview that compares editable resume and job-description text, highlights matches and gaps, and suggests resume improvements. It uses keyword matching and does not read uploaded files.
- Copy is product-focused (what the applicant gets) — plugin/node names are kept out of the page.

## Files
- `index.html` — page content and the application form
- `style.css` — responsive design system, animations, and component styles
- `script.js` — validation, drag-and-drop upload, demo/live run, result rendering, fallback

## Next
- Server-side resume parsing and PDF/DOC/DOCX text extraction
- Real email + calendar handoff through the workflow, plus a history view of past applications

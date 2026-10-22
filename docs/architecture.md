# 🏗️ System Architecture

## Overview

Job Application Autopilot uses a website form connected to an n8n workflow. The workflow extracts text from a PDF resume, requests AI analysis, parses the result, and then routes information to the configured integrations.

## High-Level Data Flow

```text
Candidate
   │
   ▼
Website Form
   │ POST request
   ▼
n8n Webhook: Website Form Submission
   │
   ▼
Resume Text Extraction (PDF)
   │
   ▼
AI Resume Analysis (Groq Chat Completions API)
   │
   ▼
Parse AI Analysis Result
   ├──────────────────────► Respond to Webhook
   │                         Returns parsed AI result
   ▼
Prepare Application Report
   │
   ▼
Candidate Insights Delivery (Gmail)
   │
   ▼
Application Records Manager (Google Sheets)
   │
   ▼
Follow-Up Scheduler (Google Calendar)

AI request error
   └──────────────────────► AI Failure Handler (Gmail)
```

> This diagram follows the connections in the supplied n8n workflow export. The webhook response branches directly from the parsed AI result, while the email, Sheets, and Calendar steps continue on a separate branch. A successful website response therefore does not prove that all downstream actions have finished.

## Components

| Component | Responsibility |
|---|---|
| Website form | Sends candidate and job information plus the resume |
| Website Form Submission | Receives the POST webhook request |
| Resume Text Extraction | Extracts text from the PDF binary field named `resume` |
| AI Resume Analysis | Sends job and resume information to the Groq API |
| Parse AI Analysis Result | Parses the model response as JSON |
| Prepare Application Report | Sets candidate name, email, job title, and company fields |
| Candidate Insights Delivery | Emails the analysis to the applicant |
| Application Records Manager | Appends analysis details to Google Sheets |
| Follow-Up Scheduler | Creates a follow-up event in the connected Google Calendar |
| Respond to Webhook | Returns the parsed AI result to the caller |
| AI Failure Handler | Emails the applicant if the AI request enters its error output |

## AI Output

The configured prompt requests applicant contact/profile fields, education, graduation date, `fit_score`, reasoning, matching skills, missing skills, missing information, and a cover letter.

## Important Boundaries

- The uploaded workflow JSON does not include the website's source code, so frontend implementation cannot be verified from that file alone.
- The webhook export's allowed origin is `http://127.0.0.1:5500`; update it to the actual deployed website origin before using the deployed frontend.
- Credentials and personal information must not be exposed in a public workflow export.

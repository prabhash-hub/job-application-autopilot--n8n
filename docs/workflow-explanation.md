# 🔄 n8n Workflow Guide

## Purpose

The workflow accepts a website form submission, extracts PDF resume text, requests AI analysis, and connects the result to Gmail, Google Sheets, and Google Calendar.

## Node Reference

| Node | Function |
|---|---|
| `Website Form Submission` | Receives a POST request through the webhook |
| `Resume Text Extraction` | Extracts text from the binary property `resume` using PDF extraction |
| `AI Resume Analysis` | Calls the Groq Chat Completions endpoint with job and resume content |
| `Parse AI Analysis Result` | Removes optional Markdown code fences and parses the AI content as JSON |
| `Prepare Application Report` | Sets applicant name/email and job title/company fields |
| `Candidate Insights Delivery` | Sends an analysis email through Gmail |
| `Application Records Manager` | Appends candidate and analysis fields to Google Sheets |
| `Follow-Up Scheduler` | Creates a 30-minute event approximately seven days ahead in the connected Google Calendar |
| `Respond to Webhook` | Returns the parsed AI result as JSON |
| `AI Failure Handler` | Sends a failure email if the AI request uses its error output |

## AI Analysis Request

The prompt asks the model to:
- compare resume evidence with the supplied job description;
- return a numeric `fit_score` from 0 to 100;
- explain the score;
- list matching skills and job requirements not evidenced in the resume;
- extract contact/profile details only when available;
- generate a role- and company-specific cover letter;
- return JSON matching the requested schema.

## Branching and Response Timing

The supplied workflow connects `Parse AI Analysis Result` to both `Prepare Application Report` and `Respond to Webhook`. The integrations continue from `Prepare Application Report` through Gmail, Google Sheets, and Google Calendar.

This means the webhook can return the parsed AI result before the integration branch has finished. Do not treat the website response as proof that email delivery, spreadsheet logging, or calendar scheduling succeeded.

## Before Publishing

- Replace exposed credentials with secure n8n credentials.
- Check the allowed origin.
- Confirm the webhook production URL.
- Confirm connected accounts and destinations.
- Run an end-to-end test and verify each integration.

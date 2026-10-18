# Workflow Explanation

## Project Name
Job Application Autopilot

## Overview
This workflow automates resume analysis and cover-letter generation using n8n and AI.

## Workflow Nodes

### 1. On Form Submission
Collects:
- Applicant name
- Applicant email
- Job title
- Company name
- Job description
- Resume PDF

### 2. Extract from File
Extracts readable text from the uploaded PDF resume.

### 3. HTTP Request — Groq API
Sends the applicant's details, resume text, and job description to the Groq API.

The AI generates:
- Resume-job match score
- Analysis and reasoning
- Matching skills
- Missing or unverified skills
- Personalized cover letter
- Available contact and education information

### 4. Parse AI Result
Converts the AI-generated JSON response into structured data for the next nodes.

### 5. Edit Fields
Combines the original form information with the AI analysis.

### 6. Send a Message — Gmail
Sends the analysis report and personalized cover letter to the applicant's email address.

### 7. Append Row in Sheet
Stores application information and AI analysis in Google Sheets.

### 8. Create an Event — Google Calendar
Creates a follow-up calendar event.

## Important Notes
- The workflow currently extracts resumes from PDF files.
- The match score is an AI-generated estimate, not a hiring decision.
- AI-generated content should be reviewed before use.
- Each user must configure their own API and Google credentials.
- Google Sheets and Calendar settings must point to the correct resources.
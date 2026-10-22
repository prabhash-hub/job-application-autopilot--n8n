# 🤖 Job Application Autopilot

### 🚀 AI-Powered Resume Analysis & Job Application Automation

An AI-powered automation project that analyzes a candidate's resume against a job description, generates a personalized cover letter, and manages application records and follow-up reminders using n8n and integrated services.

---

## 📌 About the Project

**Job Application Autopilot** is designed to simplify the job application process through AI and workflow automation.

The system accepts a candidate's resume and job details, extracts resume text, analyzes the candidate's skills and suitability using an AI model, and prepares a personalized application report.

It also integrates with Gmail, Google Sheets, and Google Calendar to support email delivery, application record management, and follow-up scheduling.

## ✨ Key Features

- 📄 **Resume Text Extraction** — Extracts text from PDF resumes.
- 🧠 **AI Resume Analysis** — Analyzes resume information using a Groq API integration.
- 📊 **Resume Match Score** — Generates a match score and reasoning based on the AI analysis.
- 🎯 **Skills Analysis** — Identifies matching and missing skills.
- ✉️ **Personalized Cover Letter** — Generates a cover letter tailored to the application details.
- 📧 **Email Integration** — Uses Gmail to deliver the application report.
- 📑 **Application Tracking** — Stores application records in Google Sheets.
- 📅 **Follow-Up Reminder** — Creates a follow-up calendar event approximately seven days later.
- ⚠️ **Error Handling** — Includes a workflow branch for AI failure notifications.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Frontend, if included in the repository |
| n8n | Workflow automation |
| Groq API | AI-powered resume analysis |
| PDF Extraction | Resume text processing |
| Gmail | Email notifications and report delivery |
| Google Sheets | Application record management |
| Google Calendar | Follow-up event scheduling |

## 🔄 How It Works

1. 📝 **Submit Application Details** — The candidate submits the form with the resume and relevant job information.
2. 📄 **Extract Resume Text** — The workflow extracts text from the uploaded PDF.
3. 🧠 **Analyze with AI** — The AI analyzes the resume against the supplied job information.
4. 📊 **Prepare the Report** — The workflow parses the AI response and prepares the application report.
5. ✉️ **Send the Report** — Gmail delivers the report to the configured recipient.
6. 📑 **Save Application Records** — Google Sheets stores the application information.
7. 📅 **Schedule Follow-Up** — Google Calendar creates a follow-up event.

### Workflow Overview

```text
📝 Website Form
       ↓
📄 Resume Text Extraction
       ↓
🧠 AI Resume Analysis
       ↓
📊 Parse & Prepare Report
       ↓
   ┌───┴───────────────┐
   ↓                   ↓
📤 Webhook Response   ✉️ Gmail Report
                           ↓
                     📑 Google Sheets
                           ↓
                     📅 Calendar Event
```

*Note: The webhook response and report-delivery branches may execute independently. The website response does not necessarily mean that every downstream integration has finished successfully.*

## ⚙️ Setup & Installation

### Prerequisites

Before starting, make sure you have:

- [ ] Node.js, if required by the included frontend
- [ ] An n8n instance
- [ ] A Groq API key
- [ ] A connected Gmail account
- [ ] A configured Google Sheets document
- [ ] A connected Google Calendar account

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd job-application-autopilot
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual repository URL.

### Step 2: Configure the Frontend

If the frontend files are included, open the project using your preferred local development server.

Ensure the frontend sends requests to the correct n8n webhook URL.

### Step 3: Import the n8n Workflow

1. Open your n8n instance.
2. Import the sanitized workflow JSON file.
3. Verify the webhook configuration.
4. Configure the required Gmail, Google Sheets, and Google Calendar credentials.
5. Configure the Groq API authentication securely.
6. Update any development URLs to match your environment.

### Step 4: Configure the Webhook

Ensure the frontend request URL matches the webhook URL configured in n8n.

If the frontend and backend are hosted on different origins, configure the appropriate allowed origin and verify CORS settings.

### Step 5: Test the Workflow

1. Submit a test application using a valid PDF resume.
2. Check whether the resume text is extracted.
3. Verify the AI-generated analysis and match score.
4. Check Gmail for the report.
5. Verify the application record in Google Sheets.
6. Confirm that the follow-up event is created in Google Calendar.

### Step 6: Activate the Workflow

After testing the workflow and verifying the integrations, activate it in n8n if your deployment requires an active workflow for production webhook requests.

## 🧪 Testing Checklist

- [ ] Valid PDF resume submission
- [ ] Missing or invalid resume handling
- [ ] AI response parsing
- [ ] Match score and skills verification
- [ ] Cover letter generation
- [ ] Gmail report delivery
- [ ] Google Sheets record creation
- [ ] Google Calendar follow-up creation
- [ ] AI failure notification
- [ ] Frontend-to-webhook connectivity

*These are recommended test cases; successful execution must be verified in your own environment.*

## ⚠️ Current Limitations

- 📄 Resume extraction currently supports PDF files in the exported workflow.
- 🌐 The webhook's configured allowed origin is a local development URL and must be updated for deployment.
- 🔌 Gmail, Google Sheets, Google Calendar, and Groq integrations require valid credentials and configuration.
- 📅 The follow-up event is created in the connected calendar; it is not automatically added to the candidate's personal calendar.
- 🔄 Downstream integrations may still be processing after the webhook response is returned.
- 🧪 The exported workflow must be tested in the target environment before production use.

## 🔐 Security Best Practices

- 🔑 Never commit API keys, access tokens, passwords, or private credentials to GitHub.
- 🛡️ Store secrets using n8n credentials or appropriate environment variables.
- 🧹 Remove sensitive information from workflow exports before sharing them publicly.
- 🔍 Review Git history if a secret has already been committed.
- 🔄 Revoke and rotate any exposed API keys immediately.
- 🔒 Share only the minimum required personal information in application records.

## 📁 Suggested Repository Structure

```text
job-application-autopilot/
├── README.md
├── .gitignore
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── n8n/
│   ├── workflow.json
│   └── README.md
└── screenshots/
    ├── website/
    └── workflow/
```

*Adjust this structure to match the files actually present in your repository.*

## 🎯 Project Objectives

- 🤖 Automate repetitive resume analysis tasks.
- ⏱️ Reduce manual effort in preparing job applications.
- 🎯 Provide AI-generated insights into resume-job alignment.
- ✉️ Simplify report delivery and application tracking.
- 📅 Support timely follow-up through calendar reminders.

## 🚀 Future Enhancements

- 🔎 Automated job discovery from approved job sources
- 🧩 Resume-to-job matching improvements
- 📈 Application analytics dashboard
- 🔔 Configurable follow-up notifications
- 📂 Support for additional resume formats
- 🧪 Automated integration and workflow tests

*These are potential future improvements, not claims about currently implemented functionality.*

## 👨‍💻 Author

**Project:** Job Application Autopilot

**Built with:** AI, n8n, and workflow automation

## 📜 Disclaimer

This project is intended for educational and productivity purposes. AI-generated scores, skill assessments, and cover letters may contain errors and should be reviewed before use. Job application outcomes are not guaranteed.

---

⭐ If you find this project useful, consider giving the repository a star!
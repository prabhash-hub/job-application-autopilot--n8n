# ⚠️ Limitations & Security

## Current Scope

The supplied n8n export configures a workflow for:
- PDF resume text extraction;
- AI-based resume/job-description comparison;
- an estimated match score and reasoning;
- matching skills, missing skills, missing profile information, and a cover letter;
- Gmail analysis email and AI-failure email;
- Google Sheets record logging;
- Google Calendar follow-up event creation;
- a JSON webhook response.

## Limitations

### 📄 Resume Format
The supplied extraction node is configured for PDF. DOC/DOCX support is not shown in this export.

### 🤖 AI Accuracy
The fit score and written analysis are model-generated estimates. They may contain errors and should be reviewed before being used in an application.

### 📅 Calendar Destination
The workflow creates an event in the Google Calendar account connected to n8n. The export does not show a mechanism for creating an event in each applicant's personal calendar.

### ⏱️ Response and Integration Timing
`Respond to Webhook` is connected directly after parsing the AI result, while Gmail, Google Sheets, and Google Calendar continue along another branch. The browser may receive a response before those actions complete.

### 🌐 CORS Configuration
The supplied Webhook export allows `http://127.0.0.1:5500`. A deployed website needs its own exact origin configured.

### 📴 Activation State
The supplied export has `active: false`. It must be activated/published in the target n8n instance for production use.

### 🖥️ Frontend Verification
Only an n8n workflow JSON was supplied for this review. The frontend source, UI behaviour, and live deployment cannot be verified from that JSON alone.

## Security Checklist 🔐

- Never commit API keys, OAuth tokens, passwords, or credential exports.
- Store credentials in n8n's credential manager or an appropriate secrets manager.
- Revoke and rotate any key that was exposed in a file or commit.
- Removing a key from the latest file does not remove it from Git history.
- Review workflow exports for authorization headers, private IDs, email addresses, and personal data.
- Do not publish real resumes, candidate data, or private execution logs.
- Use genuine screenshots and redact sensitive details.

## Honest Project Claims

Describe an integration as configured until you have verified its real output. Do not claim full end-to-end testing unless you have performed it.

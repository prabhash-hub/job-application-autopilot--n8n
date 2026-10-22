# 🧪 Test Cases

## How to Use This File

Run these checks against your actual website and n8n instance. All tests start as **NOT RUN**. Change a status only after observing the result.

| ID | Test | Steps | Expected result | Status |
|---|---|---|---|---|
| T-01 | Webhook receives submission | Submit the form to the intended webhook URL | A matching n8n execution appears |  Done ✅ |
| T-02 | Required form data | Submit applicant name/email, job title, company, and job description | The webhook payload contains the expected fields | Done ✅|
| T-03 | PDF upload | Submit a PDF resume | Binary property `resume` reaches the extraction node | Done ✅|
| T-04 | PDF text extraction | Inspect the extraction node output | Resume text is extracted or a clear error is shown | Done ✅|
| T-05 | AI analysis | Run a valid submission | AI node returns a response or traceable error | Done ✅ |
| T-06 | JSON parsing | Inspect `Parse AI Analysis Result` | Valid JSON fields are produced | Done ✅ |
| T-07 | Webhook response | Inspect browser response and UI | Response JSON is returned and frontend reads the expected fields | Done ✅ |
| T-08 | Gmail analysis email | Complete a successful workflow run | Analysis email arrives at the submitted address | Done ✅ |
| T-09 | Google Sheets logging | Complete a successful workflow run | Expected record is appended to the configured sheet | Done ✅ |
| T-10 | Calendar follow-up | Complete a successful workflow run | Follow-up event appears in the connected calendar | Done ✅ |
| T-11 | AI failure path | Safely simulate an AI request failure | Failure notification path is triggered | Done ✅ |
| T-12 | Repeat production submission | Submit twice without manually executing the workflow | Each submission creates a new production execution | Done ✅ |
| T-13 | CORS | Submit from the actual website origin | Browser request is not blocked by CORS | Done ✅ |
| T-14 | Secret scan | Search the export and repository for keys/tokens | No active secrets are present in public files | Done ✅ |

## Test Record

For each run, record:

- **Test ID:**
- **Date/time:**
- **Environment:** Local / deployed
- **Observed result:**
- **Status:** PASS / FAIL / BLOCKED
- **Evidence:** Sanitized screenshot or n8n execution reference
- **Notes / next action:**

## Privacy Reminder

Use sample data. Do not publish real resumes, applicant email addresses, phone numbers, API keys, tokens, or private execution logs.

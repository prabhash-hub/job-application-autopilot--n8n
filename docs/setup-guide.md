# ⚙️ Setup Guide

This guide is based on the supplied n8n workflow export. Confirm settings in your own n8n instance before production use.

## 1. Prerequisites

- An n8n instance.
- A Groq API account and API key.
- Authorized Gmail, Google Sheets, and Google Calendar connections in n8n.
- A website/frontend that submits the expected form data.
- A PDF resume for testing.

## 2. Configure Credentials 🔐

1. Open n8n and configure the AI provider credential securely.
2. Confirm the Gmail account connection.
3. Confirm the Google Sheets connection and target spreadsheet.
4. Confirm the Google Calendar connection and target calendar.
5. Do not store API keys in frontend JavaScript or commit them to GitHub.

## 3. Configure the Webhook 🌐

The workflow uses a `POST` Webhook named `Website Form Submission` and responds through the `Respond to Webhook` node.

1. Open the Webhook node.
2. Confirm its path and HTTP method.
3. Set the allowed origin to the actual website origin.
4. The supplied export currently uses `http://127.0.0.1:5500`, which only matches a local site served from that origin.
5. Make sure the frontend submits the PDF as the binary field named `resume`.
6. Confirm the form sends the expected fields, including applicant name, applicant email, job title, company name, and job description.
7. Use the Test URL for manual testing and the Production URL for a published/active workflow.

## 4. Activate and Test

1. Import or open the workflow in n8n.
2. Reconnect credentials if needed.
3. Confirm the Google Sheet and Calendar destinations.
4. Check the webhook URL and allowed origin.
5. Publish/activate the workflow for production requests.
6. Submit a test application with a PDF resume.
7. Inspect the n8n execution and the actual webhook response.
8. Separately verify the Gmail message, spreadsheet row, and calendar event.
9. Submit again without manually executing the workflow.

## 5. Troubleshooting 🛠️

| Symptom | Check |
|---|---|
| No execution appears | Webhook URL, HTTP method, workflow active status, browser Network tab |
| CORS error | Allowed origin exactly matches website origin, including scheme and hostname |
| Resume extraction fails | Uploaded file is a PDF and binary field is named `resume` |
| AI response parsing fails | Inspect AI response format and `Parse AI Analysis Result` input |
| Website result is missing | Compare actual webhook JSON keys with the frontend's expected keys |
| Website responds before integrations finish | This is possible because `Respond to Webhook` is on a separate branch |
| Email, Sheets, or Calendar output missing | Inspect each node's execution and connected service separately |

## 6. Security Checklist

- [ ] Revoke any API key that was exposed in a file or commit.
- [ ] Store the replacement key securely in n8n.
- [ ] Remove keys, tokens, and private data from exported JSON.
- [ ] Confirm `.gitignore` excludes local secret files.
- [ ] Use sample data when taking screenshots.

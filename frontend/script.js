/* =========================================================
   Job Application Autopilot — frontend logic
   ---------------------------------------------------------
   1. Paste your n8n Form Trigger / Webhook URL in CONFIG
      below to go live. Leave it empty to run in demo mode
      (nothing leaves the browser).
   ========================================================= */

const CONFIG = {
  WEBHOOK_URL: "https://prabhash123.app.n8n.cloud/webhook-test/094b7448-69ad-40a8-a237-62d1de8f748d", // e.g. "https://your-n8n.host/webhook/job-application"
  DEMO_DELAY: 620, // ms per workflow step in demo mode
  MAX_FILE_MB: 10,
  ALLOWED_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXT: ["pdf", "doc", "docx"],
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isLive = () => CONFIG.WEBHOOK_URL.trim().length > 0;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- mobile nav ---------------- */
const burger = $("#burger");
const nav = $("#nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

/* ---------------- scroll reveal + counters ---------------- */
const revealTargets = $$(".flow-step, .out-card, .cmp-card, .feat, .stats div, .faq-item, .cta, .stack, .fallback-note");
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      if (entry.target.classList.contains("stats")) countUp(entry.target);
      if (entry.target.matches(".stats div")) countUp(entry.target.parentElement);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => io.observe(el));

function countUp(scope) {
  $$("[data-count]", scope).forEach((el) => {
    const target = Number(el.dataset.count);
    const dur = 900;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------------- dates (sample calendar + reminder) ---------------- */
const plus7 = new Date();
plus7.setDate(plus7.getDate() + 7);

const fmtShort = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const fmtLong = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

$("#cal-month").textContent = plus7.toLocaleString("en-GB", { month: "short" }).toUpperCase();
$("#cal-day").textContent = plus7.getDate();
$("#cal-full").textContent = `${fmtLong.format(plus7)} · Added to your calendar automatically`;
$("#hero-reminder").textContent = `You'll be reminded on ${fmtShort.format(plus7)}`;

/* ---------------- form refs ---------------- */
const form = $("#resume-form");
const fileInput = $("#resume-file");
const dropzone = $("#dropzone");
const fileName = $("#file-name");
const fileSub = $("#file-sub");
const resumeMsg = $("#resume-msg");
const jd = form.job_description;
const jdCounter = $("#jd-counter");
const notice = $("#notice");
const noticeText = $("#notice-text");
const submitBtn = $("#submit-btn");

const result = $("#result");
const resultBadge = $("#result-badge");
const resultTitle = $("#result-title");
const resultBody = $("#result-body");
const progressSteps = $$(".pstep");
const fallbackBox = $("#fallback");
const fallbackText = $("#fallback-text");

let currentFile = null;

if (!isLive()) {
  noticeText.innerHTML =
    "Demo mode — this form is not connected yet, so nothing is sent anywhere. You're seeing the full experience as a preview.";
}

/* ---------------- job description counter ---------------- */
function updateCounter() {
  const words = jd.value.trim() ? jd.value.trim().split(/\s+/).length : 0;
  jdCounter.textContent = `${words} word${words === 1 ? "" : "s"}`;
  jdCounter.classList.toggle("good", words >= 60);
}
jd.addEventListener("input", updateCounter);
updateCounter();

/* ---------------- file handling ---------------- */
function setFile(file) {
  currentFile = null;
  resumeMsg.textContent = "";
  dropzone.classList.remove("has-file", "drag");

  if (!file) {
    fileName.textContent = "Drop your resume here";
    fileSub.innerHTML = 'or <u>browse files</u> from your device';
    return;
  }

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const okExt = CONFIG.ALLOWED_EXT.includes(ext);
  const okType = !file.type || CONFIG.ALLOWED_TYPES.includes(file.type);

  if (!okExt || !okType) {
    resumeMsg.textContent = "Unsupported format — please use PDF, DOC, or DOCX.";
    fileName.textContent = "Drop your resume here";
    fileSub.innerHTML = 'or <u>browse files</u> from your device';
    fileInput.value = "";
    return;
  }

  if (file.size > CONFIG.MAX_FILE_MB * 1024 * 1024) {
    resumeMsg.textContent = `File is ${(file.size / 1048576).toFixed(1)} MB — maximum allowed is ${CONFIG.MAX_FILE_MB} MB.`;
    fileName.textContent = "Drop your resume here";
    fileSub.innerHTML = 'or <u>browse files</u> from your device';
    fileInput.value = "";
    return;
  }

  currentFile = file;
  dropzone.classList.add("has-file");
  fileName.textContent = file.name;
  fileSub.textContent = `${(file.size / 1048576).toFixed(2)} MB ready to upload ✓`;
}

fileInput.addEventListener("change", () => setFile(fileInput.files && fileInput.files[0]));

["dragenter", "dragover"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.add("drag");
  })
);
["dragleave", "drop"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
  })
);
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file) return;
  try {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
  } catch (_) {
    /* browsers that block DataTransfer still get validation below */
  }
  setFile(file);
});

/* ---------------- validation ---------------- */
function validate() {
  let ok = true;
  let firstBad = null;

  $$(".field", form).forEach((label) => {
    const input = label.querySelector("input, textarea");
    if (!input || !input.required) return;

    const value = input.value.trim();
    let bad = !value;

    if (!bad && input.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!bad && input.type === "url" && value) bad = !/^https?:\/\/.+\..+/i.test(value);
    if (!bad && input.name === "job_description") bad = value.split(/\s+/).length < 25;

    label.classList.toggle("invalid", bad);
    if (bad) {
      ok = false;
      if (!firstBad) firstBad = input;
    }
  });

  if (!currentFile) {
    resumeMsg.textContent = "Please attach your resume (PDF, DOC, or DOCX).";
    ok = false;
    if (!firstBad) firstBad = fileInput;
  }

  if (!ok && firstBad) firstBad.focus({ preventScroll: false });
  return ok;
}

$$(".field input, .field textarea").forEach((input) => {
  input.addEventListener("input", () => {
    const label = input.closest(".field");
    if (label && label.classList.contains("invalid") && input.value.trim()) {
      label.classList.remove("invalid");
    }
  });
});

/* ---------------- demo AI generation ---------------- */
const SKILL_BANK = [
  "python", "sql", "excel", "tableau", "power bi", "javascript", "typescript",
  "react", "node", "aws", "gcp", "azure", "docker", "kubernetes",
  "machine learning", "tensorflow", "pandas", "statistics", "a/b testing",
  "project management", "agile", "scrum", "communication", "stakeholder",
  "leadership", "figma", "sales", "customer service", "seo", "marketing",
  "java", "git", "data analysis", "data visualization", "etl", "looker",
  "snowflake", "reporting", "forecasting", "budgeting", "recruitment",
  "copywriting", "crm", "salesforce", "hubspot", "automation", "leadership",
];

const GAP_POOL = [
  "Cloud platforms (AWS / GCP / Azure) are not mentioned in your CV",
  "No evidence of automation or scripting tooling",
  "Warehouse / advanced SQL tooling not highlighted",
  "A/B testing and experimentation not on record",
  "Formal certification in the advertised domain is missing",
];

const SKILL_TIPS = {
  python: "If accurate, add a concrete Python project and name the libraries or outcome.",
  sql: "Show the SQL work you have done, such as queries, reporting, or data transformations.",
  excel: "Mention the Excel features you have used and what they helped you deliver.",
  tableau: "Add a Tableau dashboard example and explain who used it and why.",
  "power bi": "Include a Power BI report or dashboard example if you have relevant experience.",
  aws: "If you have used AWS, name the services and describe the task; otherwise consider a small guided project.",
  gcp: "If you have used GCP, name the services and describe the task; otherwise consider a small guided project.",
  azure: "If you have used Azure, name the services and describe the task; otherwise consider a small guided project.",
  javascript: "Add a JavaScript project or work example that demonstrates how you used it.",
  typescript: "Describe a TypeScript project and the benefits it brought to the codebase.",
  react: "Show a React project and explain the features or user needs you addressed.",
  docker: "Describe how you used Docker to package or run an application.",
  kubernetes: "If you have Kubernetes experience, explain the deployment or operations work you handled.",
  "machine learning": "Describe a machine-learning project, including the problem, approach, and measurable result.",
  pandas: "Mention how you used pandas to clean, transform, or analyze data.",
  statistics: "Give an example of how statistical analysis informed a decision or result.",
  "a/b testing": "Describe an experiment you designed or analyzed and what changed as a result.",
  "project management": "Highlight a project you coordinated, your role, and how you kept it on track.",
  agile: "Mention the Agile practices you have used and how you contributed to the team.",
  scrum: "Describe your Scrum role and how you helped deliver work across a sprint.",
  communication: "Add an example showing how you explained complex information to an audience.",
  stakeholder: "Name the stakeholders you worked with and how your work supported their decisions.",
  leadership: "Use a specific example of how you guided people, decisions, or delivery.",
  figma: "Include a Figma design or prototype and explain the user problem it addressed.",
  sales: "Highlight a sales outcome with context, your contribution, and measurable results.",
  "customer service": "Share an example of resolving a customer need and its outcome.",
  seo: "Mention SEO work alongside outcomes such as traffic, ranking, or conversions.",
  marketing: "Describe a campaign or channel you worked on and its measurable impact.",
  java: "Add a Java project or work example and describe your contribution.",
  git: "Mention how you used Git for collaboration, version control, or code reviews.",
  "data analysis": "Show an analysis you completed, the tools used, and the decision it informed.",
  "data visualization": "Include a visualization example and explain how it made findings easier to use.",
  etl: "Describe a data pipeline or ETL task and the systems or tools involved.",
  looker: "Include a Looker report or dashboard and the audience or decisions it supported.",
  snowflake: "If you have used Snowflake, describe the data or workflows you worked with.",
  reporting: "Give an example of a report you created and the outcome it enabled.",
  forecasting: "Describe a forecast you built and how it was used.",
  budgeting: "Mention the budget scope you supported and the decisions your work informed.",
  recruitment: "Describe the recruiting work you handled and the outcomes you contributed to.",
  copywriting: "Include a writing sample or campaign and its audience or impact.",
  crm: "Name the CRM work you performed and how it supported customer or sales processes.",
  salesforce: "Describe how you used Salesforce, including the workflows or reports you supported.",
  hubspot: "Describe how you used HubSpot and the marketing or sales process it supported.",
  automation: "Show an automation example and the time, effort, or errors it reduced.",
};

const SKILL_ALIASES = {
  automation: ["automate", "automated", "automating"],
  communication: ["communicate", "communicated", "communicating", "communications"],
  forecasting: ["forecast", "forecasts", "forecasted"],
  recruitment: ["recruiting"],
  reporting: ["report", "reports"],
  stakeholder: ["stakeholders"],
};

function hasSkill(text, skill) {
  return [skill, ...(SKILL_ALIASES[skill] || [])].some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(text);
  });
}

function renderSkillMatch() {
  const resumeText = $("#demo-resume").value.trim();
  const jobText = $("#demo-job").value.trim();
  const required = [...new Set(SKILL_BANK.filter((skill) => hasSkill(jobText, skill)))];
  const matched = required.filter((skill) => hasSkill(resumeText, skill));
  const missing = required.filter((skill) => !hasSkill(resumeText, skill));
  const score = required.length ? Math.round((matched.length / required.length) * 100) : null;

  $("#match-score").textContent = score === null ? "—" : `${score}%`;
  $("#match-summary-text").textContent = required.length
    ? `${matched.length} of ${required.length} recognized job skills also appear in the resume text.`
    : "No recognized skills found in the job description. Try adding more role requirements.";

  const renderChips = (target, skills, emptyMessage, kind) => {
    target.replaceChildren();
    if (!skills.length) {
      const empty = document.createElement("span");
      empty.className = "empty-chip";
      empty.textContent = emptyMessage;
      target.appendChild(empty);
      return;
    }
    skills.forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = `skill-chip ${kind}`;
      chip.textContent = skill;
      target.appendChild(chip);
    });
  };

  renderChips($("#matched-skills"), matched, "No shared skills found yet", "matched");
  renderChips($("#missing-skills"), missing, "No unmentioned skills found", "missing");

  const suggestions = $("#skill-suggestions");
  suggestions.replaceChildren();
  const tips = missing.slice(0, 4).map((skill) =>
    SKILL_TIPS[skill] || `If you have experience with ${skill}, add a specific example and its outcome to your resume.`
  );
  if (missing.length > 4) {
    tips.push(`Prioritize the remaining ${missing.length - 4} gap${missing.length - 5 === 0 ? "" : "s"} that matter most to this role.`);
  }
  if (!tips.length && required.length) {
    tips.push("Your resume text mentions all recognized skills in this posting. Strengthen it with specific projects and measurable outcomes.");
  } else if (!tips.length) {
    tips.push("Add the role's key requirements and relevant resume experience, then run the match again.");
  }
  tips.forEach((tip) => {
    const item = document.createElement("li");
    item.textContent = tip;
    suggestions.appendChild(item);
  });
}

const skillCheckForm = $("#skill-check-form");
skillCheckForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderSkillMatch();
});
renderSkillMatch();

function analyseDemo(data) {
  const text = `${data.job_description} ${data.job_title} ${data.company_name}`.toLowerCase();
  const matched = SKILL_BANK.filter((s) => text.includes(s)).slice(0, 5);
  const gaps = GAP_POOL.filter((g) => !text.includes(g.split(" (")[0].toLowerCase())).slice(0, 2);
  const seed = [...`${data.job_title}${data.company_name}`].reduce((a, c) => a + c.charCodeAt(0), 0);

  let score = 58 + matched.length * 7 + (seed % 9);
  if (data.job_description.length > 900) score += 4;
  if (data.availability) score += 3;
  if (data.profile_url) score += 3;
  score = Math.max(58, Math.min(95, score));

  const reason = [];
  matched.slice(0, 3).forEach((s) => reason.push({ ok: true, text: `Keyword match — ${s} appears in the posting and your profile context` }));
  reason.push({
    ok: true,
    text: `Requirements coverage — roughly ${Math.min(9, matched.length + 3)} of the listed responsibilities map to your background`,
  });
  (gaps.length ? gaps : [GAP_POOL[0]]).forEach((g) => reason.push({ ok: false, text: g }));
  reason.push({
    ok: true,
    text: `Seniority & language — tone of the posting matches the level you applied at`,
  });

  return { score, reason };
}

function verdictFor(score) {
  if (score >= 85) return "Strong match — worth applying today.";
  if (score >= 72) return "Good match — apply and lead with your top two wins.";
  if (score >= 62) return "Partial match — lean on transferable skills in the letter.";
  return "Stretch role — tailor the CV before you send it.";
}

function buildLetter(data, matched) {
  const skills =
    matched.length >= 2
      ? matched.slice(0, 3).join(", ")
      : "data analysis, reporting, and stakeholder communication";
  const availability = data.availability
    ? `On the timing you flagged: ${data.availability.trim()}.`
    : "I can make myself available to talk within the next week.";

  return `Dear Hiring Team,

I'm writing to apply for the ${data.job_title} role at ${data.company_name}. Having read the posting in full, the problems you describe — ${skills} — are exactly the kind of work I've spent the last few years doing, and I'd love to bring that experience to your team.

In my recent roles I've turned ambiguous requirements into concrete, measurable output: building the analysis and the reporting around it, then working directly with the people who depend on it so the numbers actually get used. That combination of hands-on execution and clear communication is what I'd want to keep doing at ${data.company_name}.

${availability}

I'd welcome a short conversation about how I'd approach the first 90 days in this role. Thank you for your time and consideration — I've attached my CV and look forward to hearing from you.

Warm regards,
${data.applicant_name}
${data.applicant_email}`;
}

function extractDemoResult(data) {
  const { score, reason } = analyseDemo(data);
  const text = `${data.job_description} ${data.job_title}`.toLowerCase();
  const matched = SKILL_BANK.filter((s) => text.includes(s)).slice(0, 3);
  return {
    score,
    reasoning: reason,
    cover_letter: buildLetter(data, matched),
    reminder_date: plus7.toISOString(),
    mode: "demo",
  };
}

/* ---------------- UI helpers ---------------- */
function setNotice(text, kind) {
  noticeText.innerHTML = text;
  notice.classList.remove("error", "ok");
  if (kind) notice.classList.add(kind);
}

function resetProgress() {
  progressSteps.forEach((s) => s.classList.remove("done", "active"));
  resultBody.hidden = true;
  fallbackBox.hidden = true;
}

async function runProgress() {
  for (let i = 0; i < progressSteps.length; i++) {
    progressSteps.forEach((s, idx) => {
      s.classList.toggle("active", idx === i);
      if (idx < i) s.classList.add("done");
    });
    await wait(CONFIG.DEMO_DELAY);
  }
  progressSteps.forEach((s) => {
    s.classList.remove("active");
    s.classList.add("done");
  });
}

function animateScore(target) {
  const ring = $("#res-ring");
  const num = $("#res-score-num");
  const dur = 900;
  const t0 = performance.now();
  ring.style.setProperty("--p", 0);
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    num.textContent = val;
    ring.style.setProperty("--p", String(Math.round(target * eased)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderResult(data) {
  const score = Number(data.score) || 0;
  const reasoning = Array.isArray(data.reasoning) ? data.reasoning : [];
  const letter = data.cover_letter || data.coverLetter || "";

  $("#res-score-num").textContent = "0";
  $("#res-verdict").textContent = verdictFor(score);

  const list = $("#res-reason-list");
  list.innerHTML = "";
  reasoning.slice(0, 6).forEach((item) => {
    const li = document.createElement("li");
    const ok = typeof item === "object" ? item.ok !== false : true;
    const text = typeof item === "object" ? item.text : String(item);
    li.innerHTML = `<b class="${ok ? "" : "gap"}">${ok ? "✓" : "+"}</b><span></span>`;
    li.querySelector("span").textContent = text;
    list.appendChild(li);
  });
  if (!reasoning.length) {
    list.innerHTML = '<li><b>✓</b><span>Score generated from your CV and the job description.</span></li>';
  }

  $("#res-letter-body").innerHTML = letter
    .split(/\n\s*\n/)
    .map(
      (p) =>
        `<p>${p
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>")}</p>`
    )
    .join("");

  $("#res-remind-date").textContent = `Created for ${fmtLong.format(new Date(data.reminder_date || plus7))}`;

  resultBadge.textContent = data.mode === "live" ? "LIVE RUN" : "DEMO RUN";
  resultBadge.className = "result-badge live";
  resultTitle.textContent = "Application complete — everything is on its way.";
  resultBody.hidden = false;

  animateScore(score);
}

function showFallback(message) {
  fallbackText.innerHTML = message;
  fallbackBox.hidden = false;
  resultBody.hidden = true;
  progressSteps.forEach((s) => {
    s.classList.remove("active");
    s.classList.add("done");
  });
  resultBadge.textContent = "FALLBACK";
  resultBadge.className = "result-badge fail";
  resultTitle.textContent = "AI call failed — fallback path used.";
}

/* ---------------- submit ---------------- */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validate()) {
    setNotice("Please fix the highlighted fields before submitting.", "error");
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  delete data.resume;

  submitBtn.disabled = true;
  submitBtn.innerHTML = "Running the autopilot… <b>✳</b>";
  result.hidden = false;
  resetProgress();
  setNotice(isLive() ? "Processing your application…" : "Demo run — showing you the full experience…");
  result.scrollIntoView({ behavior: "smooth", block: "center" });

  try {
    if (isLive()) {
      progressSteps[0].classList.add("active");
      const res = await fetch(CONFIG.WEBHOOK_URL, { method: "POST", body: new FormData(form) });
      if (!res.ok) throw new Error(`Workflow responded with ${res.status}`);
      await runProgress();

      const raw = await res.text();
      let payload = null;
      try {
        payload = JSON.parse(raw);
      } catch (_) {
        payload = null;
      }

      if (payload && (payload.fallback || payload.error)) {
        showFallback(
          payload.message ||
            "The AI couldn't finish this run. Your application has still been saved, a message is on its way to your inbox, and your 7-day follow-up reminder was created. You can submit again any time."
        );
        setNotice("The AI couldn't finish this run — your application was still saved.", "error");
      } else if (payload && (payload.score != null || payload.cover_letter || payload.coverLetter)) {
        renderResult({ ...payload, mode: "live" });
        setNotice("Done — score, letter, sheet row, and calendar reminder all created.", "ok");
      } else {
        resultBadge.textContent = "SUBMITTED";
        resultBadge.className = "result-badge live";
        resultTitle.textContent = "Your application is in — results are on their way to your inbox.";
        progressSteps.forEach((s) => s.classList.add("done"));
        setNotice("Application submitted — your fit score and cover letter will arrive by email.", "ok");
      }
    } else {
      await runProgress();
      renderResult(extractDemoResult(data));
      setNotice("Demo complete — this is exactly what you'd receive. Connect the form to go live.", "ok");
    }
  } catch (err) {
    showFallback(
      `We couldn't reach the AI service (${err.message}). Your application has still been saved, a message is on its way to your inbox, and your 7-day follow-up reminder was created. Try again any time.`
    );
    setNotice("Something went wrong — but your application was still saved.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Build my application <b>→</b>";
  }
});

$("#result-close").addEventListener("click", () => {
  result.hidden = true;
  resetProgress();
});

/* ---------------- FAQ: one open at a time ---------------- */
$$(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    $$(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

Below is the complete **Improvement Roadmap**, broken into phases, and each phase includes:

1️⃣ **Purpose**
2️⃣ **Scope** (what to build)
3️⃣ **Strict boundaries** (what NOT to build)
4️⃣ **Cursor-friendly system prompt** (copy-paste ready)

Use one phase at a time.

---

# ✅ **PHASED IMPROVEMENT PLAN**

---

# **PHASE 1 — UI/UX Polish (shadcn only)**

### **Purpose**

Improve the results page UI visual clarity using shadcn components.

### **Scope**

* Replace current plain UI with shadcn `<Card>`, `<Badge>`, `<Separator>`, `<Progress>`.
* Add skeleton/loading components for analysis wait time.
* Keep layout identical (no new features).
* No navigation changes.
* No color overhaul besides shadcn defaults.

### **Do Not**

* Do NOT change analysis logic.
* Do NOT add new API routes.
* Do NOT add new features.
* Do NOT touch database/history logic.
* Do NOT over-refactor.

---

### ✅ **Cursor Prompt for Phase 1**

```
You are an expert Next.js developer working on ARESA (AI Resume Analyzer). Your task is ONLY to improve the UI using shadcn/ui without changing any logic.

=== SCOPE (STRICT) ===
1. Use shadcn/ui components to polish the interface:
   - Card, CardHeader, CardContent
   - Badge
   - Separator
   - Progress
   - Skeleton for loading state

2. Keep the existing structure and layout.
3. Improve spacing, hierarchy, and readability.

=== DO NOT ===
- Do not change any backend code.
- Do not modify analysis logic.
- Do not add new routes.
- Do not adjust the history system.
- Do not introduce new features.
- Avoid any major refactor.

=== GOAL ===
Make the existing pages more aesthetic and readable, using shadcn UI, while preserving the current behavior and APIs.
```

---

# **PHASE 2 — Add DOCX Upload Support**

### **Purpose**

Enable users to upload `.docx` files.

### **Scope**

* Install `docx` parser (`yarn add docx` or `mammoth`).
* Create extraction utility `/lib/docx.ts`.
* Update upload handler to accept PDF or DOCX.
* No UI redesign; only add the file extension support.

### **Do Not**

* Do NOT change flow.
* Do NOT modify results UI.
* Do NOT alter JSON format.

---

### ✅ **Cursor Prompt for Phase 2**

```
You are adding DOCX upload support to ARESA. Make only the minimal required changes.

=== SCOPE (STRICT) ===
1. Add ability to upload and parse .docx resumes.
2. Create a new util: /lib/docx.ts for docx→text extraction.
3. Modify the analysis API route to:
   - Detect PDF vs DOCX
   - Process accordingly
4. Keep all logic, routes, UI, and JSON structure identical.

=== DO NOT ===
- Do not redesign the UI.
- Do not modify score logic.
- Do not change the response schema.
- Do not introduce third-party APIs.

=== GOAL ===
User can upload PDF or DOCX, both convert to text, everything else stays the same.
```

---

# **PHASE 3 — Improve Loading UX**

### **Purpose**

Add a better loading flow when analyzing resumes.

### **Scope**

* Add a shadcn `<Skeleton>` for UI.
* Add “Analyzing your resume…” placeholder.
* Add a multi-step loader (optional):

  * Extracting text
  * Analyzing content
  * Generating insights

### **Do Not**

* No fancy animations.
* No server-side changes.
* Do not alter API response.

---

### ✅ **Cursor Prompt for Phase 3**

```
Improve the loading experience using shadcn/ui components.

=== SCOPE ===
- Add skeleton loaders for the result page.
- Add a simple “Analyzing your resume…” loading state.
- Replace any plain text loader with prettier shadcn components.

=== DO NOT ===
- Do not change API logic.
- Do not modify backend code.
- Do not add new features or metrics.

=== GOAL ===
Visually pleasing loading flow but identical functionality.
```

---

# **PHASE 4 — Portfolio URL Analyzer (NEW Feature)**

### **Purpose**

Allow user to input a URL (GitHub or portfolio) → tool extracts text → AI analyzes.

### **Scope**

* Add input field for URL (optional).
* Basic page scraper using `cheerio`.
* New API route: `/api/analyze-portfolio`.
* Use Groq for portfolio analysis.
* Display results similar to resume analyzer.

### **Do Not**

* Do NOT combine with resume analyzer.
* Do NOT change existing analysis.
* No history tracking for this stage.

---

### ✅ **Cursor Prompt for Phase 4**

```
You are adding a new, separate feature called Portfolio Analyzer.

=== SCOPE ===
1. Add an input field for a portfolio/GitHub URL.
2. Create a new API route: /api/analyze-portfolio.
3. Use a lightweight scraper (cheerio) to extract visible text from the page.
4. Send extracted text to Groq with a structured prompt.
5. Render portfolio insights in a new page or component.

=== DO NOT ===
- Do not modify existing resume analysis flow.
- Do not merge portfolio results into resume results.
- Do not change the history system.
- Do not redesign the UI.
- Do not change the JSON schema of resume analyzer.

=== GOAL ===
Clean, isolated Portfolio Analyzer feature.
```

---

# **PHASE 5 — Add History Improvements (Charts & Insights)**

### **Purpose**

Improve history page with chart & timeline.

### **Scope**

* Add line chart for score progression.
* Add badges for score improvements.
* No authentication.
* Store history locally (unless DB already exists).

### **Do Not**

* No backend changes unless needed.
* No cloud database integration.
* No user login.

---

### ✅ **Cursor Prompt for Phase 5**

```
Improve the History page with simple analytics.

=== SCOPE ===
1. Add a small line chart (e.g., using Recharts) to show score progression.
2. Display percentage improvement between entries.
3. Highlight the highest score achieved.

=== DO NOT ===
- Do not change backend APIs.
- Do not introduce authentication.
- Do not refactor architecture.
- Do not change resume scoring logic.

=== GOAL ===
Enhanced visualization of existing history data.
```

You are an expert Next.js developer helping me build a Minimum Viable Product (MVP) called **AI Resume Analyzer + Portfolio Coach** using:

- Next.js 15 (App Router)
- Typescript
- TailwindCSS
- shadcn/ui
- Groq API (Llama 3 or Mixtral models)
- Local PDF → text extraction
- Simple, clean architecture

====================================================
== 🔥 OVERALL PROJECT GOAL (MVP ONLY) ==
====================================================

Build a lightweight web app that:
1. Allows users to upload a PDF resume OR paste text manually.
2. Extracts text from the PDF (if uploaded).
3. Sends extracted text to the Groq API.
4. Receives structured JSON feedback:
   - Resume Score (0–100)
   - Strengths
   - Weaknesses
   - Actionable Improvements
   - Optional improved Summary rewrite
5. Displays results in a clean UI.

Optionally (ONLY if easy):
- User enters a Portfolio / GitHub URL → basic analysis.
But this is secondary. Focus on **Resume Analyzer first**.

====================================================
== 🔧 MVP REQUIREMENTS (STRICT) ==
====================================================

The MVP must include:

1. **Homepage**
   - Resume upload field (PDF)
   - OR textarea to paste resume text manually
   - Submit button

2. **API route**
   - Parses PDF → text using `pdf-parse`
   - Calls Groq API with structured prompt
   - Returns JSON object with analysis

3. **Result Page**
   - Resume score
   - Strengths list
   - Weaknesses list
   - Actionable improvements list
   - Optional rewritten summary

4. **Prompt Design (IMPORTANT)**
   Groq must return JSON EXACTLY like this:

   {
     "score": number,
     "strengths": string[],
     "weaknesses": string[],
     "improvements": string[],
     "rewritten_summary": string
   }

5. **Clean, minimal UI**
   - Only use shadcn components if needed
   - Avoid complex layouts

====================================================
== ❌ DO NOT (IMPORTANT) ==
====================================================

- No authentication
- No database
- No external scraping library unless necessary
- No Stripe, no paywall
- No fancy UI, no animations
- No Docker setup
- No state management libraries
- No RSC streaming unless very simple

This MVP must be:
➡️ clean  
➡️ minimal  
➡️ easy to extend  
➡️ production-deploy-ready

====================================================
== 📁 PREFERRED FILE STRUCTURE ==
====================================================

Use this structure:

/app
  /page.tsx              → homepage (upload)
  /results/page.tsx      → show results
/api/analyze/route.ts    → API endpoint
/lib/groq.ts             → Groq API wrapper
/lib/pdf.ts              → PDF → text extractor
/components/*            → small UI components

====================================================
== 🤖 GROQ API USAGE ==
====================================================

Use this model:
- "llama-3.1-70b-versatile" or "mixtral-8x7b"

Use OpenAI-compatible REST endpoint:
POST https://api.groq.com/openai/v1/chat/completions

Include environmental variable:
GROQ_API_KEY="gsk_xxxxxx"

====================================================
== 🧱 DEVELOPMENT STRATEGY ==
====================================================

Follow this order:

1. Build project structure
2. Build file upload + textarea input
3. Build PDF → text extraction util
4. Build API route
5. Add Groq prompt + structured response parsing
6. Build results page
7. Test end-to-end flow

====================================================
== 🎯 IMPORTANT CONSTRAINTS ==
====================================================

- Prioritize correctness over UI
- Write clean, readable code
- Keep everything simple
- Use server actions OR route handlers (not API routes AND actions)
- Always return JSON schema exactly as defined
- Never hallucinate extra features

====================================================
== 📌 START WHEN READY ==
====================================================

Begin by scaffolding the folder structure and basic pages.



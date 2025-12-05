import Groq from "groq-sdk"

interface ResumeAnalysis {
  success: boolean
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  rewritten_summary: string
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeResumeWithGroq(resumeText: string): Promise<ResumeAnalysis> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set')
  }

  const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume text and provide a structured assessment.

Resume Text:
${resumeText}

Please provide your analysis in the following JSON format only (no additional text or explanation):

{
  "score": number (0-100, overall resume quality score),
  "strengths": array of strings (3-5 key strengths of this resume),
  "weaknesses": array of strings (2-4 main areas that need improvement),
  "improvements": array of strings (3-5 actionable suggestions to improve the resume),
  "rewritten_summary": string (an improved version of the professional summary/objective, if present, or a suggested one if missing)
}

Guidelines for analysis:
- Score should be realistic and based on content quality, formatting, keywords, achievements, and completeness
- Strengths should highlight what the resume does well
- Weaknesses should identify genuine gaps or issues
- Improvements should be specific, actionable recommendations
- Rewritten summary should be professional, concise, and highlight key value propositions
- Keep all text responses concise but meaningful
- Ensure the response is valid JSON that can be parsed`

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    if(!chatCompletion.choices[0]?.message?.content) {
      throw new Error('Failed to analyze resume')
    }

    const rawContent = chatCompletion.choices[0].message.content
    // Clean the response by removing any markdown code blocks
    const cleanedContent = rawContent.replace(/```json\s*|\s*```/g, '').trim()
    const content = JSON.parse(cleanedContent)

    return {
      success: true,
      score: content.score,
      strengths: content.strengths,
      weaknesses: content.weaknesses,
      improvements: content.improvements,
      rewritten_summary: content.rewritten_summary,
    }
  } catch (error) {
    console.error('Error analyzing resume:', error)
    // throw new Error('Failed to analyze resume')
    return {
      success: false,
      score: 0,
      strengths: [],
      weaknesses: [],
      improvements: [],
      rewritten_summary: '',
    }
  }
}

import { NextRequest, NextResponse } from "next/server";

let openaiClient: import("openai").default | null = null;

async function getClient() {
  if (!openaiClient) {
    const OpenAI = (await import("openai")).default;
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
  }
  return openaiClient;
}

const SYSTEM_PROMPT = `You are an expert resume writer and ATS (Applicant Tracking System) specialist. Analyze the resume against the job description and generate a comprehensive optimization report including:
1) Overall match score (0-100%) with breakdown by section (summary, experience, skills, education)
2) Missing keywords: specific terms and skills from the job description that are absent or underrepresented in the resume
3) Section-by-section rewrite suggestions with specific language improvements
4) ATS optimization tips: formatting advice, keyword density, and common ATS heuristics to beat
5) A complete rewritten version of the resume optimized for this specific job, with all changes highlighted
6) Top 3 priority actions to improve the match score immediately
Format with clear sections. Be specific and actionable.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    const client = await getClient();
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });
    const text = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}

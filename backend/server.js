import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️  GROQ_API_KEY is not set. Add it to a .env file.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function buildPrompt({ year, branch, goal, skills }) {
  return `You are a career mentor for engineering students in India, designing a personalized 12-week roadmap.

Student profile:
- Year: ${year}
- Branch: ${branch}
- Goal: ${goal}
- Current skills: ${skills}

Design a 12-week roadmap calibrated to this exact profile.
- Start with fundamentals if beginner, skip basics if already skilled.
- Tie themes to their branch and goal.
- Each week must have 2-3 concrete actionable tasks.
- Each week must include ONE real, well-known learning resource with a real URL.

Respond with ONLY valid JSON in exactly this shape, nothing else - no markdown, no explanation:

{
  "roadmap": [
    {
      "week": 1,
      "theme": "string",
      "tasks": ["string", "string", "string"],
      "resource": {
        "title": "string",
        "url": "string"
      },
      "status": "not_started"
    }
  ]
}

Rules:
- The roadmap array must contain exactly 12 objects, week 1 through 12 in order.
- tasks must be an array of 2 or 3 strings.
- status must always be the string "not_started".
- Output raw JSON only. No markdown code fences.`;
}

function extractJson(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

function validateRoadmap(parsed) {
  if (!parsed || !Array.isArray(parsed.roadmap)) return "Missing roadmap array";
  if (parsed.roadmap.length !== 12) return `Expected 12 weeks, got ${parsed.roadmap.length}`;
  for (let i = 0; i < parsed.roadmap.length; i++) {
    const w = parsed.roadmap[i];
    if (typeof w.week !== "number" || w.week !== i + 1) return `Invalid week number at index ${i}`;
    if (!w.theme) return `Week ${i + 1} missing theme`;
    if (!Array.isArray(w.tasks) || w.tasks.length < 2) return `Week ${i + 1} needs 2-3 tasks`;
    if (!w.resource?.title || !w.resource?.url) return `Week ${i + 1} missing resource`;
    w.status = "not_started";
  }
  return null;
}

async function callGroqForRoadmap(profile, retryHint = null) {
  const prompt = buildPrompt(profile);
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: retryHint
          ? `${prompt}\n\nIMPORTANT: Previous response was invalid because: ${retryHint}. Return ONLY the corrected raw JSON.`
          : prompt,
      },
    ],
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("No response from Groq");
  return extractJson(text);
}

app.post("/generate-roadmap", async (req, res) => {
  const { year, branch, goal, skills } = req.body || {};

  if (!year || !branch || !goal || !skills) {
    return res.status(400).json({ error: "Missing required fields: year, branch, goal, skills" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set in .env" });
  }

  const profile = { year, branch, goal, skills };

  try {
    let parsed, error;

    try {
      parsed = await callGroqForRoadmap(profile);
      error = validateRoadmap(parsed);
    } catch (e) {
      error = e.message;
    }

    if (error) {
      console.warn("First attempt failed, retrying:", error);
      try {
        parsed = await callGroqForRoadmap(profile, error);
        error = validateRoadmap(parsed);
      } catch (e) {
        error = e.message;
      }
    }

    if (error) {
      return res.status(502).json({ error: "Failed to generate valid roadmap", details: error });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`First Year Filter backend running on http://localhost:${PORT}`);
});
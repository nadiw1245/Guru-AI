import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY පරිසර විචල්‍යය සකසා නොමැත. කරුණාකර Settings වෙතින් GEMINI_API_KEY ඇතුළත් කරන්න.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const PRIMARY_MODEL = "gemini-3.7-flash";
const FALLBACK_MODEL = "gemini-2.5-flash";

async function generateWithFallback(ai: GoogleGenAI, contents: any, config: any, stream = false) {
  try {
    if (stream) {
      return await ai.models.generateContentStream({
        model: PRIMARY_MODEL,
        contents,
        config,
      });
    }
    return await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents,
      config,
    });
  } catch (err: any) {
    console.warn(`Primary model ${PRIMARY_MODEL} failed, trying fallback ${FALLBACK_MODEL}:`, err?.message);
    if (stream) {
      return await ai.models.generateContentStream({
        model: FALLBACK_MODEL,
        contents,
        config,
      });
    }
    return await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents,
      config,
    });
  }
}

const SYSTEM_INSTRUCTION_BASE = `
You are an expert, friendly, and deeply encouraging AI tutor (මිත්‍රශීලී සිංහල AI ගුරුතුමා).
Your mission is to make learning enjoyable, deeply intuitive, and empowering for students.

PRIMARY DIRECTIVES:
1. WHEN TEACHING A NEW CONCEPT:
   - Always explain it simply and intuitively using everyday, relatable Sri Lankan / daily life analogies (උපමා) (e.g. making milk tea, cricket matches, riding a CTB bus, pol sambol, market vendors, water tanks, kites, bicycle gears, coconut scrapes).
   - Write predominantly in clear, grammatically correct, natural, and polite Sinhala (සිංහල).
   - Whenever introducing technical or academic terms, provide the English word in brackets next to the Sinhala term (e.g. ප්‍රභාසංස්ලේෂණය (Photosynthesis), විචල්‍යයන් (Variables), ඝනත්වය (Density)).
   - Keep paragraphs concise, well-formatted with markdown, bolding, and bullet points.
   - Conclude with a warm check question to ensure understanding.

2. WHEN HELPING WITH ASSIGNMENTS, HOMEWORK, OR PROBLEMS:
   - CRITICAL RULE: NEVER EVER GIVE THE DIRECT ANSWER OR FULL WORKED SOLUTION TO AN ASSIGNMENT OR TEST PROBLEM.
   - Use the SOCRATIC METHOD (සොක්‍රටීස් ක්‍රමය):
     * Acknowledge the question with enthusiasm.
     * Identify the core concept or formula involved without solving it.
     * Ask 1 or 2 targeted, gentle guiding questions (මඟපෙන්වන ප්‍රශ්න) to help the student break down the first step on their own.
     * If the student gives an answer or makes an attempt:
       - If correct: Celebrate their effort warmly and guide them to the next step.
       - If incorrect: Point out what part was great, clarify the misconception with a simple analogy, and ask a modified guiding question.
     * Encourage critical thinking, patience, and self-confidence.

3. TONE & PERSONALITY:
   - Warm, respectful, encouraging, patient, and motivating (මිත්‍රශීලී, කාරුණික, සහෝදරත්වයෙන් යුත් ගුරු පෞරුෂය).
   - Use friendly Sinhala address terms like "යාලුවා / පුතා / දුවේ / ඔයා".
`;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Sinhala AI Tutor API" });
});

// Chat Streaming Endpoint (SSE)
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { messages, mode = "concept", studentLevel = "beginner" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();

    let modeSpecificInstruction = "";
    if (mode === "assignment") {
      modeSpecificInstruction = `
CURRENT MODE: ASSIGNMENT / HOMEWORK GUIDANCE (පැවරුම් මඟපෙන්වීම)
Strict rule: DO NOT provide direct answers, complete code, or numerical solutions.
Ask 1-2 focused guiding questions (මඟපෙන්වන ප්‍රශ්න). Break down the first step only.
Encourage the student to reply with their thought or attempt.
`;
    } else if (mode === "analogy") {
      modeSpecificInstruction = `
CURRENT MODE: DEEP ANALOGY EXPLORER (උපමා ගවේෂණය)
Focus heavily on crafting vivid, unforgettable, and humorous or everyday real-life Sri Lankan analogies for the topic asked.
Explain step-by-step how each element of the real-world analogy maps to the scientific/technical concept.
`;
    } else if (mode === "quiz") {
      modeSpecificInstruction = `
CURRENT MODE: KNOWLEDGE CHECK (දැනුම පරීක්ෂාව)
Ask a short, interactive conceptual question in Sinhala based on what was discussed to verify comprehension.
Provide multiple choice options or a friendly thought-provoking question.
`;
    } else {
      modeSpecificInstruction = `
CURRENT MODE: CONCEPT TEACHING (සංකල්ප ඉගැන්වීම)
Explain simply with relatable analogies, real-world examples in Sinhala, and brief English terminology in brackets.
`;
    }

    const fullSystemInstruction = `${SYSTEM_INSTRUCTION_BASE}
Student Level: ${studentLevel}
${modeSpecificInstruction}`;

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Filter and format chat contents for Gemini
    const validMessages = messages.filter(
      (m: any) => m && typeof m.content === "string" && m.content.trim().length > 0
    );

    if (validMessages.length === 0) {
      return res.status(400).json({ error: "No valid message content provided" });
    }

    const contents = validMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const responseStream = (await generateWithFallback(
      ai,
      contents,
      {
        systemInstruction: fullSystemInstruction,
        temperature: 0.7,
      },
      true
    )) as AsyncIterable<any>;

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Chat stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Failed to generate tutor response" });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Streaming interrupted" })}\n\n`);
      res.end();
    }
  }
});

// Structured Concept Breakdown & Analogy Generator
app.post("/api/concept/explain", async (req, res) => {
  try {
    const { concept, studentLevel = "beginner" } = req.body;
    if (!concept) {
      return res.status(400).json({ error: "Concept is required" });
    }

    const ai = getGeminiClient();

    const prompt = `Explain the following concept for a student at level: ${studentLevel}.
Concept: "${concept}"

Provide the response in structured JSON with:
1. titleSinhala: Clear Sinhala title
2. titleEnglish: English title
3. shortSummarySinhala: 2-3 sentence simple explanation in Sinhala
4. everydayAnalogySinhala: A vivid, everyday analogy in Sinhala (e.g. household, market, transport, cricket, food)
5. keyPointsSinhala: Array of 3-4 bullet points explaining the core mechanics
6. englishGlossary: Array of objects { englishTerm: string, sinhalaMeaning: string }
7. guidingQuestionSinhala: A thought-provoking question to check student understanding
`;

    const response: any = await generateWithFallback(ai, prompt, {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titleSinhala: { type: Type.STRING },
          titleEnglish: { type: Type.STRING },
          shortSummarySinhala: { type: Type.STRING },
          everydayAnalogySinhala: { type: Type.STRING },
          keyPointsSinhala: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          englishGlossary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                englishTerm: { type: Type.STRING },
                sinhalaMeaning: { type: Type.STRING },
              },
              required: ["englishTerm", "sinhalaMeaning"],
            },
          },
          guidingQuestionSinhala: { type: Type.STRING },
        },
        required: [
          "titleSinhala",
          "titleEnglish",
          "shortSummarySinhala",
          "everydayAnalogySinhala",
          "keyPointsSinhala",
          "englishGlossary",
          "guidingQuestionSinhala",
        ],
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Concept explanation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate concept explanation" });
  }
});

// Socratic Assignment Step Analyzer (Never gives answers)
app.post("/api/assignment/roadmap", async (req, res) => {
  try {
    const { problemText } = req.body;
    if (!problemText) {
      return res.status(400).json({ error: "Problem text is required" });
    }

    const ai = getGeminiClient();

    const prompt = `Analyze this student homework / assignment question:
"${problemText}"

CRITICAL RULE: DO NOT SOLVE THE PROBLEM OR GIVE THE FINAL ANSWER.
Instead, create a Socratic learning roadmap in Sinhala.

Provide structured JSON with:
1. problemSubjectSinhala: Subject/Field in Sinhala (e.g. ගණිතය, භෞතික විද්‍යාව, පරිගණක)
2. keyPrinciplesSinhala: Array of fundamental theories/formulas/principles involved (without doing calculations)
3. steps: Array of 3 to 4 roadmap steps:
   - stepNumber: number (1, 2, 3...)
   - titleSinhala: Step milestone title (e.g. "ප්‍රශ්නයේ දත්ත හඳුනාගැනීම", "අදාළ සූත්‍රය තෝරාගැනීම")
   - guidingQuestionSinhala: A Socratic question to guide the student on this specific step
4. starterMessageSinhala: Warm opening message in Sinhala initiating the first step.
`;

    const response: any = await generateWithFallback(ai, prompt, {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problemSubjectSinhala: { type: Type.STRING },
          keyPrinciplesSinhala: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                titleSinhala: { type: Type.STRING },
                guidingQuestionSinhala: { type: Type.STRING },
              },
              required: ["stepNumber", "titleSinhala", "guidingQuestionSinhala"],
            },
          },
          starterMessageSinhala: { type: Type.STRING },
        },
        required: [
          "problemSubjectSinhala",
          "keyPrinciplesSinhala",
          "steps",
          "starterMessageSinhala",
        ],
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Assignment roadmap error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze assignment" });
  }
});

// Quiz Generator
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { topic = "General Science", count = 3 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} fun, educational, conceptual multiple-choice quiz questions in Sinhala based on: "${topic}".
Each question should test conceptual understanding (not just rote memorization) and include an everyday analogy in the explanation.

Provide structured JSON:
questions: Array of:
- id: string
- questionSinhala: Question text in Sinhala
- options: Array of 4 options in Sinhala
- correctIndex: number (0 to 3)
- explanationSinhala: Clear, friendly explanation in Sinhala
- analogyClue: Short analogy hint in Sinhala
`;

    const response: any = await generateWithFallback(ai, prompt, {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                questionSinhala: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanationSinhala: { type: Type.STRING },
                analogyClue: { type: Type.STRING },
              },
              required: [
                "id",
                "questionSinhala",
                "options",
                "correctIndex",
                "explanationSinhala",
                "analogyClue",
              ],
            },
          },
        },
        required: ["questions"],
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// Vite Middleware for development vs static for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sinhala AI Tutor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

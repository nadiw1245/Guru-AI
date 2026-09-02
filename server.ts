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
    throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in Settings / Secrets.");
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
You are an expert, friendly, and deeply encouraging AI tutor.
Your mission is to make learning intuitive, enjoyable, and empowering for all students.

CORE TUTOR DIRECTIVES:
1. WHEN TEACHING A NEW CONCEPT:
   - Always explain it simply and intuitively using relatable, vivid everyday analogies (e.g. cooking, sports, cars, restaurants, baking, water plumbing, library shelves, electricity grids, board games).
   - Break down complex concepts into step-by-step building blocks.
   - Format with clean markdown, bullet points, and bold keywords for effortless readability.
   - Finish with a brief, friendly check question to verify comprehension.

2. WHEN HELPING WITH ASSIGNMENTS, HOMEWORK, OR PROBLEMS:
   - ABSOLUTE RULE: NEVER provide the direct final answer or write complete worked solutions for homework problems or exam questions.
   - Use the SOCRATIC METHOD:
     * Acknowledge the question with encouragement.
     * Identify the core concept or principle without performing the calculations.
     * Ask 1 or 2 targeted, gentle guiding questions to help the student break down the first step on their own.
     * If the student provides an answer or thought:
       - If correct: Warmly celebrate their reasoning and prompt them toward the next milestone.
       - If incorrect: Point out what part of their thinking was great, clarify the misconception with a simple analogy, and ask an easier guiding question.
     * Build self-confidence and genuine mastery.

3. TONE & PERSONALITY:
   - Enthusiastic, patient, supportive, clear, and intellectually curious.
   - Communicate strictly in clean, natural, and engaging English.
`;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AI Concept & Homework Tutor API" });
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
CURRENT MODE: ASSIGNMENT & SOCRATIC HOMEWORK COACH
Strict rule: DO NOT provide the final answer, complete code, or direct numerical solution.
Ask 1-2 focused guiding questions. Guide the student on the first step only.
Encourage the student to reply with their thinking or next attempt.
`;
    } else if (mode === "analogy") {
      modeSpecificInstruction = `
CURRENT MODE: EVERYDAY ANALOGY EXPLORER
Focus deeply on crafting vivid, creative, and relatable everyday analogies for the topic.
Explicitly map the components of the analogy to the actual scientific or technical mechanisms.
`;
    } else if (mode === "quiz") {
      modeSpecificInstruction = `
CURRENT MODE: CONCEPTUAL KNOWLEDGE CHECK
Ask a short, interactive thought-provoking question to test the student's conceptual grasp.
`;
    } else {
      modeSpecificInstruction = `
CURRENT MODE: CONCEPT TEACHING
Explain simply and clearly with everyday analogies and real-world applications.
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
1. title: Clear conceptual title in English
2. shortSummary: 2-3 sentence intuitive overview in English
3. everydayAnalogy: A vivid, memorable everyday analogy (e.g., kitchen cooking, sports, cars, plumbing, games, library)
4. keyMechanics: Array of 3-4 bullet points explaining the core principles
5. vocabulary: Array of objects { term: string, definition: string }
6. guidingQuestion: A thought-provoking question to check student understanding
`;

    const response: any = await generateWithFallback(ai, prompt, {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          shortSummary: { type: Type.STRING },
          everydayAnalogy: { type: Type.STRING },
          keyMechanics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
              },
              required: ["term", "definition"],
            },
          },
          guidingQuestion: { type: Type.STRING },
        },
        required: [
          "title",
          "shortSummary",
          "everydayAnalogy",
          "keyMechanics",
          "vocabulary",
          "guidingQuestion",
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
Instead, create a Socratic learning roadmap in English.

Provide structured JSON with:
1. problemSubject: Subject/Field in English (e.g., Algebra, Classical Physics, Computer Science, Chemistry, Biology)
2. keyPrinciples: Array of fundamental theories/formulas/principles involved (without performing calculations)
3. steps: Array of 3 to 4 roadmap steps:
   - stepNumber: number (1, 2, 3...)
   - title: Step milestone title (e.g. "Identify Given Data & Constraints", "Determine Core Relationship", "Set Up the Algebraic Expression")
   - guidingQuestion: A Socratic question to guide the student on this specific step
4. starterMessage: Warm opening message in English initiating the first step.
`;

    const response: any = await generateWithFallback(ai, prompt, {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problemSubject: { type: Type.STRING },
          keyPrinciples: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                guidingQuestion: { type: Type.STRING },
              },
              required: ["stepNumber", "title", "guidingQuestion"],
            },
          },
          starterMessage: { type: Type.STRING },
        },
        required: [
          "problemSubject",
          "keyPrinciples",
          "steps",
          "starterMessage",
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

    const prompt = `Generate ${count} engaging, conceptual multiple-choice quiz questions in English based on: "${topic}".
Each question should test deep conceptual understanding and include an everyday analogy clue in the explanation.

Provide structured JSON:
questions: Array of:
- id: string
- question: Question text in English
- options: Array of 4 options in English
- correctIndex: number (0 to 3)
- explanation: Clear, encouraging conceptual explanation
- analogyClue: Short everyday analogy hint
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
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                analogyClue: { type: Type.STRING },
              },
              required: [
                "id",
                "question",
                "options",
                "correctIndex",
                "explanation",
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
    console.log(`AI Tutor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

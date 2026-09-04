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

const PRIMARY_MODEL = "gemini-3.8-flash";
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
You are guruAI — the warmest, most patient, and inspiring Artificial Intelligence educator in the world.
Your dedicated mission is to help complete beginners, parents, non-technical adults, and curious minds learn Artificial Intelligence from scratch with ZERO intimidation.

CORE TEACHING PHILOSOPHY & DIRECTIVES:
1. "EXPLAIN TO MY DAD" SIMPLICITY:
   - Assume the learner may have never written code, worked in tech, or used advanced software.
   - Ground every abstract AI concept in vivid, tangible everyday analogies (cooking in a kitchen, driving a car, tending a garden, shopping at a grocery store, organizing a garage, sending mail at the post office, board games).
   - NEVER use unexplained technical jargon. If you mention words like "Tokens", "Weights", "Neural Network", "LLM", or "Hallucination", immediately follow up with an intuitive everyday comparison.

2. STEP-BY-STEP BUILDING BLOCKS:
   - Break explanations into bite-sized, logical steps.
   - Use clean Markdown formatting with bold highlights and bullet points for effortless scanning.
   - Contrast traditional computer code (rigid rulebooks like a tax form) with AI (learning from patterns and examples like a child or apprentice).

3. DEBUNKING MYTHS WITH EMPATHY:
   - Clarify common fears and misconceptions gently (e.g. AI is not conscious, it doesn't have feelings or secret motives; it is an incredible mathematical pattern-matching tool created by humans).
   - Show how AI can assist in everyday life (drafting emails, planning road trips, explaining medical terms in simple language, troubleshooting home repairs).

4. INTERACTIVE CHECK-INS:
   - End your lessons with a friendly, low-pressure check-in question or invitation to try a simple prompt together.

5. TONE:
   - Respectful, enthusiastic, encouraging, never condescending or overwhelming.
   - Clear, natural, engaging English.
`;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "guruAI - Learn AI from Scratch" });
});

// Chat Streaming Endpoint (SSE)
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { messages, mode = "learn", studentLevel = "dad_beginner" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();

    let modeSpecificInstruction = "";
    if (mode === "sandbox" || mode === "assignment") {
      modeSpecificInstruction = `
CURRENT MODE: PROMPT SANDBOX & SKILL LAB
The user is practicing how to talk to AI and write effective prompts.
1. Guide them using the CLEAR formula: Context, Length/Format, Examples, Audience, Role.
2. If they share a prompt, kindly show what makes it work, what is missing, and provide a polished upgraded version with an explanation of why the upgrade gives superior results.
3. Keep it practical and empowering.
`;
    } else if (mode === "analogy") {
      modeSpecificInstruction = `
CURRENT MODE: EVERYDAY AI ANALOGY EXPLORER
Deeply unpack AI concepts (like Transformers, Neural Weights, Hallucinations, Embeddings, Diffusion, Fine-Tuning) using vivid household, mechanical, culinary, or nature metaphors.
Explicitly map each part of the real-world metaphor to the actual AI mechanism.
`;
    } else if (mode === "quiz") {
      modeSpecificInstruction = `
CURRENT MODE: AI LITERACY & MYTHBUSTER QUIZ
Ask interactive, friendly questions that test conceptual intuition about Artificial Intelligence.
Celebrate correct understanding warmly and gently clear up any misconceptions.
`;
    } else {
      modeSpecificInstruction = `
CURRENT MODE: AI LEARNING FROM SCRATCH (FOUNDATIONS)
Teach AI concepts starting from ground zero. Make it crystal clear, relatable, and fun.
Use everyday analogies for every technical element.
`;
    }

    let levelInstruction = "";
    if (studentLevel === "dad_beginner" || studentLevel === "beginner") {
      levelInstruction = "TARGET LEARNER: Complete Beginner / Parent (Zero coding experience. Use simple, warm, household analogies. Avoid all unexplained technical jargon).";
    } else if (studentLevel === "curious_explorer") {
      levelInstruction = "TARGET LEARNER: Curious Explorer (Everyday tech user interested in smartphone AI tools and practical productivity).";
    } else if (studentLevel === "hands_on") {
      levelInstruction = "TARGET LEARNER: Hands-On Prompt Creator (Wants to write stellar prompts, avoid hallucinations, and use AI tools effectively).";
    } else if (studentLevel === "deep_tech") {
      levelInstruction = "TARGET LEARNER: Deep Tech Curious (Wants to understand model parameters, neural weights, token embeddings, and technical mechanics).";
    }

    const fullSystemInstruction = `${SYSTEM_INSTRUCTION_BASE}
${levelInstruction}
${modeSpecificInstruction}`;

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

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

// Prompt Analyzer for Sandbox Mode
app.post("/api/prompt/analyze", async (req, res) => {
  try {
    const { promptText, studentLevel = "dad_beginner" } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: "Prompt text is required" });
    }

    const ai = getGeminiClient();

    const prompt = `You are guruAI's prompt laboratory mentor.
Analyze this user's prompt:
"${promptText}"

Student Level: ${studentLevel}

Evaluate the prompt and return structured JSON with:
1. clarityScore: number between 10 and 99 indicating how clear and actionable the prompt is
2. critique: Friendly 2-sentence feedback on what makes this prompt a great start and what details are missing
3. formulaBreakdown: An object with 4 fields:
   - role: who the AI should act as (e.g. "Expert Carpenter", "Patient Family Doctor", "Helpful Travel Guide")
   - task: the specific core action requested
   - context: background information or situation provided (or note if missing)
   - constraints: style, length, or tone requirements (or note if missing)
4. improvedPrompt: The upgraded "guru-level" version of this prompt that will get vastly superior results from any AI
5. whyItWorks: 2-3 sentences explaining why the improved version guides the AI so much better
6. proTip: A memorable one-sentence golden rule for beginner prompt writing
`;

    const response: any = await generateWithFallback(ai, prompt, {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clarityScore: { type: Type.INTEGER },
          critique: { type: Type.STRING },
          formulaBreakdown: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              task: { type: Type.STRING },
              context: { type: Type.STRING },
              constraints: { type: Type.STRING },
            },
            required: ["role", "task", "context", "constraints"],
          },
          improvedPrompt: { type: Type.STRING },
          whyItWorks: { type: Type.STRING },
          proTip: { type: Type.STRING },
        },
        required: [
          "clarityScore",
          "critique",
          "formulaBreakdown",
          "improvedPrompt",
          "whyItWorks",
          "proTip",
        ],
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Prompt analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze prompt" });
  }
});

// Structured Concept Breakdown & Analogy Generator
app.post("/api/concept/explain", async (req, res) => {
  try {
    const { concept, studentLevel = "dad_beginner" } = req.body;
    if (!concept) {
      return res.status(400).json({ error: "Concept is required" });
    }

    const ai = getGeminiClient();

    const prompt = `Explain the following Artificial Intelligence concept for someone learning from scratch (Level: ${studentLevel}):
Concept: "${concept}"

Provide the response in structured JSON with:
1. title: Clear conceptual title in English
2. shortSummary: 2-3 sentence intuitive overview without scary jargon
3. everydayAnalogy: A vivid, memorable everyday analogy (e.g. kitchen cooking, driving, gardening, library, carpentry, grocery store)
4. keyMechanics: Array of 3-4 bullet points explaining how it actually works step-by-step
5. vocabulary: Array of objects { term: string, definition: string } defining any terms in plain English
6. guidingQuestion: A thought-provoking question to check intuition
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

// Quiz Generator for AI Literacy
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { topic = "Artificial Intelligence Basics", count = 3 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} fun, engaging multiple-choice quiz questions in English to test AI literacy and debunk common myths about: "${topic}".
Design the questions so that beginners (like someone's dad or a new learner) feel encouraged, learn something practical, and bust misconceptions.

Provide structured JSON:
questions: Array of:
- id: string
- question: Question text in English
- options: Array of 4 options in English
- correctIndex: number (0 to 3)
- explanation: Clear, encouraging explanation in plain English
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

// Assignment/Prompt Roadmap endpoint for backward compatibility
app.post("/api/assignment/roadmap", async (req, res) => {
  try {
    const { problemText } = req.body;
    if (!problemText) {
      return res.status(400).json({ error: "Problem text is required" });
    }

    const ai = getGeminiClient();

    const prompt = `Analyze this problem or task:
"${problemText}"

Create an easy-to-follow, Socratic 3-step learning breakdown for a beginner.
Provide structured JSON with:
1. problemSubject: Subject/Category in English
2. keyPrinciples: Array of 2-3 core principles involved
3. steps: Array of 3 steps (stepNumber, title, guidingQuestion)
4. starterMessage: Warm, encouraging message to begin
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
    console.error("Roadmap error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze roadmap" });
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
    console.log(`guruAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

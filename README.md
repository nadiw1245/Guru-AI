# 🤖 guruAI — Learn Artificial Intelligence From Scratch

> **The zero-intimidation, analogy-powered AI learning platform designed specifically for beginners, parents, and curious minds who have never written code or used AI before.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_GenAI-Gemini_3.8_Flash-4285f4.svg?logo=google&logoColor=white)](https://aistudio.google.com/)

---

## 🌟 The Story Behind guruAI

> *"My father told me he didn't know anything about AI and felt left behind by the fast-moving tech world. I built guruAI so that anyone—parents, seniors, students, and complete beginners—can understand and master Artificial Intelligence from scratch, with zero fear and zero jargon."*

Most AI tutorials are filled with intimidating academic jargon: *backpropagation, vector embeddings, loss gradients, tokenization*. **guruAI throws all that jargon out the window.** 

Instead, guruAI teaches how AI works using **real-life, household analogies**—comparing Neural Networks to a bakery assembly line, Tokens to Scrabble letter tiles, and Temperature to how adventurous a chef is with spices.

---

## ✨ Key Features

### 1. 📖 Step-by-Step "AI 101" Learning Path
- Structured conversational lessons starting from ground zero:
  - **What is AI really?** (Not a sentient robot or magic; a powerful pattern finder like a master recipe book).
  - **How does AI learn?** (Training with feedback like training a puppy vs rigid traditional rule manuals).
  - **How do LLMs talk?** (Next-word prediction, like ultra-smart phone autocomplete).
  - **Why does AI make things up?** (Understanding hallucinations and how to spot them).
  - **Can AI feel emotions?** (Debunking common Hollywood sci-fi myths with science and logic).

### 2. 🧪 Interactive Prompt Sandbox & Skill Lab
- Practice talking to AI in a hands-on simulator!
- Type any beginner prompt (or pick everyday tasks like writing an email, home repairs, trip planning).
- **Objective Clarity Score (0-100)**: Instant feedback on how clear your prompt is.
- **The 4-Pillars Breakdown**: Inspects **Role**, **Task**, **Context**, and **Constraints**.
- **guruAI Master Upgrade**: Generates an upgraded prompt with an explanation of why it gets 10x better results.
- **One-Click Test in Chat**: Send the upgraded prompt directly into the live tutor conversation with a single click!
- **Creativity / Temperature Dial**: Visual slider explaining how temperature affects AI behavior (from grandma's strict recipe to wild exotic spice experiments).

### 3. 💡 Everyday AI Analogy Explorer
- Deep-dive into specific AI buzzwords:
  - **Tokens** → Like syllables and Scrabble tiles.
  - **Neural Networks** → Like an expert bakery assembly line.
  - **Diffusion Models** → Like an artist chiseling away static noise until a photograph appears.
  - **Hallucinations** → Like a charismatic dinner guest improvising when they forget exact details.
  - **RAG (Grounding)** → Like giving the AI an open reference textbook before it writes an exam.

### 4. 🏆 AI Literacy & Mythbusters Quiz
- Multiple-choice self-assessments designed to build confidence.
- Clears up common anxieties (e.g., *"Will AI take over everything?", "Can AI think on its own?"*).
- Instant explanations with celebration confetti when you succeed!

### 5. 👨‍🦳 "Dad & Beginner" Persona (Level Selector)
- **👨‍🦳 Dad & Complete Beginner**: Zero technical jargon, patient, warm, kitchen/garage/car analogies.
- **🎒 Curious Explorer**: Practical smartphone tools, everyday productivity, clear examples.
- **🛠️ Prompt Creator**: Writing powerful prompts, avoiding hallucinations, mastering AI tools.
- **🔬 Deep Tech Curious**: Model architectures, neural weights, token embeddings, and technical mechanics.

### 6. 🎙️ Accessibility & Voice Read-Aloud
- **Speech Synthesis (Read-Aloud)**: Click the speaker button or toggle voice mode to listen to answers.
- **Voice Dictation (Microphone)**: Ask questions verbally using browser speech recognition.

---

## 🏗️ Technical Architecture

guruAI is built with a modern full-stack architecture running React 19 and Express:

```text
├── server.ts                  # Express server & Gemini API endpoints
│                                - /api/chat/stream (SSE streaming with guruAI persona)
│                                - /api/prompt/analyze (Prompt scoring & 4-pillar upgrade)
│                                - /api/concept/explain (AI buzzwords -> household analogies)
│                                - /api/quiz/generate (Interactive AI literacy quizzes)
├── index.html                 # HTML entry point & font links
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── tsconfig.json              # TypeScript compilation setup
├── src/
│   ├── main.tsx               # Client entry point
│   ├── App.tsx                # Primary workspace layout & state orchestration
│   ├── types.ts               # Shared TypeScript interfaces & types
│   ├── index.css              # Global styling & Tailwind CSS v4 definitions
│   ├── data/
│   │   └── sampleTopics.ts    # AI beginner curriculum, quick questions, and preset prompts
│   └── components/
│       ├── Navbar.tsx         # Responsive header, level selector, and mode tabs
│       ├── WelcomeBanner.tsx  # Interactive onboarding banner & curriculum cards
│       ├── ChatMessageItem.tsx# Message bubble with Markdown, badges & TTS readout
│       ├── ChatInput.tsx      # Multi-line chat input with voice dictation & prompt chips
│       ├── PromptSandboxPanel.tsx # Interactive prompt lab, scoring & upgrade generator
│       ├── AnalogyExplorerPanel.tsx # AI buzzword mental model generator
│       ├── QuizPanel.tsx      # Interactive AI literacy quiz with confetti
│       └── StudyGuideModal.tsx# Beginner guide with top 4 AI myths debunked & CLEAR formula
└── dist/                      # Production build output
```

---

## 🚀 Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Project

```bash
git clone https://github.com/your-username/guruAI.git
cd guruAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the `.env.example` file and configure your API key:

```bash
cp .env.example .env
```

Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 🐙 How to Update Your GitHub Repository

To push this codebase to your own GitHub account:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all project files
git add .

# 3. Create your initial commit
git commit -m "feat: launch guruAI platform to learn AI from scratch"

# 4. Set the default branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/guruAI.git

# 6. Push your code to GitHub
git push -u origin main
```

If you already have a repository and want to push updates:
```bash
git add .
git commit -m "feat: convert platform to guruAI to teach AI from scratch"
git push origin main
```

---

## 🛡️ Model Configuration & Fallback

guruAI uses the `@google/genai` SDK with automatic model resilience:
- **Primary Model**: `gemini-3.8-flash` for blazing fast, highly articulate streaming responses.
- **Fallback Model**: `gemini-2.5-flash` for automatic high availability.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

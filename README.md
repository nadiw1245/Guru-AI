# 🎓 AI Concept & Homework Tutor

> **An intelligent, Socratic AI learning companion powered by Google Gemini, designed to make complex concepts intuitive through vivid everyday analogies and guided problem-solving.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_GenAI-Gemini_3.7_Flash-4285f4.svg?logo=google&logoColor=white)](https://aistudio.google.com/)

---

## 📖 Overview

The **AI Concept & Homework Tutor** bridges the gap between rote memorization and deep conceptual mastery. Traditional AI assistants often provide immediate final answers to homework problems, robbing students of the learning journey. This tutor adheres strictly to the **Socratic Method**—asking targeted guiding questions while using relatable everyday analogies (e.g. cooking, plumbing, sports, city traffic) to transform abstract theories into tangible mental models.

---

## ✨ Core Highlights

- 💡 **Everyday Analogy Engine**: Translates complex STEM and humanities concepts (Quantum Superposition, Docker Containers, Recursion, Inflation) into vivid, relatable analogies with component mappings.
- 🎯 **Socratic Homework Guidance**: Strict zero-spoilers policy—never hands over direct solutions, final calculations, or complete code; guides the student step-by-step.
- 🗺️ **Assignment Roadmap Generator**: Scans assignment problem statements, extracts core subject principles, and generates structured milestone questions.
- 📝 **Interactive Concept Quizzes**: Generates conceptual self-assessment quizzes with analogy clues, detailed rationale, and score feedback.
- 🎙️ **Voice & Audio Accessibility**: Built-in speech recognition for voice input and native speech synthesis for audio readout.
- 🧭 **Study Tips & Active Recall**: Integrated study guide modal with the Feynman technique, prompt templates, and active learning strategies.

---

## 🏗️ Architecture & Project Structure

```text
├── server.ts                  # Express server & Gemini API endpoints (SSE Streaming, Analogy, Roadmap, Quiz)
├── index.html                 # Main HTML entry point
├── package.json               # Scripts & dependencies
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── tsconfig.json              # TypeScript compilation setup
├── src/
│   ├── main.tsx               # Client entry point
│   ├── App.tsx                # Primary workspace layout & state orchestration
│   ├── types.ts               # Shared TypeScript interfaces & types
│   ├── index.css              # Global styling & typography definitions
│   ├── data/
│   │   └── sampleTopics.ts    # Pre-configured topics, levels, and prompt starters
│   └── components/
│       ├── Navbar.tsx         # Responsive header, level selector, and mode tabs
│       ├── WelcomeBanner.tsx  # Interactive onboarding banner & featured starter cards
│       ├── ChatMessageItem.tsx# Message bubble with Markdown formatting & TTS controls
│       ├── ChatInput.tsx      # Multi-line chat input with voice dictation & prompt chips
│       ├── AnalogyExplorerPanel.tsx # Dedicated concept-to-analogy breakdown panel
│       ├── AssignmentRoadmapPanel.tsx # Step-by-step Socratic problem analyzer
│       ├── QuizPanel.tsx      # Conceptual assessment quiz generator with confetti
│       └── StudyGuideModal.tsx# Socratic learning guide & prompt template copier
└── dist/                      # Production build output
```

---

## 🚀 Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-concept-homework-tutor.git
cd ai-concept-homework-tutor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example `.env` file and add your Google Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 🛠️ Build & Deployment

### Production Build

Compile the React frontend with Vite and bundle the Node.js server using `esbuild`:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Linting & Type Checking

```bash
npm run lint
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check. |
| `POST` | `/api/chat/stream` | Server-Sent Events (SSE) streaming chat endpoint supporting `concept`, `assignment`, `analogy`, and `quiz` modes. |
| `POST` | `/api/concept/explain` | Generates a structured JSON breakdown containing title, summary, everyday analogy, key mechanics, and vocabulary. |
| `POST` | `/api/assignment/roadmap` | Generates a 3-4 milestone Socratic problem-solving roadmap without revealing final solutions. |
| `POST` | `/api/quiz/generate` | Generates a customized multiple-choice quiz with conceptual explanations and analogy hints. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

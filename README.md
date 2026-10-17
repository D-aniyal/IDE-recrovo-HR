# recrovo hr

Role & Objective You are an expert React and Tailwind CSS developer. Your task is to build a highly dense, professional-grade Live Proctoring IDE Dashboard, exactly matching the reference design. The layout is a complex, full-screen 3-column dashboard.

Tech Stack React, Tailwind CSS, Lucide React (for icons), and Shadcn UI (for base components like scroll areas, tabs, and progress bars).

Global Styling & Theme (Dark Mode Focus) Implement this primarily in a sleek Dark Mode.

Backgrounds: Use very dark blue/grays. Main background: bg-slate-950. Panels/Cards: bg-slate-900. Borders: border-slate-800.

Typography: Inter or system sans-serif for UI. JetBrains Mono or Fira Code for all code-related text. Use very tight, dense padding (e.g., p-2, p-3, text-xs, text-sm) to match a real IDE.

Layout Architecture Create a full-screen flex column container h-screen w-full flex flex-col.

Top Navbar: Height ~48px.

Main Workspace: Flex row flex-1 overflow-hidden, divided into three columns:

Left Column (Problem Brief): Width ~25% or 300px. Border right.

Center Column (Code Editor): Flex-1 (takes remaining space). Flex column for Editor and Terminal.

Right Column (Interviewer Deck): Width ~25% or 300px. Border left.

Component Breakdown Details:

1. Top Navbar

Left: Brand name "DevEval IDE" in a bold, teal color (text-teal-400).

Center: Status badge with a pulsating red dot "LIVE RECORDING" and a timer "45:59 REMAINING".

Right: Icon buttons (mic, camera, settings) and a prominent, rectangular red "End Session" button.

2. Left Column (Problem Brief)

Header: Tabs for "Problem Brief" and "Submissions".

Title: "Problem 03: Distributed Rate Limiter". Below it, teal badges for "Sliding Window" and "Distributed Systems".

Content: Small, readable text explaining the problem.

System SLAs Card: A subtle bordered box with a grid showing "P99 SLA Latency: < 2.0 ms" (green text), "Max Peak Burst", etc.

Examples: Code snippet blocks showing Example 1 and Example 2 with a tiny "Copy" icon in the top right of each block.

3. Center Column (Code Editor)

Top Bar: Candidate name "Senior Distributed Systems", Language dropdown "Python 3.12 (CPython)", and a primary green button "Run & Submit".

File Tabs: Tabs looking like VS Code for rate_limiter.py (active) and test_rate_limiter.py.

Editor Area: A large block with a monospace font. Include line numbers (1-18) on the left edge. Add a realistic Python code snippet for a rate limiter with syntax highlighting colors (blue for keywords, green for strings, white for variables, gray for comments).

Bottom Panel (Test Runner): Fixed height (~200px) at the bottom.

Tabs: "Test Results" (active, green), "Console".

Metrics: Tiny stats for Runtime (1.42ms) and Memory (16.8MB).

List: A scrollable list of test cases (e.g., "Test Case 1: Basic Window Allowance"). Use green checkmark icons for passed tests.

4. Right Column (Interviewer Deck)

Video Feeds: Two small rectangular blocks side-by-side representing webcams (Candidate Feed, Interviewer Feed) with a subtle grey background and a user icon.

Live Behavioral Telemetry: A card containing 3 progress bars.

"Candidate Confidence" (88% - blue bar)

"Technical Fluency" (92% - blue bar)

"Stress Level" (Low (18%) - green bar).

Speech-to-Text Stream: A chat-like feed. Show timestamps and names (e.g., " Interviewer:", " Candidate:") with dummy transcript text.

Interviewer Rubric: A section with criteria (e.g., "Code Quality") and interactive scoring buttons (1 to 5).

Crucial Implementation Rules:

Ensure zero white space gaps between panels; everything should be separated by 1px slate-800 borders.

Use a custom scrollbar styling to make it look like a sleek desktop app, not a webpage.

Use Lucide icons extensively for UI elements (Terminal, Play, CheckCircle, Copy, Mic, Video).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e6f1c1f1-207c-4bda-83fa-baf434365924).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

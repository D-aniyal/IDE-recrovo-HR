# Live Proctoring IDE Dashboard

## Goal
Replace the current blank home screen with a dense, full-screen dark-mode proctoring cockpit closely matching the supplied reference.

## Build
- Create a fixed-height application shell with a compact top status bar and three edge-to-edge workspace columns.
- Build the left problem brief with tabs, challenge metadata, requirements, SLA metrics, examples, and copy controls.
- Build the center workspace with candidate/language controls, file tabs, a syntax-colored Python editor with line numbers, and a fixed test-results panel.
- Build the interviewer deck with two simulated video feeds, behavioral telemetry, a transcript stream, and interactive 1–5 rubric scoring.
- Use the existing shared Button, Tabs, ScrollArea, Progress, Badge, Select, and Tooltip components where appropriate, with Lucide icons throughout.
- Add compact desktop-app scrollbars, restrained status animation, dense spacing, and semantic dark theme tokens in the global stylesheet.
- Keep the reference image as visual guidance only; recreate the interface rather than embedding the screenshot.

## Responsive behavior
- Preserve the three-column cockpit at desktop widths.
- At narrower widths, keep the editor usable while allowing side panels to collapse or stack without overlapping content.

## Interaction
- Make problem/file/result tabs switch content.
- Wire copy buttons, language selection, run controls, rubric scores, and session controls to clear local UI feedback.
- Keep the dashboard as a realistic front-end simulation; no camera, recording, or remote persistence is included.

## Metadata and verification
- Add page-specific title, description, Open Graph, and Twitter metadata for the home route.
- Verify the finished screen in the live preview at desktop and narrow viewport sizes, including tab switching and rubric scoring.
- Immediately confirm the center code editor and bottom test runner scroll independently inside a strict 100vh shell; if either stretches the page, adjust only the center column's flex sizing and vertical overflow rules.

## Technical details
- Implement the experience on the existing `/` route using React, Tailwind CSS v4, Lucide React, and the installed UI primitives.
- Split the dense workspace into focused presentation components and data-driven repeated rows.
- Use semantic OKLCH design tokens for all surfaces, borders, text, status colors, editor syntax colors, and shadows.

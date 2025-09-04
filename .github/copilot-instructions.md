# AGENTS.md — Copilot Coding Agent Instructions

## Project intent
Client-only React app to view an MTG CSV collection. No backend. Deploy to GitHub Pages with pnpm.

## Tech decisions
- Vite (React + TypeScript), Tailwind CSS.
- Table: @tanstack/react-table v8
- CSV: papaparse
- UI polish: framer-motion (simple fades), lucide-react icons, use-debounce
- Images: Scryfall API via `https://api.scryfall.com/cards/{id}`
- Persist CSV + Scryfall image URLs in `localStorage`.

## Conventions
- TS strict; alias `@/* -> src/*`.
- Keep components small and readable.
- Accessibility: alt text, focusable controls, ESC closes modals.

## Local dev
- Use pnpm: `pnpm install`, `pnpm dev`.

## Build & deploy
- GitHub Pages via GitHub Actions.
- Ensure `vite.config.ts` has `base: '/<REPO_NAME>/'` (replace with this repo).
- Provide scripts: `dev`, `build`, `preview`.

## Checklist before opening PR
- [ ] Sample CSV and “Load sample” button work.
- [ ] Drag-and-drop CSV works; table shows rows with sorting/filtering/pagination.
- [ ] `ScryfallId` column triggers image thumbs and lightbox; cached URLs in localStorage.
- [ ] “Estimated value” calculation appears when applicable.
- [ ] Export CSV works.
- [ ] No console errors; TypeScript checks pass.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Tool users:** people who write for social networks and the web (bios, posts, messages, short copy). They arrive with a piece of text and want to style it, measure it or change its case, then copy the result and leave. Typical destinations are Instagram, X and WhatsApp, which do not let users change typefaces.
- **Portfolio reviewers:** recruiters and developers judging the author's work as a junior web developer. They judge the craft by how well the site serves the first audience, and by the quality of the code behind it.

## Product Purpose

WeLoveFonts brings together three browser-based text tools:

- **Generador de fuentes (`/fonts`):** converts plain text into Unicode mathematical and decorative alphabets that can be pasted where typefaces cannot be changed.
- **Contador de palabras (`/word-counter`):** measures a text and shows its platform limits.
- **Conversor de texto (`/converter`):** changes the case and order of a text.

Success means a user gets usable output in seconds with no friction. For reviewers, success means the site reads as deliberate, professional work with its own personality, not a template.

## Positioning

The tools treat text with typographic care. Accents, ñ and ç survive styling as combining marks (`á` → `𝐚́`). Characters are counted as graphemes, so `👍🏽` or `🇪🇸` count as one. Reversed text does not break compound emoji or flags. All processing happens in the browser.

## Operating Context

- Usually a short, single-task visit: paste or type, pick a result, copy to clipboard, paste into another app.
- Used on both desktop and mobile. Mobile matters because the target apps are mobile-first.
- Reviewers arrive from a portfolio or CV link, often on desktop, and may open the repository.

## Capabilities and Constraints

- Existing stack: Vue 3 (Composition API, `<script setup>`), TypeScript, Vite 7, Vue Router 4 with lazy-loaded views, Tailwind CSS 4 (base reset) plus custom CSS variables in `src/assets/main.css`. Deployed at `https://we-love-fonts.vercel.app/`.
- No backend, no accounts, no text sent to any server. `localStorage` holds only `wlf-theme` and `wlf-favorites`.
- Font generator: 9 Unicode styles from `src/assets/data/dataFonts.json`, live preview, category filters (bold, cursiva, decorativos, utilidad), favorites that sort first, one-click copy.
- Word counter: words, characters with and without spaces, sentences, paragraphs, reading time; limit indicators for X, SMS and meta description.
- Converter: MAYÚSCULAS, minúsculas, Capitalizar Cada Palabra, Sentence case, aLtErNaDo, iNVERTIDO, texto al revés.
- Text logic lives in pure functions in `src/utils/`, covered by Vitest. The redesign must not change their behavior.
- Includes a 404 page, a responsive mobile menu and `prefers-reduced-motion` support.
- **Scope:** exactly three tools. The planned "IA" tool is dropped. Do not show it, tease it or promise new tools.
- Code conventions: comments in Spanish, identifiers in English. Avoid new dependencies without a clear reason.

## Brand Commitments

- Name: WeLoveFonts. Author credit: DEiVid (`https://github.com/code-deivid`).
- The interface stays in Spanish only (`lang="es"`).
- Light and dark themes both stay. The default follows the system preference until the user picks one, applied before first paint.
- **The current visual identity is binding and evolves, not replaced** (confirmed 2026-11-08): minimalist, predominantly monochrome (black and white), contrast between typefaces, generous spacing, modern and refined, borders and radii where they make sense. Changes to color, proportion, size, type or components need a clear design reason.
- Only the Home may be restructured from scratch, and it must stay inside this identity. The tool pages (`/fonts`, `/word-counter`, `/converter`) are refined, not rebuilt.
- Not binding: fictional editorial copy ("Vol. 02 / № 24", "Edición primavera", "Pp. 01 – 04") and decorative numbering or eyebrow labels (e.g. "● 01 · Fuentes Unicode"), which the user explicitly wants removed.

## Evidence on Hand

- Real, working tools and their behavior, described in `README.md`.
- Unicode alphabet data: `src/assets/data/dataFonts.json`.
- Tests: 37 Vitest unit tests and a Playwright check suite (see the 2026-11-07 audit).
- None of the following exist, so do not invent them: testimonials, user counts, usage statistics, press, ratings, or customer logos.

## Product Principles

1. **Output first.** The user's text and its transformed result are the main content. Everything else supports getting to copy faster.
2. **Honest scope.** Show only what exists: three tools, no features promised for later, no invented social proof.
3. **Text correctness is the craft.** Accents, graphemes and emoji are handled correctly, and the interface makes that precision visible.
4. **Show the work.** The site doubles as a portfolio piece, so the quality of details and code is part of the product. Avoid over-engineering.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion` (already supported) and keep both themes legible.
- Styled Unicode output can be hard for screen readers to announce. The interface around it must stay plainly labeled.

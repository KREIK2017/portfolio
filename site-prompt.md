# kreik.pp.ua — site brief / prompt

A bilingual (UK/EN) developer portfolio with **two parallel modes** showing the
same content. Visual language borrowed from the video game *Disco Elysium*:
oil-paint texture, muted earth pigments, art-nouveau and condensed typography.

## Mode 1 — Résumé (default, at `/`)

Calm, scannable, for recruiters who do not want to play anything.

**Layout:** narrow dark icon rail pinned left (Home · About · Work · Stack ·
Contact) with a small painted portrait at the top. Content column to the right
on warm off-white paper.

**Sections, top to bottom:**
1. **Hero** — condensed all-caps name at ~72px, role line, a one-sentence
   tagline, a text CTA, and a small pull-quote with attribution. Wide photo
   fills the right half of the hero.
2. **Stats row** — four bordered cells: experience, projects, education, status.
3. **About** — 4–5 short first-person paragraphs, then three columns of skill
   groups (Intellect · Psyche · Motorics), each with two skills rated in
   diamond pips out of six.
4. **Work** — three project cards: cover image, title, year, summary, role,
   tech chips, outcome, links.
5. **Stack** — 12 painted technology cards in a 6-column grid, plus a wider
   light "AI Tools" card, a pull-quote, the stats row again, and a dark CTA.
6. **Contact** — email, GitHub, LinkedIn, Telegram; CV download button.

## Mode 2 — The Room (at `/room/`)

Immersive. Opens on black: fragments of inner monologue type themselves out,
then an isometric hotel room fades in. The room *is* the navigation.

Five clickable objects, each opening a paper overlay panel: pinboard →
projects, mirror → character sheet, radio → contacts, suitcase → CV, bottle and
ashtray → trivia. The window toggles day/night. Pale pulsing rings mark what is
interactive; hovering shows the section name.

Six "skill voices" (Logic, Visual Taste, Empathy, Drama, Encyclopedia,
Kinesthetics) surface short ironic one-liners in their own colour as the visitor
moves around. Opening the strongest case file rolls a 2d6 skill check first.

## Visual system

**Résumé palette:** paper `#f2ece0`, secondary paper `#e5dbc8`, ink `#1a1815`,
muted text `#6b6152`, accent terracotta `#c2502a`, rail `#17140f`.

**Room palette:** dark oil `#1c1a17`, warm shadow `#2b2620`, aged paper
`#d9c9a3`, terracotta `#b5654a`, teal `#3e6157`, amber `#c9973f`, wine
`#7a2e2e`, light text `#e8ddc4`.

**Type:** Oswald — heavy condensed uppercase headings and small letter-spaced
labels. Lora — body serif. Cormorant — display serif inside the room.
(Anton and Marcellus were rejected: no Cyrillic.)

**Texture, and this is the point of the whole design:**
- Film grain and a soft vignette over the entire page.
- The 12 stack cards are not flat colour. Each is a `<canvas>` painted
  procedurally at load: a dark underpainting, ~90 blurred elongated brush
  dabs in that technology's palette, ten drips running downward, a vignette,
  grain, and a torn-paper corner cut out to transparency so the page shows
  through. Deterministic per card.
- Every card canvas runs through an SVG filter — animated `feTurbulence`
  feeding `feDisplacementMap` — so the paint shifts very slowly, as if not
  yet dry. Hovering brightens the card; the wobble stays constant.
- Card text sits in a separate layer above the canvas, never filtered, over a
  gradient scrim so contrast is guaranteed whatever the random paint does.

**Motion:** slow and heavy. Nothing snaps. Everything respects
`prefers-reduced-motion` in logic, not only in CSS.

## Content

WordPress developer, 1+ year commercial, bachelor's in software engineering and
a master's in progress. Stack: WordPress/PHP, frontend core, React and Next.js,
Node and TypeScript, databases, Shopify, Upgates, Git, Docker, Gulp and Vite,
daily AI tooling. Three projects: a commercial 3D agency site, a WordPress plus
Shopify merch store, and a fullstack internal dashboard.

## Tech

Next.js 16 App Router, TypeScript, Tailwind CSS 4, fully static export
(`output: "export"`), deployed as a Cloudflare Worker serving static assets.
Two root layouts via route groups give each language a correct `lang` attribute
without middleware. No backend, no database — all content lives in typed
TypeScript files.

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  preview: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'welcome',
    title: 'Welcome to ThanasOS',
    date: '2026-05-09',
    preview: 'A macOS-inspired portfolio built with React, Vite and Tailwind.',
    content: `# Welcome to **ThanasOS**

> *"A portfolio that boots like a desktop."*

Hey, I'm **Thanas**. This isn't just a website — it's a **fully working macOS desktop** rebuilt in your browser.

---

## What's inside

- A real **dock** with cosine-curve magnification
- **Spotlight** search (try \`⌘K\`) with goo-filter chips
- **Launchpad** with all installed apps
- A simulated **Terminal** with a virtual filesystem
- **Safari** + **Chrome** that race three CORS proxies
- **App Store** to install and uninstall projects

---

## Quick tour

1. Hit \`⌘K\` to open **Spotlight**
2. Open **Launchpad** from the dock
3. Launch **Terminal** and type \`status\`
4. Open **Safari** and click any of the **Favorites** tiles

---

## The stack

\`\`\`ts
React 18 · TypeScript · Vite
TailwindCSS · framer-motion · lucide-react
liquid-glass tokens via oklch
\`\`\`

> Designed around the new **liquid glass** aesthetic — every surface is a *lens*, not a wall.
`,
  },
  {
    id: 'liquid-glass',
    title: 'On Liquid Glass',
    date: '2026-05-08',
    preview: 'Notes on translucency, blur and the new macOS aesthetic.',
    content: `# On **Liquid Glass**

The whole design system rests on a single idea:

> Every surface is a **lens**, not a wall.

---

## The recipe

\`\`\`css
backdrop-filter: blur(80px) saturate(180%);
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow:
  0 25px 50px -12px rgba(0, 0, 0, 0.35),
  0 0 1px rgba(255, 255, 255, 0.15) inset;
\`\`\`

Layered transparencies + saturation = depth without weight.

---

## Where it lives

| Surface       | Blur  | Saturation | Bg α |
|---------------|-------|------------|------|
| Menu bar      | 40px  | 200%       | 0.55 |
| Dock          | 80px  | 180%       | 0.65 |
| Control Center| 40px  | 180%       | 0.55 |
| Window chrome | 80px  | 180%       | 0.45 |
| Spotlight     | 40px  | 200%       | 0.50 |

---

## Visual weight (relative)

\`\`\`
Dock           ████████████████████  100%
Window         █████████████         65%
Control Center ████████████          60%
Menu bar       ████████              40%
Spotlight      █████████             45%
\`\`\`

The trick: keep \`saturation\` high so the wallpaper colors *bleed through* — that's what sells the "glass" feeling.
`,
  },
  {
    id: 'building-terminal',
    title: 'Building a Browser Terminal',
    date: '2026-05-07',
    preview: 'How the simulated shell in ThanasOS works.',
    content: `# Building a **Browser Terminal**

There's no real shell in the browser, so the Terminal is a tiny **command interpreter** with a virtual filesystem.

---

## Architecture

\`\`\`
┌─────────────┐    parse     ┌──────────────┐    mutate
│ <input>     │ ───────────▶ │ command bus  │ ───────────▶  virtual FS
└─────────────┘              └──────────────┘
       ▲                            │
       │ history                    │ stdout
       └────────── <pre> lines ◀────┘
\`\`\`

---

## Supported commands

- \`ls\`, \`cd\`, \`pwd\`, \`cat\`, \`tree\`
- \`echo\`, \`clear\`, \`history\`, \`grep\`, \`head\`, \`tail\`, \`wc\`, \`find\`
- \`whoami\`, \`date\`, \`uname\`, \`env\`, \`which\`
- \`open <app>\` to launch any app
- \`status\` — full system summary
- \`neofetch\` — the obligatory ASCII brag

Type \`help\` to see them all.

---

## Why bother?

Because a portfolio that says *"check out my CLI work"* but ships a static page is just talk.
This one **boots, runs, and responds**.
`,
  },
  {
    id: 'arch-tour',
    title: 'A Tour of the Architecture',
    date: '2026-05-06',
    preview: 'The pieces under the hood — windows, dock, contexts.',
    content: `# A Tour of the **Architecture**

ThanasOS is roughly **three layers**:

\`\`\`
  ┌──────────────────────────────────────┐
  │  Apps  (Safari, Notes, Terminal…)    │
  ├──────────────────────────────────────┤
  │  Shell (Dock, MenuBar, Spotlight,    │
  │         ControlCenter, Window)       │
  ├──────────────────────────────────────┤
  │  MacOSContext  (windows, settings,   │
  │                 dock, openApp)       │
  └──────────────────────────────────────┘
\`\`\`

---

## Lines of code, by layer

\`\`\`
Apps          ████████████████████████  ~3,800 LOC
Shell         ██████████                ~1,600 LOC
Context/Lib   ████                        ~700 LOC
Widgets       ███                         ~500 LOC
\`\`\`

---

## Where features live

| Feature              | File |
|----------------------|------|
| Window manager       | \`contexts/MacOSContext.tsx\` |
| Dock magnification   | \`components/macos/Dock.tsx\` |
| Spotlight (goo-morph)| \`components/macos/Spotlight.tsx\` |
| Control Center tiles | \`components/macos/ControlCenter.tsx\` |
| Browser proxies      | \`components/apps/SafariApp.tsx\` |

---

> The cleanest decision was making **every app a plain React component**.
> No iframes, no postMessage glue (except for Chrome's link interception). Just components.
`,
  },
  {
    id: 'design-decisions',
    title: 'Design Decisions That Survived',
    date: '2026-05-05',
    preview: 'What I kept, what I cut, and why.',
    content: `# Design Decisions That **Survived**

Every project has a graveyard. Here's what made it out alive.

---

## Kept

- **Cosine magnification** for the dock — the only curve that *feels right*
- **Goo-filter** Spotlight chips — they morph instead of pop
- **Three-proxy race** for the browsers — fastest one wins
- **Per-app menu registry** — every app publishes its own File/Edit/View menus

## Cut

- ~~A real desktop file system~~ — too much work for too little payoff
- ~~Drag-to-folder in Launchpad~~ — added complexity, no signal
- ~~A separate Control Panel app~~ — folded into Settings

---

## What changed my mind most

The biggest shift was **dropping iframes** for internal apps.
Iframes felt "real" but killed every nice interaction:
- no shared state
- no shared theme
- no real keyboard shortcuts

Plain React components won everywhere.

---

## Stack share (rough)

\`\`\`
TypeScript   ████████████████████████  90%
CSS/Tailwind ████                      15%
Markdown     █                          3%
SVG          █                          2%
\`\`\`

---

> The best feature is the one nobody notices because it just works.
`,
  },
];

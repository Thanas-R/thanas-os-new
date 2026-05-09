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
    content: `# Welcome to ThanasOS

Hey, I'm Thanas. This is my **portfolio rebuilt as a macOS desktop**.

## What's inside
- A real working dock with magnification
- A Spotlight search (try \`Cmd+K\`)
- A Launchpad with all installed apps
- A simulated Terminal
- A Safari that wraps my live projects
- An App Store to install more

## Try it
1. Hit \`Cmd+K\` to open Spotlight
2. Open Launchpad from the dock
3. Launch Terminal and type \`help\`

> Designed with the new liquid glass aesthetic.
`,
  },
  {
    id: 'liquid-glass',
    title: 'On Liquid Glass',
    date: '2026-05-08',
    preview: 'Notes on translucency, blur and the new macOS aesthetic.',
    content: `# On Liquid Glass

The idea: every surface is a **lens**, not a wall.

\`\`\`css
backdrop-filter: blur(80px) saturate(180%);
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.18);
\`\`\`

Layered transparencies + saturation = depth without weight.
`,
  },
  {
    id: 'building-terminal',
    title: 'Building a Browser Terminal',
    date: '2026-05-07',
    preview: 'How the simulated shell in ThanasOS works.',
    content: `# Building a Browser Terminal

There's no real shell in the browser, so the Terminal is a tiny **command interpreter** with a virtual filesystem.

Supported commands:
- \`ls\`, \`cd\`, \`pwd\`, \`cat\`
- \`echo\`, \`clear\`, \`history\`
- \`whoami\`, \`date\`, \`uname\`
- \`open <app>\` to launch any app
- \`neofetch\` for a system summary

Type \`help\` to see them all.
`,
  },
];

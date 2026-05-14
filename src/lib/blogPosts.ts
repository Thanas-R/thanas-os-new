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
    date: '2026-05-14',
    preview: 'The best web iteration of macOS online.',
    content: `# Welcome to **ThanasOS**

> *"The best web iteration of macOS online."*

ThanasOS is a faithful, fully interactive recreation of macOS, rebuilt from the ground up for the browser. No iframes. No screenshots. Real components, real windows, real animations.

---

## What this site is

This is not a portfolio with a macOS skin. It is a working desktop shell with:

- A real window manager (drag, resize from any edge, focus, maximize, minimize)
- A magnifying dock with live indicators
- Per-app menus that change as you focus different apps
- Spotlight search across every app, setting, note and project
- Launchpad, Control Center, Notification Center, Lock Screen, Sleep Screen
- Light and dark themes with brightness, reduced motion and 18 wallpapers

---

## Built from scratch

Every widget on the desktop was hand-built for this project:

| Widget | Built from |
|--------|------------|
| Analog Utility Clock | Custom CSS keyframes, no library |
| Bengaluru Weather | Live API, custom render |
| Calendar | Pure React grid |
| Stats | Battery API, navigator timing |
| Now Playing Pill | Custom menu-bar surface |

---

## What works right now

Everything you can click. Open Terminal and type \`status\`. Open Safari and load a real site through the proxy race. Drop a wallpaper into Settings. Lock the screen with Ctrl Cmd Q. Search anything with Cmd plus K.

---

## What is coming

- Reorderable dock with drag-and-drop
- A working Trash bin where closed windows can be restored
- Mission Control, Stage Manager and more apps

> ThanasOS will keep growing. Treat it as a long-running attempt to make the most complete macOS recreation that lives in a tab.`,
  },
  {
    id: 'features',
    title: 'Every Feature Worth Knowing',
    date: '2026-05-13',
    preview: 'A deep tour of what is on this desktop.',
    content: `# Every Feature **Worth Knowing**

A long, honest list of what ThanasOS does today.

---

## Window manager

- Drag from the title bar
- Drag from the empty top strip on integrated apps (Maps, Music, Settings)
- Resize from every edge and every corner
- Maximize fits exactly between the menu bar and the dock
- Z-order updates when you click a window
- Esc closes the focused window

## Dock

- Cosine-curve magnification (the only curve that feels right)
- Live indicators under open apps
- Click an open app to minimize it back to the dock
- Auto-hide can be turned on in Settings

## Menu bar

- Apple menu with About, Settings, App Store, Force Quit All, Sleep, Restart, Lock
- Each app publishes its own File, Edit, View, Window menus
- Live Wi-Fi, Bluetooth, Battery, Volume status with popovers
- Control Center and Notification Center on the right
- Auto-closes any open dropdown when your cursor leaves by 180px

## Spotlight

- Cmd plus K to open
- Fuzzy search apps, settings panes, notes and projects
- Goo-filter chip morph for category buttons

## Theming

- Light and dark with semantic tokens
- Brightness slider that filters the wallpaper
- Reduced motion toggle

## Cursors

ThanasOS uses the macOS glove cursor system based on the apple_cursor project (ful1e5). You get the right cursor for default, pointer, open hand, closed hand, text, help and not-allowed states.

---

> If something on this desktop feels missing, it is probably on the roadmap.`,
  },
  {
    id: 'how-built',
    title: 'How ThanasOS Was Built',
    date: '2026-05-12',
    preview: 'The architecture behind the shell.',
    content: `# How ThanasOS Was **Built**

ThanasOS is roughly three layers, all in one React app.

\`\`\`
  +--------------------------------------+
  |  Apps  (Safari, Notes, Terminal...)  |
  +--------------------------------------+
  |  Shell (Dock, MenuBar, Spotlight,    |
  |         ControlCenter, Window)       |
  +--------------------------------------+
  |  MacOSContext  (windows, settings,   |
  |                 dock, openApp)       |
  +--------------------------------------+
\`\`\`

---

## The window manager

\`MacOSContext\` owns the array of open windows. Each window is just an object with id, appId, position, size, zIndex, isMinimized, isMaximized. The \`Window\` component reads its own state from context and renders the chrome plus the app component inside.

## Per-app menus

Each app can call \`registerAppMenus(appId, menus)\` to publish its own File, Edit, View, Window menu. The menu bar reads the focused app's id and renders that app's menus dynamically.

## The default browser

You can install a second browser (Google Chrome) from the App Store. The system has an \`openUrl\` helper that routes through whichever browser you set as default in Settings. Every external link in the app is intercepted at the document level and forced to open in a new tab.

## Spotlight index

\`spotlightIndex.ts\` exports a flat list of searchable items. Apps register entries by id and category. The Spotlight component does fuzzy matching with simple ranking.

## Virtual filesystem

\`terminalFs.ts\` builds an in-memory tree of folders and files. The Terminal app interprets commands against it. \`ls\`, \`cd\`, \`tree\`, \`cat\`, \`find\`, \`grep\`, \`head\`, \`tail\`, \`wc\`, \`open\` and more all work.

---

## What I would do differently

If I started again I would lift the dock-magnification math into a hook, ship Mission Control as a first-class feature instead of an afterthought, and design the menu registry as a context provider from day one.

> The cleanest decision was making every app a plain React component. No iframes, no postMessage glue. Just components.`,
  },
  {
    id: 'roadmap',
    title: 'What is Coming Next',
    date: '2026-05-11',
    preview: 'Future improvements and unfinished ideas.',
    content: `# What is **Coming Next**

ThanasOS is a long-running project. Here is what is planned.

---

## Near term

| Feature | Status |
|---------|--------|
| Reorderable Dock with persisted order | Planned |
| Working Trash Bin (closed windows can be restored) | Planned |
| Mission Control with Cmd plus Up | Planned |
| Stage Manager side stack | Planned |
| More apps (Photos, Reminders, Stickies, Preview) | Planned |

## Medium term

- Real folder system inside Finder with drag-and-drop
- Live and animated wallpapers
- A theme builder for user-defined accent colors
- Multi-display simulation

## Long term

- Shareable session URLs (open the OS with apps already arranged)
- Plugin API so anyone can ship their own app for ThanasOS
- A real local-first store for notes, files and settings

---

> If you want to help build any of these, the repo is open.`,
  },
];

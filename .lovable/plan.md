## Phase 3: Liquid Glass macOS Tahoe Overhaul

This is a large, multi-part overhaul. Below is what I'll build, grouped by area, with clear scope boundaries so we don't blow past the budget.

### 1. Asset intake (icons you uploaded)
Copy uploads into `src/assets/` and wire them in:
- `vscode.png` → new VS Code app icon (Technologies app)
- `user-profile.png` → About Me app icon
- `cookie.png` → Nautilus icon (the cookie/shell-ish pixel art)
- `pokemon-yellow.png` → Virdis
- `pokemon-blue.png` → Spheal
- `pesu-mc-emblem.png` → PESU MC Season 2
- `circle-white.png` → AskBookie (placeholder dot)
- `chef-hat.png` → Smart Chef
- `topo.png` → Contour Flow
- Reuse turtle logo for ThanasOS + PESU Forge per your note
Update `src/lib/projects.ts` `favicon` fields and `APP_ICONS` map.

### 2. Liquid Glass design system
Add tokens to `src/index.css`:
- `--glass-bg`, `--glass-border`, `--glass-highlight`, `--glass-shadow`
- `.liquid-glass` utility class (backdrop-blur 40px, saturate 180%, inner highlight, soft outer shadow, 1px white-translucent border)
Apply across MenuBar, Dock, Window chrome, Widgets, Spotlight, Launchpad.

### 3. MenuBar rebuild (macOS-style)
- Turtle logo as Apple-menu trigger
- Real dropdowns: Apple menu (About, System Settings, Sleep, Restart, Shut Down, Lock, Log Out), File/Edit/View/Window/Help that change per focused app
- Right cluster: Battery / Wi-Fi / Volume / Spotlight / Control Center / Clock — all as proper popovers
- Restart/Shut Down/Sleep/Lock trigger a fullscreen turtle-loader overlay (your CSS spec, ported to Tailwind/keyframes) then reload/return

### 4. Dock fix
- Restore working magnification math (port your old logic; cap scale, fix overflow)
- Constrain to viewport with proper padding so icons can't escape
- Keep liquid-glass background

### 5. Spotlight rebuild
Port the AppleSpotlight component you provided (pill-shape, shortcut chips, blob SVG filter, search results list). Wire to apps + projects.

### 6. Launchpad rebuild (real macOS Launchpad)
- Single-click full-screen grid of all installed apps
- Blurred wallpaper background
- Search bar at top, page dots at bottom, drag-anywhere to dismiss

### 7. App rebuilds
- **Safari**: real macOS toolbar (traffic lights inline, sidebar toggle, back/fwd, address pill with lock + reload, share/tabs/+), tab strip with rounded chiclets, Favorites start page grid
- **Notes**: three-pane (Folders sidebar | Notes list | Editor) with collapsible sidebar using the Tabler-style sidebar animation, markdown rendering for blog posts
- **App Store**: macOS sidebar (Discover / Arcade / Create / Work / Play / Develop / Categories / Updates) collapsible, hero featured card, app rows
- **Finder**: real Finder layout — sidebar (Favorites/iCloud/Locations/Tags), toolbar (back/fwd, view switcher, group, share, tags, search), column/list/icon views, status bar
- **Terminal**: expand commands (`cat`, `echo`, `date`, `whoami`, `uname`, `history`, `clear`, `man`, `ssh`, `curl` stub, `node`, `python` stub, `open`), more directories (`~/Developer`, `~/Sites`, `/etc`, `/var/log`, `/usr/local/bin`)

### 8. Widgets (Liquid Glass)
- **Activity Rings**: rebuild with your kokonutui code — Move/Exercise/Stand → repurposed as **GitHub Stars** (live from `https://api.github.com/users/Thanas-R`), **Projects** (target 25), **LinkedIn followers** (100/250). Concentric rings, gradient strokes, detail rows below.
- **GlassCalendar**: month grid with today highlighted, liquid-glass card
- Restyle Weather/Time/Welcome to liquid glass

### 9. Boot prerender
Move app component imports + GitHub stars fetch + project favicon prefetch into the `AppleHelloEffect` window so they're warm by the time the desktop appears.

### 10. GitHub "+ menu" connect
Lovable's GitHub connection is a platform action, not something I can script from inside the project. I'll add a clear note + button in Settings → "Connect GitHub" that opens the docs/instructions, and I'll document the manual steps. (I can't programmatically clone your repo into this sandbox — that has to be done via the Lovable + menu → GitHub → Connect project flow.)

### Scope I'm explicitly deferring (to keep this shippable in one pass)
- Drag-to-reorder Dock (keeping existing order)
- Per-app dynamic File/Edit/View menus that mutate based on focused app (will ship one shared set; per-app deferred)
- Markdown blog rendering inside Notes (will scaffold the pane; full MD parser pass deferred unless quick)
- Real `ssh`/`curl` network in Terminal (simulated only)

### Final report
I'll end with: ✅ done, ⚠️ partial, ⛔ deferred + next-step suggestions.

---

Approve and I'll execute top-to-bottom. This will touch ~25–30 files.

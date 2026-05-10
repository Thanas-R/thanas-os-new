# Phase 4 Plan — Spotlight Pill, Menu Bar Fixes, Widgets Overhaul & Easter Eggs

This is a large multi-part request. I'll execute top-to-bottom, then deliver a status report. Below is the scope and approach.

## 1. Assets to import
Copy uploaded user images into `src/assets/`:
- `image-9.png` → `calendar-screenshot.png` (reference only — for calendar widget styling)
- `image-10.png` → `odintree-icon.png`
- `image-11.png` → `thanasos-turtle-icon.png` (replacement for ThanasOS project icon)
- `image-12.png` → `pesuforge-shield-icon.png`
- `image-13.png` → `portfolio-icon.png`
- `image-14.png` → `prank-pichu-icon.png` (domain-expansion easter egg avatar)
- `image-15.png` → `askpesu-rowlet-icon.png`

Update `src/lib/projects.ts` to:
- Replace ThanasOS + PESU Forge favicons
- Add `OdinTree` (after PESU Forge) — link `https://odintree.vercel.app/`
- Add `Portfolio` (after Virdis)
- Add `AskPESU` (after a few) using Rowlet icon

## 2. New Spotlight (pill style)
Rewrite `src/components/macos/Spotlight.tsx` as a top-floating pill:
- Single rounded-full pill input with shortcut chips on hover (Apps, Files, Actions, Clipboard)
- Uses framer-motion layout animations (existing `motion/react`)
- Search results dropdown below, frosted-glass
- Wires into menu bar Search button + ⌘K shortcut (existing)

## 3. Launchpad
Already a grid; tighten it to single-page macOS-style — show all installed apps in one fluid grid with search and blurred backdrop. Already mostly there; verify.

## 4. Finder rebuild
Rebuild `FinderApp.tsx` with:
- Left sidebar (Favorites: Recents, Applications, Desktop, Documents, Downloads; Locations: ThanasOS)
- Toolbar with view switchers (Icons / List / Columns)
- Column view as default — three-pane drill into the simulated filesystem from `terminalFs.ts`
- Use shadcn sidebar pattern with collapse toggle

## 5. MenuBar overhaul
Rewrite `src/components/macos/MenuBar.tsx`:
- Per-app menus via `AppConfig.menus` (extend `src/types/macos.ts` with `MenuConfig[]`)
- Each app registers its own File/Edit/View menu items with real callbacks; fall back to Finder default when no app focused
- Drop any item that doesn't have a real action (no dead links)
- Frosted-glass dropdowns matching activity card style (already `liquid-glass-dark`, intensify blur)
- Help menu → opens KeyboardShortcuts modal (new component) and ThanasOS Help modal with contact info + easter egg
- Apple menu → working Sleep/Restart/Shutdown/Lock with turtle loader

## 6. Keyboard Shortcuts modal
New `src/components/macos/ShortcutsModal.tsx`:
- Frosted card, closes on ✕ / Esc / outside click
- Lists ⌘K Spotlight, ⌘W Close, ⌘M Minimize, ⌘N New Window, ⌘Q Quit, etc., grouped with icons

## 7. ThanasOS Help / About
Modal with contact links (GitHub, LinkedIn, email) + small fun easter eggs (Konami hint, secret commands).

## 8. Widgets
- **Remove WeatherWidget** from Index
- **StatsWidget**: remove "Activity" and "live" text; shrink padding/fonts
- **CalendarWidget**: revert to flat dark `#1a1a1d` (no glass), styled like uploaded screenshot — month label red, today highlighted red dot
- **New Clock widget** (`UtilityClockWidget.tsx`): port the CodePen utility clock with classes `hour-style-text hour-text-style-small hour-display-style-all minute-style-line minute-display-style-coarse minute-text-style-none hand-style-normal`. Build dynamically with React refs + rAF instead of innerHTML.
- Replace `TimeWidget` usage with `UtilityClockWidget` in the desktop
- Increase overall widget sizes proportionally (Welcome, Clock, Calendar, Stats) so contents fit; remove Weather entirely from layout

## 9. Dock reorder
Update `Dock.tsx` `dockOrder` to: finder, launchpad, terminal, about, journey, notes, projects, technologies, safari, github, linkedin, contact, appstore, settings.

## 10. Safari rebuild
Rewrite `SafariApp.tsx`:
- Real tab bar (multiple tabs, +, close per tab)
- Toolbar: back/fwd/reload, address pill with lock icon and Google as default search
- Typing a non-URL → Google search; typing a URL → load
- iframe per tab; if URL not in known projects list **AND** matches the prank trigger → render the prank HTML page (DarkSpacePirate "domain expansion") inline using `srcDoc`
- All project URLs must remain viewable (don't block any) — only show prank for explicit non-project external domains the user lists; safest default: show prank only when user navigates to certain reserved domains (e.g. when URL doesn't match any installed project AND user toggles easter egg). I'll trigger prank for any external domain not in known list — but per request "any non-project link". Will use `srcDoc` with the supplied HTML.

## 11. Boot preloading
Update `AppleHelloEffect.tsx` / `useImagePreloader`:
- During Hello animation, preload ALL `src/assets/*.png` icons via dynamic glob import
- Prefetch all project favicons + project URLs (link rel=prefetch)
- Eagerly import all app components so they're in cache when opened
- Block dismiss of hello until preload promise resolves (with min 2s, max 6s)

## 12. Control Panel app
New `ControlPanelApp.tsx` registered as a system app accessible from MenuBar (Apple menu → Control Center) and dock-less:
- Toggles: Animations, Reduced Motion, Dock Magnification, Auto-hide Dock, Wallpaper, Theme, Sound, Easter Eggs enabled
- Persist to `MacOSContext` settings
- Style like uploaded macOS Control Center mockup: rounded translucent tiles in a grid

## 13. Memory
Save core design rules to `mem://index.md`: liquid glass system, calendar widget flat dark, dock order, prank trigger.

## Technical notes
- All new components use existing `liquid-glass-dark` / `liquid-glass-card` utilities
- Frosted dropdowns: `backdrop-filter: blur(40px) saturate(180%)`, `bg: rgba(28,28,32,0.6)`, `border: 1px solid rgba(255,255,255,0.12)`
- New types: extend `AppConfig` with optional `menus?: MenuConfig[]` and `getMenuActions?: () => Record<string, () => void>`
- Clock widget: avoid innerHTML; build SVG-free DOM via React with `transform: rotate(...)` updated each frame in a `useEffect` rAF loop

## Out of scope / deferred
- GitHub OAuth clone from inside the app (platform-level only — must use Lovable's + → GitHub)
- Drag-to-reorder Dock (still pending from earlier phase)

## Final report
After implementation I'll list:
- ✅ Done items
- ⚠️ Half-done items needing iteration
- ⏭️ Deferred (with reason)

Approve and I'll execute the whole phase in one pass.

# Phase 5 — macOS Polish & Functional Pass

A focused rebuild touching ~15 files. Grouped so each block can be verified independently.

## 1. Launchpad (macOS-accurate)
- `LaunchpadApp.tsx`: paginate apps into 7×5 grid pages with dot indicator + horizontal swipe/drag.
- Click-to-launch wired through `useMacOS().openWindow` (fix current ghost clicks).
- Drag-to-group: drop one icon onto another to create a folder (in-memory, session only).
- Search filter at top.

## 2. Per-app Menu Bar (File / Edit / View / Window)
- Extend `AppConfig` (`src/types/macos.ts`) with `menus?: { File?: Item[]; Edit?: Item[]; View?: Item[]; Window?: Item[] }`.
- `MenuBar.tsx`: when an app is focused, render its menus instead of generic placeholders. Falls back to defaults for apps without menus.
- Wire concrete actions for **Safari** (New Tab, Reload, Back/Forward, Show Bookmarks), **Notes** (New Note, Pin), **Finder** (New Folder, Toggle Sidebar, View → Icons/List/Columns), **Terminal** (Clear, Close), **Control Panel** (Reset Settings).
- **Apple/turtle menu fix**: it currently shares state with the active-app menu — give it its own `openMenu === 'apple'` slot and stopPropagation so it never collides.

## 3. Control Center sliding panel (NEW)
- New `ControlCenter.tsx` triggered from a menu-bar pill icon (top-right, between Spotlight and clock — see uploaded reference).
- Frosted floating panel (rounded 24px, glass blur), anchored top-right, slides+fades in.
- Tiles: Wi-Fi/Bluetooth/AirDrop, Focus, Stage Manager toggle (visual only), Display brightness slider, Sound slider, Now Playing stub, quick action row (Dark Mode, Calculator, Timer, Screenshot).
- All sliders/toggles read+write `useMacOS().settings` (brightness, volume, theme, focus, dockAutoHide). This makes it the front-end for the existing Control Panel.

## 4. Wallpaper upload persistence
- `ControlPanelApp.tsx`: add file input → reads as data URL → `updateSettings({ wallpaper: 'custom', customWallpaper: dataUrl })`.
- `MacOSContext`: extend settings type, persist to `localStorage` (already done for other settings — just extend the schema).
- `Desktop.tsx`: when `settings.wallpaper === 'custom'`, render `customWallpaper` as background.

## 5. Safari rebuild (CodePen port)
Full rewrite of `SafariApp.tsx` using the supplied HTML/CSS/JS as the spec:
- Toolbar: sidebar toggle, back, forward, home, URL pill (centered, focus-expands), reload, +tab, share, bookmarks, menu.
- Tab strip auto-hides when only 1 tab.
- Bookmarks popup + main menu popup (New Tab / Theme toggle / History).
- Start page (`about:home`) with Favorites grid + Privacy card on a plain dark background (no external wallpaper URL — use `--background`).
- Page loading via the 3 CORS proxies (`allorigins`, `corsproxy.io`, `codetabs`) raced with `Promise.any`.
- Per-tab history stack with back/forward enable state.
- Easter-egg "domain expansion" preserved for non-allow-listed external links.
- Plain background instead of unsplash wallpaper (per user instruction).

## 6. Notes — 3-pane macOS layout
Polish current `NotesApp.tsx`: keep folder sidebar + notes list, **add a third pane** for live Markdown preview when a note is being edited. Layout: `Sidebar (192) | List (288) | Editor (flex, split: textarea top / rendered preview bottom toggleable)`. Add an "Edit/Preview" segmented toggle in the editor toolbar.

## 7. Clock widget — rework to user-supplied spec
Rewrite `UtilityClockWidget.tsx` + `utility-clock.css` per the new CodePen:
- Outer chassis `#000000`, **inner dial white** with **black numbers / lines / hands**, orange (`#FA9F22`) second hand only.
- Apply exact classes: `hour-style-text hour-text-style-small hour-display-style-all minute-style-line minute-display-style-coarse minute-text-style-none hand-style-normal`.
- Fix hand bug — current rotation ignores 180°/54°/304.5° base offsets; port the JS exactly (`rotate(el, second*6)` with the base CSS rotations preserved on `.hour/.minute/.second`).
- Add `autoResize` so the dial fills its container at any size.

## 8. Widget sizing pass (`Desktop.tsx`)
- Shrink **WelcomeWidget**, **TimeWidget/ClockWidget**, **CalendarWidget** to roughly the size of `TimeWidget` (compact tile).
- **StatsWidget (Activity)** → match WelcomeWidget width.

## 9. Spotlight fixes (`Spotlight.tsx`)
- Fix entrance animation: spring scale-from-center + fade, no jump. Use `framer-motion` `AnimatePresence` with `initial={{ opacity:0, y:-8, scale:0.96 }}`.
- Make shortcut chips functional: **Files** → openWindow('finder'), **Apps** → openWindow('launchpad'), **Web** → opens Safari to query, **Calc** → opens Calculator, **Settings** → openWindow('settings').
- Result rows: Enter launches, ↑/↓ navigates, ⌘K toggles.

## 10. Finder
Already mostly done. Confirm sidebar collapse + Icons/List/Columns view switching works against `terminalFs`. Add "New Folder" via menu (in-memory).

## 11. Icon swaps + preload
- Swap **OdinTree** ↔ **PesuForge** icons in `src/lib/projects.ts`.
- `useImagePreloader` already globs `src/assets/*` — verify both icons are imported there. Add explicit `<link rel="preload" as="image">` injection during the Hello animation for top-15 dock/launchpad icons (faster first-paint).

## 12. Lazy app warm-up during Hello
- `AppleHelloEffect.tsx`: while animation plays (~2s), call `import()` on every app component lazily so React has them cached before the user clicks the dock. Use `Promise.all` of dynamic imports keyed off `installedApps`.

## 13. Modal scrollbar fix
- `FrostedModal.tsx` + Help/Shortcuts: add `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` on the scrolling container.

## 14. App Store: add Chrome
- Add Chrome listing in `AppStoreApp.tsx` using uploaded `image-3.png` (copy to `src/assets/chrome-icon.png`). User will wire the app code later.

## Out of scope this pass
- GitHub OAuth/clone (requires Lovable Cloud — currently disabled).
- Real Wi-Fi/Bluetooth — Control Center toggles are visual.

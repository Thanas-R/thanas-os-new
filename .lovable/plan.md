# Phase 6 — Big functional + visual pass

A focused sweep across ~20 files. Grouped so each block can be verified independently. No emojis, no em dashes, no sparkles/rockets in any user-facing copy.

## 1. Safari rebuild (CodePen port)
Full rewrite of `SafariApp.tsx` to match the supplied spec:
- Toolbar: sidebar toggle, back, forward, reload, home, URL pill (lock icon, spinner, star), bookmarks toggle, menu.
- Tab strip with favicons, spinner-on-load, close button, and `+` new tab.
- Bookmarks bar (toggleable), menu popup (New Tab, Bookmarks, History, Theme toggle).
- Start page (`about:home`) with Favorites grid, Apple-styled (no Google logo) using semantic tokens.
- Page loading via `Promise.any` race over `allorigins`, `corsproxy.io`, `codetabs`.
- Per-tab history stack with back/forward enable state.
- Plain `--background` instead of unsplash image.

## 2. Google (was Chrome) app — new app on App Store
- Rename existing "Chrome" listing in `AppStoreApp.tsx` to "Google", swap to uploaded Google `G` icon (`src/assets/google-icon.png`).
- Create `src/components/apps/GoogleApp.tsx` — a faithful port of the supplied Chrome HTML/CSS/JS (Chrome dark/light theme, tab strip, omnibox, NTP with real Google logo, shortcuts grid, bookmarks bar, menu popup).
- App not installed by default; clicking "Get" in App Store installs it: persists in `localStorage`, registers app, and adds it to the dock next to Safari.
- Settings app gains a "Default browser" toggle (Safari / Google) when Google is installed; persists in `MacOSContext`.
- Any link that currently opens Safari (project links, Spotlight web action) routes through `useMacOS().openUrl(url)` which checks default browser.

## 3. Calculator app
- Create `src/components/apps/CalculatorApp.tsx` — port supplied calculator HTML/CSS/JS as React (state-based, AC/±/%/÷×−+, sign toggle, decimal, equals, keyboard input).
- Uploaded calculator icon → `src/assets/calculator-icon.png`.
- Register in `Index.tsx` so Spotlight chip works and it's launchable from Launchpad.

## 4. Notes — true 3-pane layout
Rewrite `NotesApp.tsx`:
- Sidebar (folders) | Notes list | Editor + live Markdown preview pane (split right column 50/50, vertical).
- Toolbar in editor: Edit-only / Preview-only / Split toggle.
- Use `marked` or a tiny inline markdown renderer (no new heavy dep) for live preview.

## 5. Control Center — redesign + remove app
- Delete `ControlPanelApp.tsx` from the registered apps in `Index.tsx`. Remove the dock/launchpad listing. Keep the file unused-but-present? No — delete the file.
- Rewrite `ControlCenter.tsx` per supplied SCSS+JSX spec:
  - 500-ish px frosted glass panel, anchored top-right, opens on menu-bar Control Center icon click.
  - Grid: top half = Connections (Wi-Fi/Bluetooth/AirDrop) tile + Do Not Disturb tile + Keyboard Brightness/Airplay tiles.
  - Bottom half = Display slider, Sound slider, Now Playing tile.
  - Real frosted glass: `backdrop-blur-2xl bg-white/40 dark:bg-white/10`, rounded-2xl, sub-tiles `bg-white/40` with `module-bg` semantic.
  - All toggles/sliders write to `useMacOS().settings`. Wallpaper customization moves to Settings later.

## 6. Per-app menu wiring (`registerAppMenus`)
Add `useEffect(() => registerAppMenus(id, menus); return () => registerAppMenus(id, null))` to:
- **Safari**: File (New Tab ⌘T, New Window, Close Tab ⌘W), Edit (Cut/Copy/Paste), View (Reload ⌘R, Show Bookmarks), History (Back ⌘[, Forward ⌘]).
- **Notes**: File (New Note ⌘N, New Folder), Edit (Cut/Copy/Paste, Find ⌘F), View (Edit/Preview/Split).
- **Finder**: File (New Folder ⇧⌘N, New Window ⌘N), Edit, View (Icons/List/Columns), Go (Home, Documents).
- **Terminal**: Shell (New Window, Clear ⌘K), Edit, View.
- **Calculator**: Edit (Copy/Paste), View (Basic/Scientific stub).
- **Google** (when present): same skeleton as Safari but Google-flavored.

## 7. Widget sizing pass
- Stretch `WelcomeWidget` and `StatsWidget` to span the full row width up to the right edge of the `CalendarWidget` (i.e., col-span across both stat columns). Done in `Desktop.tsx` grid template.
- Compact vertically so layout stays balanced.

## 8. Clock widget — fix dial
Rewrite `UtilityClockWidget.tsx` + `utility-clock.css`:
- Outer chassis black `#000`, inner white dial enlarged (~92% of chassis), exact classes applied: `hour-style-text hour-text-style-small hour-display-style-all minute-style-line minute-display-style-coarse minute-text-style-none hand-style-normal`.
- Black hour/minute hands, orange (`#FA9F22`) second hand, black numerals 1-12, minute tick marks at coarse spacing.
- Fix rotation base offsets (180° hour, 54° minute? port the JS exactly: `rotate(el, second*6)` with the base CSS rotations preserved).
- ResizeObserver for autoResize.

## 9. Spotlight animation fix
Port the `AppleSpotlight` motion semantics into existing `Spotlight.tsx`:
- On open: `initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}` with spring.
- On focus/hover: shortcut chips animate from `x: -64*(i+1)` into place with spring bounce 0.2 stagger 0.05.
- On typing: chips exit with reverse `x` animation, results pane slides in below the pill.
- Use `framer-motion` `LayoutGroup` + the SVG `<filter id="blob">` goo filter for the morphing pill effect.
- Keep existing chip wiring (Files/Apps/Web/Calc/Settings).

## 10. Menu Bar dropdowns — frosted glass
Update `MenuBar.tsx` dropdown panels: `bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl` instead of current solid/transparent.

## 11. Domain-expansion easter-egg page (`public/prank-pichu.png` host page)
Currently uses an icon and "Made with coffee" footer. Update the prank HTML page (wherever it lives — likely `SafariApp` easter-egg renderer): remove the icon, remove the "made with coffee" footer, zoom out slightly (smaller font or scale 0.9), use proper dark background, no em dashes, no emojis.

## 12. Cleanup
- Delete `ControlPanelApp.tsx`.
- Remove `controlpanel` entry from `Index.tsx` apps array.
- Drop "Control Panel" from MenuBar Apple/turtle dropdown if present.
- Verify build is clean.

## Out of scope this pass
- Settings app rebuild (user says "we will remake the settings apps soon").
- Real AirPlay/Bluetooth/keyboard brightness functionality (visual only).
- GitHub OAuth and live StatsWidget data.

## Files touched (rough)
- `src/components/apps/SafariApp.tsx` (rewrite)
- `src/components/apps/GoogleApp.tsx` (new)
- `src/components/apps/CalculatorApp.tsx` (new)
- `src/components/apps/NotesApp.tsx` (rewrite)
- `src/components/apps/AppStoreApp.tsx` (rename Chrome→Google, install flow)
- `src/components/apps/FinderApp.tsx`, `TerminalApp.tsx` (menu registration)
- `src/components/macos/ControlCenter.tsx` (rewrite)
- `src/components/macos/MenuBar.tsx` (frosted dropdowns)
- `src/components/macos/Spotlight.tsx` (animation port)
- `src/components/macos/Desktop.tsx` (widget grid)
- `src/components/widgets/UtilityClockWidget.tsx` + `utility-clock.css` (rewrite)
- `src/components/widgets/WelcomeWidget.tsx`, `StatsWidget.tsx` (width)
- `src/contexts/MacOSContext.tsx` (defaultBrowser, openUrl, installedApps)
- `src/pages/Index.tsx` (register Calculator, drop ControlPanel, dynamic Google)
- `src/types/macos.ts` (extend settings)
- `src/assets/google-icon.png`, `src/assets/calculator-icon.png` (new)
- delete `src/components/apps/ControlPanelApp.tsx`

import { PROJECTS } from './projects';
import { BLOG_POSTS } from './blogPosts';

export type SpotlightKind = 'app' | 'project' | 'note' | 'bookmark' | 'appstore' | 'setting';

export interface SpotlightEntry {
  id: string;
  title: string;
  subtitle: string;
  kind: SpotlightKind;
  appId?: string;
  url?: string;
  payload?: { noteId?: string; section?: string; projectId?: string };
  icon?: string;
  keywords: string;
}

const SETTING_SECTIONS = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'sound', label: 'Sound' },
  { id: 'displays', label: 'Displays' },
  { id: 'wallpaper', label: 'Wallpaper' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'desktop', label: 'Desktop & Dock' },
  { id: 'general', label: 'General' },
  { id: 'accessibility', label: 'Accessibility' },
];

export const buildSpotlightIndex = (
  apps: { id: string; name: string }[],
  appIcons: Record<string, string>,
  installedProjectIds: string[],
): SpotlightEntry[] => {
  const out: SpotlightEntry[] = [];

  apps.forEach((a) => {
    if (a.id === 'launchpad') return;
    out.push({
      id: `app:${a.id}`,
      title: a.name,
      subtitle: 'Application',
      kind: 'app',
      appId: a.id,
      icon: appIcons[a.id],
      keywords: a.name.toLowerCase(),
    });
  });

  PROJECTS.forEach((p) => {
    const installed = installedProjectIds.includes(p.id);
    out.push({
      id: `project:${p.id}`,
      title: p.name,
      subtitle: installed ? p.description : `${p.description} - Get on App Store`,
      kind: installed ? 'project' : 'appstore',
      appId: installed ? 'safari' : 'appstore',
      url: installed ? p.liveUrl : undefined,
      payload: { projectId: p.id },
      icon: p.favicon,
      keywords: `${p.name} ${p.description} project`.toLowerCase(),
    });
  });

  BLOG_POSTS.forEach((post) => {
    out.push({
      id: `note:${post.id}`,
      title: post.title,
      subtitle: post.preview,
      kind: 'note',
      appId: 'notes',
      icon: appIcons['notes'],
      payload: { noteId: post.id },
      keywords: `${post.title} ${post.preview} ${post.content.slice(0, 800)}`.toLowerCase(),
    });
  });

  SETTING_SECTIONS.forEach((s) => {
    out.push({
      id: `setting:${s.id}`,
      title: s.label,
      subtitle: 'System Settings',
      kind: 'setting',
      appId: 'settings',
      icon: appIcons['settings'],
      payload: { section: s.id },
      keywords: `${s.label} settings preference`.toLowerCase(),
    });
  });

  // Bookmarks
  try {
    const raw = localStorage.getItem('thanasos.bookmarks');
    const bms = raw ? JSON.parse(raw) : [];
    if (Array.isArray(bms)) {
      bms.forEach((b: { name: string; url: string }) => {
        out.push({
          id: `bookmark:${b.url}`,
          title: b.name,
          subtitle: b.url,
          kind: 'bookmark',
          appId: 'safari',
          url: b.url,
          keywords: `${b.name} ${b.url} bookmark`.toLowerCase(),
        });
      });
    }
  } catch { /* ignore */ }

  return out;
};

export const searchSpotlight = (entries: SpotlightEntry[], q: string): SpotlightEntry[] => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  const scored = entries
    .map((e) => {
      let score = 0;
      const t = e.title.toLowerCase();
      if (t === query) score += 200;
      if (t.startsWith(query)) score += 100;
      if (t.includes(query)) score += 50;
      tokens.forEach((tok) => {
        if (e.keywords.includes(tok)) score += 10;
        if (t.includes(tok)) score += 20;
      });
      // surface apps/settings first when ties
      const kindBoost: Record<SpotlightKind, number> = {
        app: 8, setting: 6, project: 5, note: 4, bookmark: 3, appstore: 2,
      };
      score += kindBoost[e.kind];
      return { e, score };
    })
    .filter((x) => x.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  return scored.map((s) => s.e);
};

// Event bus so apps can react to spotlight launches
export interface SpotlightOpenDetail {
  appId: string;
  payload?: SpotlightEntry['payload'];
  url?: string;
}

export const dispatchSpotlightOpen = (detail: SpotlightOpenDetail) => {
  window.dispatchEvent(new CustomEvent('spotlight:open', { detail }));
};

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { MapPin, Link as LinkIcon, Building2, Users, BookOpen, GitFork, Star, UserPlus, Bell, Pin } from 'lucide-react';
import { GitHubCalendar } from '@/components/ui/git-hub-calendar';
import { README_MD } from '@/lib/githubContributions';
import { useMacOS } from '@/contexts/MacOSContext';

const USERNAME = 'Thanas-R';

interface UserData {
  avatar_url?: string;
  name?: string;
  login?: string;
  bio?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  company?: string;
  location?: string;
  blog?: string;
  html_url?: string;
}

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  visibility?: string;
  fork: boolean;
  updated_at: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
  Vue: '#41b883', Go: '#00ADD8', Rust: '#dea584', Dart: '#00B4AB',
};

export const GitHubApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  const [user, setUser] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [u, r] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`).then((res) => res.json()),
          fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`).then((res) => res.json()),
        ]);
        setUser(u);
        if (Array.isArray(r)) {
          setRepos(r.filter((x: Repo) => !x.fork).sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count));
        }
      } catch (e) { console.error(e); }
    })();
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 4);
  };

  // GitHub palette
  const bg = dark ? '#0d1117' : '#ffffff';
  const text = dark ? '#e6edf3' : '#1f2328';
  const subBg = dark ? '#0d1117' : '#ffffff';
  const card = dark ? '#161b22' : '#ffffff';
  const border = dark ? '#30363d' : '#d0d7de';
  const muted = dark ? '#7d8590' : '#59636e';
  const accent = '#2f81f7';
  const btnBg = dark ? '#21262d' : '#f6f8fa';
  const btnHover = dark ? '#30363d' : '#eaeef2';

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="h-full w-full overflow-auto relative"
      style={{ background: bg, color: text, fontFamily: '-apple-system,"Segoe UI",Helvetica,Arial,sans-serif' }}
    >
      {/* Frosted pill behind traffic lights — appears on scroll */}
      <div
        className="fixed pointer-events-none transition-opacity duration-200"
        style={{
          opacity: scrolled ? 1 : 0,
          top: 8,
          left: 8,
          width: 64,
          height: 28,
          borderRadius: 999,
          background: dark ? 'rgba(22,27,34,0.78)' : 'rgba(255,255,255,0.78)',
          border: `1px solid ${border}`,
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          zIndex: 30,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 grid grid-cols-1 md:grid-cols-[296px_1fr] gap-8">
        {/* LEFT: profile */}
        <aside className="flex flex-col">
          <div className="rounded-full overflow-hidden border aspect-square w-full max-w-[296px] mb-4" style={{ borderColor: border }}>
            <img src={user?.avatar_url || `https://github.com/${USERNAME}.png`} alt="" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-[26px] font-semibold leading-tight">{user?.name || 'Thanas R'}</h1>
          <div className="text-[20px] mb-3" style={{ color: muted }}>{user?.login || USERNAME}</div>

          <div className="flex gap-2 mb-4">
  <a
    href={`https://github.com/${USERNAME}`}
    target="_blank"
    rel="noreferrer"
    className="flex-1 flex items-center justify-center py-2 rounded-md border text-[14px] font-medium transition-colors"
    style={{ borderColor: border, background: btnBg, color: text }}
    onMouseEnter={(e) => (e.currentTarget.style.background = btnHover)}
    onMouseLeave={(e) => (e.currentTarget.style.background = btnBg)}
  >
    Follow
  </a>
</div>
          <p className="text-[14px] mb-4 leading-snug">Developer &amp; creative problem-solver. Building thoughtful digital experiences with code</p>

          <div className="flex items-center gap-2 text-[14px] mb-3" style={{ color: muted }}>
            <Users className="w-4 h-4" />
            <span>
              <b style={{ color: text }}>{user?.followers ?? 18}</b> followers · <b style={{ color: text }}>{user?.following ?? 24}</b> following
            </span>
          </div>

          <div className="space-y-2 text-[14px]" style={{ color: muted }}>
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> PES University</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bengaluru</div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <a className="hover:underline" style={{ color: text }} href="https://thanas.vercel.app" target="_blank" rel="noreferrer">thanas.vercel.app</a>
            </div>
            <div className="flex items-center gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
  </svg>
  <a className="hover:underline" style={{ color: text }} href="https://www.linkedin.com/in/thanasr" target="_blank" rel="noreferrer">
    in/thanasr
  </a>
</div>
          </div>

          <div className="mt-5 pt-4 border-t grid grid-cols-3 gap-2 text-center" style={{ borderColor: border }}>
            <Stat icon={BookOpen} label="Repos" value={user?.public_repos ?? repos.length} />
            <Stat icon={Star} label="Stars" value={repos.reduce((s, r) => s + r.stargazers_count, 0)} />
            <Stat icon={Users} label="Followers" value={user?.followers ?? 18} />
          </div>
        </aside>

        {/* RIGHT */}
        <main className="min-w-0 space-y-5">
          {/* README card */}
          <div className="rounded-lg border min-w-0 overflow-hidden" style={{ borderColor: border, background: card }}>
            <div
              className="flex items-center gap-2 px-4 py-2 border-b text-[12px]"
              style={{ borderColor: border, color: muted, background: dark ? '#0d1117' : '#f6f8fa' }}
            >
              <BookOpen className="w-3.5 h-3.5" /> {USERNAME} / README.md
            </div>
            <div className="p-6">
              <article className={`gh-readme prose prose-sm max-w-none ${dark ? 'prose-invert' : ''}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{README_MD}</ReactMarkdown>
              </article>
            </div>
          </div>

          {/* Contribution graph card */}
<div
  className="rounded-lg border p-5"
  style={{ borderColor: border, background: card }}
>
  <div className="mb-3">
    <div className="text-[14px] font-semibold">
      Contribution Activity
    </div>
  </div>

  <GitHubCalendar username={USERNAME} dark={dark} />
</div>

          {/* Repositories */}
          <div className="rounded-lg border p-5" style={{ borderColor: border, background: card }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-semibold  ml-2">
  Public repositories
</div>
              <div className="text-[12px]" style={{ color: muted }}>{repos.length} repos</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repos.map((r) => (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank" rel="noreferrer"
                  className="rounded-md border p-3 transition-colors block"
                  style={{ borderColor: border, background: subBg }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = btnBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = subBg)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4" style={{ color: muted }} />
                    <span className="text-[14px] font-semibold truncate" style={{ color: accent }}>{r.name}</span>
                    <span className="text-[10.5px] px-1.5 rounded-full border" style={{ color: muted, borderColor: border }}>
                      {r.visibility ?? 'Public'}
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-[12.5px] mb-2 line-clamp-2" style={{ color: muted }}>{r.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-[11.5px]" style={{ color: muted }}>
                    {r.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || '#888' }} />
                        {r.language}
                      </span>
                    )}
                    {r.stargazers_count > 0 && (
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />{r.stargazers_count}</span>
                    )}
                    {r.forks_count > 0 && (
                      <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{r.forks_count}</span>
                    )}
                  </div>
                </a>
              ))}
              {repos.length === 0 && (
                <div className="text-[13px]" style={{ color: muted }}>Loading repositories…</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value?: number }) => (
  <div>
    <div className="flex items-center justify-center gap-1 text-[11px] opacity-70"><Icon className="w-3 h-3" />{label}</div>
    <div className="text-[15px] font-semibold mt-0.5">{value ?? '—'}</div>
  </div>
);

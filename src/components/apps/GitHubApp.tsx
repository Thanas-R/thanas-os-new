import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Github, MapPin, Link as LinkIcon, Building2, Users, BookOpen, GitCommitHorizontal, UserPlus, Star } from 'lucide-react';
import { GitHubCalendar } from '@/components/ui/git-hub-calendar';
import { SAMPLE_CONTRIBUTIONS, README_MD } from '@/lib/githubContributions';
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

export const GitHubApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  const [user, setUser] = useState<UserData | null>(null);
  const [stars, setStars] = useState(0);
  const [commits, setCommits] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [u, repos] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`).then(r => r.json()),
          fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`).then(r => r.json()),
        ]);
        setUser(u);
        if (Array.isArray(repos)) {
          setStars(repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0));
        }
        // Approx commit count via search api
        try {
          const cs = await fetch(
            `https://api.github.com/search/commits?q=author:${USERNAME}`,
            { headers: { Accept: 'application/vnd.github.cloak-preview+json' } }
          ).then(r => r.json());
          if (cs && typeof cs.total_count === 'number') setCommits(cs.total_count);
        } catch { /* ignore */ }
      } catch (e) { console.error(e); }
    })();
  }, []);

  const bg = dark ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-white text-[#1f2328]';
  const subBg = dark ? 'bg-[#161b22]' : 'bg-[#f6f8fa]';
  const border = dark ? 'border-[#30363d]' : 'border-[#d0d7de]';
  const muted = dark ? 'text-[#7d8590]' : 'text-[#656d76]';

  return (
    <div className={`h-full w-full overflow-auto ${bg}`} style={{ fontFamily: '-apple-system,"Segoe UI",Helvetica,Arial,sans-serif' }}>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* LEFT: profile */}
        <aside className="flex flex-col">
          <div className={`rounded-full overflow-hidden border ${border} aspect-square w-full max-w-[260px] mb-4`}>
            <img src={user?.avatar_url || `https://github.com/${USERNAME}.png`} alt="" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-[26px] font-semibold leading-tight">{user?.name || 'Thanas R'}</h1>
          <div className={`text-[20px] ${muted} mb-3`}>{user?.login || USERNAME}</div>

          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank" rel="noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-1.5 mb-4 rounded-md border ${border} ${dark ? 'bg-[#21262d] hover:bg-[#30363d]' : 'bg-[#f6f8fa] hover:bg-[#eaeef2]'} text-[14px] font-medium`}
          >
            <UserPlus className="w-4 h-4" /> Follow
          </a>

          <p className="text-[14px] mb-3 leading-snug">Developer & creative problem-solver. Building thoughtful digital experiences with code</p>

          <div className={`flex items-center gap-2 text-[14px] mb-3 ${muted}`}>
            <Users className="w-4 h-4" />
            <span><b className={dark ? 'text-white' : 'text-black'}>{user?.followers ?? '—'}</b> followers · <b className={dark ? 'text-white' : 'text-black'}>{user?.following ?? '—'}</b> following</span>
          </div>

          <div className={`space-y-1.5 text-[14px] ${muted}`}>
            {user?.company && <div className="flex items-center gap-2"><Building2 className="w-4 h-4" />{user.company}</div>}
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> PES University</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {user?.location || 'Bengaluru'}</div>
            {user?.blog && <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /><a className="hover:underline text-[#2f81f7]" href={user.blog} target="_blank" rel="noreferrer">{user.blog.replace(/^https?:\/\//, '')}</a></div>}
          </div>

          <div className={`mt-4 pt-4 border-t ${border} grid grid-cols-3 gap-2 text-center`}>
            <Stat icon={BookOpen} label="Repos" value={user?.public_repos} />
            <Stat icon={Star} label="Stars" value={stars} />
            <Stat icon={Users} label="Followers" value={user?.followers} />
          </div>
        </aside>

        {/* RIGHT: README + calendar */}
        <main className="min-w-0">
          <div className={`flex items-center gap-2 text-[12px] ${muted} mb-2`}>
            <Github className="w-3.5 h-3.5" /> {USERNAME} / README.md
          </div>
          <div className={`rounded-lg border ${border} ${subBg} p-6 mb-5 min-w-0`}>
            <article
              className={`prose prose-sm max-w-none ${dark ? 'prose-invert' : ''}`}
              style={{
                // tighten github-flavored typography
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{README_MD}</ReactMarkdown>
            </article>
          </div>

          <div className={`rounded-lg border ${border} ${subBg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[14px] font-semibold">
                <GitCommitHorizontal className="w-4 h-4" />
                Contribution Activity
              </div>
              <div className={`text-[12px] ${muted}`}>
                {commits !== null ? `~${commits.toLocaleString()} total commits` : 'Loading commits…'}
              </div>
            </div>
            <GitHubCalendar data={SAMPLE_CONTRIBUTIONS} dark={dark} />
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

import { useState, useEffect } from 'react';
import { FolderGit2, Star, Loader2, Linkedin } from 'lucide-react';

export const StatsWidget = () => {
  const [stats, setStats] = useState({ repos: 0, stars: 0 });
  const [loading, setLoading] = useState(true);
  const linkedInFollowers = '26+';

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const username = 'Thanas-R';
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ]);
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        const totalStars = Array.isArray(reposData)
          ? reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
          : 0;
        setStats({ repos: userData.public_repos || 0, stars: totalStars });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGitHubStats();
  }, []);

  const rings = [
    { label: 'Repos', value: stats.repos, max: 30, color: 'hsl(0 100% 60%)', icon: FolderGit2 },
    { label: 'Stars', value: stats.stars, max: 50, color: 'hsl(130 70% 50%)', icon: Star },
    { label: 'LinkedIn', value: linkedInFollowers, max: 100, color: 'hsl(210 100% 55%)', icon: Linkedin, isStatic: true },
  ];

  return (
    <div
      className="backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass flex items-center gap-5"
      style={{
        width: 328,
        background: 'hsl(0 0% 8% / 0.85)',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center w-full py-4">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'hsl(0 100% 60%)' }} />
        </div>
      ) : (
        <>
          {/* Rings */}
          <div className="relative w-20 h-20 flex-shrink-0">
            {rings.map((ring, idx) => {
              const radius = 32 - idx * 9;
              const circumference = 2 * Math.PI * radius;
              const numVal = ring.isStatic ? 26 : (ring.value as number);
              const progress = Math.min(numVal / ring.max, 1);
              return (
                <svg key={idx} className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(0 0% 100% / 0.1)" strokeWidth="5" />
                  <circle
                    cx="40" cy="40" r={radius}
                    fill="none" stroke={ring.color} strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference * progress} ${circumference}`}
                    transform="rotate(-90 40 40)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
              );
            })}
          </div>

          {/* Labels */}
          <div className="flex-1 space-y-2">
            <h3 className="text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-2">Activity</h3>
            {rings.map((ring, idx) => {
              const Icon = ring.icon;
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={12} style={{ color: ring.color }} />
                    <span className="text-[10px] text-white/50">{ring.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{ring.value}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

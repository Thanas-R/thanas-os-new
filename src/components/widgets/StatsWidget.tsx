import { useState, useEffect } from 'react';
import { FolderGit2, Star, Loader2, Linkedin } from 'lucide-react';

export const StatsWidget = () => {
  const [stats, setStats] = useState({ repos: 0, stars: 0 });
  const [loading, setLoading] = useState(true);
  const linkedInFollowers = '26+'; // LinkedIn doesn't have a public API

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const username = 'Thanas-R';
        
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposRes.json();
        
        const totalStars = Array.isArray(reposData) 
          ? reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
          : 0;
        
        setStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  return (
    <div className="backdrop-blur-macos-heavy rounded-2xl p-4 shadow-macos-glass w-64"
      style={{
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <h3 className="text-sm font-semibold mb-3 opacity-90">Quick Stats</h3>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-primary" />
              <span className="text-sm">Repositories</span>
            </div>
            <span className="text-lg font-bold">{stats.repos}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm">Total Stars</span>
            </div>
            <span className="text-lg font-bold">{stats.stars}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-primary" />
              <span className="text-sm">Followers</span>
            </div>
            <span className="text-lg font-bold">{linkedInFollowers}</span>
          </div>
        </div>
      )}
    </div>
  );
};

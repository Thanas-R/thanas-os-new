import { useState, useEffect } from 'react';
import { Github, Star, GitFork, ExternalLink, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

export const GitHubApp = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ repos: 0, stars: 0, followers: 0 });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const username = 'Thanas-R';
        
        // Fetch user info
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        
        // Fetch repos
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const reposData = await reposRes.json();
        
        setStats({
          repos: 5,
          stars: reposData.reduce((acc: number, repo: Repo) => acc + repo.stargazers_count, 0),
          followers: userData.followers || 1,
        });
        
        setRepos(reposData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Github className="w-8 h-8" />
          <h1 className="text-3xl font-bold">GitHub Profile</h1>
        </div>
        <p className="text-muted-foreground">
          Check out my latest projects and contributions on GitHub
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{stats.repos}</div>
            <div className="text-sm text-muted-foreground">Repositories</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{stats.stars}</div>
            <div className="text-sm text-muted-foreground">Total Stars</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{stats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </Card>
        </div>
      )}

      {/* Repositories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Repositories</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading repositories...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map(repo => (
              <Card key={repo.id} className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{repo.name}</h3>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-secondary rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                  {repo.language && (
                    <Badge variant="secondary" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <a
          href="https://github.com/Thanas-R"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Github className="w-5 h-5" />
          View Full Profile
        </a>
      </div>
    </div>
  );
};

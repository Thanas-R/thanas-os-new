import { useState, useEffect, useRef } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Search, X } from 'lucide-react';
import finderIcon from '@/assets/finder-icon.png';
import aboutIcon from '@/assets/about-icon.png';
import techIcon from '@/assets/tech-icon.png';
import projectsIcon from '@/assets/projects-icon.png';
import journeyIcon from '@/assets/journey-icon.png';
import githubIcon from '@/assets/github-icon.png';
import linkedinIcon from '@/assets/linkedin-icon.png';
import contactIcon from '@/assets/contact-icon.png';
import settingsIcon from '@/assets/settings-icon.png';

const iconMap: Record<string, string> = {
  'finder': finderIcon,
  'about': aboutIcon,
  'technologies': techIcon,
  'projects': projectsIcon,
  'journey': journeyIcon,
  'github': githubIcon,
  'linkedin': linkedinIcon,
  'contact': contactIcon,
  'settings': settingsIcon,
};

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Spotlight = ({ isOpen, onClose }: SpotlightProps) => {
  const { apps, openApp } = useMacOS();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-32 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-background/95 backdrop-blur-macos-heavy rounded-2xl shadow-macos-glass border border-macos-glass-border overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps..."
              className="flex-1 bg-transparent text-lg outline-none"
            />
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {filteredApps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No apps found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredApps.map(app => {
                  const iconSrc = iconMap[app.id];
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        openApp(app.id);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                        {iconSrc ? (
                          <img src={iconSrc} alt={app.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-2xl">{app.icon}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{app.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

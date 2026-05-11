import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import {
  Search,
  ArrowRight,
  LayoutGrid,
  Folder,
  Globe,
  Settings as Cog,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_ICONS } from '@/components/apps/LaunchpadApp';
import { PROJECTS } from '@/lib/projects';
import { setPendingSafariUrl, useInstalledProjects } from '@/lib/installedApps';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

type ShortcutId = 'apps' | 'files' | 'web' | 'settings';

interface Shortcut {
  id: ShortcutId;
  label: string;
  icon: ReactNode;
}

interface SearchResult {
  kind: 'app' | 'project';
  id: string;
  name: string;
  description: string;
  icon?: string;
  url?: string;
}

const SHORTCUTS: Shortcut[] = [
  { id: 'apps', label: 'Apps', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'files', label: 'Files', icon: <Folder className="w-5 h-5" /> },
  { id: 'web', label: 'Web', icon: <Globe className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Cog className="w-5 h-5" /> },
];

const SVGFilter = () => {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="blob">
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
        <feColorMatrix
          values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -9
          "
          result="blob"
        />
        <feBlend in="SourceGraphic" in2="blob" />
      </filter>
    </svg>
  );
};

interface SpotlightPlaceholderProps {
  text: string;
  className?: string;
}

const SpotlightPlaceholder = ({ text, className }: SpotlightPlaceholderProps) => {
  return (
    <motion.div
      layout
      className={`absolute pointer-events-none z-10 flex items-center text-white/45 ${className ?? ''}`}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="whitespace-nowrap"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

interface SpotlightInputProps {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
}

const SpotlightInput = ({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
}: SpotlightInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center w-full justify-start gap-3 px-6 h-16">
      <motion.div layoutId="search-icon" className="shrink-0">
        <Search className="w-5 h-5 text-white/70" />
      </motion.div>

      <div className="flex-1 relative h-full flex items-center">
        {!hidePlaceholder && (
          <SpotlightPlaceholder
            text={placeholder}
            className="left-0 top-1/2 -translate-y-1/2 text-lg"
          />
        )}

        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-white text-lg placeholder-transparent"
        />
      </div>
    </div>
  );
};

interface SearchResultCardProps {
  icon?: string;
  name: string;
  description: string;
  isLast: boolean;
  isActive: boolean;
  onClick: () => void;
  onHover: () => void;
}

const SearchResultCard = ({
  icon,
  name,
  description,
  isLast,
  isActive,
  onClick,
  onHover,
}: SearchResultCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full overflow-hidden group/card text-left ${
        isLast ? 'rounded-b-3xl' : ''
      }`}
    >
      <div
        className={`flex items-center justify-start gap-3 py-2.5 px-3 w-full transition-colors rounded-xl ${
          isActive ? 'bg-white/12 text-white' : 'hover:bg-white/5 text-white/90'
        }`}
      >
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
          {icon ? (
            <img src={icon} alt="" className="w-full h-full object-cover" />
          ) : (
            <Search className="w-4 h-4 text-white/70" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <p className="font-medium text-sm truncate">{name}</p>
          <p className={`text-xs truncate ${isActive ? 'text-white/75' : 'text-white/50'}`}>
            {description}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <ArrowRight className={`w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
    </button>
  );
};

interface SearchResultsContainerProps {
  searchResults: SearchResult[];
  activeIdx: number;
  onHover: (index: number | null) => void;
  onSelect: (result: SearchResult) => void;
}

const SearchResultsContainer = ({
  searchResults,
  activeIdx,
  onHover,
  onSelect,
}: SearchResultsContainerProps) => {
  return (
    <motion.div
      layout
      onMouseLeave={() => onHover(null)}
      className="mt-3 rounded-3xl overflow-hidden max-h-96 overflow-y-auto w-full py-2 px-2"
      style={{
        background: 'rgba(28,28,32,0.65)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {searchResults.map((result, index) => (
        <motion.div
          key={`${result.kind}:${result.id}`}
          onMouseEnter={() => onHover(index)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            delay: index * 0.04,
            duration: 0.18,
            ease: 'easeOut',
          }}
        >
          <SearchResultCard
            icon={result.icon}
            name={result.name}
            description={result.description}
            isLast={index === searchResults.length - 1}
            isActive={index === activeIdx}
            onHover={() => onHover(index)}
            onClick={() => onSelect(result)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export const Spotlight = ({ isOpen, onClose }: SpotlightProps) => {
  const { apps, openApp } = useMacOS();
  const installed = useInstalledProjects();

  const [hovered, setHovered] = useState(false);
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);
  const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const appResults = apps
      .filter((a) => a.name.toLowerCase().includes(q))
      .map((a) => ({
        kind: 'app' as const,
        id: a.id,
        name: a.name,
        description: 'Application',
        icon: APP_ICONS[a.id],
      }));

    const projectResults = PROJECTS
      .filter((p) => installed.includes(p.id))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .map((p) => ({
        kind: 'project' as const,
        id: p.id,
        name: p.name,
        description: p.description,
        icon: p.favicon,
        url: p.liveUrl,
      }));

    return [...appResults, ...projectResults];
  }, [apps, installed, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setHoveredResult(null);
      setHoveredShortcut(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIdx(0);
    setHoveredResult(null);
  }, [query]);

  const launch = (result: SearchResult) => {
    if (result.kind === 'project') {
      if (result.url) {
        setPendingSafariUrl(result.url);
        openApp('safari');
      }
    } else {
      openApp(result.id);
    }
    onClose();
  };

  const handleShortcut = (id: ShortcutId) => {
    if (id === 'apps') openApp('launchpad');
    else if (id === 'files') openApp('finder');
    else if (id === 'web') openApp('safari');
    else if (id === 'settings') openApp('settings');
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(searchResults.length - 1, i + 1));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      }

      if (e.key === 'Enter' && searchResults[activeIdx]) {
        e.preventDefault();
        launch(searchResults[activeIdx]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, searchResults, activeIdx, onClose]);

  const placeholderText =
    hoveredShortcut !== null
      ? SHORTCUTS[hoveredShortcut].label
      : hoveredResult !== null && searchResults[hoveredResult]
      ? searchResults[hoveredResult].name
      : 'Spotlight Search';

  const showChips = !query;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            filter: 'blur(20px) url(#blob)',
            scaleX: 1.3,
            scaleY: 1.1,
            y: -10,
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px) url(#blob)',
            scaleX: 1,
            scaleY: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            filter: 'blur(20px) url(#blob)',
            scaleX: 1.3,
            scaleY: 1.1,
            y: 10,
          }}
          transition={{
            stiffness: 550,
            damping: 50,
            type: 'spring',
          }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/25 backdrop-blur-sm"
          onClick={onClose}
        >
          <SVGFilter />

          <motion.div
            initial={{ y: -12, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setHoveredShortcut(null);
            }}
            className="w-full max-w-3xl mx-4"
          >
            <div
              style={{ filter: 'url(#blob)' }}
              className="w-full flex items-center justify-end gap-4 z-20 group"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  layoutId="search-input-container"
                  transition={{
                    layout: {
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.2,
                    },
                  }}
                  style={{
                    borderRadius: '30px',
                    background: 'rgba(28,28,32,0.65)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-lg overflow-hidden"
                >
                  <SpotlightInput
                    placeholder={placeholderText}
                    hidePlaceholder={!!query && hoveredResult === null}
                    value={query}
                    onChange={setQuery}
                  />

                  {query && searchResults.length > 0 && (
                    <SearchResultsContainer
                      searchResults={searchResults}
                      activeIdx={activeIdx}
                      onHover={(index) => {
                        setHoveredResult(index);
                        if (index !== null) setActiveIdx(index);
                      }}
                      onSelect={launch}
                    />
                  )}
                </motion.div>

                {hovered &&
                  !query &&
                  SHORTCUTS.map((shortcut, index) => (
                    <motion.button
                      key={shortcut.id}
                      type="button"
                      onMouseEnter={() => setHoveredShortcut(index)}
                      onClick={() => handleShortcut(shortcut.id)}
                      layout
                      initial={{ scale: 0.7, x: -1 * (64 * (index + 1)) }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{
                        scale: 0.7,
                        x:
                          1 *
                          (16 * (SHORTCUTS.length - index - 1) +
                            64 * (SHORTCUTS.length - index - 1)),
                      }}
                      transition={{
                        duration: 0.8,
                        type: 'spring',
                        bounce: 0.2,
                        delay: index * 0.05,
                      }}
                      className="rounded-full cursor-pointer shrink-0"
                      title={shortcut.label}
                    >
                      <div className="rounded-full cursor-pointer hover:shadow-lg opacity-30 hover:opacity-100 transition-[opacity,shadow] duration-200 bg-[rgba(28,28,32,0.65)] backdrop-blur-xl border border-white/10 text-white">
                        <div className="size-14 aspect-square flex items-center justify-center">
                          {shortcut.icon}
                        </div>
                      </div>
                    </motion.button>
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Tiny virtual filesystem for the Terminal app.
export type FsNode =
  | { type: 'dir'; children: Record<string, FsNode> }
  | { type: 'file'; content: string };

const dir = (children: Record<string, FsNode>): FsNode => ({ type: 'dir', children });
const file = (content: string): FsNode => ({ type: 'file', content });

export const ROOT: FsNode = dir({
  Users: dir({
    thanas: dir({
      Desktop: dir({
        'README.md': file('# Welcome to ThanasOS\n\nThis is your **Desktop**.\nDrag, drop, magnify.\n\n- Hit `Cmd+K` to open Spotlight\n- Open Launchpad from the dock\n- Try `open terminal` in Terminal\n'),
        'notes.txt': file('Random thoughts:\n- ship more\n- write less yaml\n- design with conviction\n'),
      }),
      Documents: dir({
        'about.txt': file('Thanas R\nBuilder of small useful things.\nFind me at https://thanas.vercel.app\n'),
        'projects.md': file('# Projects\n\n- **ThanasOS** — the desktop you are using\n- **Portfolio** — thanas.vercel.app\n- **Spotlight v2** — goo-filter morph\n\nSee the App Store inside ThanasOS for the full list.\n'),
        'resume.md': file('# Thanas R — Resume\n\n## Stack\n- TypeScript, React, Vite, Tailwind\n- Node, Postgres, Supabase\n- Framer Motion, shadcn/ui\n\n## Highlights\n- Built ThanasOS from scratch\n- Three-proxy race for browser apps\n- Cosine-based dock magnification\n'),
        'todo.txt': file('[ ] finish notes preview pane\n[ ] add file viewer to finder\n[x] real battery in menu bar\n[x] case-insensitive terminal\n'),
        'secret-recipe.md': file('# Grandma\'s Secret Sandwich\n\n*This is the only known correct way to make a sandwich.*\n\n## Ingredients\n- 2 slices of artisanal sourdough\n- 1 dollop of `sudo` (root permissions only)\n- A pinch of `chmod 777`\n- One terminal, freshly opened\n\n## Instructions\n1. Open Terminal\n2. Type `sudo make sandwich`\n3. Wait for the magic\n\n> "He who has root, eats first." — Linus Torvalds (probably)\n'),
        'manifesto.md': file('# The ThanasOS Manifesto\n\n## We believe\n\n1. **Pixels matter.** Every shadow, every blur radius, every kerning decision.\n2. **Latency is a feature.** Snappy beats fancy.\n3. **Easter eggs are love letters** to the people who poke around.\n4. **The best UI** is the one that disappears.\n\n```\n  if (delight > friction) ship();\n```\n\n*Written at 3am, fueled by chai.*\n'),
        'beware.md': file('# ⚠️ READ THIS FIRST\n\nThere is a *thing* in the trash.\n\nDo **not** click on it.\n\n…unless you want to know what *Money Heist* has to do with all this.\n'),
      }),
      Downloads: dir({
        'lipsum.txt': file('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n'),
        'definitely-not-a-virus.exe': file('Just kidding. This is a `.txt` in disguise.\nNothing scary here. Move along.\n\n(But seriously, never run an unknown .exe.)\n'),
        'passwords.txt': file('🔒 ACCESS DENIED\n\nNice try, friend. My passwords are not in plaintext.\nThey live in 1Password like a civilized person\'s.\n'),
      }),
      Music: dir({
        'playlist.txt': file('1. Aphex Twin — Avril 14th\n2. Boards of Canada — Roygbiv\n3. Tycho — A Walk\n4. Arctic Monkeys — Crying Lightning\n5. Eminem — Mockingbird\n'),
        'lyrics-leaked.md': file('# Top secret lyrics\n\n```\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\n```\n\nWait. That doesn\'t look right.\n'),
      }),
      Pictures: dir({
        'caption.txt': file('Wallpapers live in Settings > Wallpaper.\n'),
        'screenshot-2049.md': file('# screenshot-2049-04-21.png\n\n*[image not found — file too large to render in your reality]*\n\nYou were not supposed to see this.\n'),
      }),
      Movies: dir({
        'watchlist.md': file('# To watch\n\n- [x] **Money Heist** — for research, obviously\n- [ ] **The Social Network** — every dev\'s comfort movie\n- [ ] **Whiplash** — for when you need to ship\n- [ ] **Interstellar** — for when you need perspective\n\nSee what\'s in the trash for a hint about #1.\n'),
      }),
      '.secrets': dir({
        'README.md': file('# 👀\n\nYou found it. Have a chai on me.\n\n## Easter eggs\n\nCheck the **Help** menu (top right of menu bar) for hints — but no spoilers there. They\'re scattered across:\n\n- the Terminal\n- the Trash\n- the Spotlight\n- the Finder (you\'re looking at one)\n- the Calendar widget\n- … and more.\n'),
        'konami.txt': file('↑ ↑ ↓ ↓ ← → ← → B A\n\nNothing happens. Or does it?\n'),
      }),
      '.zshrc': file('# zsh config\nexport PS1="thanas@thanasos %~ %% "\nalias ll="ls -la"\nalias gs="git status"\n'),
      '.bash_history': file('ls\ncd Documents\ncat about.txt\nneofetch\nstatus\nopen safari\n'),
    }),
  }),
  bin: dir({}),
  etc: dir({
    hostname: file('thanasos'),
    motd: file('Welcome to ThanasOS — type `help` to get started.\n'),
    'os-release': file('NAME="ThanasOS"\nVERSION="1.0 (Liquid Glass)"\nID=thanasos\nPRETTY_NAME="ThanasOS 1.0"\n'),
  }),
  tmp: dir({}),
  var: dir({ log: dir({
    'system.log': file('[boot] kernel ok\n[boot] dock attached\n[boot] menubar online\n[boot] welcome.\n'),
  }) }),
});

export const HOME = '/Users/thanas';

export const splitPath = (p: string) => p.split('/').filter(Boolean);

export const resolvePath = (cwd: string, input: string): string => {
  if (!input) return cwd;
  let parts: string[];
  if (input.startsWith('/')) {
    parts = splitPath(input);
  } else if (input.startsWith('~')) {
    parts = [...splitPath(HOME), ...splitPath(input.slice(1))];
  } else {
    parts = [...splitPath(cwd), ...splitPath(input)];
  }
  const out: string[] = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') out.pop();
    else out.push(p);
  }
  return '/' + out.join('/');
};

export const getNode = (path: string): FsNode | null => {
  const parts = splitPath(path);
  let node: FsNode = ROOT;
  for (const p of parts) {
    if (node.type !== 'dir') return null;
    if (!node.children[p]) return null;
    node = node.children[p];
  }
  return node;
};

export const getParentAndName = (path: string): { parent: FsNode | null; name: string } => {
  const parts = splitPath(path);
  if (parts.length === 0) return { parent: null, name: '' };
  const name = parts[parts.length - 1];
  const parentPath = '/' + parts.slice(0, -1).join('/');
  return { parent: getNode(parentPath), name };
};

export const mkdir = (path: string): string | null => {
  const { parent, name } = getParentAndName(path);
  if (!parent || parent.type !== 'dir') return 'No such file or directory';
  if (parent.children[name]) return 'File exists';
  parent.children[name] = { type: 'dir', children: {} };
  return null;
};

export const touch = (path: string): string | null => {
  const { parent, name } = getParentAndName(path);
  if (!parent || parent.type !== 'dir') return 'No such file or directory';
  if (!parent.children[name]) parent.children[name] = { type: 'file', content: '' };
  return null;
};

export const rm = (path: string, recursive = false): string | null => {
  const { parent, name } = getParentAndName(path);
  if (!parent || parent.type !== 'dir' || !parent.children[name]) return 'No such file or directory';
  const target = parent.children[name];
  if (target.type === 'dir' && !recursive) return 'is a directory';
  delete parent.children[name];
  return null;
};

export const writeFile = (path: string, content: string): string | null => {
  const { parent, name } = getParentAndName(path);
  if (!parent || parent.type !== 'dir') return 'No such file or directory';
  parent.children[name] = { type: 'file', content };
  return null;
};

export const prettyPath = (path: string) => {
  if (path === HOME) return '~';
  if (path.startsWith(HOME + '/')) return '~' + path.slice(HOME.length);
  return path;
};

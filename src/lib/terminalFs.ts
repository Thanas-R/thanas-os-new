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
      }),
      Downloads: dir({
        'lipsum.txt': file('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n'),
      }),
      Music: dir({
        'playlist.txt': file('1. Aphex Twin — Avril 14th\n2. Boards of Canada — Roygbiv\n3. Tycho — A Walk\n'),
      }),
      Pictures: dir({
        'caption.txt': file('Wallpapers live in Settings > Wallpaper.\n'),
      }),
      Movies: dir({}),
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

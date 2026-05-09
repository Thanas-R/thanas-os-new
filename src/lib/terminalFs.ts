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
        'README.md': file('Welcome to ThanasOS Desktop.\nDrag, drop, magnify.'),
      }),
      Documents: dir({
        'about.txt': file('Thanas — builder of small useful things.'),
        'projects.txt': file('See the App Store for the project list.'),
      }),
      Downloads: dir({}),
      '.zshrc': file('# zsh config\nexport PS1="thanas@thanasos %~ %% "'),
    }),
  }),
  bin: dir({}),
  etc: dir({
    hostname: file('thanasos'),
  }),
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

export const prettyPath = (path: string) => {
  if (path === HOME) return '~';
  if (path.startsWith(HOME + '/')) return '~' + path.slice(HOME.length);
  return path;
};

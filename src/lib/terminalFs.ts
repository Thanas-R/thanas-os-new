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
      Music: dir({}),
      Pictures: dir({}),
      Movies: dir({}),
      '.zshrc': file('# zsh config\nexport PS1="thanas@thanasos %~ %% "'),
      '.bash_history': file('ls\ncd Documents\ncat about.txt\nneofetch\n'),
    }),
  }),
  bin: dir({}),
  etc: dir({
    hostname: file('thanasos'),
    motd: file('Welcome to ThanasOS — type `help` to get started.'),
  }),
  tmp: dir({}),
  var: dir({ log: dir({}) }),
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

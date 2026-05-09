import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { HOME, getNode, resolvePath, prettyPath } from '@/lib/terminalFs';

interface Line {
  type: 'in' | 'out';
  text: string;
}

const BANNER = `ThanasOS Terminal — type "help" for commands.`;

export const TerminalApp = () => {
  const { apps, openApp } = useMacOS();
  const [cwd, setCwd] = useState(HOME);
  const [lines, setLines] = useState<Line[]>([{ type: 'out', text: BANNER }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (text: string) => setLines(prev => [...prev, { type: 'out', text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines(prev => [...prev, { type: 'in', text: `${prettyPath(cwd)} % ${raw}` }]);
    if (!cmd) return;
    setHistory(prev => [...prev, cmd]);

    const [name, ...args] = cmd.split(/\s+/);
    switch (name) {
      case 'help':
        print([
          'Available commands:',
          '  ls [path]         list directory contents',
          '  cd <path>         change directory',
          '  pwd               print working directory',
          '  cat <file>        print file contents',
          '  echo <text>       print text',
          '  clear             clear the screen',
          '  history           show command history',
          '  whoami            print current user',
          '  date              show current date/time',
          '  uname             system info',
          '  open <app>        open an app (e.g. open safari)',
          '  apps              list installable apps',
          '  neofetch          system summary',
          '  exit              close terminal',
        ].join('\n'));
        break;
      case 'pwd': print(cwd); break;
      case 'whoami': print('thanas'); break;
      case 'date': print(new Date().toString()); break;
      case 'uname': print('ThanasOS 1.0 liquid-glass x86_64'); break;
      case 'echo': print(args.join(' ')); break;
      case 'clear': setLines([]); break;
      case 'history':
        print(history.map((h, i) => `${i + 1}  ${h}`).join('\n') || '(empty)');
        break;
      case 'apps':
        print(apps.map(a => `  ${a.id.padEnd(14)} ${a.name}`).join('\n'));
        break;
      case 'open': {
        const id = args[0];
        const app = apps.find(a => a.id === id || a.name.toLowerCase() === id?.toLowerCase());
        if (!app) print(`open: no such app: ${id}`);
        else { openApp(app.id); print(`Opening ${app.name}...`); }
        break;
      }
      case 'ls': {
        const target = resolvePath(cwd, args[0] || '.');
        const node = getNode(target);
        if (!node) { print(`ls: ${args[0] || '.'}: No such file or directory`); break; }
        if (node.type === 'file') { print(target); break; }
        const entries = Object.entries(node.children);
        print(entries.map(([n, c]) => c.type === 'dir' ? `\x1b[34m${n}/\x1b[0m` : n).map(s => s.replace(/\x1b\[[0-9;]*m/g, '')).join('  ') || '(empty)');
        break;
      }
      case 'cd': {
        const target = resolvePath(cwd, args[0] || '~');
        const node = getNode(target);
        if (!node) { print(`cd: no such file or directory: ${args[0]}`); break; }
        if (node.type !== 'dir') { print(`cd: not a directory: ${args[0]}`); break; }
        setCwd(target);
        break;
      }
      case 'cat': {
        if (!args[0]) { print('cat: missing file operand'); break; }
        const target = resolvePath(cwd, args[0]);
        const node = getNode(target);
        if (!node) { print(`cat: ${args[0]}: No such file or directory`); break; }
        if (node.type !== 'file') { print(`cat: ${args[0]}: Is a directory`); break; }
        print(node.content);
        break;
      }
      case 'neofetch':
        print([
          '   ___ ',
          '  /   \\   thanas@thanasos',
          '  \\___/   ----------------',
          '          OS:     ThanasOS 1.0 (liquid)',
          '          Shell:  thsh 0.1',
          '          WM:     Aqua-React',
          '          Theme:  Liquid Glass Dark',
          '          Apps:   ' + apps.length,
        ].join('\n'));
        break;
      case 'exit': print('(close the window with the red button)'); break;
      default: print(`thsh: command not found: ${name}`);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
      setHistoryIdx(null);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === null) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) { setHistoryIdx(null); setInput(''); }
      else { setHistoryIdx(idx); setInput(history[idx]); }
    }
  };

  return (
    <div
      className="h-full w-full bg-[#1e1e1e]/95 text-[#e6e6e6] font-mono text-[13px] flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-3 leading-relaxed">
        {lines.map((l, i) => (
          <pre key={i} className="whitespace-pre-wrap font-mono">
            {l.text}
          </pre>
        ))}
        <div className="flex items-center">
          <span className="text-emerald-400">{prettyPath(cwd)}</span>
          <span className="text-white/70 mx-1">%</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            className="flex-1 bg-transparent outline-none text-white"
          />
        </div>
      </div>
    </div>
  );
};

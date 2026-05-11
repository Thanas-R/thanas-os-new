import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import {
  HOME,
  getNode,
  resolvePath,
  prettyPath,
  mkdir,
  touch,
  rm,
  writeFile,
} from '@/lib/terminalFs';

interface Line {
  type: 'in' | 'out';
  text: string;
}

const ASCII = String.raw`
                                               ########        
                                               ########        
                                           ####++++++++####    
                                           ####========####    
                       ############    ####****========****####
                       #############   ####================####
########       ############****############====++++========####
########       ########****++++****########====####========####
####****###############****++++****########====****========####
###*===+#######*+++*****+++****++++****####================####
###*===+#######*+++*****+++****++++****####================####
   ####*=======+###*+++****++++****####+===========########    
   ####*=======+###*+++****++++****####+===========########    
       ####+:::-===*###############========::::*###            
       ####+:::-===*###############========::::*###            
           ####+----:::----::::----::::----*###*               
           ####+---:::::---::::----::::----*####               
   ########*=======*###*=======*#######+=======####            
   ########*=======*###*=======*#######+=======####            
###*++++++++===+****###*===****####++++========####            
###*========   #####       ########=========####            
###*++++++++   #####   ####********=========            
   #########           ####+================                   
   #########           ####+===========+++++                   
                       ####+===========#####                   
                       ####++++++++++++#####                   
                           #############                       
                           #############                         
`;

const BANNER = `Last login: ${new Date().toString().split(' GMT')[0]} on ttys001
${ASCII}
       ThanasOS  v1.0  ·  Liquid Glass Edition
       Type \`help\` for available commands, \`status\` for system info.`;

export const TerminalApp = () => {
  const { apps, openApp, windows, closeWindow } = useMacOS();
  const [cwd, setCwd] = useState(HOME);
const [lines, setLines] = useState<Line[]>([
  { type: 'out', text: 'BANNER_TOP' }
]);
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

    const [rawName, ...args] = cmd.split(/\s+/);
    const name = rawName.toLowerCase();
    switch (name) {
      case 'help':
        print([
          'Available commands:',
          '  ls [path]              list directory contents',
          '  cd <path>              change directory',
          '  pwd                    print working directory',
          '  cat <file>             print file contents',
          '  echo <text>            print text (supports > file to write)',
          '  mkdir <dir>            create directory',
          '  touch <file>           create empty file',
          '  rm [-rf] <path>        remove file or directory',
          '  cp <src> <dst>         copy file',
          '  mv <src> <dst>         move/rename',
          '  grep <pat> <file>      search inside a file',
          '  head [-n N] <file>     first N lines (default 10)',
          '  tail [-n N] <file>     last N lines (default 10)',
          '  wc <file>              line/word/char count',
          '  find <name>            find files by name from cwd',
          '  tree                   print directory tree',
          '  env                    print env vars',
          '  which <cmd>            locate a command',
          '  whoami / date / uname  identity & system info',
          '  history                show command history',
          '  clear                  clear the screen',
          '  open <app>             open an app (e.g. open safari)',
          '  apps                   list installable apps',
          '  neofetch               system summary',
          '  status                 system status (uptime, memory, apps)',
          '  exit                   close the terminal window',
        ].join('\n'));
        break;
      case 'pwd': print(cwd); break;
      case 'whoami': print('thanas'); break;
      case 'date': print(new Date().toString()); break;
      case 'uname': print('ThanasOS 1.0 liquid-glass x86_64'); break;
      case 'env': print([
        'USER=thanas',
        'HOME=/Users/thanas',
        'SHELL=/bin/thsh',
        'TERM=xterm-256color',
        'PATH=/usr/local/bin:/usr/bin:/bin',
        'LANG=en_US.UTF-8',
      ].join('\n')); break;
      case 'which': {
        const c = args[0];
        const builtins = ['ls','cd','pwd','cat','echo','mkdir','touch','rm','cp','mv','grep','head','tail','wc','find','tree','env','which','whoami','date','uname','history','clear','open','apps','neofetch','help','exit'];
        print(builtins.includes(c) ? `${c}: shell builtin` : `${c} not found`);
        break;
      }
      case 'echo': {
        const joined = args.join(' ');
        const m = joined.match(/^(.*?)\s*>\s*(\S+)$/);
        if (m) {
          const target = resolvePath(cwd, m[2]);
          const err = writeFile(target, m[1].replace(/^"|"$/g, '') + '\n');
          if (err) print(err);
        } else print(joined);
        break;
      }
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
        const longFormat = args.includes('-l') || args.includes('-la');
        const showHidden = args.includes('-a') || args.includes('-la');
        const pathArg = args.find(a => !a.startsWith('-'));
        const target = resolvePath(cwd, pathArg || '.');
        const node = getNode(target);
        if (!node) { print(`ls: ${args[0] || '.'}: No such file or directory`); break; }
        if (node.type === 'file') { print(target); break; }
        let entries = Object.entries(node.children);
        if (!showHidden) entries = entries.filter(([n]) => !n.startsWith('.'));
        if (longFormat) {
          print(entries.map(([n, c]) =>
            `${c.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}  thanas  staff  ${c.type === 'file' ? c.content.length : 128}  ${n}${c.type === 'dir' ? '/' : ''}`
          ).join('\n') || '(empty)');
        } else {
          print(entries.map(([n, c]) => c.type === 'dir' ? `${n}/` : n).join('  ') || '(empty)');
        }
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
      case 'mkdir': {
        if (!args[0]) { print('mkdir: missing operand'); break; }
        const err = mkdir(resolvePath(cwd, args[0]));
        if (err) print(`mkdir: ${args[0]}: ${err}`);
        break;
      }
      case 'touch': {
        if (!args[0]) { print('touch: missing operand'); break; }
        const err = touch(resolvePath(cwd, args[0]));
        if (err) print(`touch: ${args[0]}: ${err}`);
        break;
      }
      case 'rm': {
        const recursive = args.some(a => a.startsWith('-') && (a.includes('r') || a.includes('R')));
        const path = args.find(a => !a.startsWith('-'));
        if (!path) { print('rm: missing operand'); break; }
        const err = rm(resolvePath(cwd, path), recursive);
        if (err) print(`rm: ${path}: ${err}`);
        break;
      }
      case 'cp':
      case 'mv': {
        if (args.length < 2) { print(`${name}: missing destination`); break; }
        const src = getNode(resolvePath(cwd, args[0]));
        if (!src) { print(`${name}: ${args[0]}: No such file or directory`); break; }
        if (src.type !== 'file') { print(`${name}: directories not supported`); break; }
        writeFile(resolvePath(cwd, args[1]), src.content);
        if (name === 'mv') rm(resolvePath(cwd, args[0]));
        break;
      }
      case 'grep': {
        if (args.length < 2) { print('usage: grep <pattern> <file>'); break; }
        const node = getNode(resolvePath(cwd, args[1]));
        if (!node || node.type !== 'file') { print(`grep: ${args[1]}: No such file`); break; }
        const pat = args[0];
        const matches = node.content.split('\n').filter(l => l.includes(pat));
        print(matches.join('\n') || '(no matches)');
        break;
      }
      case 'head':
      case 'tail': {
        let n = 10;
        const ni = args.indexOf('-n');
        if (ni >= 0) n = parseInt(args[ni + 1], 10) || 10;
        const path = args.find((a, i) => !a.startsWith('-') && args[i - 1] !== '-n');
        if (!path) { print(`${name}: missing file`); break; }
        const node = getNode(resolvePath(cwd, path));
        if (!node || node.type !== 'file') { print(`${name}: ${path}: No such file`); break; }
        const lines2 = node.content.split('\n');
        print((name === 'head' ? lines2.slice(0, n) : lines2.slice(-n)).join('\n'));
        break;
      }
      case 'wc': {
        if (!args[0]) { print('wc: missing file'); break; }
        const node = getNode(resolvePath(cwd, args[0]));
        if (!node || node.type !== 'file') { print(`wc: ${args[0]}: No such file`); break; }
        const text = node.content;
        const linesC = text.split('\n').length;
        const wordsC = text.split(/\s+/).filter(Boolean).length;
        print(`  ${linesC}  ${wordsC}  ${text.length}  ${args[0]}`);
        break;
      }
      case 'find': {
        if (!args[0]) { print('find: missing name'); break; }
        const needle = args[0];
        const out: string[] = [];
        const walk = (path: string, node: any) => {
          if (path.includes(needle)) out.push(path);
          if (node.type === 'dir') {
            for (const [n, c] of Object.entries(node.children)) {
              walk(path === '/' ? `/${n}` : `${path}/${n}`, c);
            }
          }
        };
        const start = getNode(cwd);
        if (start) walk(cwd, start);
        print(out.join('\n') || '(no results)');
        break;
      }
      case 'tree': {
        const out: string[] = [];
        const walk = (node: any, prefix: string) => {
          if (node.type !== 'dir') return;
          const ks = Object.keys(node.children);
          ks.forEach((k, i) => {
            const last = i === ks.length - 1;
            out.push(prefix + (last ? '└── ' : '├── ') + k + (node.children[k].type === 'dir' ? '/' : ''));
            walk(node.children[k], prefix + (last ? '    ' : '│   '));
          });
        };
        const start = getNode(cwd);
        if (start) { out.push(prettyPath(cwd)); walk(start, ''); }
        print(out.join('\n'));
        break;
      }
      case 'neofetch':
        print([
          '       .:\'    thanas@thanasos',
          '    __ :\'__    ----------------',
          ' .\'`__`-\'__``.   OS:      ThanasOS 1.0 (liquid)',
          ":__________.-'   Host:    MacBook Pro (web)",
          ":-------------:  Kernel:  liquid-glass 1.0",
          " `\\_____ \\____/  Shell:   thsh 0.2",
          "    `.__.-\"`     WM:      Aqua-React",
          "                 Theme:   Liquid Glass Dark",
          '                 Apps:    ' + apps.length,
        ].join('\n'));
        break;
      case 'exit': {
        const win = windows.find(w => w.appId === 'terminal');
        if (win) closeWindow(win.id);
        else print('logout');
        break;
      }
      case 'status': {
        const openWins = windows.filter(w => !w.isMinimized).length;
        const minWins = windows.filter(w => w.isMinimized).length;
        const mem = (performance as any).memory;
        const memLine = mem ? `Memory:    ${(mem.usedJSHeapSize / 1048576).toFixed(1)} MB / ${(mem.jsHeapSizeLimit / 1048576).toFixed(0)} MB` : 'Memory:    n/a';
        const upMs = performance.now();
        const m = Math.floor(upMs / 60000), s = Math.floor((upMs % 60000) / 1000);
        print([
          'ThanasOS — System Status',
          '──────────────────────────────',
          `User:      thanas`,
          `Shell:     thsh 0.2`,
          `Uptime:    ${m}m ${s}s (since page load)`,
          `Apps:      ${apps.length} installed`,
          `Windows:   ${openWins} open · ${minWins} minimized`,
          memLine,
          `Network:   online`,
          '──────────────────────────────',
          'All systems nominal ✓',
        ].join('\n'));
        break;
      }
      case 'sudo': print(args.length ? `${args[0]}: permission denied (nice try)` : 'usage: sudo <cmd>'); break;
      case 'ifconfig': print([
        'lo0: flags=8049<UP,LOOPBACK,RUNNING> mtu 16384',
        '        inet 127.0.0.1 netmask 0xff000000',
        'en0: flags=8863<UP,BROADCAST,RUNNING> mtu 1500',
        '        ether 00:1c:42:2e:60:4a',
        '        inet 192.168.1.42 netmask 0xffffff00 broadcast 192.168.1.255',
        '        media: autoselect',
      ].join('\n')); break;
      case 'ping': {
        if (!args[0]) { print('usage: ping <host>'); break; }
        const host = args[0];
        const ms = Math.round(20 + Math.random() * 30);
        print([
          `PING ${host} (93.184.216.34): 56 data bytes`,
          `64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=${ms}.${Math.floor(Math.random()*900+100)} ms`,
          `64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=${ms-2}.${Math.floor(Math.random()*900+100)} ms`,
          '',
          `--- ${host} ping statistics ---`,
          '2 packets transmitted, 2 received, 0.0% packet loss',
        ].join('\n'));
        break;
      }
      case 'ps': print([
        '  PID TTY           TIME CMD',
        '    1 ttys001    0:00.04 thsh',
        '   42 ttys001    0:00.12 finder',
        '   88 ttys001    0:01.07 safari',
        '  142 ttys001    0:00.21 dock',
      ].join('\n')); break;
      case 'top': print([
        'Processes: 4 total, 1 running, 3 sleeping',
        'Load Avg: 0.42, 0.38, 0.31  CPU usage: 3.1% user, 1.2% sys, 95.7% idle',
        '',
        'PID    COMMAND      %CPU TIME    MEM',
        '88     safari       2.1  0:01.07 142M',
        '42     finder       0.4  0:00.12 38M',
        '142    dock         0.1  0:00.21 22M',
        '1      thsh         0.0  0:00.04 4M',
      ].join('\n')); break;
      case 'df': print([
        'Filesystem    Size   Used  Avail Capacity  Mounted on',
        '/dev/disk1   500G   213G   287G    43%     /',
        'devfs        198K   198K     0B   100%     /dev',
      ].join('\n')); break;
      case 'du': print(`${Math.floor(Math.random()*8000+200)}\t${args[0] || cwd}`); break;
      case 'man': print(args[0] ? `No manual entry for ${args[0]}. Try \`help\`.` : 'What manual page do you want?'); break;
      case 'curl': {
        if (!args[0]) { print('curl: try \'curl <url>\''); break; }
        print(`curl: simulated request to ${args[0]} ... 200 OK (Content-Length: 1337)`);
        break;
      }
      case 'cowsay': {
        const msg = args.join(' ') || 'moo';
        const bar = '-'.repeat(msg.length + 2);
        print([
          ` ${bar}`,
          `< ${msg} >`,
          ` ${bar}`,
          '        \\   ^__^',
          '         \\  (oo)\\_______',
          '            (__)\\       )\\/\\',
          '                ||----w |',
          '                ||     ||',
        ].join('\n'));
        break;
      }
      case 'banner': print(`### ${args.join(' ').toUpperCase() || 'THANASOS'} ###`); break;
      case 'fortune': {
        const fortunes = [
          'Ship small, ship often.',
          'Read the source. Always.',
          'A clean cache hides many sins.',
          'Optimism compiles. Pessimism debugs.',
          'The best UI is no UI. The second best is fast UI.',
        ];
        print(fortunes[Math.floor(Math.random() * fortunes.length)]);
        break;
      }
      case 'uptime': {
        const upMs = performance.now();
        const m = Math.floor(upMs / 60000), s = Math.floor((upMs % 60000) / 1000);
        print(`up ${m}m ${s}s, 1 user, load averages: 0.42 0.38 0.31`);
        break;
      }
      default: print(`thsh: command not found: ${rawName}`);
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
      className="h-full w-full bg-[#1d1f21]/95 text-[#e6e6e6] font-mono text-[13px] flex flex-col"
      onClick={() => inputRef.current?.focus()}
      style={{ fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace' }}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-3 leading-[1.45]">
        {lines.map((l, i) => {
  if (l.text === 'BANNER_TOP') {
  return (
    <div key={i} className="text-[#e6e6e6]">
      
      {/* Login text */}
      <pre className="whitespace-pre-wrap font-mono mb-2">
{`Last login: ${new Date().toString().split(' GMT')[0]} on ttys001`}
      </pre>

      {/* ASCII + Right Text Row */}
      <div className="flex items-start gap-8">

        {/* ASCII */}
        <pre
          className="whitespace-pre leading-none text-[#e6e6e6] shrink-0"
          style={{
            fontSize: '5px',
            lineHeight: '5px'
          }}
        >
{ASCII}
        </pre>

        {/* RIGHT SIDE TEXT */}
        <div className="pt-4">
          <div className="text-[18px] font-semibold mb-2">
            ThanasOS v1.0
          </div>

          <div className="text-white/80 mb-1">
            Liquid Glass Edition
          </div>

          <div className="text-white/70">
            Type <b>help</b> for commands
          </div>

          <div className="text-white/70">
            Use <b>status</b> for system info
          </div>
        </div>

      </div>
    </div>
  );
}

  return (
    <pre key={i} className="whitespace-pre-wrap font-mono text-[#e6e6e6]">
      {l.text}
    </pre>
  );
})}
        <div className="flex items-center">
          <span className="text-emerald-400">thanas@thanasos</span>
          <span className="text-white/40 mx-1">:</span>
          <span className="text-sky-400">{prettyPath(cwd)}</span>
          <span className="text-white/70 mx-1">$</span>
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

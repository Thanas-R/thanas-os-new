import { useEffect, useState, useCallback } from 'react';
import { Delete, Calculator as CalcIcon } from 'lucide-react';
import { registerAppMenus } from '@/types/macos';

type Op = '+' | '-' | '*' | '/' | null;

// Faithful macOS-style calculator matching the uploaded reference:
// dark slate body, circular gray digit keys, dark-gray top utility row, orange operator column.
export const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [operator, setOperator] = useState<Op>(null);
  const [waitingForNew, setWaitingForNew] = useState(false);

  const inputDigit = useCallback((d: string) => {
    setDisplay((cur) => {
      if (waitingForNew) {
        setWaitingForNew(false);
        return d;
      }
      if (cur === '0') return d;
      if (cur.replace(/[^0-9]/g, '').length >= 12) return cur;
      return cur + d;
    });
  }, [waitingForNew]);

  const inputDecimal = useCallback(() => {
    if (waitingForNew) {
      setDisplay('0.');
      setWaitingForNew(false);
      return;
    }
    setDisplay((cur) => (cur.includes('.') ? cur : cur + '.'));
  }, [waitingForNew]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setAccumulator(null);
    setOperator(null);
    setWaitingForNew(false);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((cur) => (cur.startsWith('-') ? cur.slice(1) : cur === '0' ? cur : '-' + cur));
  }, []);

  const percent = useCallback(() => {
    setDisplay((cur) => {
      const n = parseFloat(cur);
      if (Number.isNaN(n)) return cur;
      return formatNum(n / 100);
    });
  }, []);

  const backspace = useCallback(() => {
    if (waitingForNew) return;
    setDisplay((cur) => {
      if (cur.length <= 1 || (cur.length === 2 && cur.startsWith('-'))) return '0';
      return cur.slice(0, -1);
    });
  }, [waitingForNew]);

  const compute = (a: number, b: number, op: Op): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const setOp = useCallback((next: Op) => {
    setDisplay((cur) => {
      const value = parseFloat(cur);
      if (accumulator === null) {
        setAccumulator(value);
      } else if (!waitingForNew && operator) {
        const result = compute(accumulator, value, operator);
        setAccumulator(result);
        setWaitingForNew(true);
        setOperator(next);
        return formatNum(result);
      }
      setOperator(next);
      setWaitingForNew(true);
      return cur;
    });
  }, [accumulator, operator, waitingForNew]);

  const equals = useCallback(() => {
    setDisplay((cur) => {
      if (operator === null || accumulator === null) return cur;
      const value = parseFloat(cur);
      const result = compute(accumulator, value, operator);
      setAccumulator(null);
      setOperator(null);
      setWaitingForNew(true);
      return formatNum(result);
    });
  }, [accumulator, operator]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') { inputDigit(e.key); return; }
      if (e.key === '.' || e.key === ',') { inputDecimal(); return; }
      if (e.key === '+') setOp('+');
      else if (e.key === '-') setOp('-');
      else if (e.key === '*') setOp('*');
      else if (e.key === '/') { e.preventDefault(); setOp('/'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clearAll();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === '%') percent();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inputDigit, inputDecimal, setOp, equals, clearAll, backspace, percent]);

  useEffect(() => {
    registerAppMenus('calculator', {
      Edit: [
        { label: 'Copy', action: () => navigator.clipboard?.writeText(display) },
        { label: 'Clear', action: clearAll },
      ],
    });
    return () => registerAppMenus('calculator', null);
  }, [display, clearAll]);

  // Show "AC" before any input, "C" after input started
  const acLabel = display === '0' && accumulator === null && operator === null ? 'AC' : 'C';

  return (
    <div
      className="h-full w-full select-none flex flex-col"
      style={{
        background: '#1f2125',
        fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
      }}
    >
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pt-6 pb-3 min-h-[110px]">
        <div
          className="text-white font-light text-right w-full"
          style={{
            fontSize: 'clamp(48px, 14vw, 88px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="px-3 pb-4 grid gap-2.5" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr' }}>
        <Key variant="util" onClick={clearAll}>{acLabel === 'AC' ? 'AC' : <Delete className="w-5 h-5" />}</Key>
        <Key variant="util" onClick={toggleSign} aria-label="Toggle sign"><span className="text-[18px]">±</span></Key>
        <Key variant="util" onClick={percent}>%</Key>
        <Key variant="op" active={operator === '/' && waitingForNew} onClick={() => setOp('/')}>÷</Key>

        <Key onClick={() => inputDigit('7')}>7</Key>
        <Key onClick={() => inputDigit('8')}>8</Key>
        <Key onClick={() => inputDigit('9')}>9</Key>
        <Key variant="op" active={operator === '*' && waitingForNew} onClick={() => setOp('*')}>×</Key>

        <Key onClick={() => inputDigit('4')}>4</Key>
        <Key onClick={() => inputDigit('5')}>5</Key>
        <Key onClick={() => inputDigit('6')}>6</Key>
        <Key variant="op" active={operator === '-' && waitingForNew} onClick={() => setOp('-')}>−</Key>

        <Key onClick={() => inputDigit('1')}>1</Key>
        <Key onClick={() => inputDigit('2')}>2</Key>
        <Key onClick={() => inputDigit('3')}>3</Key>
        <Key variant="op" active={operator === '+' && waitingForNew} onClick={() => setOp('+')}>+</Key>

        <Key onClick={clearAll} aria-label="Clear"><CalcIcon className="w-5 h-5" /></Key>
        <Key onClick={() => inputDigit('0')}>0</Key>
        <Key onClick={inputDecimal}>,</Key>
        <Key variant="op" onClick={equals}>=</Key>
      </div>
    </div>
  );
};

const Key = ({
  children,
  onClick,
  variant = 'digit',
  active,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'digit' | 'op' | 'util';
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const styles = {
    digit: { background: '#5b5e63', color: '#ffffff' },
    op:    { background: active ? '#ffffff' : '#f5a623', color: active ? '#f5a623' : '#ffffff' },
    util:  { background: '#3a3d42', color: '#ffffff' },
  } as const;
  return (
    <button
      onClick={onClick}
      {...rest}
      className="rounded-full flex items-center justify-center transition-[filter,transform] active:brightness-90 active:scale-[0.97] hover:brightness-110"
      style={{
        ...styles[variant],
        fontSize: '24px',
        fontWeight: 400,
        aspectRatio: '1 / 1',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 0 rgba(0,0,0,0.25)',
      }}
    >
      {children}
    </button>
  );
};

const formatNum = (n: number): string => {
  if (!Number.isFinite(n)) return 'Error';
  // Trim trailing zeros and very small floating-point noise
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return n.toExponential(6).replace(/\.?0+e/, 'e');
  }
  const fixed = parseFloat(n.toFixed(10)).toString();
  return fixed;
};

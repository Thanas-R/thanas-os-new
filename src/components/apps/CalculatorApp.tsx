import { useEffect, useState, useCallback } from 'react';
import { Calculator as CalcIcon } from 'lucide-react';
import { BsBackspace } from 'react-icons/bs';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineMinus } from 'react-icons/hi';
import { HiOutlineDivide } from 'react-icons/hi2';
import { RxCross1 } from 'react-icons/rx';
import { registerAppMenus } from '@/types/macos';

type Op = '+' | '-' | '*' | '/' | null;

// Fixed-size macOS Calculator. No scroll, no resize, no maximize button.
// Colors: orange #FF9203, digits #333333, utility #5E5E5E. Inter 400.
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
      if (cur.replace(/[^0-9]/g, '').length >= 9) return cur;
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
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
        return;
      }
      if (e.key === '.' || e.key === ',') {
        inputDecimal();
        return;
      }
      if (e.key === '+') setOp('+');
      else if (e.key === '-') setOp('-');
      else if (e.key === '*') setOp('*');
      else if (e.key === '/') {
        e.preventDefault();
        setOp('/');
      }
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        equals();
      }
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearAll();
      }
      else if (e.key === 'Backspace') {
        backspace();
      }
      else if (e.key === '%') {
        percent();
      }
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

  return (
    <div
      className="h-full w-full select-none flex flex-col overflow-hidden"
      style={{
        background: 'rgba(28, 28, 30, 0.80)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        fontFamily: 'Inter, -apple-system, "SF Pro Text", sans-serif',
        fontWeight: 400,
      }}
    >
      {/* Display — leaves space for floating traffic lights at top-left */}
      <div className="flex-1 flex items-end justify-end px-5 pt-10 pb-3 min-h-0">
        <div
          className="text-white text-right w-full"
          style={{
            fontSize: 'clamp(48px, 18vw, 76px)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontWeight: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {display}
        </div>
      </div>

      {/* Keypad — gap fills remaining height; no scroll */}
      <div
        className="px-2.5 pb-3 grid gap-2"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr' }}
      >
        <Key variant="util" onClick={backspace} aria-label="Backspace">
          <BsBackspace className="w-6 h-6" />
        </Key>

        <Key variant="util" onClick={toggleSign} aria-label="Toggle sign">
          <span className="text-[24px] leading-none">+/-</span>
        </Key>

        <Key variant="util" onClick={percent} aria-label="Percent">
          <span className="text-[26px] leading-none">%</span>
        </Key>

        <Key variant="op" onClick={() => setOp('/')} aria-label="Divide">
          <HiOutlineDivide className="w-7 h-7" />
        </Key>

        <Key onClick={() => inputDigit('7')}>7</Key>
        <Key onClick={() => inputDigit('8')}>8</Key>
        <Key onClick={() => inputDigit('9')}>9</Key>
        <Key variant="op" onClick={() => setOp('*')} aria-label="Multiply">
          <RxCross1 className="w-6.5 h-6.5" />
        </Key>

        <Key onClick={() => inputDigit('4')}>4</Key>
        <Key onClick={() => inputDigit('5')}>5</Key>
        <Key onClick={() => inputDigit('6')}>6</Key>
        <Key variant="op" onClick={() => setOp('-')} aria-label="Minus">
          <HiOutlineMinus className="w-7 h-7" />
        </Key>

        <Key onClick={() => inputDigit('1')}>1</Key>
        <Key onClick={() => inputDigit('2')}>2</Key>
        <Key onClick={() => inputDigit('3')}>3</Key>
        <Key variant="op" onClick={() => setOp('+')} aria-label="Plus">
          <HiOutlinePlus className="w-7 h-7" />
        </Key>

        <Key onClick={clearAll} aria-label="All Clear">
          <CalcIcon className="w-6 h-6" strokeWidth={1.8} />
        </Key>
        <Key onClick={() => inputDigit('0')}>0</Key>
        <Key onClick={inputDecimal}>.</Key>
        <Key variant="op" onClick={equals} aria-label="Equals">=</Key>
      </div>
    </div>
  );
};

const Key = ({
  children,
  onClick,
  variant = 'digit',
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'digit' | 'op' | 'util';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const styles = {
    digit: { background: '#333333', color: '#ffffff' },
    op: { background: '#FF9203', color: '#ffffff' },
    util: { background: '#5E5E5E', color: '#ffffff' },
  } as const;

  return (
    <button
      onClick={onClick}
      {...rest}
      className="rounded-full flex items-center justify-center transition-[filter,transform] active:brightness-90 active:scale-[0.97] hover:brightness-110"
      style={{
        ...styles[variant],
        fontSize: '26px',
        fontWeight: 400,
        aspectRatio: '1 / 1',
      }}
    >
      {children}
    </button>
  );
};

const formatNum = (n: number): string => {
  if (!Number.isFinite(n)) return 'Error';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e10)) return n.toExponential(5).replace(/\.?0+e/, 'e');
  return parseFloat(n.toFixed(8)).toString();
};

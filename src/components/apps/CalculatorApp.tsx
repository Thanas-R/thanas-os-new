import { useEffect, useState, useCallback } from 'react';
import { registerAppMenus } from '@/types/macos';

type Op = '+' | '-' | '*' | '/' | null;

export const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [waiting, setWaiting] = useState(false);

  const fmt = (n: number): string => {
    if (!isFinite(n)) return 'Error';
    if (Math.abs(n) >= 1e16) return n.toExponential(6);

    const s = Number(n.toFixed(10)).toString();

    if (s.includes('.')) {
      const [a, b] = s.split('.');
      return Number(a).toLocaleString('en-US') + '.' + b;
    }

    return Number(s).toLocaleString('en-US');
  };

  const getNum = (val: string) => parseFloat(val.replace(/,/g, ''));

  const inputDigit = useCallback(
    (d: string) => {
      if (waiting) {
        setDisplay(d);
        setWaiting(false);
      } else {
        setDisplay((prevVal) => (prevVal === '0' ? d : prevVal + d));
      }
    },
    [waiting]
  );

  const inputDot = useCallback(() => {
    if (waiting) {
      setDisplay('0.');
      setWaiting(false);
      return;
    }

    setDisplay((prevVal) =>
      prevVal.includes('.') ? prevVal : prevVal + '.'
    );
  }, [waiting]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setWaiting(false);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((d) =>
      d === '0' ? '0' : d.startsWith('-') ? d.slice(1) : '-' + d
    );
  }, []);

  const percent = useCallback(() => {
    setDisplay((d) => fmt(getNum(d) / 100));
  }, []);

  const compute = (a: number, b: number, o: Op): number => {
    switch (o) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const performOp = useCallback(
    (next: Op) => {
      const current = getNum(display);

      if (prev === null) {
        setPrev(current);
      } else if (op && !waiting) {
        const result = compute(prev, current, op);
        setPrev(result);
        setDisplay(fmt(result));
      }

      setOp(next);
      setWaiting(true);
    },
    [display, prev, op, waiting]
  );

  const equals = useCallback(() => {
    if (prev === null || op === null) return;

    const current = getNum(display);
    const result = compute(prev, current, op);

    setDisplay(fmt(result));
    setPrev(null);
    setOp(null);
    setWaiting(true);
  }, [display, prev, op]);

  useEffect(() => {
    registerAppMenus('calculator', {
      Edit: [
        {
          label: 'Copy',
          shortcut: '⌘C',
          action: () => navigator.clipboard?.writeText(display),
        },
        { label: 'Clear', shortcut: 'C', action: clearAll },
      ],
      View: [{ label: 'Basic' }],
    });

    return () => registerAppMenus('calculator', null);
  }, [display, clearAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDot();
      else if (
        e.key === '+' ||
        e.key === '-' ||
        e.key === '*' ||
        e.key === '/'
      )
        performOp(e.key as Op);
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        equals();
      } else if (
        e.key === 'Escape' ||
        e.key === 'c' ||
        e.key === 'C'
      )
        clearAll();
      else if (e.key === '%') percent();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inputDigit, inputDot, performOp, equals, clearAll, percent]);

  const Btn = ({
    label,
    onClick,
    variant = 'gray',
    wide,
    active,
  }: {
    label: React.ReactNode;
    onClick: () => void;
    variant?: 'gray' | 'dark' | 'orange';
    wide?: boolean;
    active?: boolean;
  }) => {
    const styles = {
      gray: { bg: '#737375', color: '#fff' },
      dark: { bg: '#5d5d5f', color: '#fff' },
      orange: {
        bg: active ? '#fff' : '#ff9f0a',
        color: active ? '#ff9f0a' : '#fff',
      },
    }[variant];

    return (
      <button
        onClick={onClick}
        className="select-none transition-[filter,background] duration-75 active:brightness-90 hover:brightness-110 flex items-center"
        style={{
          background: styles.bg,
          color: styles.color,
          gridColumn: wide ? 'span 2' : undefined,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
          fontWeight: 300,
          fontSize: 30,
          justifyContent: wide ? 'flex-start' : 'center',
          paddingLeft: wide ? 28 : 0,
          border: 'none',
          outline: 'none',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      className="h-full w-full flex flex-col select-none"
      style={{
        background: '#1c1c1e',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
      }}
    >
      {/* Display */}
      <div
        className="flex items-end justify-end px-5"
        style={{
          flex: '0 0 32%',
          background: '#3a3a3c',
        }}
      >
        <div
          className="text-white text-right pb-1 w-full"
          style={{
            fontWeight: 200,
            fontSize: 'clamp(48px, 14vw, 76px)',
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

      {/* Buttons */}
      <div
        className="flex-1 grid"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          gap: 1,
          background: '#1c1c1e',
        }}
      >
        <Btn variant="dark" label="AC" onClick={clearAll} />
        <Btn variant="dark" label="±" onClick={toggleSign} />
        <Btn variant="dark" label="%" onClick={percent} />
        <Btn
          variant="orange"
          active={op === '/'}
          label="÷"
          onClick={() => performOp('/')}
        />

        <Btn label="7" onClick={() => inputDigit('7')} />
        <Btn label="8" onClick={() => inputDigit('8')} />
        <Btn label="9" onClick={() => inputDigit('9')} />
        <Btn
          variant="orange"
          active={op === '*'}
          label="×"
          onClick={() => performOp('*')}
        />

        <Btn label="4" onClick={() => inputDigit('4')} />
        <Btn label="5" onClick={() => inputDigit('5')} />
        <Btn label="6" onClick={() => inputDigit('6')} />
        <Btn
          variant="orange"
          active={op === '-'}
          label="−"
          onClick={() => performOp('-')}
        />

        <Btn label="1" onClick={() => inputDigit('1')} />
        <Btn label="2" onClick={() => inputDigit('2')} />
        <Btn label="3" onClick={() => inputDigit('3')} />
        <Btn
          variant="orange"
          active={op === '+'}
          label="+"
          onClick={() => performOp('+')}
        />

        <Btn wide label="0" onClick={() => inputDigit('0')} />
        <Btn label="." onClick={inputDot} />
        <Btn variant="orange" label="=" onClick={equals} />
      </div>
    </div>
  );
};

import { useEffect, useState, useCallback } from 'react';
import { registerAppMenus } from '@/types/macos';

type Op = '+' | '-' | '*' | '/' | '';

export const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [oldValue, setOldValue] = useState(0);
  const [value, setValue] = useState(0);
  const [sign, setSign] = useState(1);
  const [op, setOp] = useState<Op>('');
  const [justEval, setJustEval] = useState(false);

  const fmt = (n: number) => {
    if (!isFinite(n)) return 'Error';
    const s = String(n);
    if (s.includes('.')) {
      const [a, b] = s.split('.');
      return a.replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/g, ',') + '.' + b;
    }
    return s.replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/g, ',');
  };

  useEffect(() => { setDisplay(fmt(sign * value)); }, [value, sign]);

  const inputDigit = useCallback((n: number) => {
    if (justEval) { setValue(n); setSign(1); setOp(''); setJustEval(false); return; }
    setValue(v => v * 10 + n);
  }, [justEval]);

  const allClear = useCallback(() => {
    setValue(0); setOldValue(0); setSign(1); setOp(''); setJustEval(false);
  }, []);

  const toggleSign = useCallback(() => setSign(s => s * -1), []);
  const percent = useCallback(() => setValue(v => v / 100), []);

  const operate = useCallback((next: Op) => {
    setOldValue(sign * value);
    setValue(0);
    setSign(1);
    setOp(next);
    setJustEval(false);
  }, [sign, value]);

  const equals = useCallback(() => {
    let result = sign * value;
    const cur = sign * value;
    switch (op) {
      case '+': result = oldValue + cur; break;
      case '-': result = oldValue - cur; break;
      case '*': result = oldValue * cur; break;
      case '/': result = cur === 0 ? NaN : Number((oldValue / cur).toFixed(8)); break;
    }
    setValue(Math.abs(result));
    setSign(result < 0 ? -1 : 1);
    setOp('');
    setJustEval(true);
  }, [op, oldValue, value, sign]);

  // Register menus + keyboard
  useEffect(() => {
    registerAppMenus('calculator', {
      Edit: [
        { label: 'Copy', shortcut: '⌘C', action: () => navigator.clipboard?.writeText(display) },
        { label: 'Clear', shortcut: 'C', action: allClear },
      ],
      View: [
        { label: 'Basic' },
        { label: 'Scientific (coming soon)' },
      ],
    });
    return () => registerAppMenus('calculator', null);
  }, [display, allClear]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(Number(e.key));
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') operate(e.key as Op);
      else if (e.key === 'Enter' || e.key === '=') equals();
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') allClear();
      else if (e.key === '%') percent();
    };
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  }, [inputDigit, operate, equals, allClear, percent]);

  const Btn = ({ children, onClick, variant = 'gray', span = false, br }: {
    children: React.ReactNode; onClick: () => void;
    variant?: 'gray' | 'dark' | 'orange'; span?: boolean; br?: 'bl' | 'br';
  }) => {
    const bg = variant === 'orange' ? '#ff9f0b' : variant === 'dark' ? '#626065' : '#7c7b7f';
    return (
      <button
        onClick={onClick}
        className="text-white font-medium m-px transition-[filter] hover:brightness-110 active:brightness-95"
        style={{
          background: bg, border: 'none', fontSize: '1.7rem', fontWeight: 500,
          width: span ? 'calc(50% - 3px)' : 'calc(25% - 2.5px)',
          height: '100%',
          borderBottomLeftRadius: br === 'bl' ? '1.1rem' : 0,
          borderBottomRightRadius: br === 'br' ? '1.4rem' : 0,
        }}
      >{children}</button>
    );
  };

  return (
    <div
      className="h-full w-full flex flex-col select-none"
      style={{ background: '#504e53', fontFamily: 'Montserrat, system-ui, sans-serif' }}
    >
      {/* Display */}
      <div className="px-6 pt-10 pb-4">
        <div
          className="text-white text-right font-light"
          style={{ fontSize: '4.5rem', lineHeight: 0.85, letterSpacing: '-0.02em', overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 flex flex-col" style={{ fontSize: 0 }}>
        <div className="flex" style={{ height: '20%' }}>
          <Btn variant="dark" onClick={allClear}>AC</Btn>
          <Btn variant="dark" onClick={toggleSign}>±</Btn>
          <Btn variant="dark" onClick={percent}>％</Btn>
          <Btn variant="orange" onClick={() => operate('/')}>÷</Btn>
        </div>
        <div className="flex" style={{ height: '20%' }}>
          <Btn onClick={() => inputDigit(7)}>7</Btn>
          <Btn onClick={() => inputDigit(8)}>8</Btn>
          <Btn onClick={() => inputDigit(9)}>9</Btn>
          <Btn variant="orange" onClick={() => operate('*')}>×</Btn>
        </div>
        <div className="flex" style={{ height: '20%' }}>
          <Btn onClick={() => inputDigit(4)}>4</Btn>
          <Btn onClick={() => inputDigit(5)}>5</Btn>
          <Btn onClick={() => inputDigit(6)}>6</Btn>
          <Btn variant="orange" onClick={() => operate('-')}>−</Btn>
        </div>
        <div className="flex" style={{ height: '20%' }}>
          <Btn onClick={() => inputDigit(1)}>1</Btn>
          <Btn onClick={() => inputDigit(2)}>2</Btn>
          <Btn onClick={() => inputDigit(3)}>3</Btn>
          <Btn variant="orange" onClick={() => operate('+')}>+</Btn>
        </div>
        <div className="flex" style={{ height: '20%' }}>
          <Btn span br="bl" onClick={() => inputDigit(0)}>0</Btn>
          <Btn onClick={() => { /* decimal placeholder */ }}>,</Btn>
          <Btn variant="orange" br="br" onClick={equals}>＝</Btn>
        </div>
      </div>
    </div>
  );
};

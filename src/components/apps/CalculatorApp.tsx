import { useEffect, useState, useCallback } from 'react';
import { registerAppMenus } from '@/types/macos';

type Op = '+' | '-' | '*' | '/' | '';

// macOS-style calculator faithfully ported from the user-supplied HTML/CSS/JS.
export const CalculatorApp = () => {
  // Mirror of the user's STATE object, in React form.
  const [oldValue, setOldValue] = useState(0);
  const [value, setValue] = useState(0);
  const [sign, setSign] = useState(1);
  const [operator, setOperator] = useState<Op>('');

  const formatNumber = (n: number) => {
    const s = `${n}`;
    return s.replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/g, '.');
  };

  const result = formatNumber(sign * value);

  const setVal = useCallback((number: number) => {
    setValue((v) => v * 10 + number);
  }, []);

  const clearAll = useCallback(() => {
    setOldValue(0);
    setValue(0);
    setSign(1);
  }, []);

  const toggleSign = useCallback(() => setSign((s) => s * -1), []);

  const setOp = useCallback(
    (next: Op) => {
      setOperator(next);
      setOldValue(sign * value);
      setValue(0);
      setSign(1);
    },
    [sign, value]
  );

  const equals = useCallback(() => {
    let next = value;
    switch (operator) {
      case '+':
        next = oldValue + value;
        break;
      case '-':
        next = oldValue - value;
        break;
      case '*':
        next = oldValue * value;
        break;
      case '/':
        next = value === 0 ? NaN : Number((oldValue / value).toFixed(3));
        break;
      default:
        return;
    }
    setValue(next);
  }, [value, oldValue, operator]);

  // Keyboard support — same intent as the source script's keyup handler.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const num = Number(e.key);
      if (!Number.isNaN(num) && e.key.trim() !== '') {
        setVal(num);
        return;
      }
      if (['+', '-', '*', '/'].includes(e.key)) setOp(e.key as Op);
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        equals();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clearAll();
    };
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  }, [setVal, setOp, equals, clearAll]);

  useEffect(() => {
    registerAppMenus('calculator', {
      Edit: [
        { label: 'Copy', action: () => navigator.clipboard?.writeText(result) },
        { label: 'Clear', action: clearAll },
      ],
    });
    return () => registerAppMenus('calculator', null);
  }, [result, clearAll]);

  // Note: the window already provides traffic-light controls — we render only
  // the calculator body to avoid a duplicated red/yellow/green strip.
  return (
    <div
      className="h-full w-full select-none flex flex-col"
      style={{
        background: '#504e53',
        boxShadow: 'inset 2px 2px #888, inset -2px -2px #888',
        fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Calculus / display */}
      <div
        className="w-full flex items-end justify-end"
        style={{ padding: '2rem 1.5rem 0', height: '7rem' }}
      >
        <div
          className="w-full text-right text-white"
          style={{
            fontSize: 'clamp(3rem, 12vw, 6rem)',
            fontWeight: 300,
            lineHeight: 0.9,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {result}
        </div>
      </div>

      {/* Buttons */}
      <div
        className="w-full flex-1"
        style={{ marginTop: '1.5rem', paddingLeft: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Row>
          <Sq variant="dark" onClick={clearAll}>AC</Sq>
          <Sq variant="dark" onClick={toggleSign}>±</Sq>
          <Sq variant="dark" onClick={() => setValue((v) => v / 100)}>％</Sq>
          <Sq variant="yellow" onClick={() => setOp('/')}>÷</Sq>
        </Row>
        <Row>
          <Sq onClick={() => setVal(7)}>7</Sq>
          <Sq onClick={() => setVal(8)}>8</Sq>
          <Sq onClick={() => setVal(9)}>9</Sq>
          <Sq variant="yellow" onClick={() => setOp('*')}>×</Sq>
        </Row>
        <Row>
          <Sq onClick={() => setVal(4)}>4</Sq>
          <Sq onClick={() => setVal(5)}>5</Sq>
          <Sq onClick={() => setVal(6)}>6</Sq>
          <Sq variant="yellow" onClick={() => setOp('-')}>−</Sq>
        </Row>
        <Row>
          <Sq onClick={() => setVal(1)}>1</Sq>
          <Sq onClick={() => setVal(2)}>2</Sq>
          <Sq onClick={() => setVal(3)}>3</Sq>
          <Sq variant="yellow" onClick={() => setOp('+')}>+</Sq>
        </Row>
        <Row>
          <Sq span onClick={() => setVal(0)} bleft>0</Sq>
          <Sq onClick={() => { /* decimal placeholder per spec */ }}>,</Sq>
          <Sq variant="yellow" bright onClick={equals}>＝</Sq>
        </Row>
      </div>
    </div>
  );
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    className="w-full flex"
    style={{ height: 'calc(20% - 2px)', gap: 2, paddingInline: 1, marginBottom: 0 }}
  >
    {children}
  </div>
);

const Sq = ({
  children,
  onClick,
  variant = 'gray',
  span,
  bleft,
  bright,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'gray' | 'dark' | 'yellow';
  span?: boolean;
  bleft?: boolean;
  bright?: boolean;
}) => {
  const bg =
    variant === 'dark' ? '#626065' : variant === 'yellow' ? '#ff9f0b' : '#7c7b7f';
  return (
    <button
      onClick={onClick}
      className="text-white border-0 cursor-pointer transition-[filter] duration-75 hover:brightness-110 active:brightness-90"
      style={{
        flex: span ? 2 : 1,
        background: bg,
        fontSize: '2.2rem',
        fontWeight: 500,
        textAlign: span ? 'left' : 'center',
        paddingLeft: span ? '2rem' : 0,
        borderBottomLeftRadius: bleft ? '1.1rem' : 0,
        borderBottomRightRadius: bright ? '1.4rem' : 0,
      }}
    >
      {children}
    </button>
  );
};

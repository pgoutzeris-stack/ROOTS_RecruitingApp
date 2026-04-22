import { memo, useState, useEffect, useRef } from 'react';

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const WEEKDAYS = ['Mo','Di','Mi','Do','Fr','Sa','So'];

export const getTodayCET = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());

const formatDisplay = (iso) => {
  if (!iso) return 'Datum wählen';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

const navBtn = {
  border: 'none', background: 'transparent', cursor: 'pointer',
  color: 'var(--muted)', fontSize: 16, padding: '3px 7px',
  borderRadius: 7, fontFamily: 'inherit', lineHeight: 1,
  display: 'flex', alignItems: 'center',
};

const DatePicker = memo(({ value, onChange, width = 160 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const base = value ? new Date(value + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState(base.getFullYear());
  const [viewMonth, setViewMonth] = useState(base.getMonth());

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T12:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayISO = getTodayCET();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', width }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 10px', height: 32, width: '100%',
          borderRadius: 8, border: '1px solid var(--line)',
          background: 'var(--status-bg)', color: value ? 'var(--ink)' : 'var(--muted)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'inherit', userSelect: 'none',
        }}
      >
        <i className="ri-calendar-line" style={{ fontSize: 14, color: 'var(--muted)', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{formatDisplay(value)}</span>
        <i className="ri-arrow-down-s-line" style={{ fontSize: 13, color: 'var(--muted)', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 400,
          background: 'var(--bg)', border: '1px solid var(--line)',
          borderRadius: 12, boxShadow: 'var(--shadow)', padding: '14px',
          width: 256, fontFamily: 'inherit',
        }}>
          {/* Month / Year nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button onClick={prevMonth} style={navBtn}><i className="ri-arrow-left-s-line" /></button>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} style={navBtn}><i className="ri-arrow-right-s-line" /></button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {WEEKDAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--muted)', padding: '2px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = iso === value;
              const isToday = iso === todayISO;
              return (
                <button
                  key={iso}
                  onClick={() => selectDay(day)}
                  style={{
                    height: 32, borderRadius: 7, border: 'none',
                    outline: isToday && !isSelected ? '1.5px solid var(--brand)' : 'none',
                    outlineOffset: -1,
                    background: isSelected ? 'var(--brand)' : isToday ? 'var(--brand-light)' : 'transparent',
                    color: isSelected ? '#fff' : isToday ? 'var(--brand)' : 'var(--ink)',
                    fontSize: 13, fontWeight: isSelected || isToday ? 700 : 400,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background .15s',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Heute shortcut */}
          <div style={{ marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <button
              onClick={() => { onChange(todayISO); setOpen(false); }}
              style={{
                width: '100%', padding: '7px', borderRadius: 8,
                border: '1px solid var(--line)', background: 'transparent',
                color: 'var(--brand)', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              <i className="ri-focus-3-line" style={{ fontSize: 13 }} />
              Heute
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;

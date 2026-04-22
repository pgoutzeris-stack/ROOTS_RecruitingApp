import { memo, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { theme } from '../theme';
import { getSections } from '../data/sections';

const parseMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const GlobalTimer = memo(({ isZweit }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef(null);

  const totalTargetMinutes = useMemo(() => {
    const sections = getSections(isZweit);
    return sections.reduce((sum, s) => sum + parseMinutes(s.time), 0);
  }, [isZweit]);

  const targetSeconds = totalTargetMinutes * 60;

  const startPause = useCallback(() => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setStarted(true);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStarted(false);
    setElapsedSeconds(0);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const isOvertime = elapsedSeconds > targetSeconds;
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const display = `${mins}:${secs.toString().padStart(2, '0')}`;
  const diff = elapsedSeconds - targetSeconds;
  const absDiff = Math.abs(diff);
  const diffMins = Math.floor(absDiff / 60);
  const diffSecs = absDiff % 60;

  const iconStyle = { fontSize: 12, pointerEvents: 'none' };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 10,
        background: isOvertime ? 'rgba(220,38,38,0.06)' : 'var(--brand-light)',
        border: `1px solid ${isOvertime ? 'rgba(220,38,38,0.2)' : 'rgba(32,110,251,0.2)'}`,
        transition: `all ${theme.transition.normal}`,
        fontFamily: 'inherit',
      }}
      className="no-print"
    >
      <i className="ri-timer-line" style={{ fontSize: 14, color: isOvertime ? '#dc2626' : 'var(--brand)' }} />

      <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
        Gesamt
      </span>

      <span style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 15,
        fontWeight: 700,
        color: isOvertime ? '#dc2626' : 'var(--brand)',
        minWidth: 52,
        textAlign: 'center',
        letterSpacing: '0.04em',
      }}>
        {started ? display : '0:00'}
      </span>

      <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
        / {totalTargetMinutes} Min.
      </span>

      {started && (
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'Courier New', Courier, monospace",
          color: isOvertime ? '#dc2626' : '#10b981',
          padding: '2px 6px',
          borderRadius: 5,
          background: isOvertime ? 'rgba(220,38,38,0.08)' : 'rgba(16,185,129,0.08)',
          letterSpacing: '0.04em',
        }}>
          {diff <= 0
            ? `-${diffMins}:${diffSecs.toString().padStart(2, '0')}`
            : `+${diffMins}:${diffSecs.toString().padStart(2, '0')}`}
        </span>
      )}

      {/* Start/Pause */}
      <button
        onClick={startPause}
        style={{
          width: 28, height: 28, borderRadius: 7,
          border: `1px solid ${theme.colors.border.glass}`,
          background: isRunning ? 'rgba(245,158,11,0.08)' : 'var(--brand-light)',
          color: isRunning ? '#B45309' : 'var(--brand)',
          cursor: 'pointer', fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}
        title={isRunning ? 'Pause' : 'Start'}
      >
        <i className={isRunning ? 'ri-pause-fill' : 'ri-play-fill'} style={iconStyle} />
      </button>

      {/* Reset */}
      {started && (
        <button
          onClick={reset}
          style={{
            width: 28, height: 28, borderRadius: 7,
            border: `1px solid ${theme.colors.border.glass}`,
            background: 'var(--status-bg)',
            color: 'var(--muted)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}
          title="Reset"
        >
          <i className="ri-restart-line" style={iconStyle} />
        </button>
      )}
    </div>
  );
});

GlobalTimer.displayName = 'GlobalTimer';
export default GlobalTimer;

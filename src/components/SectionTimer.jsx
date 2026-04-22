import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { theme } from '../theme';

const parseDefaultMinutes = (timeStr) => {
  if (!timeStr) return 5;
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
};

/* Shared pill style matching header buttons */
const pillBtn = {
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,
  fontFamily: 'inherit',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  whiteSpace: 'nowrap',
  transition: 'all .15s',
};

const SectionTimer = memo(({ sectionId, timeStr, timerMinutes, dispatch, setTimer }) => {
  const defaultMin = parseDefaultMinutes(timeStr);
  const configuredMin = timerMinutes?.[sectionId] ?? defaultMin;

  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(configuredMin * 60);
  const [isEditing, setIsEditing] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef(null);
  const prevConfiguredMin = useRef(configuredMin);

  if (prevConfiguredMin.current !== configuredMin) {
    prevConfiguredMin.current = configuredMin;
    if (!started) setRemainingSeconds(configuredMin * 60);
  }

  const startPause = useCallback(() => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setStarted(true);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStarted(false);
    setRemainingSeconds(configuredMin * 60);
  }, [configuredMin]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const isOvertime = remainingSeconds < 0;
  const absSeconds = Math.abs(remainingSeconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  const display = `${isOvertime ? '-' : ''}${mins}:${secs.toString().padStart(2, '0')}`;

  const handleMinutesChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0 && val <= 120) {
      dispatch(setTimer(sectionId, val));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* "Ziel X Min." – brand pill badge */}
      <span style={{
        ...pillBtn,
        padding: '4px 10px',
        background: 'var(--brand-light)',
        border: '1px solid rgba(32,110,251,0.2)',
        color: 'var(--brand)',
        cursor: 'default',
      }}>
        <i className="ri-time-line" style={{ fontSize: 12, pointerEvents: 'none' }} />
        {configuredMin} Min.
      </span>

      {/* "bearbeiten" – muted pill button (before start) */}
      {!started && (
        isEditing ? (
          <input
            type="number"
            min={1}
            max={120}
            value={configuredMin}
            onChange={handleMinutesChange}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            style={{
              width: 52, height: 28, textAlign: 'center',
              background: 'var(--status-bg)',
              border: '1px solid rgba(32,110,251,0.4)',
              borderRadius: 999,
              color: 'var(--ink)',
              fontSize: 12,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            title="Minuten anpassen"
            style={{
              ...pillBtn,
              padding: '4px 10px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
            }}
          >
            <i className="ri-edit-line" style={{ fontSize: 12, pointerEvents: 'none' }} />
            bearbeiten
          </button>
        )
      )}

      {/* Timer display */}
      {started && (
        <span style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 13,
          fontWeight: 700,
          color: isOvertime ? '#dc2626' : (remainingSeconds <= 60 && isRunning ? '#B45309' : 'var(--ink)'),
          minWidth: 50,
          textAlign: 'center',
          letterSpacing: '0.05em',
          textShadow: isOvertime ? '0 0 8px rgba(220,38,38,0.4)' : 'none',
          transition: `color ${theme.transition.fast}`,
        }}>
          {display}
        </span>
      )}

      {/* Start/Pause */}
      <button
        onClick={startPause}
        style={{
          width: 28, height: 28, borderRadius: 999,
          border: `1px solid ${isRunning ? 'rgba(245,158,11,0.3)' : 'rgba(32,110,251,0.2)'}`,
          background: isRunning ? 'rgba(245,158,11,0.08)' : 'var(--brand-light)',
          color: isRunning ? '#B45309' : 'var(--brand)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, transition: `all ${theme.transition.fast}`,
        }}
        title={isRunning ? 'Pause' : 'Start'}
      >
        <i className={isRunning ? 'ri-pause-fill' : 'ri-play-fill'} style={{ fontSize: 13, pointerEvents: 'none' }} />
      </button>

      {/* Reset */}
      {started && (
        <button
          onClick={reset}
          style={{
            width: 28, height: 28, borderRadius: 999,
            border: '1px solid var(--line)',
            background: 'var(--bg)',
            color: 'var(--muted)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, transition: `all ${theme.transition.fast}`,
          }}
          title="Reset"
        >
          <i className="ri-restart-line" style={{ fontSize: 13, pointerEvents: 'none' }} />
        </button>
      )}
    </div>
  );
});

SectionTimer.displayName = 'SectionTimer';
export default SectionTimer;

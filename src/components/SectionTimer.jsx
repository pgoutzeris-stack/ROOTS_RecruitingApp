import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { theme } from '../theme';

const parseDefaultMinutes = (timeStr) => {
  if (!timeStr) return 5;
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
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

  const iconStyle = { fontSize: 13, pointerEvents: 'none' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
      {/* Target time badge */}
      <span style={{
        fontSize: 11, color: 'var(--muted)', fontFamily: 'inherit',
        padding: '2px 8px', borderRadius: 6, background: 'var(--status-bg)',
        border: '1px solid var(--line)', whiteSpace: 'nowrap',
      }}>
        Ziel: {configuredMin} Min.
      </span>

      {/* Edit minutes (before start) */}
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
              width: 46, height: 26, textAlign: 'center',
              background: 'var(--status-bg)',
              border: '1px solid rgba(32,110,251,0.4)',
              borderRadius: 6,
              color: 'var(--ink)',
              fontSize: 12,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            title="Klicken zum Ändern"
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 6, border: 'none',
              background: 'transparent', cursor: 'pointer',
              color: 'var(--brand)', fontSize: 11, fontFamily: 'inherit',
            }}
          >
            <i className="ri-edit-line" style={{ fontSize: 12 }} />
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

      {/* Start/Pause button */}
      <button
        onClick={startPause}
        style={{
          width: 28, height: 28, borderRadius: 7,
          border: `1px solid ${theme.colors.border.glass}`,
          background: isRunning ? 'rgba(245,158,11,0.08)' : 'var(--brand-light)',
          color: isRunning ? '#B45309' : 'var(--brand)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, transition: `all ${theme.transition.fast}`,
        }}
        title={isRunning ? 'Pause' : 'Start'}
      >
        <i className={isRunning ? 'ri-pause-fill' : 'ri-play-fill'} style={iconStyle} />
      </button>

      {/* Reset button */}
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
            padding: 0, transition: `all ${theme.transition.fast}`,
          }}
          title="Reset"
        >
          <i className="ri-restart-line" style={iconStyle} />
        </button>
      )}
    </div>
  );
});

SectionTimer.displayName = 'SectionTimer';
export default SectionTimer;

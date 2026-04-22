import { memo, useCallback, useState } from 'react';
import { theme } from '../theme';
import { actions } from '../hooks/useInterviewState';

const Header = memo(({ erst, canSwitchToZweit, dispatch, onExportJson, onOpenDashboard, onReset, onOpenSettings }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const meta = erst.meta;

  const handleRoundChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (value === 'zweit' && !canSwitchToZweit) return;
      dispatch(actions.setMeta('runde', value));
    },
    [dispatch, canSwitchToZweit],
  );

  const handleMetaChange = useCallback(
    (field) => (e) => dispatch(actions.setMeta(field, e.target.value)),
    [dispatch],
  );

  const metaFields = [
    { key: 'kandidat', label: 'Kandidat:in', type: 'text', width: 180 },
    { key: 'interviewer', label: 'Interviewer:in', type: 'text', width: 180 },
    { key: 'datum', label: 'Datum', type: 'date', width: 160 },
  ];

  const btnStyle = {
    padding: '8px 18px',
    borderRadius: 999,
    border: `1px solid ${theme.colors.border.glass}`,
    fontSize: theme.font.sm,
    fontWeight: 500,
    background: theme.colors.bg.base,
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    transition: 'all .2s',
  };

  const iconBtnStyle = {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${theme.colors.border.glass}`,
    background: 'transparent',
    color: theme.colors.text.muted,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
  };

  const actionBtnStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    color: 'var(--ink)',
    borderRadius: 999,
    padding: '.55rem 1rem',
    fontSize: '.88rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const sepStyle = { width: 1, height: 22, background: 'var(--line)', margin: '0 4px', flexShrink: 0 };

  return (
    <header
      style={{
        background: 'var(--bg)',
        color: 'var(--ink)',
        padding: '.75rem 1.25rem .6rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        margin: '1rem 1rem 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, gap: 14 }}>
      {/* LEFT: logo + wordmark + divider + subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.3"/>
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          ROOTS <span style={{ color: 'var(--brand)' }}>Recruiting</span>
        </span>
        <div style={{ width: 1, height: 16, background: 'var(--line)', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Junior Marketing Consultant · Strukturiertes Interview
        </span>
      </div>

      {/* RIGHT: actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }} className="no-print">
        {/* Runde */}
        <select
          value={meta.runde}
          onChange={handleRoundChange}
          style={{
            ...actionBtnStyle,
            appearance: 'none',
            WebkitAppearance: 'none',
            paddingRight: 28,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23475569' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
          aria-label="Gesprächsrunde"
        >
          <option value="erst">Erstgespräch</option>
          <option value="zweit" disabled={!canSwitchToZweit}>
            {canSwitchToZweit ? 'Zweitgespräch' : 'Zweitgespräch (gesperrt)'}
          </option>
        </select>

        <div style={sepStyle} />

        <button onClick={onOpenSettings} style={actionBtnStyle} title="Einstellungen">
          <i className="ri-settings-3-line" />
          Einstellungen
        </button>

        <button onClick={onExportJson} style={actionBtnStyle} title="JSON exportieren">
          <i className="ri-download-2-line" />
          Export
        </button>

        <button
          onClick={() => window.print()}
          style={{ ...actionBtnStyle, background: 'var(--brand)', border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(32,110,251,0.3)' }}
          title="PDF drucken"
        >
          <i className="ri-printer-line" />
          Drucken
        </button>

        <button
          onClick={onOpenDashboard}
          style={{ ...actionBtnStyle, background: 'var(--brand-light)', borderColor: 'rgba(32,110,251,0.2)', color: 'var(--brand)' }}
          title="Dashboard"
        >
          <i className="ri-dashboard-line" />
          Dashboard
        </button>

        <div style={sepStyle} />

        {showResetConfirm ? (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: theme.font.xs, color: 'var(--danger)' }}>Reset?</span>
            <button onClick={() => { onReset(); setShowResetConfirm(false); }} style={{ ...actionBtnStyle, borderColor: 'rgba(220,38,38,0.3)', color: 'var(--danger)', padding: '5px 10px' }}>Ja</button>
            <button onClick={() => setShowResetConfirm(false)} style={{ ...actionBtnStyle, padding: '5px 10px' }}>Nein</button>
          </div>
        ) : (
          <button onClick={() => setShowResetConfirm(true)} style={actionBtnStyle} title="Zurücksetzen">
            <i className="ri-refresh-line" />
          </button>
        )}
      </div>
      </div>

      {/* META FIELDS ROW */}
      <div style={{ display: 'flex', gap: 16, paddingTop: '.6rem', borderTop: '1px solid var(--line)', marginTop: '.6rem' }} className="no-print">
        {metaFields.map(({ key, label, type, width }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              {label}
            </label>
            <input
              type={type}
              value={meta[key]}
              onChange={handleMetaChange(key)}
              placeholder={type === 'date' ? '' : 'Eingabe...'}
              aria-label={label}
              style={{
                padding: '6px 10px', borderRadius: 8,
                border: '1px solid var(--line)',
                background: 'var(--status-bg)', color: 'var(--ink)',
                fontSize: 13, fontWeight: 500, width,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
        ))}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;

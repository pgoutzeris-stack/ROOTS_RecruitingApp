import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { theme } from '../theme';
import { actions } from '../hooks/useInterviewState';

const Header = memo(({ erst, canSwitchToZweit, dispatch, onExportJson, onOpenDashboard, onReset, onOpenSettings }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [roundMenuOpen, setRoundMenuOpen] = useState(false);
  const roundMenuRef = useRef(null);
  const meta = erst.meta;

  useEffect(() => {
    const handler = (e) => {
      if (roundMenuRef.current && !roundMenuRef.current.contains(e.target)) {
        setRoundMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMetaChange = useCallback(
    (field) => (e) => dispatch(actions.setMeta(field, e.target.value)),
    [dispatch],
  );

  const formatDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}.${m}.${y}`;
  };

  const metaFields = [
    { key: 'kandidat', label: 'Kandidat:in', type: 'text', width: 180 },
    { key: 'interviewer', label: 'Interviewer:in', type: 'text', width: 180 },
    { key: 'datum', label: 'Datum', type: 'date', width: 160 },
  ];

  /* Shared pill button used throughout header */
  const pillBtn = {
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    color: 'var(--ink)',
    borderRadius: 999,
    padding: '.5rem 1rem',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  };

  const sepStyle = { width: 1, height: 22, background: 'var(--line)', margin: '0 2px', flexShrink: 0 };

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
        fontFamily: 'inherit',
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
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }} className="no-print">

          {/* Custom dropdown: Runde */}
          <div ref={roundMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setRoundMenuOpen((p) => !p)}
              aria-haspopup="listbox"
              aria-expanded={roundMenuOpen}
              style={{ ...pillBtn }}
            >
              <i className={meta.runde === 'erst' ? 'ri-chat-1-line' : 'ri-chat-2-line'} style={{ fontSize: 14 }} />
              {meta.runde === 'erst' ? 'Erstgespräch' : 'Zweitgespräch'}
              <i className="ri-arrow-down-s-line" style={{ fontSize: 14, marginLeft: -2, transition: 'transform .2s', transform: roundMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {roundMenuOpen && (
              <div role="listbox" style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                background: 'var(--bg)', border: '1px solid var(--line)',
                borderRadius: 10, boxShadow: 'var(--shadow)',
                minWidth: '100%', zIndex: 200, overflow: 'hidden',
              }}>
                {[
                  { value: 'erst', label: 'Erstgespräch', icon: 'ri-chat-1-line' },
                  { value: 'zweit', label: 'Zweitgespräch', icon: 'ri-chat-2-line', disabled: !canSwitchToZweit },
                ].map(({ value, label, icon, disabled }) => (
                  <div
                    key={value}
                    role="option"
                    aria-selected={meta.runde === value}
                    onClick={() => {
                      if (!disabled) { dispatch(actions.setMeta('runde', value)); setRoundMenuOpen(false); }
                    }}
                    style={{
                      padding: '.55rem 1rem', fontSize: 13, fontFamily: 'inherit',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      color: disabled ? 'var(--muted)' : meta.runde === value ? 'var(--brand)' : 'var(--ink)',
                      background: meta.runde === value ? 'var(--brand-light)' : 'transparent',
                      opacity: disabled ? 0.5 : 1,
                      fontWeight: meta.runde === value ? 600 : 500,
                      transition: 'background .15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <i className={icon} style={{ fontSize: 14 }} />
                    {label}
                    {disabled && <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 2 }}>gesperrt</span>}
                    {meta.runde === value && <i className="ri-check-line" style={{ fontSize: 13, marginLeft: 'auto' }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={sepStyle} />

          <button onClick={onOpenSettings} style={pillBtn} title="Einstellungen">
            <i className="ri-settings-3-line" style={{ fontSize: 14 }} />
            Einstellungen
          </button>

          <button onClick={onExportJson} style={pillBtn} title="JSON exportieren">
            <i className="ri-download-2-line" style={{ fontSize: 14 }} />
            Export
          </button>

          <button
            onClick={() => window.print()}
            style={{ ...pillBtn, background: 'var(--brand)', border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(32,110,251,0.3)' }}
            title="PDF drucken"
          >
            <i className="ri-printer-line" style={{ fontSize: 14 }} />
            Drucken
          </button>

          <button
            onClick={onOpenDashboard}
            style={{ ...pillBtn, background: 'var(--brand-light)', borderColor: 'rgba(32,110,251,0.2)', color: 'var(--brand)' }}
            title="Dashboard"
          >
            <i className="ri-dashboard-line" style={{ fontSize: 14 }} />
            Dashboard
          </button>

          <div style={sepStyle} />

          {showResetConfirm ? (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--danger)', whiteSpace: 'nowrap' }}>Reset?</span>
              <button onClick={() => { onReset(); setShowResetConfirm(false); }} style={{ ...pillBtn, borderColor: 'rgba(220,38,38,0.3)', color: 'var(--danger)', padding: '5px 10px' }}>Ja</button>
              <button onClick={() => setShowResetConfirm(false)} style={{ ...pillBtn, padding: '5px 10px' }}>Nein</button>
            </div>
          ) : (
            <button onClick={() => setShowResetConfirm(true)} style={{ ...pillBtn, padding: '.5rem .6rem' }} title="Zurücksetzen">
              <i className="ri-refresh-line" style={{ fontSize: 14 }} />
            </button>
          )}
        </div>
      </div>

      {/* META FIELDS ROW */}
      <div style={{ display: 'flex', gap: 12, paddingTop: '.6rem', borderTop: '1px solid var(--line)', marginTop: '.6rem', flexWrap: 'wrap' }} className="no-print">
        {metaFields.map(({ key, label, type, width }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              {label}
            </label>
            {type === 'date' ? (
              /* Fully custom date display; hidden native input triggers the picker */
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width, height: 32 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 10px', height: '100%', width: '100%',
                  borderRadius: 8, border: '1px solid var(--line)',
                  background: 'var(--status-bg)', color: meta[key] ? 'var(--ink)' : 'var(--muted)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  userSelect: 'none', pointerEvents: 'none',
                }}>
                  <i className="ri-calendar-line" style={{ fontSize: 14, color: 'var(--muted)', flexShrink: 0 }} />
                  <span>{meta[key] ? formatDate(meta[key]) : 'TT.MM.JJJJ'}</span>
                </div>
                <input
                  type="date"
                  value={meta[key]}
                  onChange={handleMetaChange(key)}
                  aria-label={label}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer',
                    border: 'none', background: 'transparent',
                  }}
                />
              </div>
            ) : (
              <input
                type={type}
                value={meta[key]}
                onChange={handleMetaChange(key)}
                placeholder="Eingabe..."
                aria-label={label}
                style={{
                  padding: '6px 10px', borderRadius: 8,
                  border: '1px solid var(--line)',
                  background: 'var(--status-bg)', color: 'var(--ink)',
                  fontSize: 13, fontWeight: 500, width,
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;

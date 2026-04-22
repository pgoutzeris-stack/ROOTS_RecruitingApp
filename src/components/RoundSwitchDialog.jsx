import { memo } from 'react';
import { theme, glassElevated } from '../theme';

const RoundSwitchDialog = memo(({ onConfirm, onCancel }) => (
  <div onClick={onCancel} role="dialog" aria-modal="true" aria-label="Rundenwechsel bestätigen"
    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
    <div onClick={(e) => e.stopPropagation()} style={{ ...glassElevated, padding: 32, maxWidth: 440, width: '90%', boxShadow: theme.shadow.elevated }}>
      <div style={{ width: 48, height: 48, borderRadius: theme.radius.md, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: theme.spacing.md, color: 'var(--brand)' }}>
        &#8644;
      </div>
      <div style={{ fontSize: theme.font.xl, fontWeight: 700, marginBottom: theme.spacing.sm, color: theme.colors.text.primary }}>
        Zum Zweitgespräch wechseln?
      </div>
      <div style={{ fontSize: theme.font.md, color: theme.colors.text.secondary, lineHeight: 1.7, marginBottom: theme.spacing.lg }}>
        Die Ansicht wechselt zum Zweitgespräch. Ist das Erstgespräch abgeschlossen? Bewertungen und Notizen bleiben erhalten.
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '10px 22px', borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border.glass}`, background: theme.colors.bg.muted, color: theme.colors.text.secondary, fontSize: theme.font.md, fontWeight: 600, cursor: 'pointer', transition: `all ${theme.transition.fast}` }}>
          Abbrechen
        </button>
        <button onClick={onConfirm} style={{ padding: '10px 22px', borderRadius: theme.radius.md, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: theme.font.md, fontWeight: 600, cursor: 'pointer', transition: `all ${theme.transition.fast}`, boxShadow: '0 4px 12px rgba(32,110,251,0.3)' }}>
          Ja, wechseln
        </button>
      </div>
    </div>
  </div>
));

RoundSwitchDialog.displayName = 'RoundSwitchDialog';
export default RoundSwitchDialog;

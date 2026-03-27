import { memo } from 'react';
import { theme, shared } from '../theme';
import { makeOutroErst, OUTRO_ZWEIT } from '../data/templates';
import { actions } from '../hooks/useInterviewState';

const ABSCHLUSS_FIELDS = ['Erwartungen 12 Mon.', 'Arbeitsaufwand', 'Reisetätigkeit', 'Home Office', 'Einstiegsdatum', 'Gehaltswunsch'];

const OutroBlock = memo(({ isZweit, kandidat, abschlussNotes, dispatch }) => (
  <div style={{ ...shared.card, marginBottom: theme.spacing.sm + 4 }}>
    <div style={{ fontSize: theme.font.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.colors.text.muted, marginBottom: theme.spacing.sm }}>
      Abschlusstext
    </div>
    <div style={{ whiteSpace: 'pre-wrap', fontSize: theme.font.body, lineHeight: 1.8, color: theme.colors.text.secondary }}>
      {isZweit ? OUTRO_ZWEIT : makeOutroErst(kandidat)}
    </div>
    {!isZweit && (
      <div style={{ marginTop: theme.spacing.lg, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm + 4, padding: theme.spacing.md, background: 'rgba(255,255,255,0.02)', borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border.subtle}` }}>
        {ABSCHLUSS_FIELDS.map((field) => (
          <div key={field}>
            <div style={{ fontSize: theme.font.xs, fontWeight: 600, color: theme.colors.text.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{field}</div>
            <textarea rows={1} value={abschlussNotes[field] || ''} onChange={(e) => dispatch(actions.setAbschlussNote(field, e.target.value))} style={{ ...shared.dashedInput, padding: '8px 12px', fontSize: theme.font.sm }} />
          </div>
        ))}
      </div>
    )}
  </div>
));

OutroBlock.displayName = 'OutroBlock';
export default OutroBlock;

import { memo } from 'react';
import { theme, shared } from '../theme';
import { RTI_TEXT } from '../data/templates';
import { actions } from '../hooks/useInterviewState';

const RTIBlock = memo(({ rtiDone, rtiGreyed, isZweit, erst, zweit, dispatch }) => (
  <div style={{ ...shared.card, background: rtiDone || rtiGreyed ? 'rgba(255,255,255,0.02)' : theme.colors.bg.card, opacity: rtiGreyed ? 0.45 : 1, transition: `opacity ${theme.transition.normal}` }}>
    {rtiGreyed && (
      <div style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginBottom: theme.spacing.sm, fontStyle: 'italic' }}>
        <span style={{ color: theme.colors.success.badge }}>&#10003;</span> Im Erstgespräch besprochen
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: theme.spacing.sm }}>
      <input type="checkbox" checked={isZweit ? zweit.rtiDone : erst.rtiDone} onChange={() => dispatch(actions.toggleRti())} style={shared.checkbox} />
      <span style={{ fontSize: theme.font.md, fontWeight: 600, color: theme.colors.text.primary }}>Realistische Tätigkeitsinformation vorgelesen</span>
    </div>
    <div style={{ whiteSpace: 'pre-wrap', fontSize: theme.font.body, lineHeight: 1.8, color: theme.colors.text.secondary, paddingLeft: 28 }}>
      {RTI_TEXT}
    </div>
  </div>
));

RTIBlock.displayName = 'RTIBlock';
export default RTIBlock;

import { memo } from 'react';
import { theme, shared } from '../theme';
import { ROOTS_TEXT } from '../data/templates';

const RootsBlock = memo(() => (
  <div style={shared.card}>
    <div style={{ fontSize: theme.font.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand)', marginBottom: theme.spacing.sm }}>
      Intro Deck – Kernpunkte
    </div>
    <div style={{ whiteSpace: 'pre-wrap', fontSize: theme.font.body, lineHeight: 1.8, color: theme.colors.text.secondary }}>
      {ROOTS_TEXT}
    </div>
  </div>
));

RootsBlock.displayName = 'RootsBlock';
export default RootsBlock;

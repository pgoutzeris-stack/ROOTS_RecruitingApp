import { memo } from 'react';
import { DIMENSIONS, DIMENSION_COLORS } from '../data/dimensions';
import { theme } from '../theme';

const Badge = memo(({ dimension }) => {
  const color = DIMENSION_COLORS[dimension];
  return (
    <span
      style={{
        fontSize: theme.font.xs,
        fontWeight: 600,
        background: `${color}15`,
        color,
        padding: '3px 10px',
        borderRadius: theme.radius.full,
        border: `1px solid ${color}30`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        textShadow: `0 0 12px ${color}40`,
      }}
    >
      {DIMENSIONS[dimension]}
    </span>
  );
});

Badge.displayName = 'Badge';
export default Badge;

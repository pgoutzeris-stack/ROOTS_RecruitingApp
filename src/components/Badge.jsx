import { memo } from 'react';
import { DIMENSIONS, DIMENSION_COLORS } from '../data/dimensions';
import { theme } from '../theme';

const RATING_COLORS = {
  1: '#DC2626',
  2: '#EA580C',
  3: '#D97706',
  4: '#059669',
  5: '#10b981',
};

const Badge = memo(({ dimension, rating }) => {
  const color = rating != null ? RATING_COLORS[rating] : DIMENSION_COLORS[dimension];
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
        transition: 'color .2s, background .2s, border-color .2s',
      }}
    >
      {DIMENSIONS[dimension]}
    </span>
  );
});

Badge.displayName = 'Badge';
export default Badge;

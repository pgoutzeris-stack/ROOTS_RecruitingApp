import { memo, useState, useCallback } from 'react';
import { DIMENSION_COLORS } from '../data/dimensions';
import { theme } from '../theme';
import Badge from './Badge';

const EvalRow = memo(({ evaluation, rating, erstRating, onRate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const color = DIMENSION_COLORS[evaluation.dimension];
  const displayRating = rating != null ? rating : erstRating;
  const isInherited = rating == null && erstRating != null;

  const handleKeyDown = useCallback(
    (e) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) { e.preventDefault(); onRate(num); }
    },
    [onRate],
  );

  return (
    <div
      style={{
        marginTop: theme.spacing.sm,
        border: `1px solid ${theme.colors.border.glass}`,
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        background: theme.colors.bg.elevated,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: theme.shadow.card,
        transition: `all ${theme.transition.fast}`,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label={`Bewertung: ${evaluation.label}`}
    >
      <div
        onClick={() => setIsOpen((p) => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ fontSize: 10, color: theme.colors.text.muted, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: `transform ${theme.transition.fast}`, flexShrink: 0 }} aria-hidden="true">
          &#9654;
        </span>
        <span style={{ fontSize: theme.font.body, fontWeight: 600, flex: 1, color: theme.colors.text.primary }}>{evaluation.label}</span>
        <Badge dimension={evaluation.dimension} />
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 6 }}>
          {isInherited && (
            <span style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginRight: 4, fontWeight: 500, padding: '2px 8px', borderRadius: theme.radius.sm, background: 'rgba(255,255,255,0.04)', border: `1px solid ${theme.colors.border.glass}` }}>
              EG
            </span>
          )}
          {[1, 2, 3, 4, 5].map((n) => {
            const isActive = displayRating === n;
            return (
              <button
                key={n}
                onClick={(e) => { e.stopPropagation(); onRate(n); }}
                aria-label={`Bewertung ${n}`}
                aria-pressed={isActive}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: theme.radius.sm,
                  border: isActive ? `2px solid ${color}` : `1px solid ${theme.colors.border.glass}`,
                  background: isActive ? `${color}25` : 'rgba(255,255,255,0.02)',
                  fontSize: theme.font.body,
                  fontWeight: 700,
                  color: isActive ? color : theme.colors.text.muted,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: isInherited && !isActive ? 0.35 : 1,
                  transition: `all ${theme.transition.fast}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? `0 0 12px ${color}30` : 'none',
                  textShadow: isActive ? `0 0 8px ${color}50` : 'none',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${theme.colors.border.subtle}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '10px 14px', paddingTop: 14, fontSize: theme.font.sm, lineHeight: 1.7, color: theme.colors.text.secondary }}>
            {[
              { num: 1, text: evaluation.anchor1, color: theme.colors.danger.text, bg: theme.colors.danger.bg },
              { num: 3, text: evaluation.anchor3, color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.08)' },
              { num: 5, text: evaluation.anchor5, color: theme.colors.success.text, bg: theme.colors.success.bg },
            ].map(({ num, text, color: c, bg }) => (
              <>
                <span key={`n${num}`} style={{ fontWeight: 700, color: c, fontSize: theme.font.body, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, borderRadius: theme.radius.sm, height: 30 }}>
                  {num}
                </span>
                <span key={`t${num}`} style={{ paddingTop: 5 }}>{text}</span>
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

EvalRow.displayName = 'EvalRow';
export default EvalRow;

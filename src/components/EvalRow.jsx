import { memo, useState, useCallback } from 'react';
import { DIMENSION_COLORS } from '../data/dimensions';
import { theme } from '../theme';
import Badge from './Badge';

const EvalRow = memo(({ evaluation, rating, erstRating, onRate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const color = DIMENSION_COLORS[evaluation.dimension];
  const displayRating = rating != null ? rating : erstRating;
  const isInherited = rating == null && erstRating != null;
  const hasAnchors = evaluation.anchor1 || evaluation.anchor3 || evaluation.anchor5;

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) { e.preventDefault(); onRate(num); }
    },
    [onRate, isOpen],
  );

  return (
    <div
      style={{
        marginTop: theme.spacing.sm,
        border: `1px solid ${theme.colors.border.glass}`,
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        background: theme.colors.bg.card,
        boxShadow: theme.shadow.card,
        transition: `all ${theme.transition.fast}`,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label={`Bewertung: ${evaluation.label}`}
    >
      {/* Collapsed header */}
      <div
        onClick={() => setIsOpen((p) => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ fontSize: 10, color: theme.colors.text.muted, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: `transform ${theme.transition.fast}`, flexShrink: 0 }} aria-hidden="true">
          &#9654;
        </span>
        <span style={{ fontSize: theme.font.body, fontWeight: 600, flex: 1, color: theme.colors.text.primary }}>{evaluation.label}</span>
        <Badge dimension={evaluation.dimension} />
        {!isOpen && displayRating != null && (
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: theme.radius.sm,
            border: `2px solid ${color}`, background: `${color}15`,
            fontSize: theme.font.body, fontWeight: 700, color,
          }}>
            {displayRating}
          </span>
        )}
        {!isOpen && isInherited && displayRating != null && (
          <span style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, fontWeight: 500, padding: '2px 6px', borderRadius: theme.radius.sm, background: theme.colors.bg.muted, border: `1px solid ${theme.colors.border.glass}` }}>
            EG
          </span>
        )}
      </div>

      {/* Expanded: rating buttons + anchors */}
      {isOpen && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${'var(--line)'}` }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', paddingTop: 14, paddingBottom: hasAnchors ? 14 : 0 }}>
            {isInherited && (
              <span style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginRight: 4, fontWeight: 500, padding: '2px 8px', borderRadius: theme.radius.sm, background: theme.colors.bg.muted, border: `1px solid ${theme.colors.border.glass}` }}>
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
                    width: 40, height: 40, borderRadius: theme.radius.sm,
                    border: isActive ? `2px solid ${color}` : `1px solid ${theme.colors.border.glass}`,
                    background: isActive ? `${color}15` : theme.colors.bg.muted,
                    fontSize: theme.font.md, fontWeight: 700,
                    color: isActive ? color : theme.colors.text.muted,
                    cursor: 'pointer', padding: 0,
                    opacity: isInherited && !isActive ? 0.35 : 1,
                    transition: `all ${theme.transition.fast}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? `0 0 8px ${color}20` : 'none',
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {hasAnchors && (
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '10px 14px', paddingTop: 10, fontSize: theme.font.sm, lineHeight: 1.7, color: theme.colors.text.secondary, borderTop: `1px solid ${'var(--line)'}` }}>
              {[
                { num: 1, text: evaluation.anchor1, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.06)' },
                { num: 3, text: evaluation.anchor3, color: '#B45309', bg: 'rgba(245, 158, 11, 0.06)' },
                { num: 5, text: evaluation.anchor5, color: '#16A34A', bg: 'rgba(34, 197, 94, 0.06)' },
              ].filter(a => a.text).map(({ num, text, color: c, bg }) => (
                <>
                  <span key={`n${num}`} style={{ fontWeight: 700, color: c, fontSize: theme.font.body, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, borderRadius: theme.radius.sm, height: 30 }}>
                    {num}
                  </span>
                  <span key={`t${num}`} style={{ paddingTop: 5 }}>{text}</span>
                </>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

EvalRow.displayName = 'EvalRow';
export default EvalRow;

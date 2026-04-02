import { memo } from 'react';
import { SECTIONS_ERST } from '../data/sections';
import { DIMENSIONS, DIMENSION_COLORS } from '../data/dimensions';
import { theme } from '../theme';

/**
 * Read-only overlay showing the filled Erstgespräch script.
 * Displayed in Zweitgespräch so the interviewer can reference prior data.
 */
const ErstScriptViewer = memo(({ erst, onClose }) => {
  const ratings = erst.ratings || {};
  const notes = erst.notes || {};
  const cultureFitAnswers = erst.cultureFitAnswers || {};

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '40px 20px', overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: theme.radius.xl, maxWidth: 780, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', padding: theme.spacing.xl,
        maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, borderBottom: `1px solid ${theme.colors.border.strong}`, paddingBottom: theme.spacing.md }}>
          <div>
            <div style={{ fontSize: theme.font.xl, fontWeight: 800, color: theme.colors.text.primary }}>
              Erstgespräch – Befülltes Skript
            </div>
            <div style={{ fontSize: theme.font.sm, color: theme.colors.text.muted, marginTop: 4 }}>
              {erst.meta?.kandidat || 'Unbenannt'} &middot; {erst.meta?.datum || '–'} &middot; Interviewer: {erst.meta?.interviewer || '–'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.border.glass}`,
              background: theme.colors.bg.muted, cursor: 'pointer',
              fontSize: 18, color: theme.colors.text.secondary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>

        {/* Read-only badge */}
        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: theme.radius.full, background: theme.colors.info.bg, color: theme.colors.info.text, fontSize: theme.font.xs, fontWeight: 600, marginBottom: theme.spacing.lg, border: `1px solid ${theme.colors.info.border}` }}>
          Nur Ansicht (Read-only)
        </div>

        {/* Sections */}
        {SECTIONS_ERST.map((section, idx) => {
          const hasContent = section.questions || section.type === 'culturefit';
          if (!hasContent && section.type !== 'script' && section.type !== 'roots' && section.type !== 'rti') return null;

          return (
            <div key={section.id} style={{ marginBottom: theme.spacing.lg }}>
              {/* Section header */}
              {section.main && (
                <div style={{ fontSize: theme.font.lg, fontWeight: 700, color: theme.colors.text.primary, marginBottom: theme.spacing.sm, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ color: theme.colors.accent.indigo, fontWeight: 800 }}>{idx + 1}.</span>
                  {section.main}
                  {section.time && <span style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, fontWeight: 400 }}>({section.time})</span>}
                </div>
              )}

              {/* Culture-Fit answers */}
              {section.type === 'culturefit' && section.cultureFitQuestions && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: theme.spacing.sm }}>
                  {section.cultureFitQuestions.map((q) => {
                    const ans = cultureFitAnswers[q.id];
                    return (
                      <span key={q.id} style={{
                        padding: '4px 10px', borderRadius: theme.radius.sm,
                        background: ans ? theme.colors.accent.indigoLight : theme.colors.bg.muted,
                        color: ans ? theme.colors.accent.indigo : theme.colors.text.muted,
                        fontSize: theme.font.xs, fontWeight: 500,
                        border: `1px solid ${ans ? theme.colors.accent.indigo + '30' : theme.colors.border.subtle}`,
                      }}>
                        {ans === 'A' ? q.optionA : ans === 'B' ? q.optionB : `${q.optionA} / ${q.optionB}`}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Block evaluation */}
              {section.blockEvaluation && (
                <div style={{ marginBottom: theme.spacing.sm }}>
                  {section.blockEvaluation.evaluations.map((ev, ei) => {
                    const r = (ratings[section.blockEvaluation.id] || {})[ei];
                    const color = DIMENSION_COLORS[ev.dimension];
                    return (
                      <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                        <span style={{ fontSize: theme.font.sm, color: theme.colors.text.secondary }}>{ev.label}:</span>
                        {r != null ? (
                          <span style={{ fontWeight: 700, color, fontSize: theme.font.md }}>{r}/5</span>
                        ) : (
                          <span style={{ fontSize: theme.font.sm, color: theme.colors.text.muted }}>–</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Questions */}
              {section.questions?.map((q) => {
                const note = notes[q.id];
                const qRatings = ratings[q.id] || {};
                const hasData = note || Object.keys(qRatings).length > 0;
                if (!hasData && !q.evaluations) return null;

                return (
                  <div key={q.id} style={{ padding: '10px 14px', marginBottom: 6, borderRadius: theme.radius.md, background: theme.colors.bg.surface, border: `1px solid ${theme.colors.border.subtle}` }}>
                    <div style={{ fontSize: theme.font.body, color: theme.colors.text.primary, lineHeight: 1.6, fontWeight: 450 }}>
                      {q.text}
                    </div>
                    {note && (
                      <div style={{ marginTop: 6, fontSize: theme.font.sm, color: theme.colors.text.secondary, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: note }} />
                    )}
                    {q.evaluations?.map((ev, ei) => {
                      const r = qRatings[ei];
                      if (r == null) return null;
                      const color = DIMENSION_COLORS[ev.dimension];
                      return (
                        <div key={ei} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4, marginRight: 12, padding: '2px 8px', borderRadius: theme.radius.sm, background: `${color}10`, border: `1px solid ${color}20` }}>
                          <span style={{ fontSize: theme.font.xs, color: theme.colors.text.secondary }}>{ev.label}</span>
                          <span style={{ fontWeight: 700, color, fontSize: theme.font.sm }}>{r}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Gesamteindruck */}
        {erst.gesamtNote && (
          <div style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, borderRadius: theme.radius.md, background: theme.colors.bg.surface, border: `1px solid ${theme.colors.border.subtle}` }}>
            <div style={{ fontSize: theme.font.sm, fontWeight: 700, color: theme.colors.text.muted, marginBottom: 4, textTransform: 'uppercase' }}>Gesamteindruck</div>
            <div style={{ fontSize: theme.font.body, color: theme.colors.text.primary, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{erst.gesamtNote}</div>
          </div>
        )}

        {/* Recommendation */}
        {erst.recommendation && (
          <div style={{ marginTop: theme.spacing.sm, display: 'inline-block', padding: '6px 16px', borderRadius: theme.radius.full, background: theme.colors.accent.indigoLight, color: theme.colors.accent.indigo, fontWeight: 700, fontSize: theme.font.sm }}>
            Empfehlung: {erst.recommendation}
          </div>
        )}
      </div>
    </div>
  );
});

ErstScriptViewer.displayName = 'ErstScriptViewer';
export default ErstScriptViewer;

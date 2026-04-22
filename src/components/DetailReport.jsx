import { memo, useMemo } from 'react';
import { theme, glassElevated } from '../theme';
import { getSections, SECTIONS_ERST } from '../data/sections';
import { DIMENSIONS, DIMENSION_COLORS } from '../data/dimensions';
import { calculateDimensionScores, calculateWeightedOverall, mergeRatings, DEFAULT_WEIGHTS } from '../utils/scoring';

const DetailReport = memo(({ data, onBack, onLoadCandidate }) => {
  const erst = useMemo(() => data.erst || {}, [data.erst]);
  const zweit = useMemo(() => data.zweit || {}, [data.zweit]);
  const meta = erst.meta || {};
  const isZweit = meta.runde === 'zweit';
  const hasZweit = isZweit;

  const scores = useMemo(() => {
    const effectiveRatings = isZweit ? mergeRatings(erst.ratings || {}, zweit.ratings || {}) : (erst.ratings || {});
    const s = calculateDimensionScores(effectiveRatings);
    const weights = (isZweit ? zweit.weights : erst.weights) || DEFAULT_WEIGHTS;
    s.weightedOverall = calculateWeightedOverall(s.averages, weights);
    return s;
  }, [erst, zweit, isZweit]);

  const erstRecommendation = erst.recommendation || 'Keine Empfehlung';
  const zweitRecommendation = zweit.recommendation || null;
  const canStartZweit = erst.recommendation === 'Zum Zweitgespräch einladen';

  const btnStyle = {
    padding: '8px 18px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border.glass}`,
    fontSize: theme.font.sm,
    fontWeight: 600,
    background: theme.colors.bg.muted,
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    transition: `all ${theme.transition.fast}`,
  };

  const sectionLabel = {
    fontSize: theme.font.xs,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
  };

  /** Render notes and ratings for one round */
  const renderRoundSummary = (state, label, roundIsZweit) => {
    if (!state) return null;
    const hasContent = state.gesamtNote || state.recommendation ||
      Object.values(state.notes || {}).some(Boolean) ||
      Object.keys(state.ratings || {}).length > 0 ||
      Object.keys(state.cultureFitAnswers || {}).length > 0 ||
      Object.values(state.abschlussNotes || {}).some(Boolean);
    if (!hasContent) return null;

    const roundSections = getSections(roundIsZweit);

    return (
      <div style={{ marginBottom: theme.spacing.xl }}>
        <div style={{
          fontSize: theme.font.lg, fontWeight: 700, color: 'var(--brand)',
          borderBottom: `1px solid ${'var(--line)'}`,
          paddingBottom: 8, marginBottom: theme.spacing.lg,
        }}>
          {label}
          {state.meta?.interviewer && (
            <span style={{ fontSize: theme.font.sm, fontWeight: 400, color: theme.colors.text.muted, marginLeft: 12 }}>
              Interviewer: {state.meta.interviewer}
            </span>
          )}
        </div>

        {/* Per-section notes */}
        {roundSections.map((section) => {
          if (!section.questions) return null;
          const sectionNotes = [];
          const sectionRatings = [];

          for (const q of section.questions) {
            const note = (state.notes || {})[q.id];
            if (note) sectionNotes.push({ question: q.text, note });
            if (q.evaluations) {
              for (let i = 0; i < q.evaluations.length; i++) {
                const rating = (state.ratings || {})[q.id]?.[i];
                if (rating != null) {
                  sectionRatings.push({
                    label: q.evaluations[i].label,
                    dimension: q.evaluations[i].dimension,
                    rating,
                  });
                }
              }
            }
          }

          if (sectionNotes.length === 0 && sectionRatings.length === 0) return null;

          return (
            <div key={section.id} style={{
              ...glassElevated,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm + 4,
            }}>
              <div style={{
                fontSize: theme.font.md, fontWeight: 700, color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                {section.main || section.sub}
              </div>

              {sectionRatings.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: sectionNotes.length > 0 ? theme.spacing.sm : 0 }}>
                  {sectionRatings.map((r, i) => {
                    const color = DIMENSION_COLORS[r.dimension] || 'var(--brand)';
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: theme.radius.sm,
                        background: `${color}0A`, border: `1px solid ${color}20`,
                        fontSize: theme.font.xs,
                      }}>
                        <span style={{ color: theme.colors.text.secondary }}>{r.label}</span>
                        <span style={{ fontWeight: 800, color, fontFamily: theme.fontMono }}>{r.rating}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {sectionNotes.map((n, i) => (
                <div key={i} style={{ marginTop: i > 0 ? theme.spacing.sm : 0 }}>
                  <div style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginBottom: 2 }}>
                    {n.question.length > 80 ? n.question.slice(0, 80) + '...' : n.question}
                  </div>
                  <div
                    className="rich-note-content"
                    style={{
                      fontSize: theme.font.body, color: theme.colors.text.primary,
                      lineHeight: 1.6,
                      padding: '8px 12px', borderRadius: theme.radius.sm,
                      background: 'var(--status-bg)',
                      border: `1px solid ${'var(--line)'}`,
                    }}
                    dangerouslySetInnerHTML={{ __html: n.note }}
                  />
                </div>
              ))}
            </div>
          );
        })}

        {/* Gesamteindruck */}
        {state.gesamtNote && (
          <div style={{ ...glassElevated, padding: theme.spacing.md, marginBottom: theme.spacing.sm + 4 }}>
            <div style={sectionLabel}>Gesamteindruck</div>
            <div style={{
              fontSize: theme.font.body, color: theme.colors.text.primary,
              lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {state.gesamtNote}
            </div>
          </div>
        )}

        {/* Zweit-Anmerkungen (only in Erst) */}
        {state.zweitAnmerkung && label.includes('Erst') && (
          <div style={{
            background: theme.colors.warning.bg,
            border: `1px solid ${theme.colors.warning.border}`,
            borderRadius: theme.radius.lg, padding: theme.spacing.md, marginTop: theme.spacing.sm + 4,
          }}>
            <div style={sectionLabel}>Anmerkungen für Zweitinterviewer</div>
            <div style={{ fontSize: theme.font.body, color: theme.colors.warning.textDark, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {state.zweitAnmerkung}
            </div>
          </div>
        )}

        {/* Culture-Fit answers */}
        {Object.keys(state.cultureFitAnswers || {}).length > 0 && (
          <div style={{ ...glassElevated, padding: theme.spacing.md, marginTop: theme.spacing.sm + 4 }}>
            <div style={sectionLabel}>Culture-Fit Antworten</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SECTIONS_ERST.find(s => s.id === 's_cf')?.cultureFitQuestions?.map((cfq) => {
                const answer = state.cultureFitAnswers[cfq.id];
                if (!answer) return null;
                const chosen = answer === 'A' ? cfq.optionA : cfq.optionB;
                const notChosen = answer === 'A' ? cfq.optionB : cfq.optionA;
                return (
                  <div key={cfq.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="culture-fit-badge" style={{
                      padding: '4px 12px', borderRadius: theme.radius.full,
                      background: 'var(--brand-light)',
                      border: '1px solid rgba(32,110,251,0.25)',
                      fontSize: theme.font.xs, color: 'var(--brand)', fontWeight: 700,
                    }}>
                      {chosen}
                    </span>
                    <span style={{
                      fontSize: theme.font.xs, color: theme.colors.text.muted, fontStyle: 'italic',
                    }}>
                      vs. {notChosen}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Abschluss-Notes */}
        {Object.values(state.abschlussNotes || {}).some(Boolean) && (
          <div style={{ ...glassElevated, padding: theme.spacing.md, marginTop: theme.spacing.sm + 4 }}>
            <div style={sectionLabel}>Abschluss-Notizen</div>
            {Object.entries(state.abschlussNotes).filter(([, v]) => v).map(([k, v]) => (
              <div key={k} style={{ marginBottom: theme.spacing.sm }}>
                <div style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginBottom: 2 }}>
                  {k.startsWith('_outroQ_') ? 'Abschlussfrage' : k}
                </div>
                <div
                  className="rich-note-content"
                  style={{ fontSize: theme.font.body, color: theme.colors.text.primary, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: v }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Recommendation – positioned after Abschluss-Notizen (5.2) */}
        {state.recommendation && (
          <div style={{ ...glassElevated, padding: theme.spacing.md, marginTop: theme.spacing.sm + 4 }}>
            <div style={sectionLabel}>Empfehlung</div>
            <div style={{ fontSize: theme.font.md, fontWeight: 700, color: 'var(--brand)' }}>
              {state.recommendation}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: `${theme.spacing.xl}px`, maxWidth: 900, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xl, flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <button onClick={onBack} style={btnStyle}>
          Zurück zum Dashboard
        </button>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {canStartZweit && !isZweit && (
            <button onClick={() => onLoadCandidate(data)} style={{
              ...btnStyle,
              background: 'var(--brand-light)',
              borderColor: 'rgba(32,110,251,0.25)',
              color: 'var(--brand)',
            }}>
              Zweitgespräch starten
            </button>
          )}
          {isZweit && (
            <button onClick={() => onLoadCandidate(data)} style={{
              ...btnStyle,
              background: 'var(--brand-light)',
              borderColor: 'rgba(32,110,251,0.25)',
              color: 'var(--brand)',
            }}>
              Zweitgespräch fortsetzen
            </button>
          )}
          <button onClick={() => window.print()} style={{
            ...btnStyle,
            background: 'var(--brand)',
            border: 'none',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(32,110,251,0.3)',
          }}>
            PDF drucken
          </button>
        </div>
      </div>

      {/* Candidate header */}
      <div style={{
        ...glassElevated, padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        boxShadow: theme.shadow.elevated,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <div style={{
            width: 56, height: 56, borderRadius: theme.radius.full,
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(32,110,251,0.3)',
          }}>
            {(meta.kandidat || '?')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: theme.font.xl, fontWeight: 800, letterSpacing: '-0.5px', color: theme.colors.text.primary }}>
              {meta.kandidat || 'Unbenannt'}
            </div>
            <div style={{ fontSize: theme.font.body, color: theme.colors.text.muted, display: 'flex', gap: 16 }}>
              {meta.datum && <span>Datum: {meta.datum}</span>}
              <span>Empfehlung Erst: <strong style={{ color: 'var(--brand)' }}>{erstRecommendation}</strong></span>
              {zweitRecommendation && <span>Empfehlung Zweit: <strong style={{ color: 'var(--brand)' }}>{zweitRecommendation}</strong></span>}
            </div>
          </div>
        </div>

        {/* Scores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: theme.spacing.sm }}>
          {Object.keys(DIMENSIONS).map((dk) => {
            const avg = scores.averages[dk];
            const color = DIMENSION_COLORS[dk];
            return (
              <div key={dk} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: theme.radius.md,
                background: avg ? `${color}0A` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${avg ? `${color}20` : 'var(--line)'}`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: theme.radius.full, background: color, flexShrink: 0 }} />
                <span style={{ fontSize: theme.font.sm, color: theme.colors.text.secondary, flex: 1 }}>{DIMENSIONS[dk]}</span>
                <span style={{ fontSize: theme.font.md, fontWeight: 800, fontFamily: theme.fontMono, color: avg ? color : theme.colors.text.muted }}>
                  {avg ? avg.toFixed(1) : '\u2013'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Overall */}
        {scores.weightedOverall != null && (
          <div style={{
            marginTop: theme.spacing.md, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            gap: 14, padding: '14px 22px',
            background: 'var(--brand)',
            borderRadius: theme.radius.md, color: '#fff', boxShadow: '0 4px 12px rgba(32,110,251,0.3)',
          }}>
            <span style={{ fontSize: theme.font.md, fontWeight: 500, opacity: 0.8 }}>Gesamtscore:</span>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: theme.fontMono }}>{scores.weightedOverall.toFixed(1)}</span>
            <span style={{ fontSize: theme.font.body, opacity: 0.5 }}>/ 5.0</span>
          </div>
        )}
      </div>

      {/* Round summaries */}
      {renderRoundSummary(erst, 'Erstgespräch', false)}
      {hasZweit && renderRoundSummary(zweit, 'Zweitgespräch', true)}
    </div>
  );
});

DetailReport.displayName = 'DetailReport';
export default DetailReport;

import { memo, useMemo } from 'react';
import { SECTIONS_ERST } from '../data/sections';
import { theme, shared } from '../theme';
import { actions } from '../hooks/useInterviewState';
import RichNoteField from './RichNoteField';
import EvalRow from './EvalRow';

/**
 * Shows questions from the Erstgespräch that were not evaluated (no rating given).
 * Replaces the old checkbox system: non-evaluated questions automatically
 * transfer to the Zweitgespräch script.
 */
const UnevaluatedQuestionsBlock = memo(({ erst, dispatch, currentState }) => {
  const unevaluated = useMemo(() => {
    const result = [];
    for (const section of SECTIONS_ERST) {
      // Check block evaluations
      if (section.blockEvaluation) {
        const be = section.blockEvaluation;
        const beRatings = erst.ratings[be.id] || {};
        const allRated = be.evaluations.every((_, i) => beRatings[i] != null);
        if (!allRated && section.questions) {
          // Include all questions from this block
          for (const q of section.questions) {
            result.push({ question: q, sectionMain: section.main, hasEvals: false });
          }
        }
        continue;
      }
      // Check regular questions
      if (!section.questions) continue;
      for (const q of section.questions) {
        if (!q.evaluations || q.evaluations.length === 0) continue;
        const qRatings = erst.ratings[q.id] || {};
        const allRated = q.evaluations.every((_, i) => qRatings[i] != null);
        if (!allRated) {
          result.push({ question: q, sectionMain: section.main || section.sub, hasEvals: true });
        }
      }
    }
    return result;
  }, [erst.ratings]);

  if (unevaluated.length === 0) return null;

  return (
    <div style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.lg, borderRadius: theme.radius.lg, background: theme.colors.warning.bg, border: `1px solid ${theme.colors.warning.border}` }}>
      <div style={{ fontSize: theme.font.md, fontWeight: 700, color: theme.colors.warning.text, marginBottom: theme.spacing.sm }}>
        Offene Fragen aus dem Erstgespräch
      </div>
      <div style={{ fontSize: theme.font.sm, color: theme.colors.warning.textDark, marginBottom: theme.spacing.md, lineHeight: 1.6 }}>
        Die folgenden Fragen wurden im Erstgespräch nicht bewertet und können hier nachgeholt werden.
      </div>

      {unevaluated.map(({ question, sectionMain, hasEvals }) => (
        <div key={question.id} style={{ ...shared.card, marginBottom: theme.spacing.sm, background: '#fff' }}>
          <div style={{ fontSize: theme.font.xs, fontWeight: 600, color: theme.colors.text.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {sectionMain}
          </div>
          <div style={{ fontSize: theme.font.md, lineHeight: 1.8, color: theme.colors.text.primary, fontWeight: 450 }}>
            {question.text}
          </div>
          {question.followUp && (
            <div style={{ fontSize: theme.font.body, color: theme.colors.accent.indigo, marginTop: 6, fontStyle: 'italic', lineHeight: 1.6, paddingLeft: 14, borderLeft: `2px solid ${theme.colors.accent.indigo}40` }}>
              {question.followUp}
            </div>
          )}

          {/* Erst notes (read-only) */}
          {erst.notes[question.id] && (
            <div style={{ marginTop: theme.spacing.sm, padding: '8px 14px', borderRadius: theme.radius.md, background: theme.colors.info.bg, fontSize: theme.font.sm, color: theme.colors.info.text, lineHeight: 1.6, border: `1px solid ${theme.colors.info.border}` }}>
              <span style={{ fontWeight: 700 }}>Notizen EG:</span>{' '}
              <span dangerouslySetInnerHTML={{ __html: erst.notes[question.id] }} />
            </div>
          )}

          <RichNoteField
            value={currentState.notes[question.id] || ''}
            onChange={(val) => dispatch(actions.setNote(question.id, val))}
            placeholder="Notizen (Zweitgespräch) ..."
          />

          {hasEvals && question.evaluations?.map((evaluation, evalIdx) => {
            const er = (erst.ratings[question.id] || {})[evalIdx];
            return (
              <EvalRow
                key={evalIdx}
                evaluation={evaluation}
                rating={(currentState.ratings[question.id] || {})[evalIdx]}
                erstRating={er}
                onRate={(v) => dispatch(actions.setRating(question.id, evalIdx, v))}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

UnevaluatedQuestionsBlock.displayName = 'UnevaluatedQuestionsBlock';
export default UnevaluatedQuestionsBlock;

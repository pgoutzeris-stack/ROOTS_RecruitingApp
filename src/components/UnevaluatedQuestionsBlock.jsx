import { memo, useMemo } from 'react';
import { theme, shared } from '../theme';
import { actions } from '../hooks/useInterviewState';
import { getUnevaluatedBySection } from '../utils/unevaluated';
import RichNoteField from './RichNoteField';
import EvalRow from './EvalRow';

const UnevaluatedQuestionsBlock = memo(({ erst, dispatch, currentState }) => {
  const unmatched = useMemo(() => {
    const grouped = getUnevaluatedBySection(erst.ratings || {});
    return grouped['_unmatched'] || [];
  }, [erst.ratings]);

  if (unmatched.length === 0) return null;

  return (
    <div style={{
      marginBottom: 20,
      borderRadius: 'var(--radius)',
      border: '1px solid rgba(32,110,251,0.2)',
      background: 'var(--brand-light)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 20px',
        borderBottom: '1px solid rgba(32,110,251,0.15)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <i className="ri-file-list-3-line" style={{ fontSize: 14, color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)' }}>
            Offene Fragen aus dem Erstgespräch
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
            {unmatched.length} {unmatched.length === 1 ? 'Frage' : 'Fragen'} wurden im Erstgespräch nicht bewertet
          </div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {unmatched.map(({ question, sectionMain, hasEvals }) => (
          <div key={question.id} style={{
            background: 'var(--bg)',
            borderRadius: 12,
            border: '1px solid var(--line)',
            overflow: 'hidden',
          }}>
            {/* Section label */}
            <div style={{
              padding: '8px 14px 0',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <i className="ri-corner-right-down-line" style={{ fontSize: 11, color: 'var(--muted)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                {sectionMain}
              </span>
            </div>

            <div style={{ padding: '8px 14px 14px' }}>
              {/* Question text */}
              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', fontWeight: 450, marginBottom: question.followUp ? 8 : 12 }}>
                {question.text}
              </div>

              {question.followUp && (
                <div style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6,
                  paddingLeft: 12, borderLeft: '2px solid var(--line)',
                }}>
                  {question.followUp}
                </div>
              )}

              {/* Note from Erst */}
              {erst.notes[question.id] && (
                <div style={{
                  marginBottom: 12, padding: '8px 12px',
                  borderRadius: 8, background: 'var(--brand-light)',
                  border: '1px solid rgba(32,110,251,0.2)',
                  fontSize: 12, color: 'var(--brand)', lineHeight: 1.6,
                  display: 'flex', gap: 7, alignItems: 'flex-start',
                }}>
                  <i className="ri-sticky-note-line" style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }} />
                  <span>
                    <strong>Notizen EG:</strong>{' '}
                    <span dangerouslySetInnerHTML={{ __html: erst.notes[question.id] }} />
                  </span>
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
          </div>
        ))}
      </div>
    </div>
  );
});

UnevaluatedQuestionsBlock.displayName = 'UnevaluatedQuestionsBlock';
export default UnevaluatedQuestionsBlock;

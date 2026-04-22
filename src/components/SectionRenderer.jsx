import { memo } from 'react';
import { theme, shared } from '../theme';
import { actions } from '../hooks/useInterviewState';
import ScriptBlock from './ScriptBlock';
import RootsBlock from './RootsBlock';
import RTIBlock from './RTIBlock';
import OutroBlock from './OutroBlock';
import CaseBlock from './CaseBlock';
import CultureFitBlock from './CultureFitBlock';
import SectionTimer from './SectionTimer';
import QuestionCard from './QuestionCard';
import EvalRow from './EvalRow';
import UnevaluatedForSection from './UnevaluatedForSection';

const SectionRenderer = memo(({ section, sectionNum, isZweit, erst, zweit, currentState, dispatch, kandidat, interviewer }) => {
  if (!sectionNum || !sectionNum.visible) return null;
  const caseChecked = section.isCase ? !!currentState.caseChecks[section.caseKey] : false;

  return (
    <div id={`section-${section.id}`} style={{ marginBottom: theme.spacing.xl + 8 }}>
      {section.main && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 14, marginBottom: theme.spacing.lg }}>
          <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--bg)', background: 'var(--brand)', padding: '.3rem .75rem', borderRadius: 999, letterSpacing: '.5px', flexShrink: 0 }}>
            {sectionNum.mainNumber}
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>{section.main}</span>
          {section.time && !section.sub && (
            <div style={{ marginLeft: 'auto' }}>
              <SectionTimer
                sectionId={section.id}
                timeStr={section.time}
                timerMinutes={currentState.timerMinutes || {}}
                dispatch={dispatch}
                setTimer={actions.setTimer}
              />
            </div>
          )}
        </div>
      )}

      {section.sub && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)', paddingBottom: 10, marginBottom: theme.spacing.md }}>
          {section.isCase && <input type="checkbox" checked={caseChecked} onChange={() => dispatch(actions.toggleCaseCheck(section.caseKey))} style={shared.checkbox} />}
          <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted)', fontFamily: theme.fontMono }}>{sectionNum.subNumber}</span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>{section.sub}</span>
          {section.time && (
            <div style={{ marginLeft: 'auto' }}>
              <SectionTimer
                sectionId={section.id}
                timeStr={section.time}
                timerMinutes={currentState.timerMinutes || {}}
                dispatch={dispatch}
                setTimer={actions.setTimer}
              />
            </div>
          )}
        </div>
      )}

      {section.hint && (
        <div style={{ background: theme.colors.hint.bg, border: `1px solid ${theme.colors.hint.border}`, borderRadius: theme.radius.md, padding: '12px 18px', fontSize: theme.font.body, color: theme.colors.hint.text, marginBottom: theme.spacing.md, lineHeight: 1.7, display: 'flex', gap: 8 }}>
          <span style={{ fontWeight: 700, flexShrink: 0 }}>Tipp:</span>
          <span>{section.hint}</span>
        </div>
      )}

      {/* Unevaluated questions from Erst, placed in their thematic Zweit section */}
      {isZweit && (
        <UnevaluatedForSection
          sectionId={section.id}
          erst={erst}
          dispatch={dispatch}
          currentState={currentState}
        />
      )}

      {section.type === 'script' && <ScriptBlock isZweit={isZweit} kandidat={kandidat} interviewer={interviewer} />}
      {section.type === 'roots' && <RootsBlock />}
      {section.type === 'rti' && <RTIBlock rtiDone={currentState.rtiDone} rtiGreyed={false} isZweit={isZweit} erst={erst} zweit={zweit} dispatch={dispatch} />}
      {section.type === 'outro' && (
        <OutroBlock
          isZweit={isZweit}
          kandidat={kandidat}
          abschlussNotes={currentState.abschlussNotes}
          dispatch={dispatch}
          outroFields={section.outroFields}
          outroQuestion={section.outroQuestion}
          outroEvaluation={section.outroEvaluation}
          ratings={currentState.ratings}
          erstRatings={isZweit ? erst.ratings : null}
        />
      )}
      {section.caseText && <CaseBlock caseText={section.caseText} greyed={false} />}
      {section.type === 'culturefit' && (
        <CultureFitBlock
          section={section}
          cultureFitAnswers={currentState.cultureFitAnswers || {}}
          ratings={currentState.ratings}
          dispatch={dispatch}
          erstRatings={isZweit ? erst.ratings : null}
          isZweit={isZweit}
        />
      )}

      {section.type !== 'culturefit' && section.questions?.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          notes={currentState.notes}
          observations={currentState.observations}
          ratings={currentState.ratings}
          dispatch={dispatch}
          erstRatings={isZweit ? erst.ratings : null}
          erstNote={isZweit ? (erst.notes[question.id] || '') : ''}
          isZweit={isZweit}
          hasBlockEvaluation={!!section.blockEvaluation}
        />
      )) || null}

      {/* Block-level evaluation (e.g. Erst Block 4 Motivation) */}
      {section.blockEvaluation && (
        <div style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, background: 'var(--brand-light)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--brand)', marginBottom: theme.spacing.sm, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Gesamtbewertung Block
          </div>
          {section.blockEvaluation.evaluations.map((ev, evalIdx) => {
            const er = isZweit && erst.ratings ? (erst.ratings[section.blockEvaluation.id] || {})[evalIdx] : undefined;
            return (
              <EvalRow
                key={evalIdx}
                evaluation={ev}
                rating={(currentState.ratings[section.blockEvaluation.id] || {})[evalIdx]}
                erstRating={er}
                onRate={(v) => dispatch(actions.setRating(section.blockEvaluation.id, evalIdx, v))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

SectionRenderer.displayName = 'SectionRenderer';
export default SectionRenderer;

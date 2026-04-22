import { useCallback, useEffect, useState } from 'react';
import { getSections, SECTIONS_ERST } from './data/sections';
import { theme } from './theme';
import { useInterviewState, actions } from './hooks/useInterviewState';
import { exportAsJson } from './utils/storage';
import Header from './components/Header';
import InfoBar from './components/InfoBar';
import Navigation from './components/Navigation';
import SectionRenderer from './components/SectionRenderer';
import GesamtEvaluation from './components/GesamtEvaluation';
import RoundSwitchDialog from './components/RoundSwitchDialog';
import Dashboard from './components/Dashboard';
import DetailReport from './components/DetailReport';
import ErstScriptViewer from './components/ErstScriptViewer';
import UnevaluatedQuestionsBlock from './components/UnevaluatedQuestionsBlock';
import GlobalTimer from './components/GlobalTimer';
import ApiKeyDialog from './components/ApiKeyDialog';

export default function App() {
  const {
    erst,
    zweit,
    currentState,
    isZweit,
    canSwitchToZweit,
    dispatch,
    dimScores,
    sectionNumbers,
    resetAll,
    loadCandidate,
  } = useInterviewState();

  const [view, setView] = useState('interview');
  const [detailData, setDetailData] = useState(null);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [showErstScript, setShowErstScript] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const kandidat = currentState.meta.kandidat;
  const interviewer = currentState.meta.interviewer;
  const sections = getSections(isZweit);

  const headerDispatch = useCallback(
    (action) => {
      if (action.type === 'SET_META' && action.field === 'runde' && action.value === 'zweit') {
        setShowSwitchDialog(true);
        return;
      }
      dispatch(action);
    },
    [dispatch],
  );

  const confirmSwitch = useCallback(() => {
    setShowSwitchDialog(false);
    dispatch(actions.setMeta('runde', 'zweit'));
  }, [dispatch]);

  const handleOpenDashboard = useCallback(() => setView('dashboard'), []);

  const handleOpenDetail = useCallback((data) => {
    setDetailData(data);
    setView('detail');
  }, []);

  const handleLoadCandidate = useCallback((data) => {
    const rec = data.erst?.recommendation;
    const alreadyZweit = data.erst?.meta?.runde === 'zweit';
    const startZweit = rec === 'Zum Zweitgespräch einladen' && !alreadyZweit;
    loadCandidate(data, { startZweit });
    setView('interview');
    window.scrollTo(0, 0);
  }, [loadCandidate]);

  /** Edit mode: load interview without auto-switching to Zweit */
  const handleEditCandidate = useCallback((data) => {
    loadCandidate(data);
    setView('interview');
    window.scrollTo(0, 0);
  }, [loadCandidate]);

  const handleReset = useCallback(() => {
    resetAll();
    setView('interview');
    window.scrollTo(0, 0);
  }, [resetAll]);

  const handleNewInterview = useCallback(() => {
    resetAll();
    setView('interview');
    window.scrollTo(0, 0);
  }, [resetAll]);

  const handleExportJson = useCallback(() => {
    const data = {
      erst,
      zweit,
      scores: dimScores,
      exportedAt: new Date().toISOString(),
    };
    const name = kandidat || 'interview';
    const date = erst.meta.datum || new Date().toISOString().slice(0, 10);
    exportAsJson(data, `roots-interview-${name}-${date}.json`);
  }, [erst, zweit, dimScores, kandidat]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ fontFamily: theme.fontFamily, background: 'var(--app-bg)', minHeight: '100vh', color: theme.colors.text.primary }}>
      {showSwitchDialog && (
        <RoundSwitchDialog onConfirm={confirmSwitch} onCancel={() => setShowSwitchDialog(false)} />
      )}

      {showErstScript && (
        <ErstScriptViewer erst={erst} onClose={() => setShowErstScript(false)} />
      )}

      {showApiKeyDialog && (
        <ApiKeyDialog onClose={() => setShowApiKeyDialog(false)} />
      )}

      {view === 'dashboard' && (
        <Dashboard onBack={handleNewInterview} onOpenDetail={handleOpenDetail} onLoadCandidate={handleLoadCandidate} onEditCandidate={handleEditCandidate} />
      )}

      {view === 'detail' && detailData && (
        <DetailReport data={detailData} onBack={() => setView('dashboard')} onLoadCandidate={handleLoadCandidate} />
      )}

      {view === 'interview' && (
        <>
          <Header
            erst={erst}
            isZweit={isZweit}
            canSwitchToZweit={canSwitchToZweit}
            dispatch={headerDispatch}
            onExportJson={handleExportJson}
            onOpenDashboard={handleOpenDashboard}
            onReset={handleReset}
            onOpenSettings={() => setShowApiKeyDialog(true)}
          />

          <InfoBar isZweit={isZweit} onShowErstScript={isZweit ? () => setShowErstScript(true) : null} />

          <Navigation sectionNumbers={sectionNumbers} isZweit={isZweit} currentState={currentState} />

          <div style={{ padding: '1.25rem 1.25rem 1.25rem 284px', maxWidth: 1140 }}>
            {/* Global Timer */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <GlobalTimer isZweit={isZweit} />
            </div>

            {/* Zweitgespräch: notes from first interviewer */}
            {isZweit && erst.zweitAnmerkung && (
              <div style={{ background: 'var(--brand-light)', border: '1px solid rgba(32,110,251,0.2)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <i className="ri-message-3-line" style={{ fontSize: 16, color: 'var(--brand)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    Anmerkungen vom Erstinterviewer
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                    {erst.zweitAnmerkung}
                  </div>
                </div>
              </div>
            )}

            {/* Unevaluated questions from Erst (shown in Zweit) */}
            {isZweit && (
              <UnevaluatedQuestionsBlock erst={erst} dispatch={dispatch} currentState={currentState} />
            )}

            {/* Sections */}
            {sections.map((section, idx) => (
              <SectionRenderer
                key={section.id}
                section={section}
                sectionNum={sectionNumbers[idx]}
                isZweit={isZweit}
                erst={erst}
                zweit={zweit}
                currentState={currentState}
                dispatch={dispatch}
                kandidat={kandidat}
                interviewer={interviewer}
              />
            ))}

            {/* Overall evaluation */}
            <div id="section-gesamtevaluation">
              <GesamtEvaluation
                dimScores={dimScores}
                isZweit={isZweit}
                erst={erst}
                currentState={currentState}
                dispatch={dispatch}
                canSwitchToZweit={canSwitchToZweit}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

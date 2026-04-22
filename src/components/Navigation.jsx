import { memo, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getSections } from '../data/sections';
import { theme } from '../theme';

const Navigation = memo(({ sectionNumbers, isZweit, currentState }) => {
  const [activeId, setActiveId] = useState(null);
  const [manualExpanded, setManualExpanded] = useState(null);
  const observerRef = useRef(null);
  const sections = getSections(isZweit);

  const chapters = useMemo(() => {
    const result = [];
    let current = null;
    sections.forEach((section, idx) => {
      const nums = sectionNumbers[idx];
      if (!nums || !nums.visible) return;
      if (section.main) {
        current = { main: section, mainIdx: idx, mainNumber: nums.mainNumber, subs: [] };
        result.push(current);
        if (!section.sub) current.mainSection = { section, idx, nums };
      }
      if (section.sub && current) current.subs.push({ section, idx, nums });
    });
    return result;
  }, [sections, sectionNumbers]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); } },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0.05 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [isZweit, sections]);

  const autoExpandedChapter = useMemo(() => {
    if (!activeId) return null;
    const sectionId = activeId.replace('section-', '');
    for (const chapter of chapters) {
      if (chapter.main.id === sectionId || chapter.subs.some(s => s.section.id === sectionId)) {
        return chapter.main.id;
      }
    }
    return null;
  }, [activeId, chapters]);

  const expandedChapter = manualExpanded ?? autoExpandedChapter;

  const prevAutoRef = useRef(autoExpandedChapter);
  if (prevAutoRef.current !== autoExpandedChapter) {
    prevAutoRef.current = autoExpandedChapter;
    if (manualExpanded !== null) setManualExpanded(null);
  }

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const getProgress = (sec) => {
    if (!sec.questions) return null;
    let total = 0, rated = 0;
    for (const q of sec.questions) {
      if (!q.evaluations) continue;
      for (let i = 0; i < q.evaluations.length; i++) {
        total++;
        if ((currentState.ratings[q.id] || {})[i] != null) rated++;
      }
    }
    if (sec.blockEvaluation) {
      const be = sec.blockEvaluation;
      for (let i = 0; i < be.evaluations.length; i++) {
        total++;
        if ((currentState.ratings[be.id] || {})[i] != null) rated++;
      }
    }
    return total > 0 ? { rated, total } : null;
  };

  const getChapterProgress = (chapter) => {
    let total = 0, rated = 0;
    for (const sec of [chapter.main, ...chapter.subs.map(s => s.section)]) {
      const p = getProgress(sec);
      if (p) { total += p.total; rated += p.rated; }
    }
    return total > 0 ? { rated, total } : null;
  };

  return (
    <nav
      style={{
        position: 'fixed', left: '1rem', top: 168, width: 252,
        maxHeight: 'calc(100vh - 185px)', overflowY: 'auto',
        padding: '8px 6px',
        zIndex: 10,
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        fontFamily: "'Circular Std', system-ui, sans-serif",
      }}
      className="no-print"
      aria-label="Sektions-Navigation"
    >
      {/* Header label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px 8px',
        borderBottom: '1px solid var(--line)',
        marginBottom: 4,
      }}>
        <i className="ri-list-check" style={{ fontSize: 12, color: 'var(--brand)' }} />
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>
          Kapitel
        </span>
      </div>

      {chapters.map((chapter) => {
        const isExpanded = expandedChapter === chapter.main.id;
        const isChapterActive = activeId === `section-${chapter.main.id}`
          || chapter.subs.some(s => activeId === `section-${s.section.id}`);
        const chapterProgress = getChapterProgress(chapter);
        const isComplete = chapterProgress && chapterProgress.rated === chapterProgress.total;
        const hasSubs = chapter.subs.length > 0;
        const pct = chapterProgress ? (chapterProgress.rated / chapterProgress.total) * 100 : 0;

        return (
          <div key={chapter.main.id} style={{ marginBottom: 1 }}>
            {/* Chapter row */}
            <div
              onClick={() => {
                setManualExpanded(isExpanded ? null : chapter.main.id);
                scrollTo(chapter.main.id);
              }}
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                cursor: 'pointer',
                background: isChapterActive ? 'var(--brand-light)' : 'transparent',
                transition: 'background .15s ease',
                userSelect: 'none',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && scrollTo(chapter.main.id)}
            >
              {/* Title row — single line, ellipsis */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: isChapterActive ? 'var(--brand)' : 'var(--muted)',
                  flexShrink: 0, minWidth: 18,
                }}>
                  {chapter.mainNumber}.
                </span>
                <span style={{
                  flex: 1,
                  fontSize: 13, fontWeight: isChapterActive ? 700 : 500,
                  color: isChapterActive ? 'var(--brand)' : 'var(--ink)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  lineHeight: 1.3,
                }}>
                  {chapter.main.main}
                </span>
                {isComplete ? (
                  <i className="ri-check-line" style={{ fontSize: 13, color: '#10b981', flexShrink: 0 }} />
                ) : hasSubs ? (
                  <i
                    className="ri-arrow-right-s-line"
                    style={{
                      fontSize: 15, color: 'var(--muted)', flexShrink: 0,
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: `transform ${theme.transition.fast}`,
                    }}
                  />
                ) : null}
              </div>

              {/* Progress bar + compact counter */}
              {chapterProgress && !isComplete && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, paddingLeft: 24 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden', maxWidth: 56 }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'var(--brand)',
                      borderRadius: 2,
                      transition: 'width .3s ease',
                    }} />
                  </div>
                  {chapterProgress.rated > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: 'var(--brand)',
                    }}>
                      {chapterProgress.rated}/{chapterProgress.total}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sub-sections */}
            {isExpanded && hasSubs && (
              <div style={{ paddingLeft: 6, paddingBottom: 2 }}>
                {chapter.subs.map(({ section, nums }) => {
                  const isSubActive = activeId === `section-${section.id}`;
                  const progress = getProgress(section);
                  const subComplete = progress && progress.rated === progress.total;

                  return (
                    <div
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      style={{
                        padding: '6px 10px 6px 10px',
                        marginBottom: 1,
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: isSubActive ? 'var(--brand-light)' : 'transparent',
                        transition: 'background .15s ease',
                        userSelect: 'none',
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span style={{
                          fontSize: 10, color: 'var(--muted)', opacity: 0.6,
                          flexShrink: 0, minWidth: 26,
                        }}>
                          {nums.subNumber}
                        </span>
                        <span style={{
                          flex: 1,
                          fontSize: 12, fontWeight: isSubActive ? 600 : 400,
                          color: isSubActive ? 'var(--brand)' : 'var(--ink)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          lineHeight: 1.3,
                        }}>
                          {section.sub}
                        </span>
                        {subComplete && (
                          <i className="ri-check-line" style={{ fontSize: 12, color: '#10b981', flexShrink: 0 }} />
                        )}
                      </div>
                      {section.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2, paddingLeft: 32 }}>
                          <i className="ri-time-line" style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.55 }} />
                          <span style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.55 }}>{section.time}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
});

Navigation.displayName = 'Navigation';
export default Navigation;

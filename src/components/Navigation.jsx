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
        if (!section.sub) {
          current.mainSection = { section, idx, nums };
        }
      }
      if (section.sub && current) {
        current.subs.push({ section, idx, nums });
      }
    });
    return result;
  }, [sections, sectionNumbers]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); } },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0.05 },
    );
    sections.forEach((s) => { const el = document.getElementById(`section-${s.id}`); if (el) observerRef.current.observe(el); });
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
      for (let i = 0; i < q.evaluations.length; i++) { total++; if ((currentState.ratings[q.id] || {})[i] != null) rated++; }
    }
    if (sec.blockEvaluation) {
      const be = sec.blockEvaluation;
      for (let i = 0; i < be.evaluations.length; i++) { total++; if ((currentState.ratings[be.id] || {})[i] != null) rated++; }
    }
    return total > 0 ? { rated, total } : null;
  };

  const getChapterProgress = (chapter) => {
    let total = 0, rated = 0;
    const sects = [chapter.main, ...chapter.subs.map(s => s.section)];
    for (const sec of sects) {
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
        padding: '10px 8px',
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
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 8px 10px',
        borderBottom: '1px solid var(--line)',
        marginBottom: 6,
      }}>
        <i className="ri-list-check" style={{ fontSize: 13, color: 'var(--brand)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>
          Kapitel
        </span>
      </div>

      {chapters.map((chapter) => {
        const isExpanded = expandedChapter === chapter.main.id;
        const isChapterActive = activeId === `section-${chapter.main.id}` || chapter.subs.some(s => activeId === `section-${s.section.id}`);
        const chapterProgress = getChapterProgress(chapter);
        const isComplete = chapterProgress && chapterProgress.rated === chapterProgress.total && chapterProgress.total > 0;
        const hasSubs = chapter.subs.length > 0;

        return (
          <div key={chapter.main.id} style={{ marginBottom: 2 }}>
            {/* Chapter row */}
            <div
              onClick={() => { setManualExpanded(isExpanded ? null : chapter.main.id); scrollTo(chapter.main.id); }}
              style={{
                padding: '9px 10px',
                borderRadius: 10,
                cursor: 'pointer',
                background: isChapterActive ? 'var(--brand-light)' : 'transparent',
                borderLeft: isChapterActive ? '3px solid var(--brand)' : '3px solid transparent',
                color: isChapterActive ? 'var(--brand)' : 'var(--muted)',
                fontWeight: isChapterActive ? 700 : 500,
                transition: 'all .15s ease',
                userSelect: 'none',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && scrollTo(chapter.main.id)}
            >
              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, minWidth: 22, color: isChapterActive ? 'var(--brand)' : 'var(--muted)',
                  opacity: isChapterActive ? 1 : 0.6,
                }}>
                  {chapter.mainNumber}.
                </span>
                <span style={{ flex: 1, fontSize: 13, lineHeight: 1.35, color: isChapterActive ? 'var(--brand)' : 'var(--ink)' }}>
                  {chapter.main.main}
                </span>
                {isComplete && (
                  <i className="ri-check-line" style={{ fontSize: 13, color: '#10b981', flexShrink: 0 }} />
                )}
                {hasSubs && !isComplete && (
                  <i
                    className="ri-arrow-right-s-line"
                    style={{
                      fontSize: 15, color: 'var(--muted)', flexShrink: 0,
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: `transform ${theme.transition.fast}`,
                    }}
                  />
                )}
              </div>

              {/* Progress row */}
              {chapterProgress && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, paddingLeft: 28 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden', maxWidth: 60 }}>
                    <div style={{
                      width: `${(chapterProgress.rated / chapterProgress.total) * 100}%`,
                      height: '100%',
                      background: isComplete ? '#10b981' : 'var(--brand)',
                      borderRadius: 2,
                      transition: 'width .3s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: isComplete ? '#10b981' : 'var(--muted)',
                  }}>
                    {chapterProgress.rated}/{chapterProgress.total}
                  </span>
                </div>
              )}
            </div>

            {/* Sub-sections */}
            {isExpanded && hasSubs && (
              <div style={{ paddingLeft: 8 }}>
                {chapter.subs.map(({ section, nums }) => {
                  const isSubActive = activeId === `section-${section.id}`;
                  const progress = getProgress(section);
                  const subComplete = progress && progress.rated === progress.total && progress.total > 0;

                  return (
                    <div
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      style={{
                        padding: '7px 10px 7px 12px',
                        marginBottom: 1,
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: isSubActive ? 'var(--brand-light)' : 'transparent',
                        borderLeft: isSubActive ? '2px solid var(--brand)' : '2px solid var(--line)',
                        color: isSubActive ? 'var(--brand)' : 'var(--muted)',
                        fontWeight: isSubActive ? 600 : 400,
                        transition: 'all .15s ease',
                        userSelect: 'none',
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, opacity: 0.55, minWidth: 28, color: 'var(--muted)' }}>{nums.subNumber}</span>
                        <span style={{ flex: 1, fontSize: 12, lineHeight: 1.35, color: isSubActive ? 'var(--brand)' : 'var(--ink)' }}>
                          {section.sub}
                        </span>
                        {subComplete && (
                          <i className="ri-check-line" style={{ fontSize: 12, color: '#10b981', flexShrink: 0 }} />
                        )}
                      </div>
                      {section.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, paddingLeft: 34 }}>
                          <i className="ri-time-line" style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.6 }} />
                          <span style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.6 }}>{section.time}</span>
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

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
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 },
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
    // Include block evaluation
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
        position: 'fixed', left: '1rem', top: 140, width: 220,
        maxHeight: 'calc(100vh - 160px)', overflowY: 'auto',
        padding: '1rem .75rem',
        zIndex: 10,
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
      }}
      className="no-print"
      aria-label="Sektions-Navigation"
    >
      <div style={{ fontSize: theme.font.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: theme.colors.text.muted, marginBottom: 12, paddingLeft: 8 }}>
        Kapitel
      </div>

      {chapters.map((chapter) => {
        const isExpanded = expandedChapter === chapter.main.id;
        const isChapterActive = activeId === `section-${chapter.main.id}` || chapter.subs.some(s => activeId === `section-${s.section.id}`);
        const chapterProgress = getChapterProgress(chapter);
        const isComplete = chapterProgress && chapterProgress.rated === chapterProgress.total && chapterProgress.total > 0;
        const hasSubs = chapter.subs.length > 0;

        return (
          <div key={chapter.main.id} style={{ marginBottom: 2 }}>
            <div
              onClick={() => { setManualExpanded(isExpanded ? null : chapter.main.id); scrollTo(chapter.main.id); }}
              style={{
                padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                background: isChapterActive ? 'var(--brand-light)' : 'transparent',
                borderLeft: isChapterActive ? '2px solid var(--brand)' : '2px solid transparent',
                color: isChapterActive ? 'var(--brand)' : theme.colors.text.secondary,
                fontWeight: 600, transition: 'all .15s', lineHeight: 1.4,
              }}
              role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollTo(chapter.main.id)}
            >
              <div style={{ fontSize: theme.font.sm, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ opacity: 0.4, fontWeight: 500, minWidth: 26, fontFamily: theme.fontMono, fontSize: theme.font.xs }}>
                  {chapter.mainNumber}.
                </span>
                <span style={{ flex: 1 }}>{chapter.main.main}</span>
                {hasSubs && (
                  <span style={{ fontSize: 9, opacity: 0.4, transition: `transform ${theme.transition.fast}`, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                    &#9654;
                  </span>
                )}
                {isComplete && (
                  <span style={{ color: theme.colors.success.badge, fontSize: theme.font.xs }}>&#10003;</span>
                )}
              </div>
              {chapterProgress && (
                <div style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginTop: 3, paddingLeft: 32, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {chapter.main.time && !hasSubs && <span style={{ opacity: 0.6 }}>{chapter.main.time}</span>}
                  <span style={{ color: isComplete ? 'var(--success)' : theme.colors.text.muted, fontWeight: isComplete ? 600 : 400, fontFamily: theme.fontMono }}>
                    {chapterProgress.rated}/{chapterProgress.total}
                  </span>
                  <div style={{ flex: 1, height: 2, background: 'var(--line)', borderRadius: 1, overflow: 'hidden', maxWidth: 36 }}>
                    <div style={{ width: `${(chapterProgress.rated / chapterProgress.total) * 100}%`, height: '100%', background: isComplete ? 'var(--success)' : 'var(--brand)', borderRadius: 1, transition: 'width .3s' }} />
                  </div>
                </div>
              )}
            </div>

            {isExpanded && hasSubs && (
              <div style={{ overflow: 'hidden', transition: `all ${theme.transition.normal}` }}>
                {chapter.subs.map(({ section, nums }) => {
                  const isSubActive = activeId === `section-${section.id}`;
                  const progress = getProgress(section);
                  const subComplete = progress && progress.rated === progress.total && progress.total > 0;

                  return (
                    <div
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      style={{
                        padding: '6px 10px 6px 36px', marginBottom: 1, borderRadius: 8, cursor: 'pointer',
                        background: isSubActive ? 'var(--brand-light)' : 'transparent',
                        color: isSubActive ? 'var(--brand)' : theme.colors.text.muted,
                        fontWeight: isSubActive ? 500 : 400, transition: 'all .15s', lineHeight: 1.4,
                      }}
                      role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
                    >
                      <div style={{ fontSize: theme.font.xs, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ opacity: 0.4, fontFamily: theme.fontMono, minWidth: 30 }}>{nums.subNumber}</span>
                        <span style={{ flex: 1 }}>{section.sub}</span>
                        {subComplete && <span style={{ color: theme.colors.success.badge, fontSize: 10 }}>&#10003;</span>}
                      </div>
                      {section.time && (
                        <div style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginTop: 2, paddingLeft: 36, opacity: 0.6 }}>
                          {section.time}
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

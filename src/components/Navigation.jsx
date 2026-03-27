import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { SECTIONS } from '../data/sections';
import { theme } from '../theme';

const Navigation = memo(({ sectionNumbers, isZweit, currentState }) => {
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); } },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(`section-${s.id}`); if (el) observerRef.current.observe(el); });
    return () => observerRef.current?.disconnect();
  }, [isZweit]);

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
    return total > 0 ? { rated, total } : null;
  };

  return (
    <nav
      style={{
        position: 'fixed', left: 0, top: 114, width: 230,
        maxHeight: 'calc(100vh - 130px)', overflowY: 'auto',
        padding: `${theme.spacing.lg}px ${theme.spacing.md}px ${theme.spacing.lg}px ${theme.spacing.lg}px`,
        zIndex: 10,
      }}
      className="no-print"
      aria-label="Sektions-Navigation"
    >
      <div style={{ fontSize: theme.font.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.text.muted, marginBottom: theme.spacing.md, paddingLeft: 10 }}>
        Sektionen
      </div>

      {SECTIONS.map((section, idx) => {
        const nums = sectionNumbers[idx];
        if (!nums.visible) return null;
        const label = section.sub || section.main;
        if (!label) return null;
        const number = nums.subNumber || (nums.mainNumber ? `${nums.mainNumber}.` : '');
        const isActive = activeId === `section-${section.id}`;
        const progress = getProgress(section);
        const isComplete = progress && progress.rated === progress.total && progress.total > 0;

        return (
          <div
            key={section.id}
            onClick={() => scrollTo(section.id)}
            style={{
              padding: '9px 12px',
              marginBottom: 2,
              borderRadius: theme.radius.sm,
              cursor: 'pointer',
              background: isActive ? theme.colors.accent.indigoLight : 'transparent',
              borderLeft: isActive ? `2px solid ${theme.colors.accent.indigo}` : '2px solid transparent',
              color: isActive ? theme.colors.accent.indigoMid : theme.colors.text.secondary,
              fontWeight: isActive ? 600 : 400,
              transition: `all ${theme.transition.fast}`,
              lineHeight: 1.4,
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
          >
            <div style={{ fontSize: theme.font.sm, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ opacity: 0.4, fontWeight: 500, minWidth: 26, fontFamily: theme.fontMono, fontSize: theme.font.xs }}>{number}</span>
              <span style={{ flex: 1 }}>{label}</span>
            </div>
            {(section.time || progress) && (
              <div style={{ fontSize: theme.font.xs, color: theme.colors.text.muted, marginTop: 3, paddingLeft: 32, display: 'flex', alignItems: 'center', gap: 6 }}>
                {section.time && <span style={{ opacity: 0.6 }}>{section.time}</span>}
                {progress && (
                  <>
                    <span style={{ color: isComplete ? theme.colors.success.badge : theme.colors.text.muted, fontWeight: isComplete ? 600 : 400, fontFamily: theme.fontMono }}>
                      {progress.rated}/{progress.total}
                    </span>
                    <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', maxWidth: 36 }}>
                      <div style={{ width: `${(progress.rated / progress.total) * 100}%`, height: '100%', background: isComplete ? theme.colors.success.badge : theme.colors.accent.indigo, borderRadius: 1, transition: `width ${theme.transition.slow}`, boxShadow: isComplete ? `0 0 6px ${theme.colors.success.badge}40` : `0 0 6px ${theme.colors.accent.indigoGlow}` }} />
                    </div>
                  </>
                )}
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

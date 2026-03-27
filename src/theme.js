/**
 * ROOTS Interview App – Cinematic Dark Glassmorphism Theme
 *
 * UI UX Pro Max: Modern Dark Cinema + Glassmorphism
 * Deep dark base, frosted glass cards, indigo accent with glow,
 * layered depth, premium typography.
 */

export const theme = {
  colors: {
    bg: {
      deep: '#08090E',
      base: '#0C0D14',
      elevated: 'rgba(255, 255, 255, 0.04)',
      card: 'rgba(255, 255, 255, 0.04)',
      cardHover: 'rgba(255, 255, 255, 0.06)',
      surface: 'rgba(255, 255, 255, 0.03)',
      muted: 'rgba(255, 255, 255, 0.02)',
      header: 'rgba(8, 9, 14, 0.85)',
    },
    border: {
      glass: 'rgba(255, 255, 255, 0.06)',
      glassHover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(99, 102, 241, 0.5)',
      strong: 'rgba(255, 255, 255, 0.15)',
      subtle: 'rgba(255, 255, 255, 0.04)',
    },
    text: {
      primary: '#EDEDEF',
      secondary: '#8A8F98',
      muted: '#52555E',
      accent: '#A5B4FC',
      white: '#FFFFFF',
    },
    accent: {
      indigo: '#6366F1',
      indigoDark: '#4F46E5',
      indigoLight: 'rgba(99, 102, 241, 0.15)',
      indigoGlow: 'rgba(99, 102, 241, 0.2)',
      indigoMid: '#818CF8',
    },
    info: {
      bg: 'rgba(99, 102, 241, 0.08)',
      border: 'rgba(99, 102, 241, 0.15)',
      text: '#A5B4FC',
    },
    warning: {
      bg: 'rgba(251, 191, 36, 0.08)',
      border: 'rgba(251, 191, 36, 0.2)',
      text: '#FCD34D',
      textDark: '#FBBF24',
    },
    hint: {
      bg: 'rgba(251, 191, 36, 0.06)',
      border: 'rgba(251, 191, 36, 0.15)',
      text: '#FCD34D',
    },
    case: {
      bg: 'rgba(14, 165, 233, 0.06)',
      border: 'rgba(14, 165, 233, 0.15)',
      text: '#7DD3FC',
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.08)',
      text: '#4ADE80',
      badge: '#22C55E',
    },
    danger: {
      text: '#F87171',
      bg: 'rgba(248, 113, 113, 0.08)',
    },
    eval: {
      bg: 'rgba(255, 255, 255, 0.02)',
    },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 },

  font: {
    xs: 11,
    sm: 12,
    body: 13,
    md: 14,
    lg: 16,
    xl: 18,
    title: 22,
    header: 24,
    hero: 32,
  },

  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",

  shadow: {
    glow: '0 0 20px rgba(99, 102, 241, 0.15), 0 0 60px rgba(99, 102, 241, 0.05)',
    card: '0 2px 16px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.08)',
    header: '0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.4)',
  },

  transition: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

/* Reusable glass styles */
export const glass = {
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.border.glass}`,
  borderRadius: theme.radius.lg,
};

export const glassElevated = {
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${theme.colors.border.glassHover}`,
  borderRadius: theme.radius.lg,
};

export const shared = {
  card: {
    ...glass,
    padding: theme.spacing.lg,
    boxShadow: theme.shadow.card,
    transition: `all ${theme.transition.normal}`,
  },

  cardElevated: {
    ...glassElevated,
    padding: theme.spacing.lg,
    boxShadow: theme.shadow.elevated,
  },

  dashedInput: {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${theme.colors.border.glass}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.body,
    fontFamily: 'inherit',
    resize: 'vertical',
    background: 'rgba(255, 255, 255, 0.03)',
    boxSizing: 'border-box',
    lineHeight: 1.7,
    transition: `border-color ${theme.transition.fast}`,
    color: theme.colors.text.primary,
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 14,
    borderBottom: `1px solid ${theme.colors.border.strong}`,
    paddingBottom: 12,
    marginBottom: theme.spacing.lg,
  },

  subSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderBottom: `1px solid ${theme.colors.border.glass}`,
    paddingBottom: 12,
    marginBottom: theme.spacing.lg,
  },

  checkbox: {
    width: 18,
    height: 18,
    accentColor: theme.colors.accent.indigo,
    cursor: 'pointer',
    flexShrink: 0,
  },
};

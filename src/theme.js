/**
 * ROOTS Interview App – Light Theme
 *
 * Clean white background, dark text, subtle shadows.
 * Designed for fast readability in interview situations.
 */

export const theme = {
  colors: {
    bg: {
      deep: '#F5F6F8',
      base: '#FFFFFF',
      elevated: 'rgba(0, 0, 0, 0.02)',
      card: '#FFFFFF',
      cardHover: '#F8F9FA',
      surface: '#F8F9FA',
      muted: '#F1F3F5',
      header: 'rgba(255, 255, 255, 0.92)',
    },
    border: {
      glass: 'rgba(0, 0, 0, 0.08)',
      glassHover: 'rgba(0, 0, 0, 0.14)',
      active: 'rgba(99, 102, 241, 0.5)',
      strong: 'rgba(0, 0, 0, 0.12)',
      subtle: 'rgba(0, 0, 0, 0.05)',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#4A5568',
      muted: '#A0AEC0',
      accent: '#4F46E5',
      white: '#FFFFFF',
    },
    accent: {
      indigo: '#6366F1',
      indigoDark: '#4F46E5',
      indigoLight: 'rgba(99, 102, 241, 0.08)',
      indigoGlow: 'rgba(99, 102, 241, 0.12)',
      indigoMid: '#6366F1',
    },
    info: {
      bg: 'rgba(99, 102, 241, 0.06)',
      border: 'rgba(99, 102, 241, 0.15)',
      text: '#4F46E5',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.06)',
      border: 'rgba(245, 158, 11, 0.2)',
      text: '#B45309',
      textDark: '#92400E',
    },
    hint: {
      bg: 'rgba(245, 158, 11, 0.06)',
      border: 'rgba(245, 158, 11, 0.15)',
      text: '#B45309',
    },
    case: {
      bg: 'rgba(14, 165, 233, 0.06)',
      border: 'rgba(14, 165, 233, 0.15)',
      text: '#0369A1',
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.06)',
      text: '#15803D',
      badge: '#16A34A',
    },
    danger: {
      text: '#DC2626',
      bg: 'rgba(220, 38, 38, 0.06)',
    },
    eval: {
      bg: 'rgba(0, 0, 0, 0.01)',
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
    glow: '0 2px 12px rgba(99, 102, 241, 0.15)',
    card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    header: '0 1px 3px rgba(0, 0, 0, 0.06)',
  },

  transition: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

/* Reusable card styles */
export const glass = {
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.border.glass}`,
  borderRadius: theme.radius.lg,
};

export const glassElevated = {
  background: theme.colors.bg.card,
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
    background: '#FAFBFC',
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

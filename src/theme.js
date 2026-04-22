export const theme = {
  colors: {
    bg: {
      deep: '#f4f7fb',
      base: '#ffffff',
      elevated: 'rgba(0, 0, 0, 0.02)',
      card: '#ffffff',
      cardHover: '#f8fafc',
      surface: '#f8fafc',
      muted: '#f8fafc',
      header: '#ffffff',
    },
    border: {
      glass: '#e2e8f0',
      glassHover: '#cbd5e1',
      active: 'rgba(32, 110, 251, 0.5)',
      strong: '#e2e8f0',
      subtle: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
      accent: '#206efb',
      white: '#ffffff',
    },
    accent: {
      indigo: '#206efb',
      indigoDark: '#165fd9',
      indigoLight: '#eff6ff',
      indigoGlow: 'rgba(32, 110, 251, 0.12)',
      indigoMid: '#206efb',
    },
    info: {
      bg: '#eff6ff',
      border: 'rgba(32, 110, 251, 0.2)',
      text: '#165fd9',
    },
    warning: {
      bg: '#fffbf0',
      border: '#fbbf24',
      text: '#b45309',
      textDark: '#92400e',
    },
    hint: {
      bg: '#fffbf0',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#b45309',
    },
    case: {
      bg: 'rgba(14, 165, 233, 0.06)',
      border: 'rgba(14, 165, 233, 0.2)',
      text: '#0369a1',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.06)',
      text: '#10b981',
      badge: '#10b981',
    },
    danger: {
      text: '#dc2626',
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

  fontFamily: "'Circular Std', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",

  shadow: {
    glow: '0 4px 12px rgba(32, 110, 251, 0.3)',
    card: '0 6px 20px rgba(15, 23, 42, .08)',
    elevated: '0 6px 20px rgba(15, 23, 42, .08)',
    header: '0 6px 20px rgba(15, 23, 42, .08)',
  },

  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
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

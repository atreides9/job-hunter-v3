export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"Menlo"',
      '"Monaco"',
      '"Cascadia Code"',
      '"Roboto Mono"',
      '"Oxygen Mono"',
      '"Ubuntu Monospace"',
      '"Source Code Pro"',
      '"Fira Code"',
      '"Droid Sans Mono"',
      '"Courier New"',
      'monospace',
    ],
  },
  
  // Font Sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem' }], // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }], // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
    '8xl': ['6rem', { lineHeight: '1' }], // 96px
    '9xl': ['8rem', { lineHeight: '1' }], // 128px
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text Scale for Headings and Body
  scale: {
    h1: {
      fontSize: '3rem', // 48px
      lineHeight: '1.1',
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem', // 36px
      lineHeight: '1.2',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem', // 30px
      lineHeight: '1.3',
      fontWeight: '600',
      letterSpacing: 'normal',
    },
    h4: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: 'normal',
    },
    h5: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: 'normal',
    },
    h6: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: 'normal',
    },
    body1: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: 'normal',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.4',
      fontWeight: '400',
      letterSpacing: 'normal',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: 'wide',
    },
    overline: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.3',
      fontWeight: '500',
      letterSpacing: 'widest',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type TypographyToken = typeof typography;
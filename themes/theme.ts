import { colors, typography, spacing, breakpoints, borderRadius, shadows, zIndex } from '../tokens';

export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
  
  // Animation durations following Material Design principles
  animation: {
    duration: {
      fastest: '0.1s',
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s',
      slowest: '0.5s',
    },
    
    easing: {
      easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    
    // Framer Motion spring configs
    spring: {
      gentle: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
      wobbly: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
      stiff: {
        type: 'spring',
        stiffness: 500,
        damping: 40,
      },
    },
  },
  
  // Component specific tokens
  components: {
    button: {
      height: {
        sm: '2rem',    // 32px
        md: '2.5rem',  // 40px
        lg: '3rem',    // 48px
      },
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.75rem 1rem',
        lg: '1rem 1.5rem',
      },
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
    },
    
    card: {
      padding: {
        sm: spacing[4],
        md: spacing[6],
        lg: spacing[8],
      },
      borderRadius: borderRadius.lg,
      shadow: shadows.md,
    },
    
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
      },
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.75rem 1rem',
        lg: '1rem 1.25rem',
      },
      borderRadius: borderRadius.md,
      borderWidth: '1px',
    },
  },
  
  // Layout tokens
  layout: {
    container: {
      maxWidth: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      padding: {
        mobile: spacing[4],
        tablet: spacing[6],
        desktop: spacing[8],
      },
    },
    
    header: {
      height: '4rem', // 64px
      zIndex: zIndex.sticky,
    },
    
    sidebar: {
      width: '16rem', // 256px
      zIndex: zIndex.fixed,
    },
  },
} as const;

export type Theme = typeof theme;
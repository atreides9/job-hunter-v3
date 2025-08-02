import { colors, type ColorToken } from './colors';
import { typography, type TypographyToken } from './typography';
import { 
  spacing, 
  breakpoints, 
  borderRadius, 
  shadows, 
  zIndex,
  type SpacingToken,
  type BreakpointToken,
  type BorderRadiusToken,
  type ShadowToken,
  type ZIndexToken
} from './spacing';

export { colors, typography, spacing, breakpoints, borderRadius, shadows, zIndex };
export type { ColorToken, TypographyToken, SpacingToken, BreakpointToken, BorderRadiusToken, ShadowToken, ZIndexToken };

export const tokens = {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
} as const;

export type DesignTokens = typeof tokens;
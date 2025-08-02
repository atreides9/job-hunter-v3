export { colors, type ColorToken } from './colors';
export { typography, type TypographyToken } from './typography';
export { 
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
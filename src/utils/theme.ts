// Editorial Finance inspired color scheme
export const palette = {
  primary: '#1F1A6F',
  primaryContainer: '#363386',
  primaryLight: '#5654A8',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#A2A0FA',
  inversePrimary: '#C3C0FF',
  primaryFixed: '#E2DFFF',
  primaryFixedDim: '#C3C0FF',

  secondary: '#006C49',
  secondaryContainer: '#6CF8BB',
  onSecondaryContainer: '#00714D',

  tertiary: '#590016',
  tertiaryContainer: '#820024',
  onTertiaryContainer: '#FF8590',
  tertiaryFixedDim: '#FFB2B7',

  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',

  surface: '#F7F9FB',
  surfaceDim: '#D8DADC',
  surfaceBright: '#F7F9FB',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F2F4F6',
  surfaceContainer: '#ECEEF0',
  surfaceContainerHigh: '#E6E8EA',
  surfaceContainerHighest: '#E0E3E5',
  surfaceVariant: '#E0E3E5',

  onSurface: '#191C1E',
  onSurfaceVariant: '#464652',
  outline: '#777683',
  outlineVariant: '#C7C5D4',

  inverseSurface: '#2D3133',
  inverseOnSurface: '#EFF1F3',

  white: '#FFFFFF',
  black: '#000000',

  // Semantic aliases
  owedGreen: '#006C49',
  oweRed: '#BA1A1A',
  owedGreenBg: '#6CF8BB',
  oweRedBg: '#FFDAD6',
};

export const theme = {
  colors: {
    ...palette,
    background: palette.surface,
    text: palette.onSurface,
    textSecondary: palette.onSurfaceVariant,
    border: palette.outlineVariant,
    success: palette.secondary,
    danger: palette.error,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    xxxl: 32,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#1F1A6F',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#1F1A6F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#1F1A6F',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
      elevation: 8,
    },
    fab: {
      shadowColor: '#1F1A6F',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 32,
      elevation: 12,
    },
  },
};

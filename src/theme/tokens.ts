// ============================================================================
// PHOENIX COMMAND — Design Tokens
// Single source of truth for all visual constants
// ============================================================================

export const colors = {
  primary: '#FF1A1A',        // Phoenix Red
  accent: '#D4AF37',         // Gold
  background: '#0a0a0a',     // Near-black
  surface: '#1a1a1a',        // Card/panel bg
  surfaceHover: '#2a2a2a',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.5)',
  textTertiary: 'rgba(255,255,255,0.4)',
  textMuted: 'rgba(255,255,255,0.35)',
  textSubtle: 'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.15)',
  borderRed: 'rgba(255,100,100,0.15)',
  borderRedHover: 'rgba(255,100,100,0.2)',
  borderGold: 'rgba(212,175,55,0.3)',
  borderGoldHover: 'rgba(212,175,55,0.5)',
  borderWhiteSubtle: 'rgba(255,255,255,0.08)',
  borderWhiteLight: 'rgba(255,255,255,0.1)',
  borderWhiteMed: 'rgba(255,255,255,0.2)',
  borderWhiteHeavy: 'rgba(255,255,255,0.3)',
  success: '#00C9A7',
  successGlow: 'rgba(0,201,167,0.6)',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerDark: 'rgba(220,20,60,0.9)',
  glassWhite: 'rgba(255,255,255,0.05)',
  glassWhiteHover: 'rgba(255,255,255,0.08)',
  glassWhiteActive: 'rgba(255,255,255,0.15)',
  overlayBlack: 'rgba(0,0,0,0.3)',
  overlayBlackLight: 'rgba(0,0,0,0.2)',
  overlayBlackHeavy: 'rgba(0,0,0,0.4)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontPrimary: 'Inter, system-ui, sans-serif',
  fontDisplay: 'Cinzel, Georgia, serif',
  h1: { fontSize: '32px', fontWeight: '700' as const, letterSpacing: '3px' },
  h2: { fontSize: '24px', fontWeight: '600' as const, letterSpacing: '2px' },
  h3: { fontSize: '18px', fontWeight: '600' as const },
  body: { fontSize: '16px', fontWeight: '400' as const },
  bodySmall: { fontSize: '14px', fontWeight: '500' as const },
  caption: { fontSize: '13px', fontWeight: '400' as const },
  captionSmall: { fontSize: '11px', fontWeight: '600' as const, letterSpacing: '1px' },
  label: { fontSize: '12px', fontWeight: '500' as const },
} as const;

export const touchTarget = {
  minHeight: 56,
  minWidth: 56,
  padding: spacing.md,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  pill: 24,
  full: 9999,
} as const;

export const gradients = {
  redButton: 'linear-gradient(180deg, rgba(255,26,26,0.95) 0%, rgba(200,20,20,0.9) 100%)',
  redHeader: 'linear-gradient(180deg, rgba(255,26,26,0.98) 0%, rgba(200,20,20,0.95) 100%)',
  goldButton: 'linear-gradient(135deg, #D4AF37, #B8960B)',
  goldAvatar: 'linear-gradient(135deg, #D4AF37, #B8960B)',
  glassCard: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
  splashCard: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
  clockIn: 'linear-gradient(180deg, rgba(0,201,167,0.9) 0%, rgba(0,168,143,0.95) 100%)',
  clockOut: 'linear-gradient(180deg, rgba(220,20,60,0.9) 0%, rgba(180,20,50,0.95) 100%)',
  redGlow: 'radial-gradient(circle, rgba(255,100,100,0.15) 0%, rgba(255,50,50,0.08) 30%, rgba(200,20,20,0.03) 50%, transparent 70%)',
  redGlowSubtle: 'radial-gradient(ellipse, rgba(255,50,50,0.08) 0%, transparent 70%)',
  chatPanel: 'linear-gradient(165deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.99) 100%)',
  aiBubble: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
  userBubble: 'linear-gradient(135deg, rgba(255,26,26,0.8) 0%, rgba(200,20,20,0.9) 100%)',
  teamsRedHover: 'linear-gradient(180deg, rgba(255,26,26,0.8) 0%, rgba(200,20,20,0.9) 100%)',
  teamsGoldHover: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(184,150,11,0.4) 100%)',
} as const;

export const shadows = {
  card: 'inset 0 0 20px rgba(255,50,50,0.03), 0 8px 32px rgba(0,0,0,0.3)',
  header: '0 4px 20px rgba(0,0,0,0.4)',
  redButton: '0 4px 20px rgba(255,26,26,0.3)',
  goldButton: '0 4px 20px rgba(212,175,55,0.3)',
  clockIn: '0 4px 20px rgba(0,201,167,0.3)',
  clockOut: '0 4px 20px rgba(220,20,60,0.3)',
  chatFab: '0 4px 20px rgba(255,26,26,0.4), 0 0 40px rgba(255,26,26,0.2)',
  chatFabHover: '0 8px 30px rgba(255,26,26,0.5), 0 0 60px rgba(255,26,26,0.3)',
  chatPanel: '0 8px 32px rgba(0,0,0,0.5), 0 0 60px rgba(255,26,26,0.1)',
  splashCard: 'inset 0 0 30px rgba(255,50,50,0.05), 0 20px 60px rgba(0,0,0,0.5)',
  splashButton: '0 4px 20px rgba(255,26,26,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
  splashButtonHover: '0 8px 30px rgba(255,26,26,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
  logo: '0 2px 8px rgba(0,0,0,0.3)',
  avatar: '0 2px 8px rgba(0,0,0,0.3)',
} as const;


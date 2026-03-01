// ============================================================================
// PHOENIX COMMAND — Shared Style Objects
// Composed from tokens, imported by components
// ============================================================================

import React from 'react';
import { colors, spacing, borderRadius, touchTarget, typography, gradients, shadows } from './tokens';

// Re-export legacy names for backward compatibility during migration
export const PHOENIX_RED = colors.primary;
export const PHOENIX_GOLD = colors.accent;
export const PHOENIX_BLACK = colors.background;

// Common glass card style used across Dashboard, Files, Teams, DailyLog screens
export const glassCard: React.CSSProperties = {
  background: gradients.glassCard,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${colors.borderRed}`,
  borderRadius: borderRadius.xxl,
  padding: `${spacing.lg}px`,
  marginBottom: '20px',
  boxShadow: shadows.card,
  position: 'relative',
  zIndex: 1,
};

// Red gradient button (primary action)
export const primaryButton: React.CSSProperties = {
  background: gradients.redButton,
  border: 'none',
  color: colors.text,
  borderRadius: borderRadius.lg,
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: shadows.redButton,
  minHeight: touchTarget.minHeight,
};

// Gold gradient button (secondary action)
export const goldButton: React.CSSProperties = {
  background: gradients.goldButton,
  color: colors.surface,
  border: 'none',
  borderRadius: borderRadius.lg,
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  boxShadow: shadows.goldButton,
  minHeight: touchTarget.minHeight,
};

// Common text input style
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: colors.glassWhite,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  fontSize: '13px',
  outline: 'none',
  color: colors.text,
  minHeight: touchTarget.minHeight,
};

// Screen container shared by all inner screens
export const screenContainer: React.CSSProperties = {
  background: colors.background,
  minHeight: 'calc(100vh - 160px)',
  padding: `${spacing.xl}px ${spacing.lg}px`,
  position: 'relative',
};

// Subtle red glow background overlay
export const redGlowOverlay: React.CSSProperties = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '80%',
  height: '60%',
  background: gradients.redGlowSubtle,
  pointerEvents: 'none',
};

// Screen title style
export const screenTitle: React.CSSProperties = {
  color: colors.text,
  fontSize: typography.h2.fontSize,
  fontWeight: typography.h2.fontWeight,
  marginBottom: `${spacing.lg}px`,
  textTransform: 'uppercase',
  letterSpacing: typography.h2.letterSpacing,
  fontFamily: typography.fontDisplay,
  position: 'relative',
  zIndex: 1,
};

// Section header inside glass cards
export const sectionHeader: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: `${spacing.md}px`,
  display: 'flex',
  alignItems: 'center',
  gap: `${spacing.sm}px`,
  color: colors.text,
  letterSpacing: '1px',
};

// Label style for form fields
export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: typography.captionSmall.fontSize,
  fontWeight: typography.captionSmall.fontWeight,
  marginBottom: `${spacing.sm}px`,
  color: colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: typography.captionSmall.letterSpacing,
};


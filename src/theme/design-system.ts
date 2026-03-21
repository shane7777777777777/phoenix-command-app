// ============================================================================
// PHOENIX COMMAND -- Design System
// CSS custom properties with --px- prefix and SVG icon system
// ============================================================================

// --- CSS Custom Properties ---
// These are injected via index.css :root; this module provides the JS mapping.

export const cssVars = {
  // Colors
  '--px-color-primary': '#FF1A1A',
  '--px-color-accent': '#D4AF37',
  '--px-color-background': '#0a0a0a',
  '--px-color-surface': '#1a1a1a',
  '--px-color-surface-hover': '#2a2a2a',
  '--px-color-text': '#FFFFFF',
  '--px-color-text-secondary': 'rgba(255,255,255,0.5)',
  '--px-color-text-tertiary': 'rgba(255,255,255,0.4)',
  '--px-color-text-muted': 'rgba(255,255,255,0.35)',
  '--px-color-success': '#00C9A7',
  '--px-color-warning': '#F59E0B',
  '--px-color-danger': '#EF4444',
  '--px-color-border': 'rgba(255,255,255,0.15)',

  // Spacing
  '--px-spacing-xs': '4px',
  '--px-spacing-sm': '8px',
  '--px-spacing-md': '16px',
  '--px-spacing-lg': '24px',
  '--px-spacing-xl': '32px',
  '--px-spacing-xxl': '48px',

  // Typography
  '--px-font-primary': 'Inter, system-ui, sans-serif',
  '--px-font-display': 'Cinzel, Georgia, serif',
  '--px-font-size-xs': '11px',
  '--px-font-size-sm': '13px',
  '--px-font-size-md': '16px',
  '--px-font-size-lg': '18px',
  '--px-font-size-xl': '24px',
  '--px-font-size-xxl': '32px',

  // Border Radius
  '--px-radius-sm': '6px',
  '--px-radius-md': '8px',
  '--px-radius-lg': '10px',
  '--px-radius-xl': '12px',
  '--px-radius-xxl': '16px',
  '--px-radius-pill': '24px',

  // Touch targets
  '--px-touch-min': '56px',

  // Shadows
  '--px-shadow-card': 'inset 0 0 20px rgba(255,50,50,0.03), 0 8px 32px rgba(0,0,0,0.3)',
  '--px-shadow-header': '0 4px 20px rgba(0,0,0,0.4)',
} as const;

// --- SVG Icon System ---
// Returns an SVG string for the given icon name. No emoji.

const iconPaths: Record<string, string> = {
  wrench:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  bolt:
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  truck:
    '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 4v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  clock:
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  chat:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  search:
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  location:
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  notification:
    '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  home:
    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  clipboard:
    '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
  file:
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  'file-text':
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  check:
    '<polyline points="20 6 9 17 4 12"/>',
  x:
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'chevron-right':
    '<polyline points="9 18 15 12 9 6"/>',
  'chevron-down':
    '<polyline points="6 9 12 15 18 9"/>',
  zap:
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  'map-pin':
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  send:
    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  book:
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  'alert-circle':
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'bar-chart':
    '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
};

/**
 * Create an SVG element string for the named icon.
 * Returns a complete <svg> string. No emoji.
 * @param name - Icon name from the Phoenix icon set
 * @param size - Icon size in pixels (default 24)
 */
export function createIcon(name: string, size: number = 24): string {
  const pathData = iconPaths[name];
  if (!pathData) {
    // Return a fallback empty square icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${pathData}</svg>`;
}

/**
 * Create an SVG data URI suitable for use as a CSS background-image or img src.
 * @param name - Icon name
 * @param size - Icon size in pixels
 * @param color - Stroke color (default "currentColor")
 */
export function createIconDataUri(
  name: string,
  size: number = 24,
  color: string = 'white',
): string {
  const svg = createIcon(name, size).replace('currentColor', color);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** All available icon names */
export const phoenixIcons = Object.keys(iconPaths);

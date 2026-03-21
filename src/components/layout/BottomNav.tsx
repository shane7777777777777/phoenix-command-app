import React from 'react';
import { Home, Calendar, AlertTriangle, Book, FileText } from 'lucide-react';
import { colors, touchTarget, spacing } from '../../theme/tokens';
import type { Screen } from '../../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'dispatch', label: 'Dispatch', icon: AlertTriangle },
  { id: 'knowledge', label: 'Knowledge', icon: Book },
  { id: 'files', label: 'Files', icon: FileText },
];

/**
 * BottomNav -- bottom tab navigation for mobile.
 * Includes Dashboard, Schedule, Dispatch, Knowledge, and Files.
 */
const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => (
  <div style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: colors.surface,
    borderTop: `1px solid ${colors.borderRed}`,
    display: 'flex',
    justifyContent: 'space-around',
    padding: `${spacing.sm}px 0`,
    paddingBottom: `calc(${spacing.sm}px + env(safe-area-inset-bottom, 0px))`,
    zIndex: 900,
  }}>
    {navItems.map(({ id, label, icon: Icon }) => {
      const active = currentScreen === id;
      return (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            cursor: 'pointer',
            minHeight: touchTarget.minHeight,
            minWidth: touchTarget.minWidth,
            justifyContent: 'center',
            color: active ? colors.primary : colors.textSecondary,
            padding: `${spacing.xs}px`,
          }}
        >
          <Icon size={22} />
          <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400' }}>{label}</span>
        </button>
      );
    })}
  </div>
);

export default BottomNav;

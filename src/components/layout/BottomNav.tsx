import React from 'react';
import { Clock, FileText, Users, Home, ClipboardList } from 'lucide-react';
import { colors, touchTarget, borderRadius, spacing, gradients } from '../../theme/tokens';
import type { Screen } from '../../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string; icon: typeof Clock }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'timeclock', label: 'Time', icon: Clock },
  { id: 'dailylog', label: 'Log', icon: ClipboardList },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'teams', label: 'Teams', icon: Users },
];

/**
 * BottomNav — optional bottom tab navigation for mobile.
 * Currently the app uses the TopMenu/Header for navigation,
 * so this component is available but not wired in by default.
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


import React from 'react';
import { Clock, FileText, Users } from 'lucide-react';
import { colors, typography, gradients, shadows, touchTarget, borderRadius, spacing } from '../../theme/tokens';
import type { Screen } from '../../types';

interface HeaderProps {
  userName: string;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const navItems: { id: Screen; label: string; icon: typeof Clock | null }[] = [
  { id: 'dashboard', label: 'HOME', icon: null },
  { id: 'files', label: 'FILES', icon: FileText },
  { id: 'teams', label: 'TEAMS', icon: Users },
  { id: 'timeclock', label: 'TIME CLOCK', icon: Clock },
];

const Header: React.FC<HeaderProps> = ({ userName, currentScreen, onNavigate, onLogout }) => (
  <div style={{
    background: gradients.redHeader,
    padding: `${spacing.md}px ${spacing.lg}px`,
    boxShadow: shadows.header,
    position: 'relative',
  }}>
    {/* Black accent line under header */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: '#000000',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    }} />

    {/* Logo and Company Name */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: `${spacing.md}px`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/phoenix-logo.png"
          alt="Phoenix"
          style={{
            width: '40px',
            height: 'auto',
            borderRadius: `${borderRadius.sm}px`,
            boxShadow: shadows.logo,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const next = (e.target as HTMLImageElement).nextSibling as HTMLElement;
            if (next) next.style.display = 'inline';
          }}
        />
        <span style={{ fontSize: '32px', display: 'none' }}>🔥</span>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text,
            letterSpacing: '2px',
            fontFamily: typography.fontDisplay,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            PHOENIX OPS
          </div>
          <div style={{
            fontSize: '11px',
            color: colors.accent,
            letterSpacing: '1px',
          }}>
            Command Center
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.9)',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: gradients.goldAvatar,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          color: colors.surface,
          fontSize: '12px',
        }}>
          {userName ? userName.split(' ').map(n => n[0]).join('') : 'U'}
        </div>
        <span style={{ fontWeight: '500' }}>{userName}</span>
        <button
          onClick={onLogout}
          style={{
            background: colors.overlayBlackLight,
            border: `1px solid ${colors.borderWhiteHeavy}`,
            color: 'rgba(255,255,255,0.9)',
            padding: '6px 14px',
            borderRadius: `${borderRadius.sm}px`,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: touchTarget.minHeight,
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = colors.overlayBlackHeavy;
            e.currentTarget.style.color = colors.text;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = colors.overlayBlackLight;
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
        >
          Logout
        </button>
      </div>
    </div>

    {/* Menu Buttons */}
    <div style={{
      display: 'flex',
      gap: `${spacing.sm}px`,
      flexWrap: 'wrap',
    }}>
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          style={{
            background: currentScreen === id ? colors.overlayBlack : 'rgba(255,255,255,0.1)',
            color: colors.text,
            border: 'none',
            padding: '10px 20px',
            borderRadius: `${borderRadius.sm}px`,
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: `${spacing.sm}px`,
            transition: 'all 0.2s ease',
            letterSpacing: '0.5px',
            minHeight: touchTarget.minHeight,
          }}
          onMouseOver={(e) => {
            if (currentScreen !== id) {
              e.currentTarget.style.background = colors.glassWhiteActive;
            }
          }}
          onMouseOut={(e) => {
            if (currentScreen !== id) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
        >
          {Icon && <Icon size={16} />}
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default Header;


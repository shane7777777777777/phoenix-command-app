import React from 'react';
import { colors, gradients, borderRadius, touchTarget } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';

const TeamsScreen: React.FC = () => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />
    <h2 style={screenTitle}>TEAMS & COMMUNICATION</h2>

    {/* Quick Actions */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>💬</span>
        QUICK ACTIONS
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: '💬', label: 'Open Teams Messages' },
          { icon: '📢', label: 'View Channels' },
          { icon: '📹', label: 'Start Video Call' },
        ].map((action, idx) => (
          <button
            key={idx}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.glassWhite,
              border: `1px solid ${colors.borderRedHover}`,
              borderRadius: `${borderRadius.lg}px`,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              color: colors.text,
              minHeight: touchTarget.minHeight,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = gradients.teamsRedHover;
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = colors.glassWhite;
              e.currentTarget.style.borderColor = colors.borderRedHover;
            }}
          >
            <span style={{ fontSize: '20px' }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>

    {/* OneNote */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📝</span>
        ONENOTE
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: '💾', label: 'Save to OneNote' },
          { icon: '📔', label: 'View My Notebooks' },
        ].map((action, idx) => (
          <button
            key={idx}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.glassWhite,
              border: `1px solid ${colors.borderGold}`,
              borderRadius: `${borderRadius.lg}px`,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              color: colors.text,
              minHeight: touchTarget.minHeight,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = gradients.teamsGoldHover;
              e.currentTarget.style.borderColor = colors.borderGoldHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = colors.glassWhite;
              e.currentTarget.style.borderColor = colors.borderGold;
            }}
          >
            <span style={{ fontSize: '20px' }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default TeamsScreen;


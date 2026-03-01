import React from 'react';
import { colors, gradients } from '../theme/tokens';
import { screenContainer, redGlowOverlay, screenTitle } from '../theme/styles';

interface TimeClockScreenProps {
  weekHours: number;
}

const TimeClockScreen: React.FC<TimeClockScreenProps> = ({ weekHours }) => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />

    <h2 style={{ ...screenTitle, marginBottom: '8px' }}>WEEKLY TIMESHEET</h2>

    <div style={{
      color: 'rgba(255,255,255,0.6)',
      fontSize: '14px',
      marginBottom: '24px',
      position: 'relative',
      zIndex: 1,
    }}>
      This Week • Total: <span style={{ color: colors.accent, fontWeight: '600' }}>{weekHours}h</span>
    </div>

    {/* Empty state */}
    <div style={{ textAlign: 'center', padding: '20px', color: colors.textTertiary }}>
      No entries this week
    </div>

    {/* Upcoming Days */}
    <div style={{
      background: 'linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${colors.borderWhiteLight}`,
      borderRadius: '16px',
      padding: '20px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: '11px',
        fontWeight: '600',
        marginBottom: '12px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        UPCOMING DAYS
      </div>
      <div style={{
        display: 'flex',
        gap: '16px',
        color: colors.textTertiary,
        fontSize: '13px',
        fontWeight: '500',
      }}>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div style={{ color: 'rgba(255,255,255,0.25)' }}>SAT</div>
        <div style={{ color: 'rgba(255,255,255,0.25)' }}>SUN</div>
      </div>
    </div>
  </div>
);

export default TimeClockScreen;


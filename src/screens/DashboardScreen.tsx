import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { colors, gradients, shadows, touchTarget, borderRadius, spacing } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import type { Screen } from '../types';

interface DashboardScreenProps {
  clockedIn: boolean;
  clockTime: Date | null;
  todayHours: number;
  weekHours: number;
  jobsThisWeek: number;
  logsSubmitted: number;
  isLoading: boolean;
  onClockToggle: () => void;
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  clockedIn, clockTime, todayHours, weekHours,
  jobsThisWeek, logsSubmitted, isLoading,
  onClockToggle, onNavigate,
}) => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />
    <h2 style={screenTitle}>DASHBOARD</h2>

    {/* Time Status Card */}
    <div style={glassCard}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: `${spacing.md}px`,
      }}>
        <h3 style={{ ...sectionHeader, margin: 0 }}>
          <Clock size={18} color={colors.accent} />
          TIME STATUS
        </h3>
        <span style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: clockedIn ? colors.success : colors.textSubtle,
          boxShadow: clockedIn ? `0 0 12px ${colors.successGlow}` : 'none',
        }} />
      </div>

      <div style={{ marginBottom: `${spacing.md}px` }}>
        <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
          {clockedIn ? 'Clocked In:' : 'Status:'}
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: colors.text }}>
          {clockedIn ? (clockTime ? clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--') : 'Clocked Out'}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: `${spacing.md}px`,
        marginBottom: `${spacing.md}px`,
      }}>
        <div>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Today
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.accent }}>
            {todayHours}h
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            This Week
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.accent }}>
            {weekHours}h
          </div>
        </div>
      </div>

      <button
        onClick={onClockToggle}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px',
          background: clockedIn ? gradients.clockOut : gradients.clockIn,
          color: colors.text,
          border: 'none',
          borderRadius: `${borderRadius.lg}px`,
          fontSize: '14px',
          fontWeight: '700',
          cursor: isLoading ? 'wait' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          opacity: isLoading ? 0.7 : 1,
          boxShadow: clockedIn ? shadows.clockOut : shadows.clockIn,
          minHeight: touchTarget.minHeight,
        }}
      >
        {isLoading ? 'Processing...' : (clockedIn ? 'CLOCK OUT' : 'CLOCK IN')}
      </button>
    </div>

    {/* Today's Work Card */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📝</span>
        TODAY'S WORK
      </h3>

      <div style={{ marginBottom: `${spacing.md}px` }}>
        <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
          No recent activity
        </div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>
          No active jobs
        </div>
        <div style={{ fontSize: '13px', color: colors.accent }}>
          Clock in to start
        </div>
      </div>

      <button
        onClick={() => onNavigate('dailylog')}
        style={{
          width: '100%',
          padding: '14px',
          background: gradients.goldButton,
          color: colors.surface,
          border: 'none',
          borderRadius: `${borderRadius.lg}px`,
          fontSize: '14px',
          fontWeight: '700',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${spacing.sm}px`,
          boxShadow: shadows.goldButton,
          minHeight: touchTarget.minHeight,
        }}
      >
        LOG NEW WORK
        <ChevronRight size={18} />
      </button>
    </div>

    {/* Quick Stats Card */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📊</span>
        QUICK STATS
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Jobs this week</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: colors.text }}>{jobsThisWeek}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Logs submitted</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: colors.text }}>{logsSubmitted}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Next job</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: colors.primary }}>
            No recent site
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardScreen;


// ============================================================================
// PHOENIX COMMAND -- Enhanced Dashboard Screen
// Real-time Echo AI chat, task/dispatch, schedule, knowledge, CRM stubs
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, ChevronRight, Send, MapPin, Search, Calendar,
  AlertTriangle, MessageSquare, Zap,
} from 'lucide-react';
import { colors, gradients, shadows, touchTarget, borderRadius, spacing } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import type { Screen, ChatMessage, ScheduleEntry, Dispatch } from '../types';

// TODO(gateway): Import EchoGatewayClient for real-time chat
// import { connect, sendChat, on, off, getState } from '../gateway/EchoGatewayClient';
// TODO(gateway): Import echo-api for REST calls
// import { askEcho, getJobs, getSchedule, getDispatch, getCustomer } from '../api/echo-api';

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

// TODO(gateway): Replace mock data with live getSchedule() calls
const mockTodaySchedule: ScheduleEntry[] = [
  {
    id: 'sch-001',
    jobId: 'job-101',
    jobName: 'Panel Upgrade - Johnson',
    address: '1234 Oak St, Phoenix AZ',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '12:00',
    status: 'scheduled',
    customerName: 'Mike Johnson',
  },
  {
    id: 'sch-002',
    jobId: 'job-102',
    jobName: 'EV Charger - Smith',
    address: '5678 Elm Ave, Scottsdale AZ',
    date: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '16:00',
    status: 'scheduled',
    customerName: 'Sarah Smith',
  },
];

// TODO(gateway): Replace with live getDispatch() calls
const mockPendingDispatches: Dispatch[] = [];

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  clockedIn, clockTime, todayHours, weekHours,
  jobsThisWeek, logsSubmitted, isLoading,
  onClockToggle, onNavigate,
}) => {
  // Echo AI Chat Panel
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Hi! I can help with NEC codes, job info, customer lookups, and Rexel products. Ask me anything.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    try {
      // TODO(gateway): Use sendChat() via WebSocket or askEcho() via REST
      await new Promise((resolve) => setTimeout(resolve, 800));
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `I received your message: "${userMsg}". Connect to Echo Gateway to get live AI responses.`,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', content: `Sorry, I could not process that request. Please try again.` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
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

      {/* Today's Schedule Card */}
      <div style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${spacing.md}px` }}>
          <h3 style={{ ...sectionHeader, margin: 0 }}>
            <Calendar size={18} color={colors.accent} />
            TODAY'S SCHEDULE
          </h3>
          <button
            onClick={() => onNavigate('schedule')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.accent,
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            VIEW ALL <ChevronRight size={12} />
          </button>
        </div>

        {mockTodaySchedule.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: colors.textTertiary, fontSize: '13px' }}>
            No jobs scheduled for today
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockTodaySchedule.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: '12px',
                  background: colors.glassWhite,
                  border: `1px solid ${colors.borderWhiteSubtle}`,
                  borderLeft: `3px solid ${colors.accent}`,
                  borderRadius: `${borderRadius.md}px`,
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
                  {entry.jobName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: colors.accent }}>
                    <Clock size={11} />
                    {entry.startTime} - {entry.endTime}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: colors.textSecondary }}>
                    <MapPin size={11} />
                    {entry.address}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dispatch Alerts */}
      {mockPendingDispatches.length > 0 && (
        <div style={{ ...glassCard, borderColor: colors.warning + '40' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${spacing.md}px` }}>
            <h3 style={{ ...sectionHeader, margin: 0 }}>
              <AlertTriangle size={18} color={colors.warning} />
              PENDING DISPATCHES
            </h3>
            <button
              onClick={() => onNavigate('dispatch')}
              style={{
                background: colors.warning + '20',
                border: `1px solid ${colors.warning}40`,
                borderRadius: `${borderRadius.pill}px`,
                color: colors.warning,
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 12px',
                cursor: 'pointer',
              }}
            >
              {mockPendingDispatches.length} NEW
            </button>
          </div>
        </div>
      )}

      {/* Echo AI Chat Panel */}
      <div style={glassCard}>
        <h3 style={{ ...sectionHeader, marginBottom: `${spacing.md}px` }}>
          <MessageSquare size={18} color={colors.accent} />
          ECHO AI ASSISTANT
        </h3>

        {/* Chat Messages */}
        <div
          style={{
            height: '200px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: `${spacing.md}px`,
            padding: '8px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: `${borderRadius.md}px`,
            border: `1px solid ${colors.borderWhiteSubtle}`,
          }}
        >
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                background: msg.role === 'ai' ? gradients.aiBubble : gradients.userBubble,
                color: colors.text,
                padding: '10px 12px',
                borderRadius: msg.role === 'ai' ? '10px 10px 10px 4px' : '10px 10px 4px 10px',
                fontSize: '12px',
                lineHeight: '1.5',
                alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                border: msg.role === 'ai'
                  ? `1px solid ${colors.borderWhiteLight}`
                  : '1px solid rgba(255,100,100,0.3)',
              }}
            >
              {msg.role === 'ai' && <span style={{ color: colors.accent, fontWeight: '600' }}>Echo: </span>}
              {msg.content}
            </div>
          ))}
          {isChatLoading && (
            <div
              style={{
                alignSelf: 'flex-start',
                fontSize: '12px',
                color: colors.textTertiary,
                padding: '8px 12px',
              }}
            >
              Echo is thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ display: 'flex', gap: `${spacing.sm}px` }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
            placeholder="Ask Echo about codes, products, jobs..."
            style={{
              flex: 1,
              padding: '12px 14px',
              background: colors.glassWhite,
              border: `1px solid ${colors.borderGold}`,
              borderRadius: `${borderRadius.md}px`,
              fontSize: '13px',
              outline: 'none',
              color: colors.text,
              minHeight: touchTarget.minHeight,
            }}
          />
          <button
            onClick={handleChatSend}
            disabled={isChatLoading || !chatInput.trim()}
            style={{
              padding: '12px 16px',
              background: gradients.redButton,
              color: colors.text,
              border: 'none',
              borderRadius: `${borderRadius.md}px`,
              cursor: isChatLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: touchTarget.minHeight,
              opacity: isChatLoading || !chatInput.trim() ? 0.6 : 1,
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <Zap size={18} color={colors.accent} />
          QUICK ACTIONS
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${spacing.sm}px` }}>
          {([
            { label: 'LOG WORK', screen: 'dailylog' as Screen, icon: ChevronRight },
            { label: 'DISPATCH', screen: 'dispatch' as Screen, icon: AlertTriangle },
            { label: 'KNOWLEDGE', screen: 'knowledge' as Screen, icon: Search },
            { label: 'SCHEDULE', screen: 'schedule' as Screen, icon: Calendar },
          ]).map(({ label, screen, icon: Icon }) => (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              style={{
                padding: '14px',
                background: colors.glassWhite,
                border: `1px solid ${colors.borderRedHover}`,
                borderRadius: `${borderRadius.lg}px`,
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: colors.text,
                minHeight: touchTarget.minHeight,
              }}
            >
              <Icon size={14} color={colors.accent} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Card */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <Zap size={18} color={colors.accent} />
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
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>ServiceFusion</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textTertiary }}>
              Connect CRM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

// ============================================================================
// PHOENIX COMMAND -- Dispatch Screen
// Job dispatch queue with accept/decline/details
// ============================================================================

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertTriangle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { colors, gradients, shadows, borderRadius, touchTarget, spacing } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import type { Dispatch } from '../types';

// TODO(gateway): Import and use echo-api getDispatch() and respondToDispatch()
// import { getDispatch, respondToDispatch } from '../api/echo-api';

interface DispatchScreenProps {
  onNavigate?: (screen: string) => void;
}

const priorityColors: Record<string, string> = {
  urgent: colors.danger,
  high: colors.warning,
  normal: colors.accent,
  low: colors.textSecondary,
};

const statusLabels: Record<string, string> = {
  pending: 'AWAITING RESPONSE',
  accepted: 'ACCEPTED',
  declined: 'DECLINED',
  'en-route': 'EN ROUTE',
  'on-site': 'ON SITE',
  completed: 'COMPLETED',
};

// TODO(gateway): Replace with live data from getDispatch()
const mockDispatches: Dispatch[] = [
  {
    id: 'disp-001',
    jobId: 'job-101',
    job: {
      id: 'job-101',
      name: 'Panel Upgrade - Johnson Residence',
      address: '1234 Oak St, Phoenix AZ 85001',
      status: 'scheduled',
      priority: 'high',
      estimatedDuration: 4,
      description: '200A panel upgrade, replace Federal Pacific breaker panel',
    },
    status: 'pending',
    assignedAt: new Date().toISOString(),
    priority: 'high',
    customerName: 'Mike Johnson',
    customerPhone: '(602) 555-0142',
  },
  {
    id: 'disp-002',
    jobId: 'job-102',
    job: {
      id: 'job-102',
      name: 'EV Charger Install - Smith',
      address: '5678 Elm Ave, Scottsdale AZ 85251',
      status: 'scheduled',
      priority: 'normal',
      estimatedDuration: 3,
      description: 'Install Level 2 EV charger in garage, new 50A circuit from panel',
    },
    status: 'pending',
    assignedAt: new Date(Date.now() - 3600000).toISOString(),
    priority: 'normal',
    customerName: 'Sarah Smith',
    customerPhone: '(480) 555-0198',
  },
];

const DispatchScreen: React.FC<DispatchScreenProps> = () => {
  const [dispatches, setDispatches] = useState<Dispatch[]>(mockDispatches);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO(gateway): Fetch dispatches on mount
  useEffect(() => {
    // TODO(gateway): Call getDispatch() and set state
  }, []);

  const handleRespond = async (dispatchId: string, action: 'accept' | 'decline') => {
    setIsLoading(true);
    try {
      // TODO(gateway): Call respondToDispatch(dispatchId, action)
      setDispatches((prev) =>
        prev.map((d) =>
          d.id === dispatchId
            ? { ...d, status: action === 'accept' ? 'accepted' : 'declined', respondedAt: new Date().toISOString() }
            : d,
        ),
      );
    } catch (err) {
      console.error('[Dispatch] Response failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = dispatches.filter((d) => d.status === 'pending').length;

  return (
    <div style={screenContainer}>
      <div style={redGlowOverlay} />
      <h2 style={screenTitle}>DISPATCH</h2>

      {/* Summary Card */}
      <div style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ ...sectionHeader, margin: 0 }}>
            <AlertTriangle size={18} color={colors.accent} />
            DISPATCH QUEUE
          </h3>
          <span
            style={{
              background: pendingCount > 0 ? colors.danger : colors.success,
              color: colors.text,
              padding: '4px 12px',
              borderRadius: `${borderRadius.pill}px`,
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            {pendingCount} PENDING
          </span>
        </div>
      </div>

      {/* Dispatch Cards */}
      {dispatches.map((dispatch) => {
        const isExpanded = expandedId === dispatch.id;
        const isPending = dispatch.status === 'pending';

        return (
          <div key={dispatch.id} style={{ ...glassCard, borderColor: priorityColors[dispatch.priority] + '40' }}>
            {/* Header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : dispatch.id)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: 0,
                color: colors.text,
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: priorityColors[dispatch.priority],
                    }}
                  >
                    {dispatch.priority}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: isPending ? colors.warning : colors.success,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {statusLabels[dispatch.status]}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                  {dispatch.job.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.textSecondary }}>
                  <MapPin size={12} />
                  {dispatch.job.address}
                </div>
              </div>
              <ChevronRight
                size={18}
                color={colors.textTertiary}
                style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginTop: '4px',
                }}
              />
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div style={{ marginTop: `${spacing.md}px`, paddingTop: `${spacing.md}px`, borderTop: `1px solid ${colors.border}` }}>
                {dispatch.job.description && (
                  <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '12px', lineHeight: '1.5' }}>
                    {dispatch.job.description}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                      Customer
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>
                      {dispatch.customerName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                      Phone
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>
                      {dispatch.customerPhone || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                      Est. Duration
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.accent, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {dispatch.job.estimatedDuration ? `${dispatch.job.estimatedDuration}h` : 'TBD'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                      Assigned
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>
                      {new Date(dispatch.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isPending && (
                  <div style={{ display: 'flex', gap: `${spacing.sm}px` }}>
                    <button
                      onClick={() => handleRespond(dispatch.id, 'accept')}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: gradients.clockIn,
                        color: colors.text,
                        border: 'none',
                        borderRadius: `${borderRadius.lg}px`,
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: isLoading ? 'wait' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: shadows.clockIn,
                        minHeight: touchTarget.minHeight,
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      <CheckCircle size={16} />
                      ACCEPT
                    </button>
                    <button
                      onClick={() => handleRespond(dispatch.id, 'decline')}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: gradients.clockOut,
                        color: colors.text,
                        border: 'none',
                        borderRadius: `${borderRadius.lg}px`,
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: isLoading ? 'wait' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: shadows.clockOut,
                        minHeight: touchTarget.minHeight,
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      <XCircle size={16} />
                      DECLINE
                    </button>
                  </div>
                )}

                {!isPending && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: dispatch.status === 'accepted' ? colors.success : colors.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {dispatch.status === 'accepted' ? 'Job Accepted' : 'Job Declined'}
                    {dispatch.respondedAt &&
                      ` at ${new Date(dispatch.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {dispatches.length === 0 && (
        <div style={{ ...glassCard, textAlign: 'center', padding: '40px 24px' }}>
          <CheckCircle size={40} color={colors.success} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
            All Clear
          </div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            No pending dispatches
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchScreen;

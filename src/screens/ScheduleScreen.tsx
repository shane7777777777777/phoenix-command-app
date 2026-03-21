// ============================================================================
// PHOENIX COMMAND -- Schedule Screen
// Weekly schedule view with job timeline
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { colors, gradients, shadows, borderRadius, touchTarget, spacing } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import type { ScheduleEntry } from '../types';

// TODO(gateway): Import and use echo-api getSchedule()
// import { getSchedule } from '../api/echo-api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDates(baseDate: Date): Date[] {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const statusColors: Record<string, string> = {
  scheduled: colors.accent,
  'in-progress': colors.success,
  completed: colors.textSecondary,
  cancelled: colors.danger,
};

// TODO(gateway): Replace with live data from getSchedule()
const mockEntries: ScheduleEntry[] = [
  {
    id: 'sch-001',
    jobId: 'job-101',
    jobName: 'Panel Upgrade - Johnson',
    address: '1234 Oak St, Phoenix AZ',
    date: formatDate(new Date()),
    startTime: '08:00',
    endTime: '12:00',
    status: 'scheduled',
    customerName: 'Mike Johnson',
    notes: '200A panel upgrade',
  },
  {
    id: 'sch-002',
    jobId: 'job-102',
    jobName: 'EV Charger - Smith',
    address: '5678 Elm Ave, Scottsdale AZ',
    date: formatDate(new Date()),
    startTime: '13:00',
    endTime: '16:00',
    status: 'scheduled',
    customerName: 'Sarah Smith',
    notes: 'Level 2 charger install',
  },
  {
    id: 'sch-003',
    jobId: 'job-103',
    jobName: 'Lighting Retrofit - Corp Office',
    address: '900 Central Ave, Phoenix AZ',
    date: formatDate(new Date(Date.now() + 86400000)),
    startTime: '09:00',
    endTime: '17:00',
    status: 'scheduled',
    customerName: 'Desert Corp',
    notes: 'LED retrofit, 3rd floor',
  },
];

const ScheduleScreen: React.FC = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [entries, setEntries] = useState<ScheduleEntry[]>(mockEntries);

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);

  // TODO(gateway): Fetch schedule when week changes
  useEffect(() => {
    const start = formatDate(weekDates[0]);
    const end = formatDate(weekDates[6]);
    // TODO(gateway): Call getSchedule(start, end) and set state
  }, [weekDates]);

  const todayStr = formatDate(new Date());

  const dayEntries = entries
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekLabel = `${formatDisplayDate(weekDates[0])} - ${formatDisplayDate(weekDates[6])}`;

  return (
    <div style={screenContainer}>
      <div style={redGlowOverlay} />
      <h2 style={screenTitle}>SCHEDULE</h2>

      {/* Week Navigator */}
      <div style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${spacing.md}px` }}>
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            style={{
              background: colors.glassWhite,
              border: `1px solid ${colors.border}`,
              borderRadius: `${borderRadius.md}px`,
              padding: '8px',
              cursor: 'pointer',
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: touchTarget.minHeight,
              minWidth: touchTarget.minWidth,
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, letterSpacing: '1px' }}>
              {weekLabel}
            </div>
            {weekOffset !== 0 && (
              <button
                onClick={() => {
                  setWeekOffset(0);
                  setSelectedDate(todayStr);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.accent,
                  fontSize: '11px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginTop: '2px',
                }}
              >
                Go to Today
              </button>
            )}
          </div>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            style={{
              background: colors.glassWhite,
              border: `1px solid ${colors.border}`,
              borderRadius: `${borderRadius.md}px`,
              padding: '8px',
              cursor: 'pointer',
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: touchTarget.minHeight,
              minWidth: touchTarget.minWidth,
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {weekDates.map((date, idx) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;
            const hasEntries = entries.some((e) => e.date === dateStr);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  padding: '8px 4px',
                  background: isSelected
                    ? colors.primary + '30'
                    : isToday
                      ? colors.accent + '15'
                      : 'transparent',
                  border: isSelected
                    ? `2px solid ${colors.primary}`
                    : isToday
                      ? `1px solid ${colors.accent}40`
                      : `1px solid transparent`,
                  borderRadius: `${borderRadius.md}px`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  color: colors.text,
                }}
              >
                <span style={{ fontSize: '10px', color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase' }}>
                  {DAYS[idx]}
                </span>
                <span style={{ fontSize: '16px', fontWeight: isSelected ? '700' : '500' }}>
                  {date.getDate()}
                </span>
                {hasEntries && (
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: colors.primary,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Timeline */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <Calendar size={18} color={colors.accent} />
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </h3>

        {dayEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 16px', color: colors.textTertiary }}>
            <Calendar size={32} color={colors.textTertiary} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '14px' }}>No jobs scheduled</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dayEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: '14px',
                  background: colors.glassWhite,
                  border: `1px solid ${statusColors[entry.status]}30`,
                  borderLeft: `3px solid ${statusColors[entry.status]}`,
                  borderRadius: `${borderRadius.md}px`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                    {entry.jobName}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: statusColors[entry.status],
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {entry.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.accent, marginBottom: '4px' }}>
                  <Clock size={12} />
                  {entry.startTime} - {entry.endTime}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.textSecondary }}>
                  <MapPin size={12} />
                  {entry.address}
                </div>

                {entry.customerName && (
                  <div style={{ fontSize: '12px', color: colors.textTertiary, marginTop: '4px' }}>
                    Customer: {entry.customerName}
                  </div>
                )}

                {entry.notes && (
                  <div style={{ fontSize: '12px', color: colors.textTertiary, marginTop: '4px', fontStyle: 'italic' }}>
                    {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleScreen;

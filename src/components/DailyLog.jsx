import React, { useState } from 'react';
import { MapPin, Camera } from 'lucide-react';
import { glassCard, inputStyle, screenContainer, redGlowOverlay, screenTitle, sectionHeader, labelStyle, primaryButton } from '../theme';
import { MAX_DAILY_LOG_LENGTH } from '../api/phoenix-api';

/**
 * DailyLog - Form to log daily work with customer, job, hours, notes, and photos.
 *
 * Props:
 *   customers   - Array of customer name strings
 *   jobs        - Array of job number strings
 *   onSubmit    - (logData) => Promise<void>  — called with { customer, jobNumber, hours, workCompleted, issues }
 *   onNavigate  - (screenId) => void
 *
 * Note: This component owns its own form state (logData, submitting) since it's
 * local to the form and doesn't need to persist when navigating away.
 */
const DailyLog = ({ customers, jobs, onSubmit, onNavigate }) => {
  const [logData, setLogData] = useState({
    customer: '',
    jobNumber: '',
    hours: 0,
    workCompleted: '',
    issues: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitLog = async () => {
    if (!logData.customer || !logData.jobNumber) {
      alert('Please select a customer and job number.');
      return;
    }
    if (!logData.workCompleted.trim()) {
      alert('Please describe the work completed.');
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit(logData);
      alert('Log submitted successfully!');
      onNavigate('dashboard');
    } catch (error) {
      console.error('Submit failed:', error);
      alert(`Submit failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={screenContainer}>
      <div style={redGlowOverlay} />

      <h2 style={{ ...screenTitle, marginBottom: '8px' }}>LOG TODAY'S WORK</h2>

      <div style={{
        color: '#D4AF37',
        fontSize: '14px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      {/* Location & Job */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <MapPin size={18} color="#D4AF37" />
          LOCATION & JOB
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Customer/Site</label>
            <select
              value={logData.customer}
              onChange={(e) => setLogData({...logData, customer: e.target.value})}
              style={inputStyle}
            >
              <option value="">Select customer...</option>
              {customers.length > 0 ? customers.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              )) : (
                <option disabled>No customers loaded</option>
              )}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Job Number</label>
            <select
              value={logData.jobNumber}
              onChange={(e) => setLogData({...logData, jobNumber: e.target.value})}
              style={inputStyle}
            >
              <option value="">Select job...</option>
              {jobs.length > 0 ? jobs.map((j, i) => (
                <option key={i} value={j}>{j}</option>
              )) : (
                <option disabled>No jobs loaded</option>
              )}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Hours Worked</label>
            <input
              type="number"
              step="0.25"
              value={logData.hours}
              onChange={(e) => setLogData({...logData, hours: parseFloat(e.target.value)})}
              style={inputStyle}
            />
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '6px'
            }}>
              Auto-calculated from clock times
            </div>
          </div>
        </div>
      </div>

      {/* Work Completed */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <span style={{ fontSize: '18px' }}>📝</span>
          WORK COMPLETED
        </h3>
        <textarea
          placeholder="Describe the work you completed today..."
          rows={6}
          value={logData.workCompleted}
          onChange={(e) => setLogData({...logData, workCompleted: e.target.value})}
          maxLength={MAX_DAILY_LOG_LENGTH}
          style={{
            ...inputStyle,
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Photos */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <Camera size={18} color="#D4AF37" />
          MATERIALS & PHOTOS
        </h3>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button style={{
            padding: '14px 20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(212,175,55,0.4)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            transition: 'all 0.2s ease'
          }}>
            📷 Take Photo
          </button>
          <button style={{
            padding: '14px 20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(212,175,55,0.4)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            transition: 'all 0.2s ease'
          }}>
            📎 Upload
          </button>
        </div>
      </div>

      {/* Issues */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          ISSUES / FOLLOW-UP
        </h3>
        <textarea
          placeholder="Any issues or follow-up needed?"
          rows={4}
          value={logData.issues}
          onChange={(e) => setLogData({...logData, issues: e.target.value})}
          maxLength={MAX_DAILY_LOG_LENGTH}
          style={{
            ...inputStyle,
            fontFamily: 'inherit',
            resize: 'vertical',
            borderColor: 'rgba(255,100,100,0.2)'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          style={{
            flex: 1,
            padding: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease'
          }}
        >
          SAVE DRAFT
        </button>
        <button
          onClick={handleSubmitLog}
          disabled={submitting}
          style={{
            ...primaryButton,
            flex: 2,
            padding: '14px',
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? 'wait' : 'pointer',
          }}
        >
          {submitting ? 'SUBMITTING...' : 'SUBMIT LOG'}
        </button>
      </div>
    </div>
  );
};

export default DailyLog;


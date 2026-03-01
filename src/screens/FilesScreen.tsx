import React from 'react';
import { ChevronRight } from 'lucide-react';
import { colors, borderRadius, touchTarget } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import type { JobFile } from '../types';

interface FilesScreenProps {
  jobFiles: JobFile[];
  sharepointFolders: string[];
}

const fileRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  background: colors.glassWhite,
  border: `1px solid ${colors.borderWhiteSubtle}`,
  borderRadius: `${borderRadius.lg}px`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minHeight: touchTarget.minHeight,
};

const FilesScreen: React.FC<FilesScreenProps> = ({ jobFiles, sharepointFolders }) => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />
    <h2 style={screenTitle}>FILES & DOCUMENTS</h2>

    {/* Today's Jobs */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📋</span>
        TODAY'S JOBS
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {jobFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: colors.textTertiary }}>
            Connect to Service Fusion to view job files
          </div>
        ) : jobFiles.map((file, idx) => (
          <div
            key={idx}
            style={fileRowStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background = colors.glassWhiteHover;
              e.currentTarget.style.borderColor = colors.borderRedHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = colors.glassWhite;
              e.currentTarget.style.borderColor = colors.borderWhiteSubtle;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '22px' }}>
                {file.type === 'Folder' ? '📁' : '📄'}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{file.name}</div>
                <div style={{ fontSize: '11px', color: colors.textSecondary }}>
                  {file.type === 'Folder' ? file.items : file.size}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color={colors.textTertiary} />
          </div>
        ))}
      </div>
    </div>

    {/* SharePoint Folders */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📂</span>
        SHAREPOINT
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sharepointFolders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: colors.textTertiary }}>
            Connect to SharePoint to view folders
          </div>
        ) : sharepointFolders.map((folder, idx) => (
          <div
            key={idx}
            style={fileRowStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background = colors.glassWhiteHover;
              e.currentTarget.style.borderColor = colors.borderRedHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = colors.glassWhite;
              e.currentTarget.style.borderColor = colors.borderWhiteSubtle;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '22px' }}>📁</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{folder}</div>
            </div>
            <ChevronRight size={18} color={colors.textTertiary} />
          </div>
        ))}
      </div>
    </div>

    {/* Search */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>🔍</span>
        SEARCH FILES
      </h3>
      <input
        type="text"
        placeholder="Search all SharePoint..."
        style={{
          width: '100%',
          padding: '14px',
          background: colors.glassWhite,
          border: `1px solid ${colors.borderGold}`,
          borderRadius: `${borderRadius.lg}px`,
          fontSize: '13px',
          outline: 'none',
          color: colors.text,
          minHeight: touchTarget.minHeight,
        }}
      />
    </div>
  </div>
);

export default FilesScreen;


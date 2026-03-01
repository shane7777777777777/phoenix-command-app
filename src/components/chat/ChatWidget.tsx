import React from 'react';
import { colors, gradients, shadows, borderRadius, touchTarget, spacing } from '../../theme/tokens';
import { MAX_QUERY_LENGTH } from '../../api/phoenix-api';
import type { ChatMessage } from '../../types';

interface ChatWidgetProps {
  showChatWidget: boolean;
  onToggle: () => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  showChatWidget, onToggle, chatMessages, chatInput, onInputChange, onSend,
}) => (
  <>
    {!showChatWidget ? (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: gradients.redButton,
          border: `2px solid ${colors.borderGoldHover}`,
          color: colors.accent,
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: shadows.chatFab,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          minHeight: touchTarget.minHeight,
          minWidth: touchTarget.minWidth,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = shadows.chatFabHover;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = shadows.chatFab;
        }}
      >
        🤖
      </button>
    ) : (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        height: '500px',
        background: gradients.chatPanel,
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: `${borderRadius.xxl}px`,
        boxShadow: shadows.chatPanel,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        border: `1px solid ${colors.borderRedHover}`,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: gradients.redHeader,
          padding: `${spacing.md}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #000000',
        }}>
          <div style={{
            color: colors.text,
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: `${spacing.sm}px`,
            letterSpacing: '0.5px',
          }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            Phoenix AI Assistant
          </div>
          <button
            onClick={onToggle}
            style={{
              background: colors.overlayBlackLight,
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              lineHeight: '1',
              minHeight: touchTarget.minHeight,
              minWidth: touchTarget.minWidth,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: `${spacing.md}px`,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: colors.overlayBlack,
        }}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{
              background: msg.role === 'ai' ? gradients.aiBubble : gradients.userBubble,
              color: colors.text,
              padding: '12px 14px',
              borderRadius: msg.role === 'ai' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
              fontSize: '13px',
              lineHeight: '1.5',
              alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
              maxWidth: '85%',
              border: msg.role === 'ai'
                ? `1px solid ${colors.borderWhiteLight}`
                : `1px solid rgba(255,100,100,0.3)`,
              boxShadow: msg.role === 'ai' ? 'none' : '0 2px 8px rgba(255,26,26,0.2)',
            }}>
              {msg.role === 'ai' && <span style={{ color: colors.accent, fontWeight: '600' }}>AI: </span>}
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: `${spacing.md}px`,
          borderTop: `1px solid ${colors.borderWhiteLight}`,
          background: colors.overlayBlackHeavy,
        }}>
          <div style={{ display: 'flex', gap: `${spacing.sm}px` }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend()}
              placeholder="Ask me anything..."
              maxLength={MAX_QUERY_LENGTH}
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
              onClick={onSend}
              style={{
                background: gradients.redButton,
                color: colors.text,
                border: 'none',
                padding: '12px 18px',
                borderRadius: `${borderRadius.md}px`,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: touchTarget.minHeight,
              }}
            >
              Send
            </button>
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '11px',
            color: chatInput.length > MAX_QUERY_LENGTH * 0.9 ? '#ff6b6b' : colors.textMuted,
            marginTop: '4px',
            paddingRight: '4px',
          }}>
            {chatInput.length}/{MAX_QUERY_LENGTH}
          </div>
        </div>
      </div>
    )}
  </>
);

export default ChatWidget;


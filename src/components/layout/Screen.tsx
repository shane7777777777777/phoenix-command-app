import React from 'react';
import { screenContainer, redGlowOverlay, screenTitle } from '../../theme/styles';

interface ScreenProps {
  title: string;
  titleStyle?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Shared screen wrapper with background, red glow overlay, and title.
 */
const Screen: React.FC<ScreenProps> = ({ title, titleStyle, children }) => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />
    <h2 style={{ ...screenTitle, ...titleStyle }}>{title}</h2>
    {children}
  </div>
);

export default Screen;


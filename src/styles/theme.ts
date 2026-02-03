import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // Core
    background: string;
    backgroundAlt: string;
    surface: string;
    surfaceHover: string;
    
    // Text
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // Borders
    border: string;
    borderSubtle: string;
    borderRadius: string;
    
    // Accents
    accent: string;
    accentHover: string;
    accentMuted: string;
    accentGlow: string;
    accentGold: string;
    
    // Status
    live: string;
    liveGlow: string;
    success: string;
    warning: string;
    danger: string;
    
    // Effects
    shadow: string;
    shadowStrong: string;
    overlay: string;
    glow: string;
    
    // Named Colors (Into the Void palette)
    signalWhite: string;
    steelGray: string;
    infraRed: string;
  }
}

// Into the Void - Dark Theme
// Underground tournament energy, ritualistic, competitive
export const darkTheme: DefaultTheme = {
  // Core backgrounds
  background: '#0B0B0D',           // Void Black
  backgroundAlt: '#16181C',        // Obsidian Charcoal
  surface: '#16181C',              // Obsidian Charcoal
  surfaceHover: '#1E2127',         // Slightly lighter for hover
  
  // Text
  text: '#F5F7FA',                 // Signal White
  textSecondary: '#9CA3AF',        // Muted gray
  textMuted: '#6B7280',            // Even more muted
  
  // Borders
  border: '#2A2E35',               // Steel Gray
  borderSubtle: '#1E2127',         // Subtle border
  borderRadius: '8px',
  
  // Accents - Electric Violet (use sparingly)
  accent: '#7B5CFF',               // Electric Violet
  accentHover: '#8F73FF',          // Lighter violet
  accentMuted: 'rgba(123, 92, 255, 0.15)',
  accentGlow: 'rgba(123, 92, 255, 0.4)',
  accentGold: '#8F73FF',           // Legacy support - maps to lighter violet
  
  // Status
  live: '#E14B4B',                 // Infra Red (live/finals only)
  liveGlow: 'rgba(225, 75, 75, 0.3)',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  
  // Effects
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowStrong: 'rgba(0, 0, 0, 0.8)',
  overlay: 'rgba(11, 11, 13, 0.9)',
  glow: '0 0 20px rgba(123, 92, 255, 0.3)',
  
  // Named Colors (Into the Void palette)
  signalWhite: '#F5F7FA',
  steelGray: '#2A2E35',
  infraRed: '#E14B4B',
};

// Renaissance City Creator Fund - Documentary, process-first aesthetic
export const creatorFundTheme: DefaultTheme = {
  // Core backgrounds - warm cream, paper/canvas
  background: '#F8F6F2',
  backgroundAlt: '#F0EDE8',
  surface: '#FDFCF9',
  surfaceHover: '#F5F3EF',

  // Text - soft charcoal, warm grays
  text: '#2C2A26',
  textSecondary: '#5C5A56',
  textMuted: '#8A8782',

  // Borders - subtle warm
  border: '#E5E2DC',
  borderSubtle: '#EDEAE6',
  borderRadius: '6px',

  // Accents - clay/rust (use sparingly)
  accent: '#8B6B4A',
  accentHover: '#7A5E41',
  accentMuted: 'rgba(139, 107, 74, 0.12)',
  accentGlow: 'rgba(139, 107, 74, 0.15)',
  accentGold: '#7A5E41',

  // Status
  live: '#B85450',
  liveGlow: 'rgba(184, 84, 80, 0.2)',
  success: '#4A7C59',
  warning: '#B8860B',
  danger: '#B85450',

  // Effects - minimal, no flash
  shadow: 'rgba(44, 42, 38, 0.08)',
  shadowStrong: 'rgba(44, 42, 38, 0.12)',
  overlay: 'rgba(248, 246, 242, 0.95)',
  glow: 'none',

  // Named (map for components that reference these)
  signalWhite: '#2C2A26',
  steelGray: '#E5E2DC',
  infraRed: '#B85450',
};

// Light theme (kept for compatibility, but app should default to dark)
export const lightTheme: DefaultTheme = {
  background: '#F5F7FA',
  backgroundAlt: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceHover: '#F9FAFB',
  
  text: '#0B0B0D',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  
  border: '#D1D5DB',
  borderSubtle: '#E5E7EB',
  borderRadius: '8px',
  
  accent: '#7B5CFF',
  accentHover: '#6B4CE6',
  accentMuted: 'rgba(123, 92, 255, 0.1)',
  accentGlow: 'rgba(123, 92, 255, 0.2)',
  accentGold: '#6B4CE6',
  
  live: '#E14B4B',
  liveGlow: 'rgba(225, 75, 75, 0.2)',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.2)',
  overlay: 'rgba(255, 255, 255, 0.9)',
  glow: '0 0 20px rgba(123, 92, 255, 0.15)',
  
  // Named Colors
  signalWhite: '#F5F7FA',
  steelGray: '#D1D5DB',
  infraRed: '#E14B4B',
};

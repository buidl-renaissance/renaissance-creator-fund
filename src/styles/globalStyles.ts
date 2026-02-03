import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: background-color 0.2s ease, color 0.2s ease;
    line-height: 1.5;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  a {
    color: ${props => props.theme.text};
    text-decoration: none;
    transition: color 0.15s ease, opacity 0.15s ease;
    
    &:hover {
      color: ${props => props.theme.accent};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 500;
  }

  input, textarea, select {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px; /* Prevents iOS zoom on focus */
  }

  ::selection {
    background: ${props => props.theme.accent};
    color: white;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.textMuted};
    }
  }

  /* Focus states */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.accent};
    outline-offset: 2px;
  }
`;

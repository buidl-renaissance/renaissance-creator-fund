import React, { createContext, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { creatorFundTheme } from '../styles/theme';

type Theme = 'creatorFund';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: 'creatorFund' }}>
      <StyledThemeProvider theme={creatorFundTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

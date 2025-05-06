import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

interface ThemeLanguageContextType {
  theme: 'light' | 'dark';
  language: 'en' | 'es';
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'es') => void;
}

const ThemeLanguageContext = createContext<
  ThemeLanguageContextType | undefined
>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeLanguageContext.Provider
      value={{ theme, language, toggleTheme, setLanguage }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (context === undefined) {
    throw new Error(
      'useThemeLanguage must be used within a ThemeLanguageProvider'
    );
  }
  return context;
};

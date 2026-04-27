import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const getTMDBLang = useCallback(() => {
    return lang === 'ar' ? 'ar-SA' : 'en-US';
  }, [lang]);

  const t = (arText, enText) => (lang === 'ar' ? arText : enText);

  return (
    <LanguageContext.Provider value={{ lang, setLang, getTMDBLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};